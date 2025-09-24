import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import Layout from '../layout/Layout';
import Header from '../layout/Header';
import { useStudentData } from '../../hooks/useStudentData';
import { apiService } from '../../services/api';

const DEFAULT_LABELS = ['Distinction', 'Fail', 'Pass', 'Withdrawn'];

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '-';
  }
  if (bytes === 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const idx = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** idx;
  const decimals = value >= 10 || idx === 0 ? 0 : 1;
  return `${value.toFixed(decimals)} ${units[idx]}`;
}

function formatTimestamp(value) {
  if (!value) {
    return 'unknown';
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return 'unknown';
  }
  return dt.toLocaleString();
}


function generateMockPredictions(days, labels) {
  return days.map((day) => {
    const probs = Array(labels.length).fill(0).map(() => Math.random());
    const sum = probs.reduce((a, b) => a + b, 0) || 1;
    const norm = probs.map((p) => p / sum);
    const idx = norm.indexOf(Math.max(...norm));
    return {
      day,
      model_available: true,
      pred_label: labels[idx],
      pred_index: idx,
      confidence: Number(norm[idx].toFixed(3)),
    };
  });
}

const FORCE_DUMMY = false;

const PredictionsPage = () => {
  const { data } = useStudentData();

  const students = useMemo(() => {
    const set = new Set();
    data.forEach((r) => r.id_student && set.add(r.id_student));
    const arr = Array.from(set);
    return arr.length ? arr : [686112, 123456];
  }, [data]);

  const maxDayInData = useMemo(() => {
    const numericDays = data
      .map((r) => Number(r?.date))
      .filter((v) => Number.isFinite(v) && v > 0);
    const max = numericDays.length ? Math.max(...numericDays) : 60;
    return max < 1 ? 60 : max;
  }, [data]);

  const [selectedStudent, setSelectedStudent] = useState(() => (students[0] || 'all'));
  useEffect(() => {
    // If the students list changes and current selection isn't present, pick the first
    if (!students.includes(selectedStudent)) {
      setSelectedStudent(students[0] || 'all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  const [labelText, setLabelText] = useState(DEFAULT_LABELS.join(', '));
  const labels = useMemo(() => labelText.split(',').map((s) => s.trim()).filter(Boolean), [labelText]);

  const [startDay, setStartDay] = useState(1);
  const endDay = Math.min(startDay + 4, Math.max(1, maxDayInData));
  const days = useMemo(
    () => Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i),
    [startDay, endDay]
  );

  const [predictions, setPredictions] = useState([]);
  const [groundTruth, setGroundTruth] = useState(null);
  const [backendMode, setBackendMode] = useState(null); // 'python' or stub_xxx
  const [modelDir, setModelDir] = useState('Azure Blob Storage (models)');
  const [availableModels, setAvailableModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState(null);
  const [selectedModelName, setSelectedModelName] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      // Force dummy data mode for now
      if (FORCE_DUMMY) {
        const rows = generateMockPredictions(days, labels.length ? labels : DEFAULT_LABELS);
        if (!cancelled) {
          setPredictions(rows);
          setGroundTruth(null);
          setBackendMode('fallback-data');
          setModelDir('Dummy data');
        }
        return;
      }

      // Normal path (kept for when we re-enable models)
      try {
        const sid = selectedStudent || (students[0] || 0);
        const resp = await apiService.getPredictionsWindow({ studentId: sid, startDay, endDay, labels });
        if (!cancelled) {
          let rows = resp && resp.success ? (resp.data || []) : [];
          const mode = resp && resp.meta ? resp.meta.mode : null;
          const allErrored = rows.length > 0 && rows.every((r) => typeof r?.pred_label === 'string' && r.pred_label.startsWith('ERROR'));
          if (mode === 'python' && allErrored) {
            rows = generateMockPredictions(days, labels.length ? labels : DEFAULT_LABELS);
            setBackendMode('fallback-data');
          } else {
            setBackendMode(mode);
          }
          if (rows.length === days.length) rows = rows.map((r, i) => ({ ...r, day: days[i] }));
          setPredictions(rows);
          setGroundTruth(resp && resp.meta ? resp.meta.groundTruth : null);
          if (resp && resp.meta && resp.meta.modelDir) setModelDir(resp.meta.modelDir);
        }
      } catch (e) {
        if (!cancelled) {
          setPredictions(generateMockPredictions(days, labels.length ? labels : DEFAULT_LABELS));
          setGroundTruth(null);
          setBackendMode('fallback-data');
          setModelDir('Dummy data');
        }
      }
    };
    run();
    return () => { cancelled = true; };
  }, [selectedStudent, startDay, endDay, labels, students]);

  const fetchModels = useCallback(async () => {
    setModelsLoading(true);
    setModelsError(null);
    setDownloadUrl(null);
    setDownloadError(null);

    try {
      const models = await apiService.listPredictionModels();
      if (!isMountedRef.current) {
        return;
      }
      const normalized = Array.isArray(models) ? models : [];
      setAvailableModels(normalized);
      setSelectedModelName((prev) => {
        if (prev && normalized.some((item) => item.name === prev)) {
          return prev;
        }
        return normalized[0]?.name || '';
      });
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }
      setAvailableModels([]);
      setSelectedModelName('');
      setModelsError(error?.message || 'Unable to load models');
    } finally {
      if (!isMountedRef.current) {
        return;
      }
      setModelsLoading(false);
    }
  }, [isMountedRef]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  useEffect(() => {
    setDownloadUrl(null);
    setDownloadError(null);
  }, [selectedModelName]);

  const selectedModelMeta = useMemo(() => (
    availableModels.find((item) => item.name === selectedModelName) || null
  ), [availableModels, selectedModelName]);

  const handleRefreshModels = useCallback(() => {
    fetchModels();
  }, [fetchModels]);

  const handleGenerateDownloadUrl = useCallback(async () => {
    if (!selectedModelName) {
      return;
    }
    setDownloadLoading(true);
    setDownloadError(null);
    setDownloadUrl(null);
    try {
      const data = await apiService.getPredictionModelDownloadUrl(selectedModelName);
      if (!isMountedRef.current) {
        return;
      }
      const url = data?.url;
      if (!url) {
        throw new Error('Download URL missing in response');
      }
      setDownloadUrl(url);
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }
      setDownloadError(error?.message || 'Unable to generate download URL');
    } finally {
      if (!isMountedRef.current) {
        return;
      }
      setDownloadLoading(false);
    }
  }, [selectedModelName]);
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <Header
          title="Daywise Predictions"
          subtitle="Windowed view of model outputs per day"
          rightContent={
            <div className="hidden md:flex items-center space-x-2 text-sm bg-black/20 text-white px-3 py-2 rounded-lg">
              <span className="opacity-80">Models folder:</span>
              <code className="opacity-95">{modelDir}</code>
            </div>
          }
        />

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sdt-dark">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Student</label>
              <select
                className="app-input w-full px-3 py-2 rounded-lg border"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                {students.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Label names (comma-separated)</label>
              <input
                className="app-input w-full px-3 py-2 rounded-lg border"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Azure Stored Models</h4>
            {modelsError && (
              <div className="mb-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {modelsError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Model file</label>
                <select
                  className="app-input w-full px-3 py-2 rounded-lg border"
                  value={selectedModelName}
                  onChange={(e) => setSelectedModelName(e.target.value)}
                  disabled={modelsLoading || !availableModels.length}
                >
                  {availableModels.map((item) => (
                    <option key={item.name} value={item.name}>{item.name}</option>
                  ))}
                </select>
                {selectedModelMeta && (
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {formatBytes(selectedModelMeta.size ?? 0)} | Updated {formatTimestamp(selectedModelMeta.lastModified)}
                  </p>
                )}
                {!modelsLoading && !availableModels.length && !modelsError && (
                  <p className="text-xs text-gray-500 mt-1">No models available in Azure storage.</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="px-3 py-2 rounded-lg text-white shadow-sm"
                  style={{ backgroundColor: '#8b57d4' }}
                  onClick={handleRefreshModels}
                  disabled={modelsLoading}
                >
                  {modelsLoading ? 'Loading...' : 'Refresh list'}
                </button>
                <button
                  className="px-3 py-2 rounded-lg text-white shadow-sm"
                  style={{ backgroundColor: '#0ea5e9' }}
                  onClick={handleGenerateDownloadUrl}
                  disabled={downloadLoading || !selectedModelName}
                >
                  {downloadLoading ? 'Generating...' : 'Get download URL'}
                </button>
              </div>
            </div>
            {downloadError && (
              <div className="mt-3 text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                {downloadError}
              </div>
            )}
            {downloadUrl && (
              <div className="mt-3 text-xs text-gray-200 bg-black/30 border border-white/10 rounded-lg px-3 py-2 space-y-1 break-words">
                <div className="flex items-center justify-between gap-2">
                  <span>Download link ready</span>
                  <a className="text-indigo-300 underline" href={downloadUrl} target="_blank" rel="noreferrer">Open</a>
                </div>
                <code className="block text-[11px] leading-4 break-words">{downloadUrl}</code>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Max day in dataset: <span className="font-medium text-gray-300">{Math.max(1, maxDayInData)}</span></div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-2 rounded-lg text-white shadow-sm"
                style={{ backgroundColor: '#8b57d4' }}
                onClick={() => setStartDay((d) => Math.max(1, d - 5))}
              >
                Prev 5 days
              </button>
              <button
                className="px-3 py-2 rounded-lg text-white shadow-sm"
                style={{ backgroundColor: '#8b57d4' }}
                onClick={() => setStartDay((d) => Math.min(Math.max(1, maxDayInData - 4), d + 5))}
              >
                Next 5 days ➡️
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-200 sdt-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-100">Student {selectedStudent} — Days {startDay}–{endDay}</h3>
            <div className="flex items-center gap-2">
              {backendMode && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${backendMode === 'python' ? 'bg-green-200/10 text-green-300 border-green-400/20' : 'bg-yellow-200/10 text-yellow-300 border-yellow-400/20'}`}>
                  {backendMode === 'python' ? 'Source: Real models' : 'Fallback Data'}
                </span>
              )}
              {groundTruth && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-200/10 text-indigo-300 border border-indigo-400/20">
                  Ground truth: {groundTruth}
                </span>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="pb-2 pr-4">Day</th>
                  <th className="pb-2 pr-4">Model Available</th>
                  <th className="pb-2 pr-4">Predicted Label</th>
                  <th className="pb-2 pr-4">Index</th>
                  <th className="pb-2 pr-4">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {predictions.map((r) => (
                  <tr key={r.day} className="hover:bg-white/5">
                    <td className="py-2 pr-4 text-gray-200">{r.day}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.model_available ? 'bg-green-200/10 text-green-300 border border-green-400/20' : 'bg-gray-200/10 text-gray-300 border border-gray-400/20'}`}>
                        {r.model_available ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-gray-100">{r.pred_label}</td>
                    <td className="py-2 pr-4 text-gray-300">{r.pred_index}</td>
                    <td className="py-2 pr-4 text-gray-300">{r.confidence != null ? (r.confidence * 100).toFixed(1) + '%' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PredictionsPage;
