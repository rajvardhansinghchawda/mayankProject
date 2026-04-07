import React, { useState, useEffect } from 'react';
import assessmentService from '../../../services/assessmentService';

const EvaluationQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const resp = await assessmentService.getTestAttempts();
      const data = resp.data?.results || resp.data || resp;
      setQueue(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch evaluation queue', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-on-surface mb-1">Evaluation Queue</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Faculty Review</p>
        </div>
        <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        {queue.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">fact_check</span>
            <p className="text-slate-400 font-bold text-sm">No pending submissions to evaluate.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assessment</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted At</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 text-sm font-bold text-on-surface">
                      <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary text-xs font-black">
                        {item.student_name?.split(' ').map(n => n[0]).join('') || 'S'}
                      </div>
                      <div>
                        {item.student_name}
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Student Submission</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-black text-slate-600 uppercase tracking-tighter">{item.test_title}</div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                      item.risk_level === 'high' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      Risk: {item.risk_level}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">
                    {item.submitted_at ? new Date(item.submitted_at).toLocaleString() : 'Just now'}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="bg-primary text-white py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg shadow-primary/20 transition-all">
                      Evaluate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EvaluationQueue;

