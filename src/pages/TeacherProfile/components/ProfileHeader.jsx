import React from 'react';

const ProfileHeader = () => {
  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
        <div className="relative">
          <div className="w-40 h-40 rounded-[48px] bg-slate-100 p-1 shadow-inner overflow-hidden border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256" 
              alt="Dr. Sarah Mitchell"
              className="w-full h-full object-cover rounded-[42px]"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-lg"></div>
        </div>
        
        <div className="text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Dr. Sarah Mitchell</h1>
            <span className="bg-primary/5 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">Senior Professor</span>
          </div>
          <p className="text-lg font-medium text-on-surface-variant mb-6">Department of Computer Science & Artificial Intelligence</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-2xl border border-white">
              <span className="material-symbols-outlined text-sm">mail</span>
              s.mitchell@university.edu
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-2xl border border-white">
              <span className="material-symbols-outlined text-sm">location_on</span>
              Engineering Block, Room 402
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
