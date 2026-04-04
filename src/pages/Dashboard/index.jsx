import React from 'react';
import DashboardWelcome from './components/DashboardWelcome';
import QuickActions from './components/QuickActions';
import ActiveTests from './components/ActiveTests';
import SystemAlerts from './components/SystemAlerts';
import RecentResources from './components/RecentResources';
import MyUploads from './components/MyUploads';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <DashboardWelcome />
      <QuickActions />
      
      <div className="grid grid-cols-12 gap-8">
        <ActiveTests />
        <SystemAlerts />
        <RecentResources />
        <MyUploads />
      </div>
    </div>
  );
};

export default Dashboard;
