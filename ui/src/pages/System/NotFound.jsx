import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-8 font-body">
      <div className="max-w-xl w-full text-center relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <span className="text-[280px] font-black text-primary">404</span>
        </div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-primary/20 -rotate-6">
            <span className="material-symbols-outlined text-5xl text-white">explore_off</span>
          </div>

          <h1 className="text-4xl font-black text-on-surface mb-4 tracking-tight leading-tight">
            Institutional Link Severed
          </h1>
          <p className="text-on-surface-variant font-medium mb-12 text-lg">
            The resource you are attempting to access does not exist in the SARAS directory or has been relocated of high security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-white py-4 px-10 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">home</span>
              Return to Safe Zone
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="bg-slate-100 text-slate-600 py-4 px-10 rounded-2xl font-black text-sm hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Go Back
            </button>
          </div>

          <div className="mt-20 flex justify-center gap-8 opacity-20 filter grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <span className="material-symbols-outlined text-4xl">fingerprint</span>
            <span className="material-symbols-outlined text-4xl">security</span>
            <span className="material-symbols-outlined text-4xl">vpn_key</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
