import React from 'react';
import ProfileHeader from './components/ProfileHeader';
import ProfileIdentityCard from './components/ProfileIdentityCard';
import AcademicDetails from './components/AcademicDetails';
import SecuritySettings from './components/SecuritySettings';
import ActivityTrace from './components/ActivityTrace';

const Profile = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <ProfileHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProfileIdentityCard />
          <AcademicDetails />
        </div>
        
        <div className="lg:col-span-1">
          <SecuritySettings />
        </div>
      </div>
      
      <ActivityTrace />
    </div>
  );
};

export default Profile;
