import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ActiveTest = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const questions = [
    {
      id: 1,
      text: "What is the time complexity of searching an element in a balanced binary search tree?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    },
    {
      id: 2,
      text: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
      options: ["Queue", "Linked List", "Stack", "Binary Tree"],
    },
    {
      id: 3,
      text: "Which of the following sorting algorithms has the best average-case performance?",
      options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    },
  ];

  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionIndex });
  };

  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit your assessment?")) {
      navigate('/assessments/submitted');
    }
  };

  return (
    <div className="fixed inset-0 bg-surface-container-lowest z-[100] flex flex-col font-body">
      {/* Test Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold">DS</div>
          <div>
            <h1 className="font-black text-on-surface text-lg leading-tight uppercase tracking-tight">Data Structures Mid-Term</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student ID: CS-2023-084</p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Remaining</span>
            <span className={`text-2xl font-black tabular-nums ${timeLeft < 300 ? 'text-error animate-pulse' : 'text-primary'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-primary text-white py-3 px-8 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Submit Assessment
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-80 bg-slate-50 border-r border-slate-100 p-8 overflow-y-auto hidden lg:block">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Question Palette</h3>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 45 }).map((_, i) => (
              <button 
                key={i}
                onClick={() => i < questions.length && setCurrentQuestion(i)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all border ${
                  currentQuestion === i 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110 z-10' 
                    : selectedAnswers[i] !== undefined
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-white text-slate-400 border-slate-200 hover:border-primary/30'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="mt-12 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Legend</h3>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <div className="w-4 h-4 rounded bg-primary"></div> Answered
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <div className="w-4 h-4 rounded bg-white border border-slate-200"></div> Unvisited
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <div className="w-4 h-4 rounded bg-primary/10 border border-primary/20 ring-2 ring-primary/20"></div> Current
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-8 lg:p-16 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-1.5 rounded-full">
                Question {currentQuestion + 1} of 45
              </span>
              <span className="text-xs font-bold text-slate-400">Section: Theoretical Foundations</span>
            </div>

            <h2 className="text-2xl font-black text-on-surface mb-12 leading-snug">
              {questions[currentQuestion]?.text || "Loading question content..."}
            </h2>

            <div className="space-y-4 mb-16">
              {questions[currentQuestion]?.options.map((option, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-6 group ${
                    selectedAnswers[currentQuestion] === idx
                      ? 'bg-primary/5 border-primary shadow-sm'
                      : 'bg-slate-50 border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                    selectedAnswers[currentQuestion] === idx
                      ? 'bg-primary text-white'
                      : 'bg-white text-slate-400 border border-slate-200 shadow-sm group-hover:border-primary/30'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`font-bold transition-colors ${
                    selectedAnswers[currentQuestion] === idx ? 'text-primary' : 'text-on-surface-variant'
                  }`}>
                    {option}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
              <button 
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 font-black text-sm text-slate-400 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Previous Question
              </button>
              <div className="flex gap-4">
                <button className="px-6 py-3 rounded-xl border-2 border-slate-100 font-bold text-xs text-slate-400 hover:bg-slate-50 transition-all">
                  Mark for Review
                </button>
                <button 
                  onClick={() => currentQuestion < questions.length - 1 && setCurrentQuestion(prev => prev + 1)}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-black text-xs shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  Save & Next
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proctoring Banner */}
      <div className="bg-slate-900 text-white px-8 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-center">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          AI Proctoring Active • Eye-Tracking & Background Monitoring Enabled • Stay within browser frame
        </span>
      </div>
    </div>
  );
};

export default ActiveTest;
