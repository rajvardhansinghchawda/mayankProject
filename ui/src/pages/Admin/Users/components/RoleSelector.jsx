import React from 'react';

const RoleSelector = ({ selectedRole, onSelect }) => {
  const roles = [
    { id: 'student', label: 'Student', desc: 'Enrolled individuals taking assessments.', icon: 'person' },
    { id: 'teacher', label: 'Faculty / Teacher', desc: 'Manage courses and grade submissions.', icon: 'school' },
    { id: 'admin', label: 'Administrator', desc: 'Full institutional management access.', icon: 'admin_panel_settings' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onSelect(role.id)}
          className={`p-8 rounded-[36px] border-2 text-left transition-all group ${
            selectedRole === role.id 
              ? 'bg-primary border-primary shadow-xl shadow-primary/20 scale-[0.98]' 
              : 'bg-white border-slate-50 hover:border-primary/30'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
            selectedRole === role.id ? 'bg-white/20 text-white' : 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white'
          }`}>
            <span className="material-symbols-outlined text-2xl">{role.icon}</span>
          </div>
          <h4 className={`text-xl font-black mb-2 transition-colors ${selectedRole === role.id ? 'text-white' : 'text-on-surface'}`}>
            {role.label}
          </h4>
          <p className={`text-sm font-medium leading-relaxed transition-colors ${selectedRole === role.id ? 'text-white/80' : 'text-slate-500'}`}>
            {role.desc}
          </p>
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
