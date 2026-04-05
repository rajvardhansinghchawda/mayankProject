import React from 'react';

const CategoryFilter = () => {
  const categories = ['All Resources', 'Course Material', 'Reference Books', 'Research Papers', 'Examination Papers'];

  return (
    <div className="flex flex-wrap gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((cat, i) => (
        <button 
          key={i}
          className={`px-6 py-3 rounded-2xl font-black text-xs transition-all whitespace-nowrap uppercase tracking-widest ${
            i === 0 
              ? 'bg-primary text-white shadow-xl shadow-primary/20' 
              : 'bg-white text-slate-400 border border-slate-100 hover:border-primary/30 hover:text-primary'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
