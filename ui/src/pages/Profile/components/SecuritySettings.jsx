import React, { useState } from 'react';
import api from '../../../services/api';

const SecuritySettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/auth/password/change/', {
        old_password: formData.currentPassword,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword
      });
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      let errorMsg = 'Failed to update password';
      if (err.response?.data?.error) {
        // Validation throws error as array string sometimes, handle it
        errorMsg = Array.isArray(err.response.data.error) ? err.response.data.error[0] : err.response.data.error;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        errorMsg = Array.isArray(errors[firstKey]) ? errors[firstKey][0] : errors[firstKey];
      }
      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_32px_rgba(25,28,29,0.06)] h-full">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary">lock_reset</span>
        <h2 className="text-xl font-bold text-primary">Security Settings</h2>
      </div>
      
      {status.message && (
        <div className={`p-4 rounded-lg mb-6 text-xs font-bold uppercase tracking-widest ${
          status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-2">Current Password</label>
          <div className="relative">
            <input 
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm" 
              placeholder="••••••••" 
              type="password"
              required
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/10">
          <label className="block text-xs font-bold text-on-surface-variant mb-2">New Password</label>
          <div className="relative">
            <input 
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm" 
              placeholder="Enter new password" 
              type="password"
              required
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-2">Confirm New Password</label>
          <div className="relative">
            <input 
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm" 
              placeholder="Repeat new password" 
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className={`w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:shadow-lg active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2 ${loading ? 'opacity-50' : ''}`} 
          type="submit"
        >
          <span className="material-symbols-outlined text-sm">verified_user</span>
          {loading ? 'Updating...' : 'Update Security'}
        </button>
      </form>
    </section>
  );
};

export default SecuritySettings;
