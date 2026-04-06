import React, { useState, useEffect } from 'react';
import documentService from '../../../services/documentService';
import userService from '../../../services/userService';

const UploadResourceModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_type: 'notes',
    section_id: '',
    subject: '',
    pdf_file: null
  });

  useEffect(() => {
    if (isOpen) {
      fetchSections();
    }
  }, [isOpen]);

  const fetchSections = async () => {
    try {
      // Pass mine=true to filter by teacher assignments (limit the scope)
      const resp = await userService.getSections({ mine: 'true' });
      const data = resp.data || resp;
      setSections(data);
    } catch (err) {
      console.error('Failed to fetch sections', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, pdf_file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pdf_file || !formData.section) {
      setError('Please provide a file and select a section.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('document_type', formData.document_type);
      data.append('section_id', formData.section_id);
      data.append('subject', formData.subject);
      data.append('pdf_file', formData.pdf_file); // Backend expects 'pdf_file' in DocumentUploadSerializer

      await documentService.uploadDocument(data);
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error('Upload failed', err);
      const msg = err.response?.data?.errors || 'Failed to upload document.';
      setError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative border border-white/20 animate-in fade-in zoom-in duration-300 overflow-hidden">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black text-on-surface mb-2 tracking-tight">Upload Resource</h2>
              <p className="text-on-surface-variant font-medium">Add digital assets to your assigned batches.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary/5 hover:text-primary transition-all duration-300"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Title</label>
                <input 
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Data Structures Part 1"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-on-surface placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Section</label>
                <select 
                  name="section"
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 appearance-none"
                  value={formData.section_id}
                  onChange={(e) => setFormData({...formData, section_id: e.target.value})}
                >
                  <option value="">Select Target Batch</option>
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.department_code} | Sem {s.semester} | Sec {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Type</label>
                <select 
                  name="document_type"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 appearance-none"
                  value={formData.document_type}
                  onChange={handleInputChange}
                >
                  <option value="notes">Course Material</option>
                  <option value="reference_books">Reference Book</option>
                  <option value="lab">Lab Guide</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Name</label>
                <input 
                  type="text"
                  name="subject"
                  required
                  placeholder="e.g. Data Structures"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-on-surface placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <textarea 
                name="description"
                rows="3"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-on-surface placeholder:text-slate-300 focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Brief summary of the resource..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PDF Document</label>
              <div className="relative group">
                <input 
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label 
                  htmlFor="pdf-upload"
                  className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 rounded-[32px] cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group-hover:scale-[1.01]"
                >
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 group-hover:text-primary transition-colors">upload_file</span>
                  <span className="text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">
                    {formData.pdf_file ? formData.pdf_file.name : 'Choose PDF File'}
                  </span>
                  <span className="text-[10px] font-black text-slate-300 uppercase mt-2">Max 50MB • PDFs only</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <div className="pt-4 flex gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-5 rounded-2xl font-black text-sm text-slate-400 hover:text-on-surface hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] bg-primary text-white px-8 py-5 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale uppercase tracking-widest"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">publish</span>
                    Submit for Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadResourceModal;
