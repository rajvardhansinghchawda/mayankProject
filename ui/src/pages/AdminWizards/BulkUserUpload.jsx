import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

const BulkUserUpload = () => {
  const [file, setFile] = useState(null);
  const [importType, setImportType] = useState('student');
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    setErrors([]);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('import_type', importType);

    try {
      const response = await api.post('/admin/users/bulk-upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setJobId(response.data.job_id);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Please ensure the file is a valid CSV.");
      setUploading(false);
    }
  };

  // Status Polling
  useEffect(() => {
    let pollInterval;
    if (jobId && uploading) {
      pollInterval = setInterval(async () => {
        try {
          const res = await api.get(`/admin/users/bulk-upload/${jobId}/status/`);
          setStatus(res.data);
          
          if (res.data.status === 'completed' || res.data.status === 'failed') {
            setUploading(false);
            clearInterval(pollInterval);
            
            // If failed, fetch errors
            if (res.data.status === 'failed' || res.data.processed_rows < res.data.total_rows) {
              const errRes = await api.get(`/admin/users/bulk-upload/${jobId}/errors/`);
              setErrors(errRes.data.error_report || []);
            }
          }
        } catch (err) {
          console.error("Polling failed", err);
          clearInterval(pollInterval);
          setUploading(false);
        }
      }, 2000);
    }
    return () => clearInterval(pollInterval);
  }, [jobId, uploading]);

  const resetUpload = () => {
    setFile(null);
    setJobId(null);
    setStatus(null);
    setErrors([]);
    setUploading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-12 font-body text-on-surface">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2 uppercase">Bulk Ingestion Engine</h1>
        <p className="text-on-surface-variant font-medium text-lg">Onboard entire batches or departments in seconds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        <div className="md:col-span-8">
          <div 
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`bg-white rounded-[40px] p-12 lg:p-16 border-2 border-dashed flex flex-col items-center justify-center text-center group transition-all cursor-pointer ${
              file ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".csv"
            />
            
            <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 transition-all shadow-xl shadow-primary/5 ${
              file ? 'bg-primary text-white scale-110' : 'bg-primary/5 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white'
            }`}>
              <span className="material-symbols-outlined text-5xl">
                {uploading ? 'sync' : file ? 'check_circle' : 'cloud_upload'}
              </span>
            </div>
            
            <h3 className="text-2xl font-black text-on-surface mb-2">
              {file ? file.name : 'Drop Institutional Spreadsheet'}
            </h3>
            <p className="text-on-surface-variant font-medium text-sm mb-10 max-w-[300px]">
              {uploading ? 'Processing ledger integration...' : 'Supported format: .CSV. Ensure all mandatory identification fields are present.'}
            </p>
            
            {!uploading && !status && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                disabled={!file}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-30"
              >
                Initiate Block Ingestion
              </button>
            )}

            {uploading && status && (
              <div className="w-full max-w-sm mt-4">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                  <div 
                    className="bg-primary h-full transition-all duration-500" 
                    style={{ width: `${(status.processed_rows / (status.total_rows || 1)) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Processing: {status.processed_rows} / {status.total_rows} Records
                </p>
              </div>
            )}

            {status?.status === 'completed' && (
              <div className="flex flex-col items-center gap-4 mt-6">
                <span className="text-green-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined">verified</span>
                  Ingestion Complete
                </span>
                <button onClick={resetUpload} className="text-xs font-black text-primary underline uppercase tracking-widest">Upload Another</button>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6 tracking-tighter">Ingestion Parameters</h4>
            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Identity Class</span>
                <select 
                  value={importType}
                  onChange={(e) => setImportType(e.target.value)}
                  disabled={uploading}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold text-on-surface outline-none focus:border-primary transition-colors"
                >
                  <option value="student">Student Intake</option>
                  <option value="teacher">Faculty Registry</option>
                </select>
              </label>
            </div>
          </div>
          
          <button className="w-full bg-slate-50 text-slate-600 p-6 rounded-[32px] font-black text-xs border border-white hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-sm">download</span>
            Download Schema Template
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 rounded-[40px] p-10 border border-red-100 mb-12">
          <h4 className="text-lg font-black text-red-600 mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined">warning</span>
            Validation Conflict Report
          </h4>
          <div className="space-y-4">
            {errors.map((err, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-red-200 flex items-start gap-4">
                <div className="bg-red-100 text-red-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                  {err.row || i + 1}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">{err.message || err.error}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-[40px] p-10 border border-white">
        <h4 className="text-lg font-black text-primary mb-6 uppercase tracking-tight">Automated Integrity Checks</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 pb-1 mb-3 block">Identity Trace</span>
            <p className="text-xs font-bold text-on-surface-variant leading-relaxed">Prevents duplicate roll numbers and employee IDs across sessions.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 pb-1 mb-3 block">Secure Transit</span>
            <p className="text-xs font-bold text-on-surface-variant leading-relaxed">Default protocols force password reset upon first successful handshake.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 pb-1 mb-3 block">Reporting</span>
            <p className="text-xs font-bold text-on-surface-variant leading-relaxed">Atomic commits ensure a failed record doesn't corrupt the entire intake.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUserUpload;
