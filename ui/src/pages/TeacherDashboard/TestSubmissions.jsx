import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RISK_CONFIG = {
  low:    { label: 'Low',    classes: 'bg-green-50 text-green-600',  dot: 'bg-green-400' },
  medium: { label: 'Medium', classes: 'bg-amber-50 text-amber-600',  dot: 'bg-amber-400' },
  high:   { label: 'High',   classes: 'bg-red-50 text-red-600',      dot: 'bg-red-500' },
};

const STATUS_CONFIG = {
  submitted:      { label: 'Submitted',     classes: 'bg-blue-50 text-blue-600' },
  auto_submitted: { label: 'Auto-Submit',   classes: 'bg-orange-50 text-orange-600' },
  in_progress:    { label: 'In Progress',   classes: 'bg-amber-50 text-amber-600' },
  not_started:    { label: 'Not Started',   classes: 'bg-slate-100 text-slate-500' },
};

const TestSubmissionsPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('submitted_at');
  const [filterRisk, setFilterRisk] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testRes, subRes] = await Promise.all([
          api.get(`/assessments/tests/${testId}/`),
          api.get(`/assessments/tests/${testId}/submissions/`),
        ]);
        setTest(testRes.data);
        const subs = subRes.data?.results ?? subRes.data;
        setSubmissions(Array.isArray(subs) ? subs : []);
      } catch (err) {
        console.error('Failed to load submissions', err);
        setError('Could not load submission data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [testId]);

  const filtered = submissions.filter(s =>
    filterRisk === 'all' ? true : s.risk_level === filterRisk
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'score') return (b.score ?? -1) - (a.score ?? -1);
    if (sortBy === 'name') return (a.student_name || '').localeCompare(b.student_name || '');
    // default: submitted_at
    return new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0);
  });

  const submittedCount = submissions.filter(s => ['submitted', 'auto_submitted'].includes(s.status)).length;
  const avgScore = submittedCount > 0
    ? (submissions.filter(s => s.score != null).reduce((acc, s) => acc + parseFloat(s.score || 0), 0) / submittedCount).toFixed(1)
    : 'N/A';
  const highRiskCount = submissions.filter(s => s.risk_level === 'high').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">error</span>
        <p className="text-slate-400 font-bold">{error}</p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-black text-on-surface">{test?.title}</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            {test?.subject_name} · Submission Results
          </p>
        </div>
        <a
          href={`/api/assessments/tests/${testId}/submissions/export/`}
          className="flex items-center gap-2 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest px-4 py-3 rounded-2xl hover:bg-slate-200 transition-colors"
          download
        >
          <span className="material-symbols-outlined text-base">download</span>
          Export CSV
        </a>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Submissions', value: submittedCount,             icon: 'assignment_turned_in', color: 'bg-blue-50 text-blue-600' },
          { label: 'Avg. Score',        value: avgScore,                   icon: 'bar_chart',            color: 'bg-green-50 text-green-600' },
          { label: 'Total Marks',       value: test?.total_marks ?? '—',   icon: 'grade',                color: 'bg-purple-50 text-purple-600' },
          { label: 'High Risk',         value: highRiskCount,              icon: 'warning',              color: 'bg-red-50 text-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-on-surface">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-black text-on-surface">Student Submissions</h2>
          <div className="flex items-center gap-3">
            {/* Risk filter */}
            <div className="flex items-center gap-1 bg-slate-50 rounded-2xl p-1">
              {['all', 'low', 'medium', 'high'].map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRisk(r)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filterRisk === r ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {r === 'all' ? 'All Risk' : r}
                </button>
              ))}
            </div>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-slate-50 text-[11px] font-black text-slate-600 uppercase tracking-widest px-3 py-2 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="submitted_at">Sort: Latest</option>
              <option value="score">Sort: Score ↓</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">inbox</span>
            <p className="text-slate-400 font-bold">No submissions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Score</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Percentage</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted</th>
                  <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Taken</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((sub) => {
                  const risk   = RISK_CONFIG[sub.risk_level]   || RISK_CONFIG.low;
                  const status = STATUS_CONFIG[sub.status]     || STATUS_CONFIG.not_started;
                  const pct    = test?.total_marks && sub.score != null
                    ? ((parseFloat(sub.score) / test.total_marks) * 100).toFixed(1)
                    : null;
                  const initials = (sub.student_name || 'S').split(' ').map(n => n[0]).join('').toUpperCase();
                  const timeTaken = sub.time_taken_seconds
                    ? `${Math.floor(sub.time_taken_seconds / 60)}m ${sub.time_taken_seconds % 60}s`
                    : '—';

                  return (
                    <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      {/* Student */}
                      <td className="py-5 pr-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary text-xs font-black flex items-center justify-center flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{sub.student_name || '—'}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Student</p>
                          </div>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="py-5 pr-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${status.classes}`}>
                          {status.label}
                        </span>
                      </td>
                      {/* Score */}
                      <td className="py-5 pr-6 text-center">
                        <span className={`text-base font-black ${sub.score != null ? 'text-on-surface' : 'text-slate-300'}`}>
                          {sub.score != null ? sub.score : '—'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium"> / {test?.total_marks ?? '?'}</span>
                      </td>
                      {/* Percentage */}
                      <td className="py-5 pr-6 text-center">
                        {pct != null ? (
                          <div className="inline-flex flex-col items-center gap-1">
                            <span className={`text-sm font-black ${parseFloat(pct) >= 60 ? 'text-green-600' : 'text-red-500'}`}>
                              {pct}%
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${parseFloat(pct) >= 60 ? 'bg-green-400' : 'bg-red-400'}`}
                                style={{ width: `${Math.min(100, parseFloat(pct))}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      {/* Risk */}
                      <td className="py-5 pr-6">
                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${risk.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
                          {risk.label}
                        </span>
                      </td>
                      {/* Submitted At */}
                      <td className="py-5 pr-6 text-xs text-slate-500 font-medium">
                        {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString([], {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) : '—'}
                      </td>
                      {/* Time Taken */}
                      <td className="py-5 text-xs text-slate-500 font-medium">{timeTaken}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSubmissionsPage;
