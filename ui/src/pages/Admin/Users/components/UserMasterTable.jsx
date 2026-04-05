import React from 'react';

const UserMasterTable = () => {
  const users = [
    { name: 'Dr. Sarah Mitchell', id: 'FAC-1029', role: 'Faculty', dept: 'Computer Science', lastLogin: '10 mins ago', status: 'Active' },
    { name: 'John Doe', id: 'STU-4562', role: 'Student', dept: 'Information Tech', lastLogin: '2 hours ago', status: 'Active' },
    { name: 'Alice Smith', id: 'FAC-7721', role: 'Faculty', dept: 'Physics', lastLogin: 'Yesterday', status: 'Active' },
    { name: 'Bob Johnson', id: 'STU-3344', role: 'Student', dept: 'Mathematics', lastLogin: '3 days ago', status: 'Suspended' },
    { name: 'Charlie Davis', id: 'ADM-0012', role: 'Administrator', dept: 'Institutional Core', lastLogin: 'Online', status: 'Active' },
    { name: 'Diana Prince', id: 'STU-9912', role: 'Student', dept: 'Mechanical Eng.', lastLogin: '1 week ago', status: 'Active' },
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'Faculty': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Student': return 'bg-primary/5 text-primary border-primary/10';
      case 'Administrator': return 'bg-slate-900 text-white border-slate-900';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50 transition-all hover:shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Details</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Role</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Login</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border-2 border-white shadow-sm flex items-center justify-center text-primary text-xs font-black">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{user.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6 text-xs font-semibold text-slate-500 uppercase tracking-tight">{user.dept}</td>
                <td className="px-8 py-6 text-xs text-slate-400 font-bold">{user.lastLogin}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] font-black uppercase text-on-surface">{user.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 border border-white flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-all">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 border border-white flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                      <span className="material-symbols-outlined text-sm">block</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map(p => (
          <button 
            key={p} 
            className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
              p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-400 border border-slate-50 hover:bg-primary/5'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserMasterTable;
