import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const ProfileHeader = () => {
  const { user } = useAuth();
  
  return (
    <div className="mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2 capitalize">
        {user?.role || 'User'} Profile
      </h1>
      <p className="text-on-surface-variant font-medium">Manage your institutional identity and security credentials.</p>
    </div>
  );
};

export default ProfileHeader;
