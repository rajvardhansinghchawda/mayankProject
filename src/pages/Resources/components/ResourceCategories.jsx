import React from 'react';

const categories = [
  { name: 'All Resources', icon: 'grid_view', count: 124 },
  { name: 'Lecture Notes', icon: 'description', count: 42 },
  { name: 'Research Papers', icon: 'menu_book', count: 18 },
  { name: 'Practice Labs', icon: 'biotech', count: 25 },
  { name: 'Previous Papers', icon: 'history_edu', count: 39 },
];

const ResourceCategories = () => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {categories.map((cat, index) => (
        <button 
          key={index}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all font-bold text-sm shadow-sm ${
            index === 0 
              ? 'bg-primary text-white scale-105 shadow-primary/20' 
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span className="material-symbols-outlined text-lg">{cat.icon}</span>
          <span>{cat.name}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            index === 0 ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            {cat.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ResourceCategories;
