import React from 'react';

const UserTableFilter = () => {
  const roles = ['All Roles', 'Student', 'Faculty', 'Administrator', 'Proctor'];
  const departments = ['All Departments', 'Computer Science', 'Physics', 'Mathematics', 'Engineering'];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-10">
      <div className="flex-1 relative">
        <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
        <input 
          type="text" 
          placeholder="Search by name, ID, or email..."
          className="w-full bg-white border-2 border-slate-50 rounded-[28px] pl-16 pr-8 py-4 text-sm font-bold text-on-surface focus:border-primary/20 outline-none transition-all placeholder:text-slate-300 shadow-sm"
        />
      </div>
      
      <div className="flex flex-wrap gap-4">
        <select className="bg-white border-2 border-slate-50 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl outline-none cursor-pointer shadow-sm hover:border-primary/10">
          {roles.map(role => <option key={role}>{role}</option>)}
        </select>
        <select className="bg-white border-2 border-slate-50 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl outline-none cursor-pointer shadow-sm hover:border-primary/10">
          {departments.map(dept => <option key={dept}>{dept}</option>)}
        </select>
      </div>
    </div>
  );
};

export default UserTableFilter;
