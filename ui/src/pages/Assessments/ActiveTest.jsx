import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const ActiveTest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState(null);

  // Use refs to avoid closure issues in event listeners
  const attemptIdRef = useRef(null);

  const fetchTestData = useCallback(async () => {
    try {
      // We first try to get the active test details (which includes attempt info if started)
      // Actually, we'll fetch the test details and the questions
      const testRes = await api.get(`/assessments/tests/${id}/`);
      setTest(testRes.data);

      // Now fetch attempt details to resume or initialize
      try {
        const attemptRes = await api.get(`/assessments/tests/${id}/attempt/`);
        setAttemptId(attemptRes.data.id);
        attemptIdRef.current = attemptRes.data.id;
        
        // Calculate remaining time
        if (attemptRes.data.expires_at) {
          const expires = new Date(attemptRes.data.expires_at).getTime();
          const now = new Date().getTime();
          setTimeLeft(Math.max(0, Math.floor((expires - now) / 1000)));
        } else if (testRes.data.duration_minutes) {
          setTimeLeft(testRes.data.duration_minutes * 60);
        }

        // Questions are part of the test object
        setQuestions(testRes.data.questions || []);
      } catch (err) {
        // If no attempt found, maybe redirect back?
        console.error("No active attempt found", err);
        navigate(`/assessments/instructions/${id}`);
      }
    } catch (err) {
      console.error("Failed to load test", err);
      navigate('/tests');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTestData();
  }, [fetchTestData]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === null) return;
    
    if (timeLeft <= 0) {
      handleFinalSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Proctoring logic
  const logEvent = useCallback(async (eventType, data = {}) => {
    if (!id) return;
    try {
      await api.post(`/assessments/tests/${id}/attempt/event/`, {
        event_type: eventType,
        event_data: data
      });
    } catch (err) {
      console.error("Failed to log proctoring event", err);
    }
  }, [id]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logEvent('tab_switch', { timestamp: new Date().toISOString() });
      }
    };

    const handleBlur = () => {
      logEvent('focus_lost', { timestamp: new Date().toISOString() });
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [logEvent]);

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const handleOptionSelect = async (optionId) => {
    const questionId = questions[currentQuestion].id;
    
    // Optimistic UI update
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));

    try {
      await api.post(`/assessments/tests/${id}/attempt/answer/`, {
        question: questionId,
        selected_option: optionId
      });
    } catch (err) {
      console.error("Failed to save answer", err);
    }
  };

  const handleFinalSubmit = async (isAuto = false) => {
    if (!isAuto && !window.confirm("Are you sure you want to submit your assessment?")) return;
    
    setIsSubmitting(true);
    try {
      await api.post(`/assessments/tests/${id}/attempt/submit/`);
      navigate('/assessments/submitted', { state: { testId: id } });
    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to submit assessment. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center font-body">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Securing Assessment Environment...</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isShortAnswer = currentQ?.question_type === 'short_answer';
  const isTrueFalse = currentQ?.question_type === 'true_false';

  return (
    <div className="fixed inset-0 bg-surface-container-lowest z-[100] flex flex-col font-body select-none">
      {/* Blur Overlay when focus is lost */}
      {isBlurred && (
        <div className="fixed inset-0 z-[500] backdrop-blur-xl bg-slate-900/80 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-white mb-4">visibility_off</span>
          <h2 className="text-white text-2xl font-black mb-2 uppercase tracking-widest">Proctoring Alert</h2>
          <p className="text-white/70 text-sm font-medium">Test paused. Return to this tab to continue.</p>
          <p className="text-amber-400 text-xs font-bold mt-4 uppercase tracking-widest">This leave has been logged.</p>
        </div>
      )}

      {/* Test Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold">
            {test?.subject_name?.substring(0, 2).toUpperCase() || 'SA'}
          </div>
          <div>
            <h1 className="font-black text-on-surface text-lg leading-tight uppercase tracking-tight">{test?.title}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attempt ID: {attemptId?.toString().substring(0, 8)}</p>
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
            disabled={isSubmitting}
            onClick={() => handleFinalSubmit(false)}
            className="bg-primary text-white py-3 px-8 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-80 bg-slate-50 border-r border-slate-100 p-8 overflow-y-auto hidden lg:block">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Question Palette</h3>
          <div className="grid grid-cols-4 gap-3">
            {questions.map((q, i) => {
              const isAnswered = q.question_type === 'short_answer'
                ? textAnswers[q.id] !== undefined && textAnswers[q.id] !== ''
                : selectedAnswers[q.id] !== undefined;
              return (
                <button 
                  key={q.id}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all border ${
                    currentQuestion === i 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110 z-10' 
                      : isAnswered
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-primary/30'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-12 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Legend</h3>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <div className="w-4 h-4 rounded bg-primary"></div> Answered
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <div className="w-4 h-4 rounded bg-white border border-slate-200"></div> Unvisited
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-8 lg:p-16 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-1.5 rounded-full">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isShortAnswer ? 'bg-purple-50 text-purple-600' :
                  isTrueFalse ? 'bg-green-50 text-green-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {isShortAnswer ? 'Short Answer' : isTrueFalse ? 'True / False' : 'MCQ'}
                </span>
                <span className="text-xs font-bold text-slate-400">Marks: {currentQ?.marks}</span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-on-surface mb-12 leading-snug">
              {currentQ?.question_text}
            </h2>

            <div className="space-y-4 mb-16">
              {/* Short Answer Input */}
              {isShortAnswer ? (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Answer</label>
                  <textarea
                    className="w-full border-2 border-slate-200 rounded-2xl p-6 text-base font-medium text-on-surface focus:border-primary/40 focus:bg-primary/5 outline-none transition-all resize-none min-h-[180px] leading-relaxed select-text"
                    placeholder="Type your answer here..."
                    value={textAnswers[currentQ?.id] || ''}
                    onChange={(e) => handleTextAnswer(currentQ.id, e.target.value)}
                    onBlur={() => handleSaveTextAnswer(currentQ.id)}
                    id={`short-answer-${currentQ?.id}`}
                    onContextMenu={(e) => e.stopPropagation()}
                  />
                  <p className="text-xs text-slate-400 ml-2">Your answer is saved automatically when you move to the next question.</p>
                </div>
              ) : (
                /* MCQ / True-False options */
                currentQ?.options?.map((option, idx) => (
                  <button 
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-6 group ${
                      selectedAnswers[currentQ.id] === option.id
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'bg-slate-50 border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                      selectedAnswers[currentQ.id] === option.id
                        ? 'bg-primary text-white'
                        : 'bg-white text-slate-400 border border-slate-200 shadow-sm group-hover:border-primary/30'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`font-bold transition-colors ${
                      selectedAnswers[currentQ.id] === option.id ? 'text-primary' : 'text-on-surface-variant'
                    }`}>
                      {option.option_text}
                    </span>
                  </button>
                ))
              )}
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
                <button 
                  onClick={async () => {
                    if (isShortAnswer) await handleSaveTextAnswer(currentQ.id);
                    if (currentQuestion < questions.length - 1) setCurrentQuestion(prev => prev + 1);
                  }}
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
          AI Proctoring Active • Copy/Print Protection ON • Stay within browser frame
        </span>
      </div>
    </div>
  );
};

export default ActiveTest;
