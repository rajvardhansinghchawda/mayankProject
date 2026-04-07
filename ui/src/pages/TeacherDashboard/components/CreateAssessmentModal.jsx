import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assessmentService from '../../../services/assessmentService';
import userService from '../../../services/userService';

const CreateAssessmentModal = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject_name: '',
    section: '',
    availability_start: '',
    availability_end: '',
    duration_minutes: 60,
    total_marks: 100
  });

  useEffect(() => {
    if (isOpen) {
      fetchSections();
    }
  }, [isOpen]);

  const fetchSections = async () => {
    try {
      // Admins should see all institutional sections, teachers see only theirs
      const params = {};
      if (localStorage.getItem('user_role') === 'teacher') {
        params.mine = 'true';
      }
      const resp = await userService.getSections(params);
      const data = resp.data || (Array.isArray(resp) ? resp : []);
      setSections(data);
    } catch (err) {
      console.error('Failed to fetch sections', err);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const created = await assessmentService.createTest(formData);
      // Navigate to the Test Builder for this new draft test
      const testId = created?.id || created?.data?.id;
      if (testId) {
        onClose();
        navigate(`/teacher/test-builder/${testId}`);
      } else {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Creation failed', err);
      setError(err.response?.data?.detail || 'Failed to create assessment.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative border border-white/20 animate-in fade-in zoom-in duration-300">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black text-on-surface mb-2">Create Assessment</h2>
              <p className="text-on-surface-variant font-medium">Design a new test for your students.</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Test Title</label>
              <input 
                type="text"
                name="title"
                required
                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                <input 
                  type="text"
                  name="subject_name"
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
                  value={formData.subject_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Batch</label>
                <select 
                  name="section"
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
                  value={formData.section}
                  onChange={handleInputChange}
                >
                  <option value="">Select Section</option>
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>{s.department_code} | Sec {s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                <input 
                  type="datetime-local"
                  name="availability_start"
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
                  value={formData.availability_start}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                <input 
                  type="datetime-local"
                  name="availability_end"
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
                  value={formData.availability_end}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Mins)</label>
                <input 
                  type="number"
                  name="duration_minutes"
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Marks</label>
                <input 
                  type="number"
                  name="total_marks"
                  required
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
                  value={formData.total_marks}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-xs font-bold">{error}</div>}

            <div className="pt-4 flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 p-5 rounded-2xl font-black text-slate-400 uppercase tracking-widest">Cancel</button>
              <button type="submit" disabled={loading} className="flex-[2] bg-primary text-white p-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                {loading ? 'Creating...' : 'Create Test'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessmentModal;
