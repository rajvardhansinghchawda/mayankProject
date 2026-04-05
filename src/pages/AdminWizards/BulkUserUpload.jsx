import React from 'react';

const BulkUserUpload = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-12 font-body">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Bulk Ingestion Engine</h1>
        <p className="text-on-surface-variant font-medium text-lg">Onboard entire batches or departments in seconds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        <div className="md:col-span-8">
          <div className="bg-surface-container-lowest rounded-[40px] p-12 lg:p-16 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center group hover:border-primary transition-all cursor-pointer bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.02)_0%,transparent_100%)]">
            <div className="w-24 h-24 bg-primary/5 rounded-[32px] flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5">
              <span className="material-symbols-outlined text-5xl">cloud_upload</span>
            </div>
            <h3 className="text-2xl font-black text-on-surface mb-2">Drop institutional Spreadsheet</h3>
            <p className="text-on-surface-variant font-medium text-sm mb-10 max-w-[300px]">Supported formats: .CSV, .XLSX, .XLS. Maximum file size: 50MB.</p>
            
            <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
              Select File from System
            </button>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6">Prerequisites</h4>
            <ul className="space-y-4">
              {[
                'Header row must exist',
                'Email must be unique',
                'Role names must match',
                'Max 5000 users per file'
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-xs font-bold text-slate-500">
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <button className="w-full bg-surface-container-high text-primary p-6 rounded-[32px] font-black text-xs border border-white hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-sm">download</span>
            Download Sample Template
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-[40px] p-10 border border-white">
        <h4 className="text-lg font-black text-primary mb-6">Automated Validation Rules</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded inline-block mb-3">System Integrity</span>
            <p className="text-xs font-bold text-on-surface-variant leading-relaxed">Our AI engine automatically detects duplicate identity traces and prevents account overlap across departments.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded inline-block mb-3">Security Guard</span>
            <p className="text-xs font-bold text-on-surface-variant leading-relaxed">Passwords will be automatically generated and sent to institutional email addresses via secure transit protocols.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded inline-block mb-3">Reporting</span>
            <p className="text-xs font-bold text-on-surface-variant leading-relaxed">Immediate error reporting with exact row and column references for failed ingestion attempts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUserUpload;
