import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: 'notes',
    subject: '',
    tags: '',
    section_id: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        if (user.role === 'admin') {
          const response = await api.get('/admin/sections/');
          const sectionData = Array.isArray(response.data) ? response.data : (response.data.results || []);
          setSections(sectionData);
        } else if (user.role === 'teacher') {
          // Fetch real assignments from API
          const response = await api.get('/sections/?mine=true');
          const sectionData = Array.isArray(response.data) ? response.data : (response.data.results || []);
          setSections(sectionData);
          if (sectionData.length === 1) {
            setFormData(prev => ({ ...prev, section_id: sectionData[0].id }));
          }
        } else if (user.role === 'student') {
          setFormData(prev => ({ ...prev, section_id: user.profile?.section_id || '' }));
        }
      } catch (err) {
        console.error("Failed to fetch sections", err);
      }
    };

    if (isOpen) {
      fetchSections();
    }
  }, [isOpen, user]);


  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
      if (isPdf) {
        setFile(selectedFile);
      } else {
        alert("Please select a valid PDF file.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('document_type', formData.document_type);
    data.append('subject', formData.subject);
    data.append('pdf_file', file);
    
    if (!formData.section_id) {
      const msg = user.role === 'student' 
        ? "Your account profile is missing a Section ID. Please log out and back in, or contact your administrator."
        : "Please select a target section for this document.";
      alert(msg);
      setLoading(false);
      return;
    }
    data.append('section_id', formData.section_id);

    // Process tags
    if (formData.tags) {
      formData.tags.split(',').forEach(tag => {
        const trimmedTag = tag.trim();
        if (trimmedTag) {
          data.append('tags', trimmedTag);
        }
      });
    }

    try {
      await api.post('/documents/upload/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Document uploaded successfully and sent for review!");
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error("Upload failed", err);
      const backendError = err.response?.data?.errors;
      const errorMsg = backendError ? JSON.stringify(backendError) : (err.response?.data?.message || "Failed to upload document.");
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-primary">Upload Material</h3>
            <p className="text-xs text-slate-400 mt-1">Contribute to the academic resource library</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Document Title</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="e.g., Intro to OS - Lecture 1"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target Section</label>
              {user.role === 'student' ? (
                <div className="w-full bg-slate-100 border-0 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed">
                  {user.profile?.section || 'Default Section'}
                </div>
              ) : (
                <select 
                  required
                  className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold text-on-surface"
                  value={formData.section_id}
                  onChange={(e) => setFormData({...formData, section_id: e.target.value})}
                >
                  <option value="">Select Section...</option>
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.department_code ? `${s.department_code} | Sem ${s.semester} | Sec ${s.name}` : s.display_name || s.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                <select 
                  className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={formData.document_type}
                  onChange={(e) => setFormData({...formData, document_type: e.target.value})}
                >
                  <option value="notes">Lecture Notes</option>
                  <option value="assignment">Assignment</option>
                  <option value="lab">Lab Documentation</option>
                  <option value="project">Project / Research</option>
                  <option value="presentation">Presentation</option>
                  <option value="study_guide">Study Guide</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="e.g., Computer Networks"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">PDF Document</label>
              <div className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${file ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50 bg-slate-50'}`}>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className={`material-symbols-outlined text-4xl mb-2 ${file ? 'text-primary' : 'text-slate-300'}`}>
                  {file ? 'task' : 'upload_file'}
                </span>
                <p className={`text-xs font-bold ${file ? 'text-primary' : 'text-slate-500'}`}>
                  {file ? file.name : 'Click or drag to upload PDF'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Max 2MB. Valid PDF only.</p>
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white"></div>
            ) : (
              <>Complete Upload <span className="material-symbols-outlined text-sm">rocket_launch</span></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
