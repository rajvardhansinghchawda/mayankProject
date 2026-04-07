import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const userRole = user?.role || 'student';

  const renderStudentLinks = () => (
    <>
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
        <span>My Profile</span>
      </NavLink>
    </>
  );

  const renderTeacherLinks = () => (
    <>
      <NavLink 
        to="/teacher/dashboard"
        className={({ isActive }) => 
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive 
              ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`
        }
      >
        <span className="material-symbols-outlined" id="teacher-dashboard-icon">dashboard</span>
        <span>Teacher Hub</span>
      </NavLink>
      <NavLink 
        to="/teacher/resources"
        className={({ isActive }) => 
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive 
              ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`
        }
      >
        <span className="material-symbols-outlined" id="teacher-resources-icon">library_books</span>
        <span>Course Content</span>
      </NavLink>
      <NavLink 
        to="/teacher/profile"
        className={({ isActive }) => 
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive 
              ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`
        }
      >
        <span className="material-symbols-outlined" id="teacher-profile-icon">person</span>
        <span>Faculty Profile</span>
      </NavLink>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <div className="pt-4 pb-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Administration</div>
      <NavLink 
        to="/admin/dashboard"
        className={({ isActive }) => 
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive 
              ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`
        }
      >
        <span className="material-symbols-outlined" id="admin-dashboard-icon">dashboard</span>
        <span>Admin Overview</span>
      </NavLink>
      <NavLink 
        to="/admin/users"
        className={({ isActive }) => 
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive 
              ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`
        }
      >
        <span className="material-symbols-outlined" id="admin-users-icon">group</span>
        <span>User Control</span>
      </NavLink>
      <NavLink 
        to="/admin/moderation"
        className={({ isActive }) => 
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive 
              ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`
        }
      >
        <span className="material-symbols-outlined" id="admin-moderation-icon">policy</span>
        <span>Compliance</span>
      </NavLink>
      <NavLink 
        to="/admin/resources-review"
        className={({ isActive }) => 
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive 
              ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`
        }
      >
        <span className="material-symbols-outlined" id="admin-review-icon">fact_check</span>
        <span>Resources Review</span>
      </NavLink>
      <NavLink 
        to="/admin/profile"
        className={({ isActive }) => 
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            isActive 
              ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`
        }
      >
        <span className="material-symbols-outlined" id="admin-profile-icon">shield_person</span>
        <span>Super Profile</span>
      </NavLink>
    </>
  );

  return (
    <aside className="bg-slate-100 dark:bg-slate-950 text-primary dark:text-blue-400 font-body text-sm font-medium h-screen w-64 fixed left-0 top-0 border-r-0 bg-slate-100 dark:bg-slate-900 flat no-shadows flex flex-col p-4 space-y-2 pt-24">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined" id="school-icon">school</span>
          </div>
          <div>
            <div className="text-xl font-bold text-primary">SARAS Hub</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{userRole} Portal</div>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        {userRole === 'student' && renderStudentLinks()}
        {userRole === 'teacher' && renderTeacherLinks()}
        {userRole === 'admin' && renderAdminLinks()}
      </div>
      <div className="mt-auto pb-4 space-y-1">
        {userRole === 'admin' && (
          <NavLink 
            to="/settings"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined" id="settings-icon">settings</span>
            <span>System Settings</span>
          </NavLink>
        )}
        {userRole === 'student' && (
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
            <span className="material-symbols-outlined" id="settings-icon">manage_accounts</span>
            <span>Settings & Profile</span>
          </NavLink>
        )}
        {userRole === 'teacher' && (
          <NavLink 
            to="/teacher/profile"
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-white dark:bg-slate-800 text-primary dark:text-blue-300 shadow-sm scale-[0.98]' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined" id="settings-icon">manage_accounts</span>
            <span>Settings & Profile</span>
          </NavLink>
        )}
        <NavLink 
          to="/"
          onClick={logout}
          className="text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 rounded-lg transition-all flex items-center gap-3 px-4 py-3"
        >
          <span className="material-symbols-outlined" id="logout-icon">logout</span>
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
