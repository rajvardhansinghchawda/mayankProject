import React, { useState, useEffect } from 'react';
import DepartmentHeader from './components/DepartmentHeader';
import DepartmentStats from './components/DepartmentStats';
import DepartmentGrid from './components/DepartmentGrid';
import api from '../../../services/api';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [deptRes, statsRes] = await Promise.all([
        api.get('/admin/departments/'),
        api.get('/admin/stats/')
      ]);
      setDepartments(deptRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch department data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Institutional Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <DepartmentHeader onRefresh={fetchData} />
      <DepartmentStats stats={stats} />
      <DepartmentGrid departments={departments} onRefresh={fetchData} />
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">account_tree</span>
          <span className="material-symbols-outlined text-4xl">groups</span>
          <span className="material-symbols-outlined text-4xl">inventory</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Academic Hierarchy • SARAS Management-v2.1</p>
      </div>
    </div>
  );
};

export default DepartmentManagement;
