import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BulkUploadHeader from './components/BulkUploadHeader';
import DragDropArea from './components/DragDropArea';
import api from '../../../services/api';

const BulkUserUpload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [role, setRole] = useState('student');
  const [isUploading, setIsUploading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const pollInterval = useRef(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadResult(null);
    setJobId(null);
    setJobStatus(null);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setJobId(null);
    setJobStatus(null);
    if (pollInterval.current) clearInterval(pollInterval.current);
  };

  // Polling logic
  useEffect(() => {
    let timeoutId = null;

    const pollStatus = async () => {
      if (!jobId || !isUploading) return;

      try {
        const response = await api.get(`/admin/users/bulk-upload/${jobId}/status/`);
        const statusData = response.data;
        setJobStatus(statusData);

        if (statusData.status === 'completed' || statusData.status === 'failed') {
          setIsUploading(false);
          if (statusData.status === 'completed') {
            setUploadResult({ success: true, data: statusData });
          } else {
            setUploadResult({ success: false, error: 'Job failed' });
          }
        } else {
          // Schedule next poll - 5 seconds interval
          timeoutId = setTimeout(pollStatus, 5000);
        }
      } catch (err) {
        console.error("Polling error:", err);
        setIsUploading(false);
        alert("Error tracking upload status.");
      }
    };

    if (jobId && isUploading) {
      timeoutId = setTimeout(pollStatus, 1000); // Start first poll after 1s
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [jobId, isUploading]);


  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('role', role);

    try {
      const response = await api.post('/auth/users/bulk-upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success && response.data.data.job_id) {
        setJobId(response.data.data.job_id);
        // Polling will start via useEffect
      } else {
        setUploadResult({ success: true, data: response.data.data });
        setIsUploading(false);
      }
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      if (err.response && err.response.data && err.response.data.error) {
        setUploadResult({ success: false, error: err.response.data.error });
        alert(err.response.data.error);
      } else {
        alert("An error occurred during upload initialization.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-12 font-body">
      <button 
        onClick={() => navigate('/admin/users')}
        className="mb-8 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary transition-all group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Return to Directory
      </button>

      <div className="flex justify-between items-end mb-8">
        <BulkUploadHeader />
        
        <div className="flex items-center gap-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload As:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            disabled={isUploading}
            className="bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-on-surface focus:border-primary outline-none"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
      </div>

      <DragDropArea onFileSelect={handleFileSelect} disabled={isUploading} />
      
      {selectedFile && (
        <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-navy">{selectedFile.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">
                {(selectedFile.size / 1024).toFixed(1)} KB • CSV Format
              </p>
            </div>
            
            {isUploading && jobStatus && (
              <div className="text-right">
                <p className="text-xs font-bold text-primary uppercase tracking-widest animate-pulse">
                  {jobStatus.status === 'processing' ? `Processing ${jobStatus.success_rows + jobStatus.error_rows}/${jobStatus.total_rows}` : 'Queued...'}
                </p>
                <div className="w-48 h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${((jobStatus.success_rows + jobStatus.error_rows) / jobStatus.total_rows) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {uploadResult && uploadResult.success && (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Final: {uploadResult.data.success_rows} Success | {uploadResult.data.error_rows} Errors
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Report */}
      {uploadResult && uploadResult.data && uploadResult.data.error_rows > 0 && (
         <div className="bg-red-50 border border-red-100 rounded-[24px] p-6 mb-8">
           <h4 className="text-red-700 font-bold mb-4 text-xs">Mass Provisioning Error Report</h4>
           <div className="max-h-60 overflow-y-auto pr-4">
             <ul className="text-[10px] text-red-600 space-y-3">
               {uploadResult.data.error_report?.map((err, idx) => (
                 <li key={idx} className="flex gap-4 border-b border-red-100 pb-2">
                    <span className="font-bold whitespace-nowrap">Row {err.row}:</span>
                    <span>{err.message} <em className="opacity-50">({err.email})</em></span>
                 </li>
               ))}
             </ul>
           </div>
         </div>
      )}

      <div className="mt-16 flex items-center justify-between gap-6 pt-10 border-t border-slate-50">
        <button 
          onClick={clearSelection}
          disabled={isUploading}
          className="px-10 py-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 font-black text-[10px] uppercase tracking-widest transition-all border border-white disabled:opacity-50"
        >
          Clear Selection
        </button>
        
        <button 
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className={`px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center gap-3 ${
            selectedFile && !isUploading 
              ? 'bg-slate-900 text-white shadow-slate-900/20 hover:opacity-90 active:scale-[0.98]' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isUploading ? 'Provisioning Active...' : 'Begin Mass Provisioning'}
          <span className="material-symbols-outlined text-sm">rocket_launch</span>
        </button>
      </div>
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30">
          <span className="material-symbols-outlined text-4xl">group_add</span>
          <span className="material-symbols-outlined text-4xl">inventory_2</span>
          <span className="material-symbols-outlined text-4xl">security</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Mass Identity Provisioning Active • AES-256 Vault-v4 • SARAS Batch-v3 (Async)</p>
      </div>
    </div>
  );
};

export default BulkUserUpload;

