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
import { useTheme } from '../../contexts/ThemeContext';
import { getCardStyles, getTextStyles, getChartStyles } from '../../utils/themeStyles';

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
        border: '#2ECC71',
        background: '#2ECC71',
        text: '#FFFFFF'
      };
    case 'Distinction':
      return {
        border: '#3AA3FF',
        background: '#3AA3FF',
        text: '#FFFFFF'
      };
    case 'Withdrawn':
      return {
        border: '#FFB020',
        background: '#FFB020',
        text: '#FFFFFF'
      };
    case 'Fail':
      return {
        border: '#FF4D4F',
        background: '#FF4D4F',
        text: '#FFFFFF'
      };
    default:
      return {
        border: '#6B7280',
        background: '#6B7280',
        text: '#FFFFFF'
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
  const { isKSG, isKSGMirror, isProfessional } = useTheme();
  const isKSGVariant = isKSG || isKSGMirror;
  const cardStyles = useMemo(() => getCardStyles(isKSGVariant, isProfessional), [isKSGVariant, isProfessional]);
  const textStyles = useMemo(() => getTextStyles(isKSGVariant, isProfessional), [isKSGVariant, isProfessional]);
  const chartStyles = useMemo(() => getChartStyles(isKSGVariant, isProfessional), [isKSGVariant, isProfessional]);

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
      <div className={isProfessional
        ? 'rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-pro-text shadow-lg'
        : 'rounded-md border border-zinc-700 bg-zinc-900/90 px-3 py-2 text-xs text-slate-200 shadow-lg'
      }>
        <p className="font-semibold" style={{ color: point.color }}>
          {point.label}
        </p>
        <p className={isProfessional ? 'text-pro-text' : 'text-slate-300'}>{point.dayLabel}</p>
        <p className={isProfessional ? 'text-pro-text-muted' : 'text-slate-400'}>
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
          <h1 className={isProfessional
            ? 'text-3xl font-bold text-pro-text'
            : 'text-3xl font-bold text-slate-100'
          }>
            Weekly Prediction Tracker
          </h1>
          <p className={isProfessional
            ? 'mt-2 text-sm text-pro-text-muted'
            : 'mt-2 text-sm text-slate-300'
          }>
            Follow how your predicted outcome changes across the term. Each week
            combines five study days so you can focus on the bigger picture.
          </p>
        </div>

        <div className={isProfessional
          ? 'bg-white rounded-lg border border-gray-200 shadow-pro-card p-6 space-y-6'
          : 'rounded-xl border border-zinc-700 bg-zinc-900/60 p-6 space-y-6'
        }>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <label className={isProfessional
                ? 'text-sm font-semibold text-pro-text'
                : 'text-sm font-semibold text-slate-200'
              }>
                Week in focus
              </label>
              <p className={isProfessional
                ? 'text-xs text-pro-text-muted'
                : 'text-xs text-slate-400'
              }>
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
                className={isProfessional
                  ? 'rounded-lg border border-gray-300 px-3 py-2 text-sm text-pro-text hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                  : 'rounded-lg border border-zinc-700 px-3 py-2 text-sm text-slate-100 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50'
                }
              >
                Prev
              </button>
              <select
                value={selectedWeek ?? ''}
                onChange={(event) => setSelectedWeek(Number(event.target.value))}
                className={isProfessional
                  ? 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-pro-text focus:outline-none focus:ring-2 focus:ring-pro-primary'
                  : 'rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400'
                }
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
                className={isProfessional
                  ? 'rounded-lg border border-gray-300 px-3 py-2 text-sm text-pro-text hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                  : 'rounded-lg border border-zinc-700 px-3 py-2 text-sm text-slate-100 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50'
                }
              >
                Next
              </button>
            </div>
          </div>

          <div className={isProfessional
            ? 'bg-gray-50 rounded-lg border border-gray-200 p-6'
            : 'rounded-xl border border-zinc-700 bg-zinc-900/70 p-6'
          }>
            {loading ? (
              <div className={isProfessional
                ? 'flex flex-col items-center gap-3 py-12 text-pro-text-muted'
                : 'flex flex-col items-center gap-3 py-12 text-slate-300'
              }>
                <div className={isProfessional
                  ? 'h-10 w-10 animate-spin rounded-full border-2 border-pro-primary border-t-transparent'
                  : 'h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent'
                } />
                <p>Loading predictions...</p>
              </div>
            ) : error ? (
              <div className={isProfessional
                ? 'rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700'
                : 'rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200'
              }>
                {error}
              </div>
            ) : !currentWeek ? (
              <div className={isProfessional
                ? 'rounded-lg border border-gray-200 bg-white p-4 text-sm text-pro-text-muted'
                : 'rounded-lg border border-zinc-700 bg-zinc-900/80 p-4 text-sm text-slate-300'
              }>
                We do not have weekly predictions to show just yet. Check back soon.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className={isProfessional
                      ? 'text-2xl font-semibold text-pro-text'
                      : 'text-2xl font-semibold text-slate-100'
                    }>
                      Week {currentWeek.weekNumber}{' '}
                      <span className={isProfessional
                        ? 'text-lg text-pro-text-muted'
                        : 'text-lg text-slate-300'
                      }>
                        (days {currentWeek.range.start}-{currentWeek.range.end})
                      </span>
                    </h2>
                    <p className={isProfessional
                      ? 'mt-2 text-sm text-pro-text-muted'
                      : 'mt-2 text-sm text-slate-400'
                    }>
                      Predictions update daily, showing whether you are on track to
                      pass, excel, or if extra attention is needed.
                    </p>
                  </div>
                  {currentWeek.summary && (
                    <div className={isProfessional
                      ? 'rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm'
                      : 'rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm'
                    }>
                      <p className={isProfessional
                        ? 'text-xs uppercase tracking-wide text-green-600'
                        : 'text-xs uppercase tracking-wide text-emerald-200/80'
                      }>
                        Week outlook
                      </p>
                      <p className={isProfessional
                        ? 'text-lg font-semibold text-green-700'
                        : 'text-lg font-semibold text-emerald-200'
                      }>
                        {currentWeek.summary.label || EMPTY_VALUE}
                      </p>
                    </div>
                  )}
                </div>

                <div className={isProfessional
                  ? 'overflow-x-auto rounded-lg border border-gray-200'
                  : 'overflow-x-auto rounded-lg border border-zinc-800'
                }>
                  <table className={isProfessional
                    ? 'min-w-full divide-y divide-gray-200 text-sm'
                    : 'min-w-full divide-y divide-zinc-800 text-sm'
                  }>
                    <thead className={isProfessional
                      ? 'bg-gray-50 text-pro-text'
                      : 'bg-zinc-900/80 text-slate-300'
                    }>
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
                    <tbody className={isProfessional
                      ? 'divide-y divide-gray-200 text-pro-text'
                      : 'divide-y divide-zinc-800 text-slate-100'
                    }>
                      {currentWeek.rows.map((row) => {
                        const dayNumber = Number(row.day);
                        const label = row.pred_label || EMPTY_VALUE;
                        const { border, background, text } = getOutcomeColors(label);
                        return (
                          <tr key={`day-${dayNumber}`} className={isProfessional
                            ? 'hover:bg-gray-50'
                            : 'hover:bg-zinc-800/40'
                          }>
                            <td className={isProfessional
                              ? 'px-4 py-3 font-medium text-pro-text'
                              : 'px-4 py-3 font-medium text-slate-200'
                            }>Day {dayNumber}</td>
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

                <div className={isProfessional
                  ? 'rounded-lg border border-gray-200 bg-white p-4'
                  : 'rounded-lg border border-zinc-800 bg-zinc-900/80 p-4'
                }>
                  <div className="flex items-center justify-between">
                    <h3 className={isProfessional
                      ? 'text-sm font-semibold text-pro-text'
                      : 'text-sm font-semibold text-slate-200'
                    }>
                      Confidence trend this week
                    </h3>
                  </div>
                  {chartData.length ? (
                    <div className="mt-4 h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                          <CartesianGrid stroke={chartStyles.gridColor} strokeDasharray="4 4" />
                          <XAxis
                            dataKey="dayLabel"
                            tick={{ fill: chartStyles.axisColor, fontSize: 12 }}
                            axisLine={{ stroke: chartStyles.axisColor }}
                            tickLine={{ stroke: chartStyles.axisColor }}
                          />
                          <YAxis
                            tick={{ fill: chartStyles.axisColor, fontSize: 12 }}
                            axisLine={{ stroke: chartStyles.axisColor }}
                            tickLine={{ stroke: chartStyles.axisColor }}
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
                                  stroke={isProfessional ? '#ffffff' : '#1f2937'}
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
                                    stroke={isProfessional ? '#ffffff' : '#1f2937'}
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
                    <p className={isProfessional
                      ? 'mt-4 text-xs text-pro-text-muted'
                      : 'mt-4 text-xs text-slate-400'
                    }>
                      Confidence information is not available for this week.
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className={isProfessional
                    ? 'rounded-lg border border-gray-200 bg-white p-4'
                    : 'rounded-lg border border-zinc-800 bg-zinc-900/80 p-4'
                  }>
                    <p className={isProfessional
                      ? 'text-xs uppercase tracking-wide text-pro-text-muted'
                      : 'text-xs uppercase tracking-wide text-slate-400'
                    }>
                      Week highlights
                    </p>
                    <ul className={isProfessional
                      ? 'mt-3 space-y-2 text-sm text-pro-text'
                      : 'mt-3 space-y-2 text-sm text-slate-300'
                    }>
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
                  <div className={isProfessional
                    ? 'rounded-lg border border-gray-200 bg-white p-4 text-sm text-pro-text'
                    : 'rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-slate-300'
                  }>
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
