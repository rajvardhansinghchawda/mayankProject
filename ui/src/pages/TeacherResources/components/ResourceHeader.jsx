import React from 'react';

const ResourceHeader = () => {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Academic Repository</h1>
        <p className="text-on-surface-variant font-medium text-lg">Manage digital assets and study materials for your assigned courses.</p>
      </div>
      <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3">
        <span className="material-symbols-outlined">add_box</span>
        Upload New Resource
      </button>
    </div>
  );
};

export default ResourceHeader;
