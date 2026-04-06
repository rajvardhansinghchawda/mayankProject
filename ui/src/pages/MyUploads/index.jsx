import React, { useState, useEffect } from 'react';
import UploadsHeader from './components/UploadsHeader';
import UploadStats from './components/UploadStats';
import UploadList from './components/UploadList';
import UploadModal from '../Resources/components/UploadModal';
import api from '../../services/api';

const MyUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMyUploads = async () => {
    try {
      const response = await api.get('/documents/my-uploads/');
      // Handle paginated vs non-paginated response
      const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setUploads(data);
    } catch (err) {
      console.error("Failed to fetch personal uploads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyUploads();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <UploadsHeader onUploadClick={() => setIsModalOpen(true)} />
      <UploadStats uploads={uploads} />
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Recent Submissions</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <UploadList uploads={uploads} setUploads={setUploads} />
      )}

      {isModalOpen && (
        <UploadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onUploadSuccess={() => {
            setIsModalOpen(false);
            fetchMyUploads();
          }}
        />
      )}
      
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
