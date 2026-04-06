import React, { useState, useEffect } from 'react';
import UserTableHeader from './components/UserTableHeader';
import UserTableFilter from './components/UserTableFilter';
import UserMasterTable from './components/UserMasterTable';
import api from '../../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/', {
        params: {
          search: searchTerm,
          role: roleFilter !== 'all' ? roleFilter : undefined
        }
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter]);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <UserTableHeader onRefresh={fetchUsers} />
      <UserTableFilter 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />
      
      {loading ? (
        <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center border border-slate-50 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs font-body">Fetching User Directory...</p>
        </div>
      ) : (
        <UserMasterTable users={users} onRefresh={fetchUsers} />
      )}
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">face</span>
          <span className="material-symbols-outlined text-4xl">verified_user</span>
          <span className="material-symbols-outlined text-4xl">security</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Biometric Identity Integrated • Global Audit Trail Active • SARAS ID-v4</p>
      </div>
    </div>
  );
};

export default UserManagement;
