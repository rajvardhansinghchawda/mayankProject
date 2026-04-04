import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-slate-100 dark:bg-slate-950 text-primary dark:text-blue-400 font-body text-sm font-medium h-screen w-64 fixed left-0 top-0 border-r-0 bg-slate-100 dark:bg-slate-900 flat no-shadows flex flex-col p-4 space-y-2 pt-24">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined" id="school-icon">school</span>
          </div>
          <div>
            <div className="text-xl font-bold text-primary">SARAS Institutional</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Management Portal</div>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <NavLink 
          to="/dashboard"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive 
                ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`
          }
        >
          <span className="material-symbols-outlined" id="dashboard-icon">dashboard</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/resources"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive 
                ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`
          }
        >
          <span className="material-symbols-outlined" id="resources-icon">library_books</span>
          <span>Resources</span>
        </NavLink>
        <NavLink 
          to="/tests"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive 
                ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`
          }
        >
          <span className="material-symbols-outlined" id="tests-icon">quiz</span>
          <span>Tests</span>
        </NavLink>
        <NavLink 
          to="/uploads"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive 
                ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`
          }
        >
          <span className="material-symbols-outlined" id="uploads-icon">cloud_upload</span>
          <span>My Uploads</span>
        </NavLink>
        <NavLink 
          to="/profile"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive 
                ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`
          }
        >
          <span className="material-symbols-outlined" id="profile-icon">person</span>
          <span>Profile</span>
        </NavLink>
      </div>
      <div className="mt-auto pb-4 space-y-1">
        <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white rounded-xl py-3 px-4 font-bold text-sm mb-4 shadow-lg shadow-primary/20" id="start-session-btn">
          Start New Session
        </button>
        <NavLink 
          to="/settings"
          className="text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all flex items-center gap-3 px-4 py-3"
        >
          <span className="material-symbols-outlined" id="settings-icon">settings</span>
          <span>Settings</span>
        </NavLink>
        <NavLink 
          to="/help"
          className="text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all flex items-center gap-3 px-4 py-3"
        >
          <span className="material-symbols-outlined" id="help-icon">help_outline</span>
          <span>Help</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
