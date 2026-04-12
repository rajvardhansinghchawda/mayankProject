import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    is_active: true,
    roll_number: '',
    employee_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        is_active: user.is_active,
        roll_number: user.profile?.roll_number || '',
        employee_id: user.profile?.employee_id || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Clean up payload based on role
    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      is_active: formData.is_active,
    };
    
    if (user.role === 'student') {
      payload.roll_number = formData.roll_number;
    } else if (user.role === 'teacher') {
      payload.employee_id = formData.employee_id;
    }

    try {
      await api.patch(`/users/${user.id}/update/`, payload);
      onSave(); // Refresh table
    } catch (err) {
      console.error('Failed to update user', err);
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to update user. Check input values.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-body">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-on-surface">Edit User</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Updating details for {user.role}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 flex items-start gap-3">
              <span className="material-symbols-outlined mt-0.5">error</span>
              <div>{error}</div>
            </div>
          )}

          <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-primary focus:bg-white transition-all text-on-surface font-bold text-sm"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-primary focus:bg-white transition-all text-on-surface font-bold text-sm"
                placeholder="email@example.com"
              />
            </div>

            {user.role === 'student' && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Roll Number</label>
                <input
                  type="text"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-primary focus:bg-white transition-all text-on-surface font-bold text-sm"
                />
              </div>
            )}

            {user.role === 'teacher' && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Employee ID</label>
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-primary focus:bg-white transition-all text-on-surface font-bold text-sm"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 rounded hover:ring-2 hover:ring-primary/20 transition-all accent-primary cursor-pointer"
              />
              <label htmlFor="is_active" className="text-sm font-bold text-on-surface cursor-pointer select-none">
                Account Active
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-2xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-user-form"
            disabled={loading}
            className="flex-1 py-4 text-sm font-black text-white bg-primary rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin material-symbols-outlined text-sm">rotate_right</span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
