import React from 'react';

const ActiveAssessments = () => {
  const assessments = [
    { name: 'Data Structures Final', progress: 45, students: 120, timeRemaining: '25m' },
    { name: 'Algorithm Analysis Midterm', progress: 80, students: 85, timeRemaining: '10m' },
    { name: 'Operating Systems Quiz', progress: 15, students: 150, timeRemaining: '45m' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50 mb-12">
      <h3 className="text-xl font-black text-on-surface mb-8">Active Assessments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assessments.map((assessment, i) => (
          <div key={i} className="bg-slate-50 p-6 rounded-[28px] border border-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded">Live</span>
              <span className="text-xs font-bold text-slate-400">{assessment.timeRemaining} left</span>
            </div>
            <h4 className="text-lg font-black text-on-surface mb-2">{assessment.name}</h4>
            <p className="text-xs font-medium text-slate-500 mb-6">{assessment.students} students taking it</p>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-primary">
                    {assessment.progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/5">
                <div style={{ width: `${assessment.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveAssessments;
