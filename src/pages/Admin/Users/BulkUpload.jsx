import React from 'react';
import { useNavigate } from 'react-router-dom';
import BulkUploadHeader from './components/BulkUploadHeader';
import DragDropArea from './components/DragDropArea';
import BulkValidationTable from './components/BulkValidationTable';

const BulkUserUpload = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-12 font-body">
      <button 
        onClick={() => navigate('/admin/users')}
        className="mb-8 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary transition-all group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Return to Directory
      </button>

      <BulkUploadHeader />
      <DragDropArea />
      <BulkValidationTable />
      
      <div className="mt-16 flex items-center justify-between gap-6 pt-10 border-t border-slate-50">
        <button 
          onClick={() => navigate('/admin/users')}
          className="px-10 py-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 font-black text-[10px] uppercase tracking-widest transition-all border border-white"
        >
          Clear Selection
        </button>
        
        <button 
          className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3"
        >
          Provision 242 Users
          <span className="material-symbols-outlined text-sm">rocket_launch</span>
        </button>
      </div>
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">group_add</span>
          <span className="material-symbols-outlined text-4xl">inventory_2</span>
          <span className="material-symbols-outlined text-4xl">security</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Mass Identity Provisioning Active • AES-256 Vault-v4 • SARAS Batch-v2</p>
      </div>
    </div>
  );
};

export default BulkUserUpload;
