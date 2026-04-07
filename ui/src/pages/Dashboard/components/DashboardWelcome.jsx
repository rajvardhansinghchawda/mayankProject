import React from 'react';

const DashboardWelcome = ({ user }) => {
  const name = user?.full_name || user?.name || 'Student';
  // The /auth/me/ endpoint and login both include a profile object
  const profile = user?.profile || {};
  const department = profile?.department || 
                     user?.student_profile?.section?.department?.name ||
                     'N/A';
  const section = profile?.section || user?.student_profile?.section?.name || '';
  const semester = profile?.semester || user?.semester || '';

  return (
    <header className="mb-10 relative overflow-hidden bg-primary-container rounded-[2rem] p-8 text-white min-h-[160px] flex flex-col justify-center">
      <div className="relative z-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome, {name}</h1>
        <div className="flex flex-wrap items-center gap-4 text-primary-fixed-dim font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm" id="domain-icon">domain</span>
            {department}
          </span>
          {section && (
            <>
              <span className="w-1.5 h-1.5 bg-primary-fixed rounded-full opacity-30"></span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" id="group-icon">group</span>
                Section: {section}
              </span>
            </>
          )}
          {semester && (
            <>
              <span className="w-1.5 h-1.5 bg-primary-fixed rounded-full opacity-30"></span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" id="calendar-icon">calendar_month</span>
                Semester: {semester}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 pointer-events-none bg-gradient-to-bl from-white to-transparent"></div>
    </header>
  );
};

export default DashboardWelcome;
