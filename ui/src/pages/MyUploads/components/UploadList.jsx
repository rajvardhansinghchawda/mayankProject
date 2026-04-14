import React from 'react';
import api from '../../../services/api';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const UploadList = ({ uploads, setUploads }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'draft': return 'bg-blue-100 text-blue-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'flagged': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const handleAction = async (id, action) => {
    try {
      const response = await api.post(`/documents/${id}/action/${action}/`);
      if (response.data.success) {
        setUploads(prev => prev.map(doc => 
          doc.id === id ? { ...doc, status: response.data.status } : doc
        ));
      }
    } catch (err) {
      console.error(`Failed to ${action} document`, err);
      alert(`Failed to ${action} document. Please try again.`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    
    try {
      await api.delete(`/documents/${id}/`);
      setUploads(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      console.error("Failed to delete document", err);
      alert("Failed to delete document. Please try again.");
    }
  };

  const safeUploads = Array.isArray(uploads) ? uploads : [];

  if (safeUploads.length === 0) {
    return (
      <div className="bg-white rounded-[40px] p-20 text-center border border-slate-50 shadow-sm font-body">
        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 scale-150">cloud_off</span>
        <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">No Documents Found</h3>
        <p className="text-slate-400 mt-2 font-medium">You haven't uploaded any academic resources yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-slate-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Name</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Date</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeUploads.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-xl">description</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface truncate max-w-[200px]">{doc.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{doc.document_type?.replace('_', ' ')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-semibold text-slate-500">{doc.subject || 'General'}</span>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-semibold text-slate-500">{formatFileSize(doc.file_size_bytes)}</span>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-semibold text-slate-500">{new Date(doc.created_at).toLocaleDateString()}</span>
                </td>
                <td className="px-8 py-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusStyle(doc.status)}`}>
                    {doc.status?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {doc.status === 'draft' && (
                      <button 
                        onClick={() => handleAction(doc.id, 'submit')}
                        title="Submit for Review"
                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-lg">rocket_launch</span>
                      </button>
                    )}
                    {(doc.status === 'published' || doc.status === 'pending') && (
                      <button 
                        onClick={() => handleAction(doc.id, 'unpublish')}
                        title="Move to Draft"
                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-amber-500 transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-lg">undo</span>
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        window.location.assign(`/utilities/viewer?id=${doc.id}`);
                      }}
                      className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-error transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
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

export default UploadList;
