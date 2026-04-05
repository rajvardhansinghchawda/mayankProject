import React from 'react';

const DepartmentHeader = () => {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Academic Departments</h1>
        <p className="text-on-surface-variant font-medium text-lg">Manage organizational hierarchy and department-wide performance.</p>
      </div>
      <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-3">
        <span className="material-symbols-outlined">account_tree</span>
        Add New Department
      </button>
    </div>
  );
};

export default DepartmentHeader;
