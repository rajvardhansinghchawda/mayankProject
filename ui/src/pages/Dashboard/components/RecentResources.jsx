import React from 'react';
import { useNavigate } from 'react-router-dom';

const SkeletonItem = () => (
  <li className="flex items-center justify-between p-3 border-b border-outline-variant/10 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 bg-slate-200 rounded"></div>
      <div>
        <div className="h-4 w-40 bg-slate-200 rounded mb-1"></div>
        <div className="h-3 w-24 bg-slate-100 rounded"></div>
      </div>
    </div>
    <div className="w-6 h-6 bg-slate-200 rounded"></div>
  </li>
);

const ResourceItem = ({ res }) => {
  const navigate = useNavigate();
  const typeIconMap = {
    'LECTURE_NOTES': 'description',
    'RESEARCH_PAPER': 'article',
    'PRACTICE_LAB': 'science',
    'PREVIOUS_PAPER': 'history_edu',
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
    <li className="flex items-center justify-between p-3 border-b border-outline-variant/10">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary-fixed-dim" id={`res-${res.id}-icon`}>
          {typeIconMap[res.document_type] || 'description'}
        </span>
        <div>
          <p className="text-sm font-bold text-on-surface line-clamp-1 max-w-[200px]">{res.title}</p>
          <p className="text-[10px] text-slate-400">
            By {res.uploader_name} • {timeAgo(res.created_at)}
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate(`/utilities/viewer?id=${res.id}`)}
        className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors"
        id={`res-${res.id}-action`}
      >
        open_in_new
      </button>
    </li>
  );
};

const RecentResources = ({ resources = [], loading }) => {
  return (
    <section className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined" id="auto-stories-icon">auto_stories</span>
          Recent Resources
        </h2>
        {resources.length > 0 && (
          <span className="bg-secondary-container text-on-secondary-container text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
            {resources.length} New
          </span>
        )}
      </div>
      <ul className="space-y-1">
        {loading && <><SkeletonItem /><SkeletonItem /><SkeletonItem /></>}
        {!loading && resources.length === 0 && (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-4xl text-slate-200 mb-2 block">auto_stories</span>
            <p className="text-slate-400 font-medium text-sm">No resources available yet.</p>
          </div>
        )}
        {!loading && resources.map(res => <ResourceItem key={res.id} res={res} />)}
      </ul>
    </section>
  );
};

export default RecentResources;
