import React from 'react';

const ModerationQueue = () => {
  const queue = [
    { title: 'Neural Networks Final Prep', author: 'Dr. Sarah Mitchell', type: 'Course Material', department: 'Computer Science', date: '10 mins ago' },
    { title: 'Quantum Computing Intro', author: 'Prof. James Wilson', type: 'Research Papers', department: 'Physics', date: '45 mins ago' },
    { title: 'Data Structures Lab Guide', author: 'Alice Smith', type: 'Course Material', department: 'Computer Science', date: '2 hours ago' },
    { title: 'Algorithm Analysis Notes', author: 'Bob Johnson', type: 'Reference Books', department: 'Mathematics', date: '5 hours ago' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 transition-all hover:shadow-lg">
      <h3 className="text-xl font-black text-on-surface mb-8 border-b border-slate-50 pb-6 uppercase tracking-widest text-[10px] text-primary">Moderation Queue</h3>
      <div className="space-y-6">
        {queue.map((item, i) => (
          <div key={i} className="flex flex-col lg:flex-row lg:items-center justify-between p-8 bg-slate-50 rounded-[36px] border border-white group hover:bg-slate-100 transition-all duration-300">
            <div className="flex items-center gap-6 mb-6 lg:mb-0">
              <div className="w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center text-primary border border-slate-50">
                <span className="material-symbols-outlined text-2xl">
                  {item.type === 'Course Material' ? 'book' : 'article'}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black text-on-surface mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs capitalize text-primary/50">person</span>
                  Uploaded by {item.author} • {item.date}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="bg-white text-slate-400 w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                <span className="material-symbols-outlined">block</span>
              </button>
              <button className="bg-primary text-white px-8 h-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all">
                Approve Asset
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModerationQueue;
