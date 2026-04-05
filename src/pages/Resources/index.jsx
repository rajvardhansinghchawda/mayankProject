import React from 'react';
import ResourcesHeader from './components/ResourcesHeader';
import ResourceCategories from './components/ResourceCategories';
import ResourceGrid from './components/ResourceGrid';

const Resources = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <ResourcesHeader />
      
      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-slate-400">search</span>
        </div>
        <input 
          type="text" 
          placeholder="Search for lecture notes, research papers, or authors..." 
          className="w-full bg-white border-0 rounded-2xl pl-14 pr-6 py-4 shadow-sm focus:ring-2 focus:ring-primary/20 text-base"
        />
      </div>

      <ResourceCategories />
      <ResourceGrid />
      
      {/* Upload/Request Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-2">Request Subject Access</h4>
            <p className="text-white/70 text-sm mb-6">Need resources for a specific course or elective? Send a request to your departmental administrator.</p>
            <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
              Submit Request <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
          <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[180px] text-white/5 rotate-12">help_center</span>
        </div>
        
        <div className="bg-surface-container-high rounded-3xl p-8 border border-white/50 flex flex-col justify-center">
          <h4 className="text-xl font-bold text-primary mb-2">Institutional Contribution</h4>
          <p className="text-slate-500 text-sm mb-6">Contribute your research papers or verified study materials to help fellow students and improve the academic library.</p>
          <div className="flex gap-4">
            <button className="flex-1 bg-white text-slate-700 px-6 py-3 rounded-xl font-bold text-sm border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              Upload Material <span className="material-symbols-outlined text-sm">upload_file</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
