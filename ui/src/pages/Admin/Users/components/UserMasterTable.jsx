import React from 'react';
import api from '../../../../services/api';

const UserMasterTable = ({ users = [], onRefresh }) => {
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'teacher': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'student': return 'bg-primary/5 text-primary border-primary/10';
      case 'admin': return 'bg-slate-900 text-white border-slate-900';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/toggle-active/`);
      onRefresh();
    } catch (err) {
      console.error("Failed to toggle user status", err);
      alert("Failed to update user status.");
    }
  };

  const handleResetPassword = async (userId) => {
    if (!window.confirm("Reset this user's password to default? They will be forced to change it on next login.")) return;
    try {
      await api.post(`/admin/users/${userId}/reset-password/`);
      alert("Password has been reset to default.");
    } catch (err) {
      console.error("Failed to reset password", err);
      alert("Failed to reset password.");
    }
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-[40px] p-20 text-center border border-slate-50 shadow-sm font-body">
        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">person_off</span>
        <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">No Users Found</h3>
        <p className="text-slate-400 mt-2 font-medium">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50 transition-all hover:shadow-lg font-body">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Details</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Role</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile ID</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border-2 border-white shadow-sm flex items-center justify-center text-primary text-xs font-black">
                      {user.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{user.full_name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">{user.profile_id || 'N/A'}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] font-black uppercase text-on-surface">{user.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 text-on-surface">
                    <button 
                      onClick={() => handleResetPassword(user.id)}
                      title="Reset Password"
                      className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 border border-white flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">lock_reset</span>
                    </button>
                    <button 
                      onClick={() => handleToggleActive(user.id)}
                      title={user.is_active ? "Deactivate User" : "Activate User"}
                      className={`w-10 h-10 rounded-xl border border-white flex items-center justify-center transition-all ${
                        user.is_active 
                          ? 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {user.is_active ? 'block' : 'undo'}
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserMasterTable;
