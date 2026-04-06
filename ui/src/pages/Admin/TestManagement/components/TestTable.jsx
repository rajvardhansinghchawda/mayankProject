import React, { useState, useEffect } from 'react';
import assessmentService from '../../../../services/assessmentService';

const TestTable = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const data = await assessmentService.getTests();
      // Handle paginated vs non-paginated
      setTests(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error('Failed to fetch tests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('ADMIN ACTION: Are you sure you want to permanently delete this test? This will also delete all associated questions and student submissions.')) {
      try {
        await assessmentService.deleteTest(id);
        fetchTests();
      } catch (err) {
        console.error('Delete test failed', err);
        alert('Failed to delete test');
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'published':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'draft':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'closed':
      case 'archived':
        return 'bg-slate-50 text-slate-400 border-slate-100';
      default:
        return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[40px] p-20 flex justify-center shadow-sm">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-on-surface uppercase tracking-[0.2em] text-[10px] text-primary">Live Assessment Inventory</h3>
        <div className="flex gap-2">
          {['Active', 'Draft', 'Archived'].map((status) => (
            <button key={status} className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-50 text-slate-400 hover:text-primary transition-all">
              {status}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Test Information</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Questions</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Duration</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic">No assessments found in the inventory</td>
              </tr>
            ) : tests.map((test) => (
              <tr key={test.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{test.title}</h4>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest opacity-50">{test.subject_name || 'General'}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center text-sm font-bold text-slate-500">{test.question_count || 0}</td>
                <td className="px-8 py-6 text-center text-sm font-bold text-slate-500">{test.duration_minutes}m</td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(test.status)}`}>
                    {test.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      title="View Analytics"
                      className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">analytics</span>
                    </button>
                    <button 
                      title="Edit Test"
                      className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(test.id)}
                      title="Delete Test (Admin)"
                      className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default TestTable;
