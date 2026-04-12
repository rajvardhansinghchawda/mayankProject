import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';

const UserTableFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter, 
  departmentFilter, 
  setDepartmentFilter 
}) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/users/departments/');
        const data = response.data?.data || response.data || [];
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-10">
      <div className="flex-1 relative">
        <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-white border-2 border-slate-50 rounded-[28px] pl-16 pr-8 py-4 text-sm font-bold text-on-surface focus:border-primary/20 outline-none transition-all placeholder:text-slate-300 shadow-sm"
        />
      </div>
      
      <div className="flex flex-wrap gap-4">
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-white border-2 border-slate-50 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl outline-none cursor-pointer shadow-sm hover:border-primary/10"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Administrator</option>
        </select>
        
        <select 
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="bg-white border-2 border-slate-50 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl outline-none cursor-pointer shadow-sm hover:border-primary/10"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UserTableFilter;
