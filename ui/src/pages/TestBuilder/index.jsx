import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import QuestionCard from './components/QuestionCard';
import TestBuilderHeader from './components/TestBuilderHeader';

const QUESTION_TYPES = [
  { value: 'mcq', label: 'Multiple Choice', icon: 'radio_button_checked' },
  { value: 'true_false', label: 'True / False', icon: 'toggle_on' },
  { value: 'short_answer', label: 'Short Answer', icon: 'short_text' },
];

const TestBuilder = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [testId]);

  const fetchTest = async () => {
    try {
      const [testData, questionsData] = await Promise.all([
        assessmentService.getTestDetail(testId),
        assessmentService.getTestQuestions(testId),
      ]);
      setTest(testData);
      setQuestions(questionsData);
    } catch (err) {
      console.error('Failed to load test', err);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async () => {
    const newQ = {
      question_text: 'New Question',
      question_type: 'mcq',
      marks: 1,
      order_index: questions.length + 1,
      options: [
        { option_text: 'Option A', is_correct: true, order_index: 1 },
        { option_text: 'Option B', is_correct: false, order_index: 2 },
        { option_text: 'Option C', is_correct: false, order_index: 3 },
        { option_text: 'Option D', is_correct: false, order_index: 4 },
      ],
    };

    setSaving(true);
    try {
      const created = await assessmentService.addQuestion(testId, newQ);
      setQuestions(prev => [...prev, created]);
      setActiveQuestionIdx(questions.length);
    } catch (err) {
      console.error('Failed to add question', err);
    } finally {
      setSaving(false);
    }
  };

  const updateQuestion = useCallback(async (questionId, updatedData) => {
    setSaving(true);
    try {
      const updated = await assessmentService.updateQuestion(testId, questionId, updatedData);
      setQuestions(prev => prev.map(q => q.id === questionId ? updated : q));
    } catch (err) {
      console.error('Failed to update question', err);
    } finally {
      setSaving(false);
    }
  }, [testId]);

  const deleteQuestion = useCallback(async (questionId) => {
    if (!window.confirm('Delete this question?')) return;
    setSaving(true);
    try {
      await assessmentService.deleteQuestion(testId, questionId);
      setQuestions(prev => {
        const updated = prev.filter(q => q.id !== questionId);
        return updated.map((q, i) => ({ ...q, order_index: i + 1 }));
      });
      setActiveQuestionIdx(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to delete question', err);
    } finally {
      setSaving(false);
    }
  }, [testId]);

  const handlePublish = async () => {
    if (questions.length === 0) {
      alert('Please add at least one question before publishing.');
      return;
    }
    if (!window.confirm(`Publish "${test?.title}"? Students in the selected section will be able to see this test.`)) return;

    setPublishing(true);
    try {
      await assessmentService.publishTest(testId);
      navigate('/teacher/dashboard', { state: { published: true } });
    } catch (err) {
      console.error('Failed to publish', err);
      alert('Failed to publish. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold">Loading Test Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <TestBuilderHeader
        test={test}
        questionCount={questions.length}
        saving={saving}
        publishing={publishing}
        onPublish={handlePublish}
        onBack={() => navigate('/teacher/dashboard')}
      />

      <div className="max-w-4xl mx-auto px-6 pb-32 pt-6">
        {/* Test Info Card */}
        <div className="bg-white rounded-3xl p-6 mb-6 border-l-4 border-primary shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-800 mb-1">{test?.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">subject</span>
                  {test?.subject_name}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">groups</span>
                  {test?.department_code ? `${test.department_code} | Sec ${test.section_name}` : (test?.section_name || 'Target Section')}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">timer</span>
                  {test?.duration_minutes} mins
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">pending</span>
                  DRAFT
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-slate-800">{questions.reduce((s, q) => s + (q.marks || 0), 0)}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Marks</p>
            </div>
          </div>
        </div>

        {/* Questions */}
        {questions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-4xl text-primary">quiz</span>
            </div>
            <h3 className="text-xl font-black text-slate-700 mb-2">No Questions Yet</h3>
            <p className="text-slate-400 font-medium mb-6 text-sm">Click "Add Question" below to start building your test</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, idx) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={idx}
                isActive={activeQuestionIdx === idx}
                onActivate={() => setActiveQuestionIdx(idx)}
                onUpdate={updateQuestion}
                onDelete={() => deleteQuestion(question.id)}
                questionTypes={QUESTION_TYPES}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Question Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={addQuestion}
          disabled={saving}
          className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all disabled:opacity-70"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          {saving ? 'Adding...' : 'Add Question'}
        </button>
      </div>
    </div>
  );
};

export default TestBuilder;
