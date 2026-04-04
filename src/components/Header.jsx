import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

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
          <a className="text-primary dark:text-blue-400 border-b-2 border-primary pb-1 hover:text-primary-container dark:hover:text-blue-300 transition-colors" href="#">Dashboard</a>
          <a className="text-slate-500 dark:text-slate-400 hover:text-primary-container dark:hover:text-blue-300 transition-colors" href="#">Resources</a>
          <a className="text-slate-500 dark:text-slate-400 hover:text-primary-container dark:hover:text-blue-300 transition-colors" href="#">Tests</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-sm font-bold text-primary">Alex Rivers</span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Student ID: 88291</span>
        </div>
        <button className="material-symbols-outlined text-2xl" id="profile-btn">account_circle</button>
        <button className="material-symbols-outlined text-2xl" id="logout-btn">logout</button>
      </div>
    </nav>
  );
};

export default Header;
