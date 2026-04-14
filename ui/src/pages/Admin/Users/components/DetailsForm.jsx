import React from 'react';

const DetailsForm = ({ role, formData, setFormData, departments, sections }) => {
  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
          <input 
            type="text" 
            required
            placeholder="e.g. John Doe"
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
            value={formData.full_name}
            onChange={(e) => setField('full_name', e.target.value)}
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Institutional Email</label>
          <input 
            type="email" 
            required
            placeholder="j.doe@university.edu"
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
            value={formData.email}
            onChange={(e) => setField('email', e.target.value)}
          />
        </div>
      </div>

      {(role === 'teacher' || role === 'student') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Department / Unit</label>
            <select
              required={role === 'teacher'}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all appearance-none cursor-pointer"
              value={formData.department_id}
              onChange={(e) => setField('department_id', e.target.value)}
            >
              <option value="">Select Department</option>
              {(departments || []).map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {role === 'teacher' ? (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Employee ID</label>
              <input
                type="text"
                required
                placeholder="EMP-1029"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
                value={formData.employee_id}
                onChange={(e) => setField('employee_id', e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Section</label>
              <select
                required
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all appearance-none cursor-pointer"
                value={formData.section_id}
                onChange={(e) => setField('section_id', e.target.value)}
              >
                <option value="">Select Section</option>
                {(sections || []).map((section) => (
                  <option key={section.id} value={section.id}>{section.department_code} | Sem {section.semester} | Sec {section.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Roll Number</label>
            <input
              type="text"
              required
              placeholder="CSE2024001"
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
              value={formData.roll_number}
              onChange={(e) => setField('roll_number', e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Enrollment Number</label>
            <input
              type="text"
              required
              placeholder="ENR-2024-001"
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
              value={formData.enrollment_number}
              onChange={(e) => setField('enrollment_number', e.target.value)}
            />
          </div>
        </div>
      )}

      {role === 'teacher' && (
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Designation</label>
          <input
            type="text"
            placeholder="Assistant Professor"
            className="w-full bg-slate-50 border-2 border-slate-50 rounded-[28px] px-8 py-5 text-sm font-bold text-on-surface focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-slate-300"
            value={formData.designation}
            onChange={(e) => setField('designation', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default DetailsForm;
