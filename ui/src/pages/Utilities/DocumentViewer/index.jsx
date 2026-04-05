import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentViewer = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(100);

  return (
    <div className="h-screen flex flex-col bg-slate-900 font-body text-white">
      {/* Viewer Header */}
      <div className="h-20 bg-slate-800/50 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
          <div>
            <h1 className="text-sm font-black tracking-tight">Advanced Data Structures.pdf</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DS-101 • Page 4 of 42</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-2xl border border-white/5">
          <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-all">
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
          <span className="text-[10px] font-black w-12 text-center">{zoom}%</span>
          <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-primary text-white h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-sm">download</span>
            Download
          </button>
          <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
            <span className="material-symbols-outlined text-sm">print</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnails Sidebar */}
        <div className="w-64 bg-slate-800/30 border-r border-white/5 p-6 overflow-y-auto hidden lg:block">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8 text-center">Thumbnails</p>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`aspect-[3/4] rounded-xl border-2 transition-all cursor-pointer ${
                i === 4 ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-slate-700/50 border-white/5 hover:border-white/20'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black opacity-20">PAGE {i}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-900 p-12 overflow-auto flex justify-center custom-scrollbar">
          <div 
            className="bg-white rounded-[4px] shadow-2xl transition-all duration-300"
            style={{ 
              width: `${(zoom / 100) * 800}px`,
              height: `${(zoom / 100) * 1100}px`,
              minWidth: '200px'
            }}
          >
            {/* Mock PDF Content */}
            <div className="p-16 text-slate-800 font-serif leading-relaxed">
              <h2 className="text-2xl font-bold mb-10 text-slate-900 underline underline-offset-8">4.2 AVL Tree Balancing</h2>
              <p className="mb-6">AVL trees maintain balance by ensuring the height difference between left and right subtrees is no more than one. When this invariant is violated, rotations are performed...</p>
              <div className="w-full h-80 bg-slate-50 rounded-lg border-2 border-slate-100 my-10 flex items-center justify-center text-slate-300">
                <span className="italic">[Figure 4.2.1: Left-Right Rotation Diagram]</span>
              </div>
              <p>Consider the case where a node is inserted into the left subtree of the right child...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
