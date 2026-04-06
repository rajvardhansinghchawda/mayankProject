import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const ProfileIdentityCard = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_32px_rgba(25,28,29,0.04)] relative overflow-hidden">
      {/* Decorative Background Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-primary/10 flex items-center justify-center">
            {user.avatar_url ? (
              <img 
                className="w-full h-full object-cover" 
                alt={user.full_name} 
                src={user.avatar_url}
              />
            ) : (
              <span className="material-symbols-outlined text-5xl text-primary/40">person</span>
            )}
          </div>
          <button className="absolute bottom-1 right-1 bg-primary text-on-primary p-2 rounded-full shadow-md hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-sm">photo_camera</span>
          </button>
        </div>

        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
              <p className="text-lg font-bold text-on-surface">{user.full_name}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
              <p className="text-lg font-medium text-on-surface-variant opacity-70">{user.email}</p>
              <span className="inline-flex items-center text-[10px] bg-surface-container-high px-2 py-0.5 rounded mt-1 font-bold text-slate-500 uppercase tracking-tighter italic">Non-Editable</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Roll Number</label>
              <p className="text-lg font-bold text-on-surface">{user.profile?.roll_number || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Enrollment ID</label>
              <p className="text-lg font-bold text-on-surface">{user.profile?.enrollment_number || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileIdentityCard;
