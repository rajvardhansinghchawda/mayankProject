import React from 'react';

const MyUploads = () => {
  return (
    <section className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
      <h2 className="text-xl font-extrabold text-primary mb-8 flex items-center gap-2">
        <span className="material-symbols-outlined" id="cloud-done-icon">cloud_done</span>
        My Uploads
      </h2>
      <div className="grid grid-cols-2 gap-8 h-32">
        <div className="flex flex-col items-center justify-center bg-surface-container-low rounded-3xl group hover:bg-primary hover:text-white transition-all">
          <span className="text-4xl font-black mb-1 group-hover:scale-110 transition-transform">12</span>
          <span className="text-xs font-bold uppercase tracking-widest opacity-60">Published</span>
        </div>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-3xl group hover:border-tertiary transition-all">
          <span className="text-4xl font-black text-tertiary-container mb-1 group-hover:scale-110 transition-transform">04</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Drafts</span>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
          Manage your document library <span className="material-symbols-outlined" id="arrow-forward-icon">arrow_forward</span>
        </button>
      </div>
    </section>
  );
};

export default MyUploads;
