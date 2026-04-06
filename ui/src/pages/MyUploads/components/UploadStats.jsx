import React from 'react';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return mb.toFixed(1) + ' MB';
};

const UploadStats = ({ uploads }) => {
  const safeUploads = Array.isArray(uploads) ? uploads : [];
  const totalSize = safeUploads.reduce((acc, doc) => acc + (doc.file_size_bytes || 0), 0);
  const approvedCount = safeUploads.filter(doc => doc.status === 'published').length;
  const pendingCount = safeUploads.filter(doc => doc.status === 'pending_review').length;

  const displayStats = [
    { label: 'Total Uploads', value: safeUploads.length, icon: 'cloud_upload', color: 'text-primary bg-primary/5' },
    { label: 'Approved', value: approvedCount, icon: 'check_circle', color: 'text-green-600 bg-green-50' },
    { label: 'Pending Review', value: pendingCount, icon: 'pending', color: 'text-amber-600 bg-amber-50' },
    { label: 'Storage Used', value: formatFileSize(totalSize), icon: 'database', color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {displayStats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
            <span className="material-symbols-outlined">{stat.icon}</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
            <p className="text-xl font-black text-on-surface">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UploadStats;
