import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const ResourcesReview = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents/pending/');
      const data = res.data?.results || res.data?.data || res.data || [];
      setQueue(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch pending documents', err);
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionInProgress(id + action);
    try {
      await api.post(`/documents/${id}/admin-action/${action}/`);
      setQueue(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(`Failed to ${action} document`, err);
      alert(`Failed to ${action} document.`);
    } finally {
      setActionInProgress(null);
    }
  };

  const docTypeLabel = (type) => (type || 'Document').replace(/_/g, ' ');
  const docTypeColor = (type) => {
    const map = {
      'LECTURE_NOTES': 'bg-blue-50 text-blue-600',
      'RESEARCH_PAPER': 'bg-purple-50 text-purple-600',
      'PRACTICE_LAB': 'bg-green-50 text-green-600',
      'PREVIOUS_PAPER': 'bg-amber-50 text-amber-600',
    };
    return map[type] || 'bg-slate-50 text-slate-500';
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Resources Review</h1>
            <p className="text-on-surface-variant font-medium">Review and approve student-submitted documents before they are published.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 text-amber-700 px-5 py-3 rounded-2xl flex items-center gap-2 font-black text-sm border border-amber-100">
              <span className="material-symbols-outlined text-lg">pending_actions</span>
              {queue.length} Pending
            </div>
            <button
              onClick={fetchQueue}
              className="bg-white border border-slate-100 text-slate-500 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-[40px] p-20 text-center border border-slate-50 shadow-sm">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Pending Documents...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && queue.length === 0 && (
        <div className="bg-white rounded-[40px] p-20 text-center border border-slate-50 shadow-sm">
          <span className="material-symbols-outlined text-7xl text-slate-200 mb-6 block">fact_check</span>
          <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest mb-3">All Clear!</h3>
          <p className="text-slate-400 font-medium">No documents are currently pending review. Great work!</p>
        </div>
      )}

      {/* Document Cards */}
      {!loading && queue.length > 0 && (
        <div className="space-y-6">
          {queue.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-50 flex flex-col lg:flex-row lg:items-center gap-6 hover:shadow-md transition-all group"
            >
              {/* Icon + Info */}
              <div className="flex items-start gap-6 flex-1 min-w-0">
                <div
                  className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-white shadow-sm cursor-pointer hover:bg-primary hover:text-white transition-all flex-shrink-0"
                  onClick={() => window.open(`/utilities/viewer?id=${doc.id}`, '_blank')}
                  title="Preview Document"
                >
                  <span className="material-symbols-outlined text-2xl">description</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3
                      className="text-lg font-black text-on-surface group-hover:text-primary transition-colors cursor-pointer truncate"
                      onClick={() => window.open(`/utilities/viewer?id=${doc.id}`, '_blank')}
                    >
                      {doc.title}
                    </h3>
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${docTypeColor(doc.document_type)}`}>
                      {docTypeLabel(doc.document_type)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    <span className="font-bold text-slate-500">{doc.uploader_name}</span>
                    {doc.section_display && <> · {doc.section_display}</>}
                    {doc.subject && <> · {doc.subject}</>}
                    <> · Submitted {timeAgo(doc.created_at)}</>
                  </p>
                  {doc.description && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">description</span>
                      {doc.page_count || '?'} pages
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">storage</span>
                      {doc.file_size_bytes ? `${(doc.file_size_bytes / 1024).toFixed(0)} KB` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => window.open(`/utilities/viewer?id=${doc.id}`, '_blank')}
                  className="px-5 h-12 bg-slate-50 text-slate-500 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-slate-100 transition-all border border-white"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Preview
                </button>
                <button
                  onClick={() => handleAction(doc.id, 'reject')}
                  disabled={!!actionInProgress}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-100 bg-white text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 disabled:opacity-50 transition-all"
                  title="Reject Document"
                >
                  {actionInProgress === doc.id + 'reject' ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined">block</span>
                  )}
                </button>
                <button
                  onClick={() => handleAction(doc.id, 'approve')}
                  disabled={!!actionInProgress}
                  className="px-8 h-12 rounded-2xl font-black text-xs uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {actionInProgress === doc.id + 'approve' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Approve & Publish
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesReview;
