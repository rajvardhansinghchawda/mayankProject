import React, { useState } from 'react';
import ResourceHeader from './components/ResourceHeader';
import CategoryFilter from './components/CategoryFilter';
import ResourceGrid from './components/ResourceGrid';

const TeacherResources = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <ResourceHeader onUploadSuccess={handleUploadSuccess} />
      <CategoryFilter />
      <ResourceGrid refreshKey={refreshKey} />
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">folder_managed</span>
          <span className="material-symbols-outlined text-4xl">cloud_sync</span>
          <span className="material-symbols-outlined text-4xl">verified</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Resource Infrastructure • All Data Encrypted • institutional-v2.1</p>
      </div>
    </div>
  );
};

export default TeacherResources;

