import React from 'react';
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import AboutSection from './components/AboutSection';
import TeachingPortfolio from './components/TeachingPortfolio';

const TeacherProfile = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-12 font-body">
      <ProfileHeader />
      <ProfileStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <AboutSection />
        </div>
        <div className="lg:col-span-8">
          <TeachingPortfolio />
        </div>
      </div>
      
      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center">
        <div className="flex gap-8 mb-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="material-symbols-outlined text-4xl">verified_user</span>
          <span className="material-symbols-outlined text-4xl">badge</span>
          <span className="material-symbols-outlined text-4xl">workspace_premium</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Institutional Profile • Professional ID: T-882193</p>
      </div>
    </div>
  );
};

export default TeacherProfile;
