import React, { useState } from 'react';

const DragDropArea = () => {
  const [isOver, setIsOver] = useState(false);

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      className={`h-80 rounded-[48px] border-4 border-dashed mb-16 flex flex-col items-center justify-center transition-all cursor-pointer group ${
        isOver ? 'bg-primary/20 border-primary shadow-2xl shadow-primary/20 scale-[0.98]' : 'bg-slate-50 border-slate-100 hover:border-primary/20 shadow-inner'
      }`}
    >
      <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 transition-all ${
        isOver ? 'bg-white shadow-xl text-primary' : 'bg-white shadow-sm text-slate-300 group-hover:text-primary group-hover:scale-110'
      }`}>
        <span className="material-symbols-outlined text-4xl">upload_file</span>
      </div>
      <h3 className={`text-xl font-black mb-2 transition-colors ${isOver ? 'text-primary' : 'text-on-surface'}`}>
        Ready for Processing
      </h3>
      <p className="text-sm font-medium text-slate-400">Drag and drop your spreadsheet or <span className="text-primary underline underline-offset-4 cursor-pointer font-bold">select file</span></p>
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-6 opacity-60 italic">SARAS-v4 compliant parser active</p>
    </div>
  );
};

export default DragDropArea;
