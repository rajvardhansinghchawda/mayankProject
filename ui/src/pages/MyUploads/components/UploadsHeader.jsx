import React from 'react';

const UploadsHeader = ({ onUploadClick }) => {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">My Institutional Uploads</h1>
        <p className="text-on-surface-variant font-medium">Manage and track the status of your submitted academic materials.</p>
      </div>
      
      <button 
        onClick={onUploadClick}
        className="bg-primary text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2 w-max"
      >
        <span className="material-symbols-outlined text-lg">add_circle</span>
        Upload New Document
      </button>
    </div>
  );
};

export default UploadsHeader;
