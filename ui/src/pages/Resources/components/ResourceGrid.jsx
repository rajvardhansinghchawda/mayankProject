import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ResourceCard = ({ res }) => {
  const navigate = useNavigate();
  const typeColorMap = {
    'LECTURE_NOTES': 'text-blue-500 bg-blue-50',
    'RESEARCH_PAPER': 'text-purple-500 bg-purple-50',
    'PRACTICE_LAB': 'text-green-500 bg-green-50',
    'PREVIOUS_PAPER': 'text-amber-500 bg-amber-50'
  };

  const handleView = () => {
    navigate(`/utilities/viewer?id=${res.id}`);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_20px_rgba(25,28,29,0.03)] hover:shadow-[0_15px_35px_rgba(25,28,29,0.07)] transition-all group border border-transparent hover:border-primary/10">
      <div className="flex justify-between items-start mb-6">
        <div className={`px-3 py-1 rounded-lg flex items-center justify-center font-black text-[10px] tracking-widest ${typeColorMap[res.document_type] || 'text-slate-500 bg-slate-50'}`}>
          {res.document_type?.replace('_', ' ')}
        </div>
        <button 
          onClick={handleView}
          className="material-symbols-outlined text-slate-300 hover:text-primary transition-colors"
        >
          visibility
        </button>
      </div>
      
      <h3 className="text-base font-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
        {res.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
          {res.subject || 'General'}
        </span>
        <span className="text-[10px] text-slate-300">•</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatFileSize(res.file_size_bytes)}</span>
      </div>
      
      <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-surface-container-high overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase">
            {res.uploader_name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-on-surface truncate">{res.uploader_name}</p>
          <p className="text-[9px] text-slate-400 font-medium">{new Date(res.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

const ResourceGrid = ({ documents }) => {
  if (!Array.isArray(documents) || documents.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-100">
        <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">folder_off</span>
        <p className="text-slate-400 font-medium">No resources found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map(res => (
        <ResourceCard key={res.id} res={res} />
      ))}
    </div>
  );
};

export default ResourceGrid;
