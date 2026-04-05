import React from 'react';
import UploadsHeader from './components/UploadsHeader';
import UploadStats from './components/UploadStats';
import UploadList from './components/UploadList';

const MyUploads = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <UploadsHeader />
      <UploadStats />
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Recent Submissions</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">filter_alt</span>
          </button>
          <button className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">sort</span>
          </button>
        </div>
      </div>
      
      <UploadList />
      
      {/* Policy Reminder */}
      <div className="mt-12 bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
        <span className="material-symbols-outlined text-amber-600 mt-0.5">info</span>
        <div>
          <h5 className="text-sm font-bold text-amber-900 mb-1">Upload Policy Tracking</h5>
          <p className="text-xs text-amber-800/70 leading-relaxed">All uploaded documents are subject to automated virus scanning and institutional review. Approval typically takes 24-48 business hours. Ensure your files are within the 25MB size limit and are in supported formats (PDF, DOCX, ZIP, etc.).</p>
        </div>
      </div>
    </div>
  );
};

export default MyUploads;
