import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyUploads = ({ publishedCount = 0, draftCount = 0, loading }) => {
  const navigate = useNavigate();
  const pendingCount = 0; // Can expand later

  return (
    <section className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
      <h2 className="text-xl font-extrabold text-primary mb-8 flex items-center gap-2">
        <span className="material-symbols-outlined" id="cloud-done-icon">cloud_done</span>
        My Uploads
      </h2>
      <div className="grid grid-cols-2 gap-8 h-32">
        <div
          className="flex flex-col items-center justify-center bg-surface-container-low rounded-3xl group hover:bg-primary hover:text-white transition-all cursor-pointer"
          onClick={() => navigate('/uploads')}
        >
          {loading ? (
            <div className="h-10 w-10 bg-slate-200 rounded animate-pulse mb-1"></div>
          ) : (
            <span className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">
              {publishedCount}
            </span>
          )}
          <span className="text-xs font-bold uppercase tracking-widest opacity-60">Published</span>
        </div>
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-3xl group hover:border-tertiary transition-all cursor-pointer"
          onClick={() => navigate('/uploads')}
        >
          {loading ? (
            <div className="h-10 w-10 bg-slate-200 rounded animate-pulse mb-1"></div>
          ) : (
            <span className="text-4xl font-black text-tertiary-container mb-1 group-hover:scale-110 transition-transform">
              {String(draftCount).padStart(2, '0')}
            </span>
          )}
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Drafts</span>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate('/uploads')}
          className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
        >
          Manage your document library{' '}
          <span className="material-symbols-outlined" id="arrow-forward-icon">arrow_forward</span>
        </button>
      </div>
    </section>
  );
};

export default MyUploads;
