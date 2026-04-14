import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getHomeRoute = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'teacher') return '/teacher/dashboard';
    return '/dashboard';
  };

  const getResourcesRoute = () => {
    if (user?.role === 'teacher') return '/teacher/resources';
    return '/resources';
  };

  const getProfileRoute = () => {
    if (user?.role === 'admin') return '/admin/profile';
    if (user?.role === 'teacher') return '/teacher/profile';
    return '/profile';
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-primary dark:text-blue-400 font-headline font-bold tracking-tight fixed w-full top-0 z-50 bg-gradient-to-b from-slate-50 to-transparent shadow-sm dark:shadow-none flex justify-between items-center px-8 py-4">
      <div className="flex items-center gap-8">
        <span 
          className="text-2xl font-black text-primary dark:text-blue-500 cursor-pointer"
          onClick={() => navigate('/')}
        >
          SARAS
        </span>
        <div className="hidden md:flex gap-6">
          <button 
            onClick={() => navigate(getHomeRoute())}
            className="text-primary dark:text-blue-400 border-b-2 border-primary pb-1 hover:text-primary-container dark:hover:text-blue-300 transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => navigate(getResourcesRoute())}
            className="text-slate-500 dark:text-slate-400 hover:text-primary-container dark:hover:text-blue-300 transition-colors"
          >
            Resources
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-sm font-bold text-primary">{user?.full_name || 'Anonymous User'}</span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">
            {user?.role === 'admin' ? 'Institutional Admin' : user?.role || 'Guest'}
          </span>
        </div>
        <button 
          onClick={() => navigate(getProfileRoute())}
          className="material-symbols-outlined text-2xl hover:text-primary transition-colors" 
          id="profile-btn"
        >
          account_circle
        </button>
        <button 
          className="material-symbols-outlined text-2xl hover:text-rose-600 transition-colors" 
          id="logout-btn"
          onClick={logout}
        >
          logout
        </button>
      </div>
    </nav>
  );
};

export default Header;
