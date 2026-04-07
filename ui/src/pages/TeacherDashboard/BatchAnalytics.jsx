import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const RISK_COLORS = {
  low: 'bg-green-400',
  medium: 'bg-amber-400',
  high: 'bg-red-500',
};

const ScoreBar = ({ label, count, max }) => {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-black text-slate-400 w-12 text-right uppercase tracking-widest">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
        <div
          className="h-full bg-primary/80 rounded-full flex items-center justify-end pr-2 transition-all duration-700"
          style={{ width: `${pct}%` }}
        >
          {count > 0 && <span className="text-[9px] font-black text-white">{count}</span>}
        </div>
      </div>
      <span className="text-xs font-bold text-slate-500 w-8">{pct}%</span>
    </div>
  );
};

const BatchAnalytics = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const resp = await api.get(`/assessments/tests/${testId}/analytics/`);
        setData(resp.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
        setError('Could not load analytics. Make sure you have access to this test.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [testId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-slate-400 font-bold text-sm">Crunching numbers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">analytics</span>
        <p className="text-slate-400 font-bold">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary font-bold text-sm hover:underline">← Go Back</button>
      </div>
    );
  }

  const maxBucketCount = data.score_distribution.length > 0
    ? Math.max(...data.score_distribution.map(b => b.count), 1)
    : 1;

  const totalRisk = (data.risk_distribution.low + data.risk_distribution.medium + data.risk_distribution.high) || 1;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 font-body">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/teacher/dashboard')}
          className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Batch Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-on-surface">{data.test_title}</h1>
        </div>
        <Link
          to={`/teacher/test/${testId}/submissions`}
          className="flex items-center gap-2 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest px-4 py-3 rounded-2xl hover:bg-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
          View Submissions
        </Link>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            label: 'Total Submitted',
            value: data.total_submitted,
            sub: `of ${data.total_enrolled} enrolled`,
            icon: 'assignment_turned_in',
            color: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'Average Score',
            value: data.avg_score != null ? `${data.avg_score}` : '—',
            sub: `out of ${data.total_marks}`,
            icon: 'bar_chart',
            color: 'bg-green-50 text-green-600',
          },
          {
            label: 'Pass Rate',
            value: data.pass_rate != null ? `${data.pass_rate}%` : '—',
            sub: 'students passed',
            icon: 'workspace_premium',
            color: 'bg-purple-50 text-purple-600',
          },
          {
            label: 'High Risk',
            value: data.risk_distribution.high,
            sub: 'students flagged',
            icon: 'warning',
            color: 'bg-red-50 text-red-500',
          },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${kpi.color}`}>
              <span className="material-symbols-outlined">{kpi.icon}</span>
            </div>
            <p className="text-3xl font-black text-on-surface">{kpi.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Score Distribution */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-50">
          <h2 className="text-base font-black text-on-surface mb-1">Score Distribution</h2>
          <p className="text-xs text-slate-400 font-medium mb-6">Percentage of full marks scored</p>
          {data.total_submitted === 0 ? (
            <p className="text-slate-300 text-sm font-bold text-center py-8">No submissions yet</p>
          ) : (
            <div className="space-y-4">
              {data.score_distribution.map(bucket => (
                <ScoreBar key={bucket.range} label={bucket.range} count={bucket.count} max={data.total_submitted} />
              ))}
            </div>
          )}
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50">
          <h2 className="text-base font-black text-on-surface mb-1">Risk Breakdown</h2>
          <p className="text-xs text-slate-400 font-medium mb-6">Based on proctoring flags</p>

          {/* Donut-like visual */}
          <div className="flex flex-col gap-4">
            {Object.entries(data.risk_distribution).map(([level, count]) => {
              const pct = Math.round((count / totalRisk) * 100);
              return (
                <div key={level}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-black text-slate-500 capitalize">{level} Risk</span>
                    <span className="text-xs font-black text-slate-600">{count} ({pct}%)</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${RISK_COLORS[level]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Avg. Time Taken</p>
            <p className="text-xl font-black text-on-surface">—</p>
            <p className="text-xs text-slate-400">across all submissions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Performers */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50">
          <h2 className="text-base font-black text-on-surface mb-1">Top Performers</h2>
          <p className="text-xs text-slate-400 font-medium mb-6">Highest scoring students</p>
          {data.top_performers.length === 0 ? (
            <p className="text-slate-300 text-sm font-bold text-center py-8">No submissions yet</p>
          ) : (
            <div className="space-y-3">
              {data.top_performers.map((student, i) => {
                const pct = data.total_marks ? Math.round((parseFloat(student.score) / data.total_marks) * 100) : 0;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                      i === 0 ? 'bg-amber-100 text-amber-600' :
                      i === 1 ? 'bg-slate-100 text-slate-500' :
                      i === 2 ? 'bg-orange-50 text-orange-500' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-on-surface">{student.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400">{pct}%</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-on-surface">{student.score}<span className="text-slate-400 font-medium text-xs">/{data.total_marks}</span></span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Question Analytics */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50">
          <h2 className="text-base font-black text-on-surface mb-1">Question Difficulty</h2>
          <p className="text-xs text-slate-400 font-medium mb-6">Accuracy rate per question</p>
          {data.question_analytics.length === 0 ? (
            <p className="text-slate-300 text-sm font-bold text-center py-8">No questions or attempts</p>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-72 pr-1">
              {data.question_analytics.map((q, i) => {
                const acc = q.accuracy_pct;
                const color = acc == null ? 'bg-slate-200' : acc >= 70 ? 'bg-green-400' : acc >= 40 ? 'bg-amber-400' : 'bg-red-400';
                return (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 flex-shrink-0 mt-0.5">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-on-surface leading-tight mb-1">{q.question_text}{q.question_text.length >= 80 ? '…' : ''}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${acc ?? 0}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 w-12 text-right">
                          {acc != null ? `${acc}%` : 'N/A'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{q.correct_count}/{q.total_attempts} correct · {q.marks} mark{q.marks !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchAnalytics;
