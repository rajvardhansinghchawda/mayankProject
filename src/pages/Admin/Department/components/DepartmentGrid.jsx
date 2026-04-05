import React from 'react';

const DepartmentGrid = () => {
  const departments = [
    { name: 'Computer Science & AI', hod: 'Dr. Sarah Mitchell', faculty: 45, students: 850, gpa: '3.42', color: 'bg-primary/5 text-primary' },
    { name: 'Information Technology', hod: 'Prof. James Wilson', faculty: 32, students: 620, gpa: '3.15', color: 'bg-green-50 text-green-600' },
    { name: 'Electronics Engineering', hod: 'Dr. Emily Brown', faculty: 28, students: 540, gpa: '3.28', color: 'bg-purple-50 text-purple-600' },
    { name: 'Mechanical Engineering', hod: 'Prof. Robert Miller', faculty: 25, students: 480, gpa: '2.95', color: 'bg-amber-50 text-amber-600' },
    { name: 'Data Science & Analytics', hod: 'Dr. Alan Turing', faculty: 15, students: 220, gpa: '3.65', color: 'bg-cyan-50 text-cyan-600' },
    { name: 'Cyber Security', hod: 'Prof. Kevin Mitnick', faculty: 12, students: 180, gpa: '3.52', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {departments.map((dept, i) => (
        <div key={i} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 transition-all hover:shadow-xl hover:-translate-y-1 duration-500 group">
          <div className="flex justify-between items-start mb-8">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${dept.color}`}>
              <span className="material-symbols-outlined text-3xl">domain</span>
            </div>
            <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">more_vert</span>
            </button>
          </div>
          
          <h4 className="text-xl font-black text-on-surface mb-2 group-hover:text-primary transition-colors">{dept.name}</h4>
          <p className="text-xs font-bold text-slate-400 mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-xs">person</span>
            HOD: {dept.hod}
          </p>
          
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-3xl border border-white mb-8">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Faculty</p>
              <p className="text-sm font-bold text-on-surface">{dept.faculty}</p>
            </div>
            <div className="text-center border-x border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Students</p>
              <p className="text-sm font-bold text-on-surface">{dept.students}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Avg GPA</p>
              <p className="text-sm font-bold text-primary">{dept.gpa}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View Analytics</button>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((_, idx) => (
                <div key={idx} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 shadow-sm overflow-hidden text-[8px] flex items-center justify-center font-bold text-slate-400">
                  {idx === 3 ? '+3d' : 'U'}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentGrid;
