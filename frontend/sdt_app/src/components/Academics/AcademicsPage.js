import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '../layout/Layout';
import Header from '../layout/Header';
import { apiService } from '../../services/api';
import { useStudentData } from '../../hooks/useStudentData';

const DEFAULT_LABELS = ['Distinction', 'Fail', 'Pass', 'Withdrawn'];
const WINDOW_SIZE = 5;

const AcademicsPage = () => {
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [startDay, setStartDay] = useState(1);
  const [labelsInput, setLabelsInput] = useState(DEFAULT_LABELS.join(', '));
  const [predictions, setPredictions] = useState([]);
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  const [predictionsError, setPredictionsError] = useState(null);
  const [predictionsMeta, setPredictionsMeta] = useState(null);

  const labels = useMemo(() => {
    return labelsInput
      .split(',')
      .map((value) => value.trim())
      .filter((value) => Boolean(value));
  }, [labelsInput]);

  const {
    data: studentRows,
    loading: studentDataLoading,
    error: studentDataError,
  } = useStudentData(selectedStudent || null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setStudentsLoading(true);
        setStudentsError(null);
        const response = await apiService.getUniqueStudents();
        if (!active) return;
        if (response?.success && Array.isArray(response.data)) {
          setStudents(response.data);
          setSelectedStudent((prev) => {
            if (prev) return prev;
            const first = response.data[0];
            return first != null ? String(first) : '';
          });
        } else {
          throw new Error(response?.error || 'Unable to load student list');
        }
      } catch (err) {
        if (active) {
          setStudentsError(err?.message || 'Unable to load student list');
        }
      } finally {
        if (active) {
          setStudentsLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setStartDay(1);
  }, [selectedStudent]);

  const maxDayInData = useMemo(() => {
    const numericDays = studentRows
      .map((row) => Number(row?.date))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (!numericDays.length) {
      return 0;
    }
    return Math.max(...numericDays);
  }, [studentRows]);

  const maxStartDay = useMemo(() => {
    if (!maxDayInData || maxDayInData < 1) {
      return 1;
    }
    return Math.max(1, maxDayInData - WINDOW_SIZE + 1);
  }, [maxDayInData]);

  useEffect(() => {
    setStartDay((prev) => Math.min(prev, maxStartDay));
  }, [maxStartDay]);

  const endDay = useMemo(() => {
    const tentative = startDay + WINDOW_SIZE - 1;
    if (!maxDayInData || maxDayInData < 1) {
      return tentative;
    }
    return Math.min(tentative, maxDayInData);
  }, [startDay, maxDayInData]);

  const windowDescription = useMemo(() => {
    if (!selectedStudent) {
      return 'Select a student to view predictions.';
    }
    return `Showing predictions for days ${startDay}-${endDay}`;
  }, [selectedStudent, startDay, endDay]);

  const loadPredictions = useCallback(async () => {
    if (!selectedStudent) {
      setPredictions([]);
      setPredictionsMeta(null);
      return;
    }

    try {
      setPredictionsLoading(true);
      setPredictionsError(null);
      const numericStudentId = Number(selectedStudent);
      if (!Number.isFinite(numericStudentId)) {
        throw new Error('Student id must be numeric.');
      }

      const effectiveLabels = labels.length ? labels : DEFAULT_LABELS;
      const response = await apiService.getPredictionsWindow({
        studentId: numericStudentId,
        startDay,
        endDay,
        labels: effectiveLabels,
      });

      if (!response?.success) {
        throw new Error(response?.error || 'Prediction service returned an error');
      }

      setPredictions(Array.isArray(response.data) ? response.data : []);
      setPredictionsMeta(response.meta || null);
    } catch (err) {
      setPredictions([]);
      setPredictionsMeta(null);
      console.error("[ACADEMICS] Failed to load predictions", err);
      setPredictionsError(err?.message || 'Unable to load predictions');
    } finally {
      setPredictionsLoading(false);
    }
  }, [selectedStudent, startDay, endDay, labels]);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  const handlePrevWindow = () => {
    setStartDay((prev) => Math.max(1, prev - WINDOW_SIZE));
  };

  const handleNextWindow = () => {
    setStartDay((prev) => {
      const candidate = prev + WINDOW_SIZE;
      return Math.min(maxStartDay, candidate);
    });
  };

  const handleRefresh = () => {
    loadPredictions();
  };

  const groundTruth = useMemo(() => {
    if (predictionsMeta?.groundTruth) {
      return predictionsMeta.groundTruth;
    }
    const counts = {};
    studentRows.forEach((row) => {
      if (row?.final_result) {
        const key = String(row.final_result);
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    const keys = Object.keys(counts);
    if (!keys.length) {
      return null;
    }
    return keys.sort((a, b) => counts[b] - counts[a])[0];
  }, [predictionsMeta, studentRows]);

  const missingModels = predictionsMeta?.missingModels || [];
  const azureDownloads = predictionsMeta?.azureDownloads || [];
  const backendMode = predictionsMeta?.mode;
  const modelSource = predictionsMeta?.source;
  const modelSourceLabel = useMemo(() => {
    if (!modelSource) return 'unknown';
    if (modelSource === 'azure-only') return 'Azure blob storage';
    if (modelSource === 'local-cache') return 'Local cache (unexpected)';
    return modelSource;
  }, [modelSource]);
  const unexpectedModelSource = modelSource && modelSource !== 'azure-only';
  const rowsCount = predictionsMeta?.rowsCount;
  const rowMinDate = predictionsMeta?.rowMinDate;
  const rowMaxDate = predictionsMeta?.rowMaxDate;

  return (
    <Layout>
      <Header
        title="Academics"
        subtitle="Day-wise predictions powered by Azure-hosted ANN models"
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 sdt-dark">
            <h2 className="text-lg font-semibold text-gray-100">Configuration</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Student</label>
                {studentsLoading ? (
                  <p className="text-sm text-gray-400 mt-1">Loading student ids...</p>
                ) : studentsError ? (
                  <p className="text-sm text-red-300 mt-1">{studentsError}</p>
                ) : (
                  <select
                    className="mt-1 w-full rounded-lg bg-zinc-900/80 border border-white/10 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={selectedStudent}
                    onChange={(event) => setSelectedStudent(event.target.value)}
                  >
                    {students.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Label order</label>
                <input
                  type="text"
                  value={labelsInput}
                  onChange={(event) => setLabelsInput(event.target.value)}
                  placeholder="Distinction, Fail, Pass, Withdrawn"
                  className="mt-1 w-full rounded-lg bg-zinc-900/80 border border-white/10 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Comma-separated labels mapping to the model output indices.
                </p>
              </div>

              <div className="rounded-lg bg-zinc-900/70 border border-white/10 px-3 py-2 text-sm text-gray-300 space-y-1">
                <p>
                  Max day in dataset: {' '}
                  <span className="font-semibold text-indigo-200">
                    {maxDayInData || 'unknown'}
                  </span>
                </p>
                {studentDataLoading && <p>Loading activity data...</p>}
                {studentDataError && <p className="text-red-300">{studentDataError}</p>}
                {groundTruth && (
                  <p>
                    Ground truth: {' '}
                    <span className="font-semibold text-green-200">{groundTruth}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 sdt-dark">
            <h2 className="text-lg font-semibold text-gray-100">Model status</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <p>
                Backend mode: {' '}
                <span className="font-semibold text-indigo-200">
                  {backendMode || 'unknown'}
                </span>
              </p>
              <p>
                Model source: {' '}
                <span className="font-semibold text-indigo-200">
                  {modelSourceLabel}
                </span>
              </p>
              {unexpectedModelSource && (
                <p className="text-xs text-red-300">
                  Unexpected backend source reported: {modelSource}
                </p>
              )}
              {typeof rowsCount === 'number' && (
                <p className="text-xs text-gray-400">
                  Rows fetched: {rowsCount} (min date {rowMinDate ?? 'n/a'}, max date {rowMaxDate ?? 'n/a'})
                </p>
              )}
              <p>
                Missing models this window: {' '}
                {missingModels.length ? (
                  <span className="text-yellow-300 font-semibold">
                    {missingModels.length}
                  </span>
                ) : (
                  <span className="text-green-300 font-semibold">0</span>
                )}
              </p>
              {missingModels.length > 0 && (
                <div className="text-xs text-yellow-200 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                  <p className="font-medium mb-1">Models not found locally:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {missingModels.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p>
                Azure downloads this request: {' '}
                {azureDownloads.length ? (
                  <span className="text-indigo-200 font-semibold">
                    {azureDownloads.length}
                  </span>
                ) : (
                  <span className="text-gray-300 font-semibold">0</span>
                )}
              </p>
              {azureDownloads.length > 0 && (
                <div className="text-xs text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-2">
                  <p className="font-medium mb-1">Downloaded artifacts:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {azureDownloads.map((item) => (
                      <li key={item.name}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 sdt-dark">
            <h2 className="text-lg font-semibold text-gray-100">Window controls</h2>
            <p className="text-sm text-gray-400 mt-2">{windowDescription}</p>
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <button
                  className="px-3 py-2 rounded-lg text-white shadow-sm"
                  style={{ backgroundColor: '#8b57d4' }}
                  onClick={handlePrevWindow}
                  disabled={startDay <= 1 || predictionsLoading}
                >
                  Prev {WINDOW_SIZE} days
                </button>
                <button
                  className="px-3 py-2 rounded-lg text-white shadow-sm"
                  style={{ backgroundColor: '#8b57d4' }}
                  onClick={handleNextWindow}
                  disabled={startDay >= maxStartDay || predictionsLoading}
                >
                  Next {WINDOW_SIZE} days
                </button>
              </div>
              <button
                className="px-3 py-2 rounded-lg text-white shadow-sm w-full md:w-auto"
                style={{ backgroundColor: '#0ea5e9' }}
                onClick={handleRefresh}
                disabled={predictionsLoading}
              >
                {predictionsLoading ? 'Loading...' : 'Refresh predictions'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sdt-dark">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-100">
                Student {selectedStudent || 'N/A'} - Days {startDay} to {endDay}
              </h3>
              {predictionsMeta?.modelDir && (
                <p className="text-xs text-gray-400">Model directory: {predictionsMeta.modelDir}</p>
              )}
            </div>
            {backendMode && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  backendMode === 'python'
                    ? 'bg-green-200/10 text-green-300 border-green-400/20'
                    : 'bg-red-200/10 text-red-300 border-red-400/20'
                }`}
              >
                {backendMode === 'python' ? 'Azure predictions' : `Unexpected mode: ${backendMode}`}
              </span>
            )}
          </div>

          {predictionsError && (
            <div className="mt-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {predictionsError}
            </div>
          )}

          {!predictionsError && (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="pb-2 pr-4">Day</th>
                    <th className="pb-2 pr-4">Model available</th>
                    <th className="pb-2 pr-4">Predicted label</th>
                    <th className="pb-2 pr-4">Index</th>
                    <th className="pb-2 pr-4">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {predictionsLoading && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-300">
                        Loading predictions...
                      </td>
                    </tr>
                  )}
                  {!predictionsLoading && !predictions.length && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-300">
                        No predictions available for this range.
                      </td>
                    </tr>
                  )}
                  {!predictionsLoading &&
                    predictions.map((row) => (
                      <tr key={row.day} className="hover:bg-white/5">
                        <td className="py-2 pr-4 text-gray-200">{row.day}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              row.model_available
                                ? 'bg-green-200/10 text-green-300 border border-green-400/20'
                                : 'bg-gray-200/10 text-gray-300 border border-gray-400/20'
                            }`}
                          >
                            {row.model_available ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-gray-100">{row.pred_label || '-'}</td>
                        <td className="py-2 pr-4 text-gray-300">
                          {row.pred_index != null ? row.pred_index : '-'}
                        </td>
                        <td className="py-2 pr-4 text-gray-300">
                          {row.confidence != null ? `${(row.confidence * 100).toFixed(1)}%` : '-'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AcademicsPage;


