import React from 'react';

const userData = [
  { id: 1, name: "Alex Johnston", email: "a.johnston@university.edu", role: "Student", dept: "Comp. Science", status: "Active" },
  { id: 2, name: "Dr. Sarah Smith", email: "s.smith@university.edu", role: "Faculty", dept: "Comp. Science", status: "Active" },
  { id: 3, name: "Michael Chen", email: "m.chen@university.edu", role: "Student", dept: "Information Tech.", status: "Inactive" },
  { id: 4, name: "Emma Wilson", email: "e.wilson@university.edu", role: "Administrator", dept: "Institutional", status: "Active" },
  { id: 5, name: "David Miller", email: "d.miller@university.edu", role: "Student", dept: "Electronics", status: "Active" },
  { id: 6, name: "James Brown", email: "j.brown@university.edu", role: "Faculty", dept: "Mathematics", status: "Active" },
];

const UserTable = () => {
  const getStatusStyle = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-slate-100 text-slate-500';
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case 'Administrator': return 'text-primary bg-primary/5';
      case 'Faculty': return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-slate-50 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-primary">System Users</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter users..." 
              className="bg-slate-50 border-0 rounded-xl px-4 py-2 pl-10 text-xs w-48 focus:ring-1 focus:ring-primary/20"
            />
            <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-sm">search</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Details</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group border-b border-slate-50/50">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-xs uppercase tracking-tighter">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getRoleStyle(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-4 text-xs font-semibold text-slate-500">
                  {user.dept}
                </td>
                <td className="px-8 py-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusStyle(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button className="material-symbols-outlined text-slate-300 hover:text-primary transition-colors text-lg">edit_note</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-slate-50/30 text-center">
        <button className="text-xs font-bold text-primary hover:underline transition-all">View All 1,370 Users</button>
      </div>
    </div>
  );
};

export default UserTable;
