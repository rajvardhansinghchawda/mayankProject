import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import assessmentService from '../../../services/assessmentService';

const STATUS_CONFIG = {
  draft:    { label: 'Draft', color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-400' },
  published:{ label: 'Live',  color: 'bg-green-50 text-green-600',  dot: 'bg-green-500' },
  active:   { label: 'Active', color: 'bg-blue-50 text-blue-600',   dot: 'bg-blue-500' },
  closed:   { label: 'Closed', color: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
  results_released: { label: 'Results Out', color: 'bg-purple-50 text-purple-600', dot: 'bg-purple-500' },
};

const ActiveAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const data = await assessmentService.getTests();
      setAssessments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch assessments', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all'
    ? assessments
    : assessments.filter(a => a.status === filter);

  if (loading) return null;

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50 mb-12">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-black text-on-surface mb-1">My Assessments</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {assessments.length} Total · {assessments.filter(a => ['published', 'active'].includes(a.status)).length} Live
          </p>
        </div>
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-50 rounded-2xl p-1">
          {['all', 'draft', 'published', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">quiz</span>
          <p className="text-slate-400 font-bold text-sm">
            {filter === 'all' ? 'No assessments yet.' : `No ${filter} assessments.`}
          </p>
          {filter === 'draft' && (
            <p className="text-slate-300 text-xs mt-1">Draft tests need questions before publishing.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((assessment) => {
            const cfg = STATUS_CONFIG[assessment.status] || STATUS_CONFIG.draft;
            const isDraft = assessment.status === 'draft';
            return (
              <div
                key={assessment.id}
                className="bg-slate-50 p-6 rounded-[28px] border border-white group hover:shadow-lg transition-all duration-300"
              >
                {/* Status + Duration */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${cfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                    {cfg.label}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {assessment.duration_minutes}m
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-base font-black text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {assessment.title}
                </h4>

                {/* Subject + Section */}
                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-xs font-bold text-slate-500">{assessment.subject_name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[13px] text-primary">groups</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {assessment.department_name
                        ? `${assessment.department_name} | Sec ${assessment.section_name}`
                        : (assessment.section_name || 'All Sections')}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {assessment.total_marks || '—'} Marks
                  </span>
                  {isDraft ? (
                    <button
                      onClick={() => navigate(`/teacher/test-builder/${assessment.id}`)}
                      className="flex items-center gap-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl hover:bg-amber-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Add Questions
                    </button>
                  ) : (
                    <Link
                      to={`/teacher/test/${assessment.id}/submissions`}
                      className="flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl hover:bg-primary hover:text-white transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                      Submissions
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveAssessments;
