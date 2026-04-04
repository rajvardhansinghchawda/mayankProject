import React from 'react';

const DashboardWelcome = ({ name = "Alex Rivers", department = "Computer Engineering", semester = 5 }) => {
  return (
    <header className="mb-10 relative overflow-hidden bg-primary-container rounded-[2rem] p-8 text-white min-h-[160px] flex flex-col justify-center">
      <div className="relative z-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome, {name}</h1>
        <div className="flex items-center gap-4 text-primary-fixed-dim font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm" id="domain-icon">domain</span> 
            Dept: {department}
          </span>
          <span className="w-1.5 h-1.5 bg-primary-fixed rounded-full opacity-30"></span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm" id="calendar-icon">calendar_month</span> 
            Semester: {semester}
          </span>
        </div>
      </div>
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 pointer-events-none bg-gradient-to-bl from-white to-transparent"></div>
    </header>
  );
};

export default DashboardWelcome;
