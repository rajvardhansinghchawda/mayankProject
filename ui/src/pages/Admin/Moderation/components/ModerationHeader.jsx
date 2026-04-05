import React from 'react';

const ModerationHeader = () => {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Content Moderation</h1>
        <p className="text-on-surface-variant font-medium text-lg">Review and approve educational assets to maintain institutional standards.</p>
      </div>
      <div className="flex gap-4">
        <button className="bg-white text-primary border-2 border-primary/10 px-8 py-4 rounded-2xl font-black text-sm hover:bg-primary/5 transition-all flex items-center gap-3">
          <span className="material-symbols-outlined">policy</span>
          View Guidelines
        </button>
      </div>
    </div>
  );
};

export default ModerationHeader;
