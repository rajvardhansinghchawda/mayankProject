import React from 'react';

const TestBuilderHeader = ({ test, questionCount, saving, publishing, onPublish, onBack }) => {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: back + title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">edit_square</span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Builder</p>
            </div>
            <h2 className="text-base font-black text-slate-800 leading-tight truncate max-w-xs">
              {test?.title || 'Untitled Test'}
            </h2>
          </div>
        </div>

        {/* Center: stats */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-center">
            <p className="text-lg font-black text-slate-800">{questionCount}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Questions</p>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="text-center">
            <p className="text-lg font-black text-slate-800">{test?.duration_minutes || 0}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mins</p>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          {/* Save indicator */}
          <div className="flex items-center gap-2">
            {saving ? (
              <>
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Saving...</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">All Saved</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Publish CTA */}
        <button
          onClick={onPublish}
          disabled={publishing}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-70"
        >
          <span className="material-symbols-outlined text-base">
            {publishing ? 'hourglass_empty' : 'rocket_launch'}
          </span>
          {publishing ? 'Publishing...' : 'Publish Test'}
        </button>
      </div>
    </div>
  );
};

export default TestBuilderHeader;
