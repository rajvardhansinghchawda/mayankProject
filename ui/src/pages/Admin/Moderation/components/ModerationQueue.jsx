import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';

const ModerationQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await api.get('/documents/pending/');
      // Handle both paginated and non-paginated responses
      const data = response.data.results || response.data.data || response.data || [];
      setQueue(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch moderation queue", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.post(`/documents/${id}/admin-action/${action}/`);
      setQueue(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(`Failed to ${action} asset`, err);
      alert(`Failed to ${action} asset.`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[40px] p-12 text-center border border-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Queue...</p>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="bg-white rounded-[40px] p-12 text-center border border-slate-50 shadow-sm transition-all hover:shadow-lg">
        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 scale-150">fact_check</span>
        <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest text-[10px] mb-2">Queue Empty</h3>
        <p className="text-slate-400 font-medium text-sm">No documents are currently pending review.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 transition-all hover:shadow-lg">
      <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
        <h3 className="text-xl font-black text-on-surface uppercase tracking-widest text-[10px] text-primary">Moderation Queue</h3>
        <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-[10px] font-black">{queue.length} PENDING</span>
      </div>
      <div className="space-y-6">
        {queue.map((item) => (
          <div key={item.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-8 bg-slate-50 rounded-[36px] border border-white group hover:bg-slate-100 transition-all duration-300">
            <div className="flex items-center gap-6 mb-6 lg:mb-0">
              <div className="w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center text-primary border border-slate-50 cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open(`/utilities/viewer?id=${item.id}`, '_blank')}>
                <span className="material-symbols-outlined text-2xl">
                  {item.document_type === 'presentation' ? 'slideshow' : 'article'}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-on-surface mb-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => window.open(`/utilities/viewer?id=${item.id}`, '_blank')}>{item.title}</h4>
                <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs capitalize text-primary/50">person</span>
                  By {item.uploader_name} • {item.section_display} • {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleAction(item.id, 'reject')}
                className="bg-white text-slate-400 w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                title="Reject and Delete"
              >
                <span className="material-symbols-outlined">block</span>
              </button>
              <button 
                onClick={() => handleAction(item.id, 'approve')}
                className="bg-primary text-white px-8 h-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Approve Asset
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModerationQueue;
