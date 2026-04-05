import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestManagementHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Institutional Test Management</h1>
        <p className="text-on-surface-variant font-medium text-lg">Central control for all assessments across the university infrastructure.</p>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/admin/create-test')}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3"
        >
          <span className="material-symbols-outlined">add_task</span>
          Create New Test
        </button>
      </div>
    </div>
  );
};

export default TestManagementHeader;
