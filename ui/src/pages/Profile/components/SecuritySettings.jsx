import React from 'react';

const SecuritySettings = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for updating password
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_32px_rgba(25,28,29,0.06)] h-full">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary">lock_reset</span>
        <h2 className="text-xl font-bold text-primary">Security Settings</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-2">Current Password</label>
          <div className="relative">
            <input 
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm" 
              placeholder="••••••••" 
              type="password"
            />
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-sm cursor-pointer hover:text-primary">visibility</span>
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/10">
          <label className="block text-xs font-bold text-on-surface-variant mb-2">New Password</label>
          <div className="relative">
            <input 
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm" 
              placeholder="Enter new password" 
              type="password"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-2">Confirm New Password</label>
          <div className="relative">
            <input 
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-sm" 
              placeholder="Repeat new password" 
              type="password"
            />
          </div>
        </div>

        {/* Password Strength Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Strength</span>
            <span className="text-[10px] font-bold text-on-tertiary-fixed-variant uppercase tracking-widest">Moderate</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden flex">
            <div className="h-full w-1/3 bg-error rounded-full"></div>
            <div className="h-full w-1/3 bg-tertiary-fixed-dim mx-0.5 rounded-full"></div>
            <div className="h-full w-1/3 bg-surface-container-highest opacity-30"></div>
          </div>
          <p className="text-[10px] text-on-surface-variant leading-relaxed">
            Include at least 1 uppercase letter, 1 number, and 1 special character.
          </p>
        </div>

        <button 
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-3 rounded-lg hover:shadow-lg active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2" 
          type="submit"
        >
          <span className="material-symbols-outlined text-sm">verified_user</span>
          Update Security
        </button>
      </form>
    </section>
  );
};

export default SecuritySettings;
