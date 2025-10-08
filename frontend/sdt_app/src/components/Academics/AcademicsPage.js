import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Layout from '../layout/Layout';
import { apiService } from '../../services/api';

const WEEK_LENGTH = 5;
const EMPTY_VALUE = 'N/A';

function parseStudentId(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const numeric = Number.parseInt(value, 10);
  return Number.isNaN(numeric) ? null : numeric;
}

function getRowStudentId(row) {
  if (!row || typeof row !== 'object') {
    return null;
  }
  return parseStudentId(
    row.student_id ?? row.id_student ?? row.studentId ?? row.idStudent
  );
}

function getOutcomeColors(label) {
  switch (label) {
    case 'Pass':
      return {
        border: '#22c55e',
        background: 'rgba(34, 197, 94, 0.1)',
        text: '#bbf7d0'
      };
    case 'Distinction':
      return {
        border: '#38bdf8',
        background: 'rgba(56, 189, 248, 0.1)',
        text: '#bae6fd'
      };
    case 'Withdrawn':
      return {
        border: '#f97316',
        background: 'rgba(249, 115, 22, 0.1)',
        text: '#fed7aa'
      };
    case 'Fail':
      return {
        border: '#ef4444',
        background: 'rgba(239, 68, 68, 0.1)',
        text: '#fecaca'
      };
    default:
      return {
        border: 'rgba(148, 163, 184, 0.4)',
        background: 'rgba(148, 163, 184, 0.1)',
        text: '#e2e8f0'
      };
  }
}

function formatConfidence(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return EMPTY_VALUE;
  }
  return `${(numeric * 100).toFixed(1)}%`;
}

function getWeekNumber(day) {
  const numeric = Number(day);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return 1;
  }
  return Math.floor((numeric - 1) / WEEK_LENGTH) + 1;
}

function getWeekRange(weekNumber) {
  const start = (weekNumber - 1) * WEEK_LENGTH + 1;
  const end = start + WEEK_LENGTH - 1;
  return { start, end };
}

function summariseWeek(rows) {
  if (!rows.length) {
    return null;
  }

  const counts = new Map();
  rows.forEach((row) => {
    const label = row.pred_label || 'Unknown';
    const entry = counts.get(label) || { total: 0, confidenceSum: 0 };
    entry.total += 1;
    const numericConfidence = Number(row.confidence);
    if (Number.isFinite(numericConfidence)) {
      entry.confidenceSum += numericConfidence;
    }
    counts.set(label, entry);
  });

  let bestLabel = null;
  let bestScore = -Infinity;
  counts.forEach((entry, label) => {
    const averageConfidence =
      entry.total > 0 ? entry.confidenceSum / entry.total : 0;
    const score = entry.total * 100 + averageConfidence;
    if (score > bestScore) {
      bestScore = score;
      bestLabel = label;
    }
  });

  return { label: bestLabel, daysCount: rows.length };
}

const AcademicsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getAllStudents();
        if (!active) {
          return;
        }
        if (response?.success) {
          let data = response.data || [];
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const [, payloadBase64] = token.split('.');
              if (payloadBase64) {
                const payload = JSON.parse(atob(payloadBase64));
                const tokenStudentId = parseStudentId(
                  payload?.id_student ?? payload?.student_id
                );
                if (
                  payload?.role === 'student' &&
                  tokenStudentId !== null
                ) {
                  data = data.filter(
                    (row) => getRowStudentId(row) === tokenStudentId
                  );
                }
              }
            } catch (decodeErr) {
              console.error('[ACADEMICS] Token decode failed:', decodeErr);
            }
          }
          setRecords(data);
        } else {
          throw new Error(response?.error || 'Unable to load predictions');
        }
      } catch (err) {
        if (!active) {
          return;
        }
        console.error('[ACADEMICS] load failed:', err);
        setError(err?.message || 'Unable to load predictions');
        setRecords([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const primaryStudentId = useMemo(() => {
    const first = records.find(
      (row) => getRowStudentId(row) !== null
    );
    return first ? getRowStudentId(first) : null;
  }, [records]);

  const studentRows = useMemo(() => {
    if (primaryStudentId === null) {
      return [];
    }
    return records
      .filter((row) => getRowStudentId(row) === primaryStudentId)
      .sort((a, b) => Number(a.day) - Number(b.day));
  }, [records, primaryStudentId]);

  const weeks = useMemo(() => {
    const grouped = new Map();
    studentRows.forEach((row) => {
      const weekNumber = getWeekNumber(row.day);
      if (!grouped.has(weekNumber)) {
        grouped.set(weekNumber, []);
      }
      grouped.get(weekNumber).push(row);
    });
    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([weekNumber, rows]) => ({
        weekNumber,
        range: getWeekRange(weekNumber),
        rows: rows.sort((a, b) => Number(a.day) - Number(b.day)),
        summary: summariseWeek(rows)
      }));
  }, [studentRows]);

  useEffect(() => {
    if (!weeks.length) {
      setSelectedWeek(null);
      return;
    }
    setSelectedWeek((prev) => {
      if (prev === null) {
        return weeks[0].weekNumber;
      }
      const stillExists = weeks.some((week) => week.weekNumber === prev);
      return stillExists ? prev : weeks[0].weekNumber;
    });
  }, [weeks]);

  const currentWeek = useMemo(() => {
    if (selectedWeek === null) {
      return null;
    }
    return weeks.find((week) => week.weekNumber === selectedWeek) || null;
  }, [weeks, selectedWeek]);

  const highestConfidence = useMemo(() => {
    if (!currentWeek) {
      return null;
    }
    return currentWeek.rows.reduce((acc, row) => {
      const numeric = Number(row.confidence);
      if (!Number.isFinite(numeric)) {
        return acc;
      }
      return numeric > acc ? numeric : acc;
    }, 0);
  }, [currentWeek]);

  const chartData = useMemo(() => {
    if (!currentWeek) {
      return [];
    }
    return currentWeek.rows.map((row) => {
      const dayNumber = Number(row.day);
      const label = row.pred_label || EMPTY_VALUE;
      const confidenceRaw = Number(row.confidence);
      const confidencePercent = Number.isFinite(confidenceRaw)
        ? confidenceRaw * 100
        : null;
      const { border } = getOutcomeColors(label);
      return {
        dayNumber,
        dayLabel: `Day ${dayNumber}`,
        label,
        confidencePercent,
        color: border
      };
    });
  }, [currentWeek]);

  const renderTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }
    const point = payload[0].payload;
    return (
      <div className="rounded-md border border-zinc-700 bg-zinc-900/90 px-3 py-2 text-xs text-slate-200 shadow-lg">
        <p className="font-semibold" style={{ color: point.color }}>
          {point.label}
        </p>
        <p className="text-slate-300">{point.dayLabel}</p>
        <p className="text-slate-400">
          Confidence{' '}
          {point.confidencePercent !== null
            ? `${point.confidencePercent.toFixed(1)}%`
            : EMPTY_VALUE}
        </p>
      </div>
    );
  };

  const handleWeekShift = (direction) => {
    if (!currentWeek) {
      return;
    }
    const index = weeks.findIndex(
      (week) => week.weekNumber === currentWeek.weekNumber
    );
    if (index === -1) {
      return;
    }
    const target = weeks[index + direction];
    if (target) {
      setSelectedWeek(target.weekNumber);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Weekly Prediction Tracker
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Follow how your predicted outcome changes across the term. Each week
            combines five study days so you can focus on the bigger picture.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-700 bg-zinc-900/60 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-200">
                Week in focus
              </label>
              <p className="text-xs text-slate-400">
                Move between weeks to see how the daily predictions are trending.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleWeekShift(-1)}
                disabled={
                  !currentWeek ||
                  !weeks.length ||
                  weeks[0].weekNumber === selectedWeek
                }
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-slate-100 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <select
                value={selectedWeek ?? ''}
                onChange={(event) => setSelectedWeek(Number(event.target.value))}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {weeks.map((week) => (
                  <option key={week.weekNumber} value={week.weekNumber}>
                    Week {week.weekNumber} ({week.range.start}-{week.range.end})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleWeekShift(1)}
                disabled={
                  !currentWeek ||
                  !weeks.length ||
                  weeks[weeks.length - 1].weekNumber === selectedWeek
                }
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-slate-100 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-6">
            {loading ? (
              <div className="flex flex-col items-center gap-3 py-12 text-slate-300">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
                <p>Loading predictions...</p>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            ) : !currentWeek ? (
              <div className="rounded-lg border border-zinc-700 bg-zinc-900/80 p-4 text-sm text-slate-300">
                We do not have weekly predictions to show just yet. Check back soon.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-100">
                      Week {currentWeek.weekNumber}{' '}
                      <span className="text-lg text-slate-300">
                        (days {currentWeek.range.start}-{currentWeek.range.end})
                      </span>
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Predictions update daily, showing whether you are on track to
                      pass, excel, or if extra attention is needed.
                    </p>
                  </div>
                  {currentWeek.summary && (
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
                      <p className="text-xs uppercase tracking-wide text-emerald-200/80">
                        Week outlook
                      </p>
                      <p className="text-lg font-semibold text-emerald-200">
                        {currentWeek.summary.label || EMPTY_VALUE}
                      </p>
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto rounded-lg border border-zinc-800">
                  <table className="min-w-full divide-y divide-zinc-800 text-sm">
                    <thead className="bg-zinc-900/80 text-slate-300">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">
                          Day
                        </th>
                        <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">
                          Outcome
                        </th>
                        <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">
                          Confidence
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-slate-100">
                      {currentWeek.rows.map((row) => {
                        const dayNumber = Number(row.day);
                        const label = row.pred_label || EMPTY_VALUE;
                        const { border, background, text } = getOutcomeColors(label);
                        return (
                          <tr key={`day-${dayNumber}`} className="hover:bg-zinc-800/40">
                            <td className="px-4 py-3 font-medium text-slate-200">Day {dayNumber}</td>
                            <td className="px-4 py-3">
                              <span
                                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                                style={{
                                  borderWidth: '1px',
                                  borderStyle: 'solid',
                                  borderColor: border,
                                  color: text,
                                  backgroundColor: background
                                }}
                              >
                                {label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {formatConfidence(row.confidence)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-200">
                      Confidence trend this week
                    </h3>
                  </div>
                  {chartData.length ? (
                    <div className="mt-4 h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                          <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="4 4" />
                          <XAxis
                            dataKey="dayLabel"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
                            tickLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
                          />
                          <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
                            tickLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                          />
                          <Tooltip content={renderTooltip} />
                          <Line
                            type="monotone"
                            dataKey="confidencePercent"
                            stroke="#8b57d4"
                            strokeWidth={2}
                            connectNulls
                            dot={({ cx, cy, payload }) => {
                              if (payload.confidencePercent === null) {
                                return null;
                              }
                              return (
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={5}
                                  fill={payload.color}
                                  stroke="#1f2937"
                                  strokeWidth={1.5}
                                />
                              );
                            }}
                            activeDot={({ cx, cy, payload }) => {
                              if (payload.confidencePercent === null) {
                                return null;
                              }
                              return (
                                <g>
                                  <circle cx={cx} cy={cy} r={7} fill={payload.color} opacity={0.25} />
                                  <circle
                                    cx={cx}
                                    cy={cy}
                                    r={5}
                                    fill={payload.color}
                                    stroke="#1f2937"
                                    strokeWidth={1.5}
                                  />
                                </g>
                              );
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-slate-400">
                      Confidence information is not available for this week.
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Week highlights
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                      <li>- {currentWeek.rows.length} daily predictions were generated.</li>
                      <li>
                        - {currentWeek.summary?.label || EMPTY_VALUE} is the most common outcome
                        this week.
                      </li>
                      <li>
                        - Confidence peaks at {formatConfidence(highestConfidence)}.
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-slate-300">
                    <p>
                      As new results are added, this view refreshes automatically. Use
                      the combined weekly outlook and the daily breakdown to decide
                      whether to keep your current study plan or take action early.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AcademicsPage;
