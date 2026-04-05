import React from 'react';

const resources = [
  {
    id: 1,
    title: "Introduction to Algorithm Complexity",
    type: "PDF",
    size: "2.4 MB",
    category: "Lecture Notes",
    updated: "2 days ago",
    author: "Dr. Sarah Smith",
    color: "text-red-500 bg-red-50"
  },
  {
    id: 2,
    title: "Operating Systems - System Calls Guide",
    type: "PDF",
    size: "1.8 MB",
    category: "Lecture Notes",
    updated: "5 days ago",
    author: "Prof. Michael Chen",
    color: "text-blue-500 bg-blue-50"
  },
  {
    id: 3,
    title: "React Hooks Deep Dive - Hands-on Lab",
    type: "ZIP",
    size: "15.2 MB",
    category: "Practice Labs",
    updated: "1 week ago",
    author: "Admin Team",
    color: "text-purple-500 bg-purple-50"
  },
  {
    id: 4,
    title: "Distributed Systems Research - Vol 4",
    type: "EPUB",
    size: "8.1 MB",
    category: "Research Papers",
    updated: "Oct 12, 2023",
    author: "Research Cell",
    color: "text-green-500 bg-green-50"
  },
  {
    id: 5,
    title: "Database Management Systems Final Review",
    type: "PDF",
    size: "3.2 MB",
    category: "Previous Papers",
    updated: "Oct 10, 2023",
    author: "Dept. Head",
    color: "text-amber-500 bg-amber-50"
  },
  {
    id: 6,
    title: "Computer Networks Protocols Cheat Sheet",
    type: "DOCX",
    size: "540 KB",
    category: "Lecture Notes",
    updated: "Sep 28, 2023",
    author: "Assistant Prof. Rao",
    color: "text-indigo-500 bg-indigo-50"
  }
];

const ResourceCard = ({ res }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_8px_20px_rgba(25,28,29,0.03)] hover:shadow-[0_15px_35px_rgba(25,28,29,0.07)] transition-all group border border-transparent hover:border-primary/10">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs ${res.color}`}>
          {res.type}
        </div>
        <button className="material-symbols-outlined text-slate-300 hover:text-primary transition-colors">download</button>
      </div>
      
      <h3 className="text-base font-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
        {res.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
          {res.category}
        </span>
        <span className="text-[10px] text-slate-300">•</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.size}</span>
      </div>
      
      <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-surface-container-high overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase">
            {res.author.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-on-surface truncate">{res.author}</p>
          <p className="text-[9px] text-slate-400 font-medium">Updated {res.updated}</p>
        </div>
      </div>
    </div>
  );
};

const ResourceGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {resources.map(res => (
        <ResourceCard key={res.id} res={res} />
      ))}
    </div>
  );
};

export default ResourceGrid;
