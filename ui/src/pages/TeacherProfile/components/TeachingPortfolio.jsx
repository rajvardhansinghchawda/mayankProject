import React from 'react';

const TeachingPortfolio = () => {
  const courses = [
    { name: 'Introduction to AI', code: 'CS-101', semester: 'Fall 2023', status: 'Ongoing' },
    { name: 'Deep Learning', code: 'CS-402', semester: 'Fall 2023', status: 'Ongoing' },
    { name: 'Natural Language Processing', code: 'CS-305', semester: 'Spring 2023', status: 'Completed' },
    { name: 'Machine Learning', code: 'CS-201', semester: 'Fall 2022', status: 'Completed' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 transition-all hover:shadow-lg">
      <h3 className="text-xl font-black text-on-surface mb-8 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">Teaching Portfolio</h3>
      <div className="space-y-6">
        {courses.map((course, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-white group hover:bg-slate-100 transition-colors">
            <div>
              <h4 className="font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">{course.name}</h4>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{course.code} • {course.semester}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              course.status === 'Ongoing' 
                ? 'bg-blue-50 text-blue-600 border-blue-100' 
                : 'bg-green-50 text-green-600 border-green-100'
            }`}>
              {course.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachingPortfolio;
