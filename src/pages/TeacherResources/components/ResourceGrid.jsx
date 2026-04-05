import React from 'react';

const ResourceGrid = () => {
  const resources = [
    { title: 'Data Structures with C++', course: 'DS-101', type: 'Course Material', views: '1.2k', updated: '2 days ago', color: 'text-blue-600 bg-blue-50' },
    { title: 'Neural Networks Lab Guide', course: 'AI-402', type: 'Reference Books', views: '450', updated: '5 hours ago', color: 'text-purple-600 bg-purple-50' },
    { title: 'Quantum Computing Intro', course: 'PH-305', type: 'Research Papers', views: '890', updated: '1 week ago', color: 'text-amber-600 bg-amber-50' },
    { title: 'Operating Systems Quiz Prep', course: 'OS-201', type: 'Examination Papers', views: '2.1k', updated: '10 mins ago', color: 'text-green-600 bg-green-50' },
    { title: 'Compiler Design Notes', course: 'CD-501', type: 'Course Material', views: '150', updated: '1 month ago', color: 'text-red-600 bg-red-50' },
    { title: 'Cloud Infrastructure FAQ', course: 'CS-404', type: 'Reference Books', views: '320', updated: '3 days ago', color: 'text-cyan-600 bg-cyan-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {resources.map((res, i) => (
        <div key={i} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 transition-all hover:shadow-xl hover:-translate-y-1 duration-500 group">
          <div className="flex justify-between items-start mb-8">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${res.color}`}>
              <span className="material-symbols-outlined text-3xl">
                {res.type === 'Course Material' ? 'book' : res.type === 'Reference Books' ? 'menu_book' : 'article'}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
          
          <h4 className="text-xl font-black text-on-surface mb-2 group-hover:text-primary transition-colors">{res.title}</h4>
          <p className="text-xs font-black text-primary uppercase tracking-widest bg-primary/5 inline-block px-3 py-1 rounded-lg mb-8">{res.course}</p>
          
          <div className="flex items-center justify-between pt-8 border-t border-slate-50">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="material-symbols-outlined text-sm">visibility</span>
              {res.views} views
            </div>
            <div className="text-xs font-bold text-slate-400">
              Updated {res.updated}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceGrid;
