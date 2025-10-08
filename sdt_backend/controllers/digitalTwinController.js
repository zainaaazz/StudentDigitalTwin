// controllers/digitalTwinController.js
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const DigitalTwin = require('../models/DigitalTwin');
const { listModelBlobs, getModelDownloadUrl, downloadBlobToFile } = require('../utils/azureModels');

/**
 * Run aggregation on native collection with allowDiskUse:true (Atlas/Mongo driver)
 */
async function runAggregationWithDiskUse(pipeline, collectionName = 'digitaltwin') {
  if (!mongoose.connection || !mongoose.connection.db) {
    throw new Error('MongoDB connection not initialized');
  }
  const coll = mongoose.connection.db.collection(collectionName);
  const cursor = coll.aggregate(pipeline, { allowDiskUse: true });
  return cursor.toArray();
}

/**
 * Convert projection object to Mongoose select string
 */
function projectionToSelect(proj) {
  // keep only keys that are set to 1
  return Object.keys(proj).filter(k => proj[k] === 1).join(' ');
}

const BACKEND_ROOT = path.resolve(__dirname, '..');
const DEFAULT_MODEL_DIR = path.join(BACKEND_ROOT, 'AcademicPredictionModels');

function resolveBackendPath(inputPath, fallbackAbsolute) {
  if (inputPath === undefined || inputPath === null || inputPath === '') {
    return fallbackAbsolute;
  }
  const candidate = path.isAbsolute(inputPath)
    ? inputPath
    : path.join(BACKEND_ROOT, inputPath);
  const normalized = path.normalize(candidate);
  if (!normalized.startsWith(BACKEND_ROOT)) {
    throw new Error(`Resolved path escapes backend directory: ${inputPath}`);
  }
  return normalized;
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function loadStudentRowsFromCsv(filePath, studentId) {
  const content = await fs.promises.readFile(filePath, 'utf8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (!lines.length) {
    throw new Error('CSV file is empty or missing header row.');
  }

  const headerValues = parseCsvLine(lines.shift());
  const headers = headerValues.map(h => h.trim());
  const idIndex = headers.indexOf('id_student');
  const dateIndex = headers.indexOf('date');
  if (idIndex === -1 || dateIndex === -1) {
    throw new Error("CSV must contain 'id_student' and 'date' columns.");
  }
  const finalResultIndex = headers.indexOf('final_result');

  const rows = [];
  const finalResultCounts = {};
  let minDate = null;
  let maxDate = null;

  for (const rawLine of lines) {
    let fields = parseCsvLine(rawLine);
    if (!fields.length) {
      continue;
    }
    if (fields.length < headers.length) {
      fields = fields.concat(new Array(headers.length - fields.length).fill(''));
    } else if (fields.length > headers.length) {
      fields = fields.slice(0, headers.length);
    }

    const rawId = fields[idIndex];
    const numericId = Number.parseInt(rawId, 10);
    if (!Number.isFinite(numericId) || numericId !== studentId) {
      continue;
    }

    const row = {};
    for (let i = 0; i < headers.length; i += 1) {
      row[headers[i]] = fields[i] ?? '';
    }
    rows.push(row);

    const numericDate = Number.parseFloat(String(fields[dateIndex] || '').trim());
    if (Number.isFinite(numericDate)) {
      if (minDate === null || numericDate < minDate) {
        minDate = numericDate;
      }
      if (maxDate === null || numericDate > maxDate) {
        maxDate = numericDate;
      }
    }

    if (finalResultIndex !== -1) {
      const fr = (fields[finalResultIndex] || '').trim();
      if (fr) {
        finalResultCounts[fr] = (finalResultCounts[fr] || 0) + 1;
      }
    }
  }

  return {
    rows,
    minDate,
    maxDate,
    finalResultCounts
  };
}

function stripQuotes(value) {
  return typeof value === 'string'
    ? value.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
    : value;
}

const controller = {
  // ... keep your other endpoints unchanged (debugDatabase, testConnection, etc.)
  // Only showing the endpoints we changed / added here for brevity

  // Get student data (index-first, fallback to allowDiskUse aggregation)
  getStudentData: async (req, res) => {
    console.log('=== API CALLED ===');
    console.log('Query params:', req.query);
    console.log('==================');

    try {
      const { studentId, limit: limitRaw, page: pageRaw } = req.query;
      const limit = Math.min(parseInt(limitRaw, 10) || 100, 1000); // cap to avoid huge responses
      const page = Math.max(parseInt(pageRaw, 10) || 1, 1);

      // Minimal projection to reduce memory
      const projection = {
        _id: 1,
        id_student: 1,
        date: 1,
        homepage: 1,
        oucontent: 1,
        subpage: 1,
        url: 1,
        forumng: 1,
        resource: 1,
        final_result: 1,
        studied_credits: 1
      };

      // If no specific student requested, require pagination (sorting entire collection can explode memory)
      if (!studentId || studentId === 'all') {
        // Use pagination and index if possible; otherwise use aggregation with allowDiskUse
        const skip = (page - 1) * limit;

        // Use find with sort; let MongoDB use index if present.
        const records = await DigitalTwin.find({})
          .select(projectionToSelect(projection))
          .lean()
          .sort({ date: 1 })
          .skip(skip)
          .limit(limit)
          .exec();

        const total = await DigitalTwin.countDocuments();

        return res.json({
          success: true,
          data: records,
          pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
      }

      // Specific student: prefer index-backed find + hint
      const sid = parseInt(studentId, 10);
      if (Number.isNaN(sid)) {
        return res.status(400).json({ success: false, error: 'studentId must be a number or "all"' });
      }

      try {
        // First attempt: find() sorted by date — we supply a hint for the compound index
        const records = await DigitalTwin.find({ id_student: sid })
          .select(projectionToSelect(projection))
          .lean()
          .sort({ date: 1 })
          .hint({ id_student: 1, date: 1 }) // force index usage if available
          .exec();

          console.log(`Found ${records.length} records for student ${sid}`);
          console.log('Date range:', records.map(r => r.date));
          console.log('Sample records:', records.slice(0, 5).map(r => ({ date: r.date, homepage: r.homepage, content: r.oucontent })));

        // If this returns without error, we're done
        return res.json({
          success: true,
          data: records,
          count: records.length,
          method: 'find_with_hint'
        });
      } catch (err) {
        // If the driver/server rejected the sort (memory) or the hint wasn't usable, fall back to aggregation
        console.warn('find-with-hint failed, falling back to aggregation with allowDiskUse:', err && err.message);

        // Aggregation pipeline: match -> sort (index can cover this if index exists) -> project
        // Note: we place $sort before $project here so the query planner can use the index for the sort.
        const pipeline = [
          { $match: { id_student: sid } },
          { $sort: { date: 1 } },        // put sort before project so index can satisfy it
          { $project: projection }
        ];

        const recordsAgg = await runAggregationWithDiskUse(pipeline, 'digitaltwin');

        console.log(`Aggregation found ${recordsAgg.length} records for student ${sid}`);
        console.log('Aggregation date range:', recordsAgg.map(r => r.date));

        return res.json({
          success: true,
          data: recordsAgg,
          count: recordsAgg.length,
          method: 'aggregation_allowDiskUse'
        });
      }
    } catch (error) {
      console.error('Error in getStudentData:', error);
      const status = (error && error.code === 292) ? 413 : 500;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  },

  // Get records by student id debug route (similar strategy)
  getRecordsByStudentId: async (req, res) => {
    try {
      const studentId = parseInt(req.params.studentId, 10);
      if (Number.isNaN(studentId)) {
        return res.status(400).json({ success: false, error: 'invalid studentId' });
      }

      const projection = {
        _id: 1,
        id_student: 1,
        date: 1,
        homepage: 1,
        oucontent: 1,
        subpage: 1,
        url: 1,
        forumng: 1,
        resource: 1,
        final_result: 1,
        studied_credits: 1
      };

      try {
        // Try index-backed find
        const records = await DigitalTwin.find({ id_student: studentId })
          .select(projectionToSelect(projection))
          .lean()
          .sort({ date: 1 })
          .hint({ id_student: 1, date: 1 })
          .exec();

        if (!records || records.length === 0) {
          const sampleStudents = await DigitalTwin.distinct('id_student');
          return res.status(404).json({
            success: false,
            error: 'No records found for this student',
            debug: {
              requestedStudentId: studentId,
              sampleStudentIds: sampleStudents.slice(0, 10)
            }
          });
        }

        const summary = await DigitalTwin.getStudentSummary(studentId);

        return res.json({
          success: true,
          data: { records, summary: summary[0] || null, recordCount: records.length },
          method: 'find_with_hint'
        });
      } catch (err) {
        console.warn('find-with-hint failed in getRecordsByStudentId; trying aggregation with allowDiskUse', err && err.message);

        const pipeline = [
          { $match: { id_student: studentId } },
          { $sort: { date: 1 } },
          { $project: projection }
        ];

        const recordsAgg = await runAggregationWithDiskUse(pipeline, 'digitaltwin');

        if (!recordsAgg || recordsAgg.length === 0) {
          const sampleStudents = await DigitalTwin.distinct('id_student');
          return res.status(404).json({
            success: false,
            error: 'No records found for this student (agg)',
            debug: { sampleStudentIds: sampleStudents.slice(0, 10) }
          });
        }

        const summary = await DigitalTwin.getStudentSummary(studentId);

        return res.json({
          success: true,
          data: { records: recordsAgg, summary: summary[0] || null, recordCount: recordsAgg.length },
          method: 'aggregation_allowDiskUse'
        });
      }
    } catch (error) {
      console.error('Error in getRecordsByStudentId:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        stack: error.stack
      });
    }
  },

  // Get unique students
  getUniqueStudents: async (req, res) => {
    try {
      const students = await DigitalTwin.getUniqueStudents();
      res.json({
        success: true,
        data: students,
        count: students.length
      });
    } catch (error) {
      console.error('Error in getUniqueStudents:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  ,
  // Predictions (scaffold): check for model files and return stub predictions
  // GET /digitaltwin/predictions/day-window?studentId=123&startDay=1&endDay=5
  // Optional: labels=Distinction,Fail,Pass,Withdrawn
  listPredictionModels: async (req, res) => {
    try {
      const models = await listModelBlobs();
      res.json({ success: true, data: models });
    } catch (error) {
      console.error('Error listing prediction models:', error);
      const status = error?.statusCode === 404 ? 404 : 500;
      res.status(status).json({ success: false, error: error.message || 'Unable to list models' });
    }
  },

  getPredictionModelDownloadUrl: async (req, res) => {
    try {
      const { name } = req.query;
      if (!name) {
        return res.status(400).json({ success: false, error: 'name query parameter is required' });
      }
      const url = await getModelDownloadUrl(name);
      res.json({ success: true, data: { name, url } });
    } catch (error) {
      console.error('Error generating model download URL:', error);
      const status = error?.statusCode === 404 ? 404 : 500;
      res.status(status).json({ success: false, error: error.message || 'Unable to generate download URL' });
    }
  },

  getPredictionsForWindow: async (req, res) => {
    let cleanupTempDir = () => Promise.resolve();
    let baseDir = null;
    try {
      const studentId = parseInt(req.query.studentId, 10);
      const startDay = Math.max(parseInt(req.query.startDay, 10) || 1, 1);
      const endDayRaw = parseInt(req.query.endDay, 10) || startDay + 4;
      const endDay = Math.max(startDay, endDayRaw);

      if (Number.isNaN(studentId)) {
        console.error('[PRED] Invalid studentId supplied to getPredictionsForWindow:', req.query.studentId);
        return res.status(400).json({ success: false, error: 'studentId must be a number' });
      }

      const labelsParam = (req.query.labels || '').split(',').map(s => s.trim()).filter(Boolean);
      const labels = labelsParam.length ? labelsParam : ['Distinction', 'Fail', 'Pass', 'Withdrawn'];

      const modeParam = (req.query.mode || '').toLowerCase();
      const useLocalModels = modeParam === 'local'
        || req.query.useLocal === '1'
        || Boolean(req.query.modelDir || req.query.dataPath || req.query.scalerPath || req.query.featsPath);

      let scalerPath;
      let featsPath;
      let dataPathUsed = null;
      let rows = [];
      let minDate = null;
      let maxDate = null;
      let rowsCount = 0;
      let azureDownloads = [];
      let missingModels = [];
      const dataSource = useLocalModels ? 'local-files' : 'azure-storage';

      if (useLocalModels) {
        try {
          const resolvedModelDir = resolveBackendPath(req.query.modelDir, DEFAULT_MODEL_DIR);
          const resolvedDataPath = resolveBackendPath(req.query.dataPath, path.join(resolvedModelDir, 'data.csv'));
          const resolvedScalerPath = resolveBackendPath(req.query.scalerPath, path.join(resolvedModelDir, 'scaler.pkl'));
          const resolvedFeatsPath = resolveBackendPath(req.query.featsPath, path.join(resolvedModelDir, 'feature_cols.pkl'));

          const modelDirStats = await fs.promises.stat(resolvedModelDir).catch(() => null);
          if (!modelDirStats || !modelDirStats.isDirectory()) {
            return res.status(404).json({
              success: false,
              error: `Model directory not found: ${resolvedModelDir}`
            });
          }

          const requiredArtifacts = [
            { label: 'Data CSV', path: resolvedDataPath },
            { label: 'Scaler file', path: resolvedScalerPath },
            { label: 'Feature columns file', path: resolvedFeatsPath }
          ];

          for (const artifact of requiredArtifacts) {
            const exists = await fs.promises.access(artifact.path).then(() => true).catch(() => false);
            if (!exists) {
              return res.status(404).json({
                success: false,
                error: `${artifact.label} missing at ${artifact.path}`
              });
            }
          }

          baseDir = resolvedModelDir;
          scalerPath = resolvedScalerPath;
          featsPath = resolvedFeatsPath;
          dataPathUsed = resolvedDataPath;
          cleanupTempDir = () => Promise.resolve();

          const csvData = await loadStudentRowsFromCsv(dataPathUsed, studentId);
          rows = csvData.rows;
          minDate = csvData.minDate;
          maxDate = csvData.maxDate;
          rowsCount = rows.length;

          if (!rowsCount) {
            return res.status(404).json({
              success: false,
              error: `No records found for student ${studentId} in ${path.basename(dataPathUsed)}`
            });
          }
        } catch (localErr) {
          console.error('[PRED] Local mode preparation failed:', localErr);
          return res.status(500).json({
            success: false,
            error: localErr.message || 'Failed to prepare local prediction artefacts'
          });
        }
      } else {
        const azureEnvReady = Boolean(
          process.env.AZURE_STORAGE_ACCOUNT_NAME &&
          process.env.AZURE_STORAGE_CONTAINER &&
          process.env.AZURE_STORAGE_SAS_TOKEN
        );

        if (!azureEnvReady) {
          console.error('[PRED] Azure Storage environment variables are missing.');
          return res.status(503).json({
            success: false,
            error: 'Prediction service is not configured to connect to Azure Storage.'
          });
        }

        const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'sdt_models_'));
        baseDir = tempDir;
        cleanupTempDir = () => fs.promises.rm(baseDir, { recursive: true, force: true }).catch((err) => {
          console.error(`[PRED] Failed to clean up temp directory ${baseDir}:`, err);
        });

        scalerPath = path.join(baseDir, 'scaler.pkl');
        featsPath = path.join(baseDir, 'feature_cols.pkl');

        const azureTargets = [
          { name: 'scaler.pkl', destination: scalerPath },
          { name: 'feature_cols.pkl', destination: featsPath }
        ];
        for (let day = startDay; day <= endDay; day += 1) {
          azureTargets.push({
            name: `model_day_${day}.h5`,
            destination: path.join(baseDir, `model_day_${day}.h5`)
          });
        }

        azureDownloads = [];
        for (const target of azureTargets) {
          try {
            const info = await downloadBlobToFile(target.name, target.destination);
            azureDownloads.push(info);
          } catch (downloadErr) {
            console.error(`[PRED] Azure download failed for ${target.name}:`, downloadErr);
            await cleanupTempDir();
            return res.status(500).json({
              success: false,
              error: `Azure download failed for ${target.name}: ${downloadErr.message}`
            });
          }
        }

        console.info('[PRED] Azure downloads:', azureDownloads.map(item => item.name).join(', ') || 'none');

        missingModels = azureTargets
          .filter(target => !fs.existsSync(target.destination))
          .map(target => target.name);

        if (missingModels.length) {
          console.error('[PRED] Missing models after Azure download:', missingModels);
          await cleanupTempDir();
          return res.status(500).json({
            success: false,
            error: `Missing models after Azure download: ${missingModels.join(', ')}`
          });
        }

        if (!fs.existsSync(scalerPath) || !fs.existsSync(featsPath)) {
          console.error('[PRED] Essential artifacts were not downloaded from Azure.');
          await cleanupTempDir();
          return res.status(500).json({
            success: false,
            error: 'Scaler or feature columns missing after Azure download.'
          });
        }

        const projection = {
          _id: 0,
          id_student: 1,
          date: 1,
          homepage: 1,
          oucontent: 1,
          subpage: 1,
          url: 1,
          forumng: 1,
          resource: 1,
          repeatactivity: 1,
          glossary: 1,
          dataplus: 1,
          oucollaborate: 1,
          htmlactivity: 1,
          questionnaire: 1,
          dualpane: 1,
          quiz: 1,
          externalquiz: 1,
          page: 1,
          folder: 1,
          ouwiki: 1,
          sharedsubpage: 1,
          ouelluminate: 1,
          num_of_prev_attempts: 1,
          studied_credits: 1,
          final_result: 1
        };

        rows = await DigitalTwin.find({ id_student: studentId, date: { $lt: endDay } })
          .select(Object.keys(projection).join(' '))
          .lean()
          .sort({ date: 1 })
          .exec();

        rowsCount = rows.length;
      }

      const debugLog = process.env.PREDICTION_DEBUG_LOG === '1';
      const debugDayParsed = Number.parseInt(process.env.PREDICTION_DEBUG_DAY || '', 10);
      const debugDay = Number.isFinite(debugDayParsed) ? debugDayParsed : startDay;
      console.info(`[PRED] Debug logging ${debugLog ? 'enabled' : 'disabled'} (day ${debugDay})`);

      const numericDates = rows.map(r => Number(r?.date)).filter(Number.isFinite);
      if (numericDates.length) {
        minDate = minDate ?? Math.min(...numericDates);
        maxDate = maxDate ?? Math.max(...numericDates);
      }

      rowsCount = rows.length;
      console.info(`[PRED] [${dataSource}] Student ${studentId} window ${startDay}-${endDay}: row_count=${rowsCount}, min_date=${minDate ?? 'n/a'}, max_date=${maxDate ?? 'n/a'}`);

      let groundTruth = null;
      if (rows && rows.length) {
        const counts = {};
        rows.forEach(r => {
          const fr = r.final_result;
          if (fr) {
            counts[fr] = (counts[fr] || 0) + 1;
          }
        });
        groundTruth = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || null;
      }

      const script = path.resolve(__dirname, '..', 'utils', 'predict_window.py');
      const pythonBinRaw = process.env.PYTHON_BIN || (process.platform === 'win32' ? 'py' : 'python');
      const pythonBin = stripQuotes(pythonBinRaw);
      const py = spawn(pythonBin, ['-u', script], { stdio: ['pipe', 'pipe', 'pipe'] });

      const payload = {
        model_dir: baseDir,
        scaler_path: scalerPath,
        feats_path: featsPath,
        student_id: studentId,
        start_day: startDay,
        end_day: endDay,
        labels,
        rows,
        debug_log: debugLog,
        debug_day: debugDay
      };

      let stdout = '';
      let stderr = '';
      let responded = false;

      const respondWithError = (context, err) => {
        const message = err && err.message ? err.message : err;
        console.error(`[PRED] ${context}:`, message);
        if (err && err.stack) {
          console.error(err.stack);
        }
        if (!responded) {
          responded = true;
          cleanupTempDir();
          res.status(500).json({
            success: false,
            error: `${context}: ${message}`,
            meta: {
              studentId,
              startDay,
              endDay,
              modelDir: baseDir,
              groundTruth,
              source: dataSource,
              dataPath: dataPathUsed,
              azureDownloads,
              missingModels,
              rowsCount,
              rowMinDate: minDate,
              rowMaxDate: maxDate,
              stderr,
              stdout
            }
          });
        }
      };

      py.stdout.on('data', (d) => { stdout += d.toString(); });
      py.stderr.on('data', (d) => { stderr += d.toString(); });

      py.on('error', (err) => {
        respondWithError('Python process spawn failed', err);
      });

      py.on('close', async (code) => {
        if (responded) {
          return;
        }
        try {
          const resp = JSON.parse(stdout || '{}');
          if (code === 0 && resp && resp.success) {
            responded = true;
            await cleanupTempDir();
            return res.json({
              success: true,
              data: resp.data || [],
              meta: {
                studentId,
                startDay,
                endDay,
                modelDir: baseDir,
                groundTruth,
                mode: 'python',
                source: dataSource,
                dataPath: dataPathUsed,
                azureDownloads,
                missingModels,
                rowsCount,
                rowMinDate: minDate,
                rowMaxDate: maxDate,
                stderr,
                stdout
              }
            });
          }
          const errorMessage = resp && resp.error ? resp.error : `Python exited with code ${code}`;
          respondWithError('Python prediction failed', new Error(errorMessage));
        } catch (parseErr) {
          respondWithError('Failed to parse python output', parseErr);
        }
      });

      try {
        py.stdin.write(JSON.stringify(payload));
        py.stdin.end();
      } catch (stdinErr) {
        respondWithError('Failed to write payload to python stdin', stdinErr);
      }
    } catch (error) {
      console.error('Error in getPredictionsForWindow:', error);
      try {
        await cleanupTempDir();
      } catch (cleanupError) {
        console.error('[PRED] Cleanup after failure failed:', cleanupError);
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = controller;



