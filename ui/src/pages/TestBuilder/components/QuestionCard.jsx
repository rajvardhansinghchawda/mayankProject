import React, { useState, useEffect } from 'react';

const QuestionCard = ({ question, index, isActive, onActivate, onUpdate, onDelete, questionTypes }) => {
  const [localQuestion, setLocalQuestion] = useState(question);
  const [isDirty, setIsDirty] = useState(false);

  // Debounced save
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      onUpdate(localQuestion.id, {
        question_text: localQuestion.question_text,
        question_type: localQuestion.question_type,
        marks: localQuestion.marks,
        order_index: localQuestion.order_index,
        options: localQuestion.options,
      });
      setIsDirty(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [localQuestion, isDirty]);

  const update = (changes) => {
    setLocalQuestion(prev => ({ ...prev, ...changes }));
    setIsDirty(true);
  };

  const updateOption = (optIdx, changes) => {
    const newOptions = localQuestion.options.map((opt, i) => i === optIdx ? { ...opt, ...changes } : opt);
    update({ options: newOptions });
  };

  const setCorrectOption = (optIdx) => {
    const newOptions = localQuestion.options.map((opt, i) => ({
      ...opt,
      is_correct: i === optIdx,
    }));
    update({ options: newOptions });
  };

  const addOption = () => {
    if (localQuestion.options.length >= 6) return;
    const newOptions = [
      ...localQuestion.options,
      { option_text: `Option ${String.fromCharCode(65 + localQuestion.options.length)}`, is_correct: false, order_index: localQuestion.options.length + 1 }
    ];
    update({ options: newOptions });
  };

  const removeOption = (optIdx) => {
    if (localQuestion.options.length <= 2) return;
    const newOptions = localQuestion.options
      .filter((_, i) => i !== optIdx)
      .map((opt, i) => ({ ...opt, order_index: i + 1 }));
    // If deleted option was correct, make first one correct
    if (!newOptions.some(o => o.is_correct)) {
      newOptions[0].is_correct = true;
    }
    update({ options: newOptions });
  };

  const handleTypeChange = (newType) => {
    let newOptions = localQuestion.options;
    if (newType === 'true_false') {
      newOptions = [
        { option_text: 'True', is_correct: true, order_index: 1 },
        { option_text: 'False', is_correct: false, order_index: 2 },
      ];
    } else if (newType === 'mcq' && localQuestion.question_type === 'true_false') {
      newOptions = [
        { option_text: 'Option A', is_correct: true, order_index: 1 },
        { option_text: 'Option B', is_correct: false, order_index: 2 },
        { option_text: 'Option C', is_correct: false, order_index: 3 },
        { option_text: 'Option D', is_correct: false, order_index: 4 },
      ];
    } else if (newType === 'short_answer') {
      newOptions = [];
    }
    update({ question_type: newType, options: newOptions });
  };

  const isShortAnswer = localQuestion.question_type === 'short_answer';
  const isTrueFalse = localQuestion.question_type === 'true_false';

  return (
    <div
      onClick={onActivate}
      className={`bg-white rounded-3xl shadow-sm transition-all cursor-pointer ${
        isActive
          ? 'border-2 border-primary shadow-primary/10 shadow-lg ring-0'
          : 'border border-slate-100 hover:border-slate-200 hover:shadow-md'
      }`}
    >
      {/* Card Top Bar */}
      <div className={`flex items-center justify-between px-6 pt-5 pb-3`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${
            isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            {index + 1}
          </div>
          {/* Type selector */}
          <div className="relative">
            <select
              value={localQuestion.question_type}
              onChange={e => handleTypeChange(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="appearance-none bg-slate-50 border-none text-[11px] font-black text-slate-600 uppercase tracking-widest pl-3 pr-7 py-2 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {questionTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <span className="material-symbols-outlined text-xs text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Marks */}
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marks</span>
            <input
              type="number"
              min="1"
              max="100"
              value={localQuestion.marks}
              onChange={e => update({ marks: parseInt(e.target.value) || 1 })}
              onClick={e => e.stopPropagation()}
              className="w-10 bg-transparent text-sm font-black text-primary text-center focus:outline-none"
            />
          </div>
          {/* Delete */}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-9 h-9 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </div>

      {/* Question Text Input */}
      <div className="px-6 pb-4">
        <textarea
          value={localQuestion.question_text}
          onChange={e => update({ question_text: e.target.value })}
          onClick={e => e.stopPropagation()}
          placeholder="Type your question here..."
          rows={2}
          className="w-full bg-slate-50 rounded-2xl p-4 text-slate-700 font-semibold text-sm resize-none border-none focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-slate-300"
        />
      </div>

      {/* Options */}
      {!isShortAnswer && (
        <div className="px-6 pb-5 space-y-2">
          {localQuestion.options.map((opt, optIdx) => (
            <div key={optIdx} className="flex items-center gap-3 group">
              {/* Correct radio */}
              <button
                onClick={e => { e.stopPropagation(); setCorrectOption(optIdx); }}
                title="Mark as correct answer"
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
                  opt.is_correct
                    ? 'border-green-500 bg-green-500'
                    : 'border-slate-300 hover:border-green-400'
                }`}
              >
                {opt.is_correct && (
                  <span className="material-symbols-outlined text-white text-xs w-full flex items-center justify-center">check</span>
                )}
              </button>
              {/* Option text */}
              <input
                type="text"
                value={opt.option_text}
                onChange={e => updateOption(optIdx, { option_text: e.target.value })}
                onClick={e => e.stopPropagation()}
                disabled={isTrueFalse}
                className={`flex-1 text-sm font-semibold bg-transparent border-b-2 py-1.5 focus:outline-none transition-colors ${
                  opt.is_correct
                    ? 'border-green-400 text-green-700'
                    : 'border-slate-100 text-slate-600 focus:border-primary'
                } ${isTrueFalse ? 'cursor-not-allowed opacity-70' : ''}`}
                placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
              />
              {/* Correct label */}
              {opt.is_correct && (
                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest flex-shrink-0">Correct</span>
              )}
              {/* Remove option */}
              {!isTrueFalse && localQuestion.options.length > 2 && (
                <button
                  onClick={e => { e.stopPropagation(); removeOption(optIdx); }}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
          ))}

          {/* Add option button (only for MCQ) */}
          {localQuestion.question_type === 'mcq' && localQuestion.options.length < 6 && (
            <button
              onClick={e => { e.stopPropagation(); addOption(); }}
              className="mt-3 flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Add Option
            </button>
          )}
        </div>
      )}

      {/* Short Answer placeholder */}
      {isShortAnswer && (
        <div className="px-6 pb-6">
          <div className="bg-slate-50 rounded-2xl p-4 border-2 border-dashed border-slate-200">
            <p className="text-slate-300 text-sm font-bold italic">Student will type their answer here...</p>
          </div>
        </div>
      )}

      {/* Bottom: correct answer hint */}
      <div className={`px-6 py-3 border-t border-slate-50 flex items-center gap-2 ${isActive ? '' : 'hidden'}`}>
        <span className="material-symbols-outlined text-sm text-slate-300">info</span>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          {isShortAnswer ? 'Short answer — no auto-grading' : 'Click a circle to set the correct answer'}
        </p>
      </div>
    </div>
  );
};

export default QuestionCard;
