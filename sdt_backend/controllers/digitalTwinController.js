// controllers/digitalTwinController.js
const mongoose = require('mongoose');
const DigitalTwin = require('../models/DigitalTwin');

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

const controller = {
  // ... keep your other endpoints unchanged (debugDatabase, testConnection, etc.)
  // Only showing the endpoints we changed / added here for brevity

  // Get student data (index-first, fallback to allowDiskUse aggregation)
  getStudentData: async (req, res) => {
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
  getPredictionsForWindow: async (req, res) => {
    try {
      const path = require('path');
      const fs = require('fs');
      const { spawn } = require('child_process');
      const stripQuotes = (s) => (typeof s === 'string' ? s.trim().replace(/^"(.*)"$/,'$1').replace(/^\'(.*)\'$/,'$1') : s);

      const studentId = parseInt(req.query.studentId, 10);
      const startDay = Math.max(parseInt(req.query.startDay, 10) || 1, 1);
      const endDayRaw = parseInt(req.query.endDay, 10) || startDay + 4;
      const endDay = Math.max(startDay, endDayRaw);

      if (Number.isNaN(studentId)) {
        return res.status(400).json({ success: false, error: 'studentId must be a number' });
      }

      const labelsParam = (req.query.labels || '').split(',').map(s => s.trim()).filter(Boolean);
      const labels = labelsParam.length ? labelsParam : ['Distinction', 'Fail', 'Pass', 'Withdrawn'];

      let baseDir = process.env.PREDICTION_MODELS_DIR || path.resolve(__dirname, '..', 'PredictionModels');
      baseDir = stripQuotes(baseDir);
      let scalerPath = process.env.PREDICTION_SCALER || path.join(baseDir, 'scaler.pkl');
      scalerPath = stripQuotes(scalerPath);
      let featsPath = process.env.PREDICTION_FEATURES || path.join(baseDir, 'feature_cols.pkl');
      featsPath = stripQuotes(featsPath);

      // Fetch minimal student rows up to endDay-1 for sequence building
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

      const rows = await DigitalTwin.find({ id_student: studentId, date: { $lt: endDay } })
        .select(Object.keys(projection).join(' '))
        .lean()
        .sort({ date: 1 })
        .exec();

      // Compute ground truth (most frequent final_result)
      let groundTruth = null;
      if (rows && rows.length) {
        const counts = {};
        rows.forEach(r => {
          const fr = r.final_result;
          if (fr) counts[fr] = (counts[fr] || 0) + 1;
        });
        groundTruth = Object.keys(counts).sort((a,b) => counts[b]-counts[a])[0] || null;
      }

      // Ensure scaler/feature files exist
      const haveArtifacts = fs.existsSync(scalerPath) && fs.existsSync(featsPath);

      // If Python runtime or artifacts are missing, fall back to existence-only scaffold
      async function fallbackStub() {
        const items = [];
        for (let day = startDay; day <= endDay; day++) {
          const modelPath = path.join(baseDir, `model_day_${day}.h5`);
          const exists = fs.existsSync(modelPath);
          const idx = day % labels.length;
          const confidence = exists ? Number((0.6 + ((day % 10) / 50)).toFixed(3)) : null;
          items.push({
            day,
            model_available: exists,
            pred_label: exists ? labels[idx] : null,
            pred_index: exists ? idx : null,
            confidence
          });
        }
        return items;
      }

      if (!haveArtifacts) {
        const items = await fallbackStub();
        return res.json({ success: true, data: items, meta: { studentId, startDay, endDay, modelDir: baseDir, groundTruth, mode: 'stub_no_artifacts' } });
      }

      // Spawn python to run real predictions
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
        rows
      };

      let stdout = '';
      let stderr = '';
      py.stdout.on('data', (d) => { stdout += d.toString(); });
      py.stderr.on('data', (d) => { stderr += d.toString(); });

      py.on('error', async (err) => {
        const items = await fallbackStub();
        return res.json({ success: true, data: items, meta: { studentId, startDay, endDay, modelDir: baseDir, groundTruth, mode: 'stub_py_spawn_failed', stderr, pythonBin } });
      });

      py.on('close', async () => {
        try {
          const resp = JSON.parse(stdout || '{}');
          if (resp && resp.success) {
            return res.json({ success: true, data: resp.data || [], meta: { studentId, startDay, endDay, modelDir: baseDir, groundTruth, mode: 'python' } });
          }
          const items = await fallbackStub();
          return res.json({ success: true, data: items, meta: { studentId, startDay, endDay, modelDir: baseDir, groundTruth, mode: 'stub_py_error', stderr, pyResp: resp } });
        } catch (e) {
          const items = await fallbackStub();
          return res.json({ success: true, data: items, meta: { studentId, startDay, endDay, modelDir: baseDir, groundTruth, mode: 'stub_py_parse_error', stderr } });
        }
      });

      py.stdin.write(JSON.stringify(payload));
      py.stdin.end();
    } catch (error) {
      console.error('Error in getPredictionsForWindow:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = controller;
