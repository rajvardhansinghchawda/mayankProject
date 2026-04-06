import React, { useState } from 'react';
import UploadResourceModal from './UploadResourceModal';

const ResourceHeader = ({ onUploadSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Academic Repository</h1>
        <p className="text-on-surface-variant font-medium text-lg">Manage digital assets and study materials for your assigned courses.</p>
      </div>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3"
      >
        <span className="material-symbols-outlined">add_box</span>
        Upload New Resource
      </button>

      <UploadResourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUploadSuccess={onUploadSuccess}
      />
    </div>
  );
};

export default ResourceHeader;

