import React from 'react';
import { useNavigate } from 'react-router-dom';

const SkeletonRow = () => (
  <div className="p-5 bg-surface-container-low rounded-xl flex items-center justify-between animate-pulse">
    <div className="flex gap-4 items-center">
      <div className="w-2 h-12 bg-slate-200 rounded-full"></div>
      <div>
        <div className="h-4 w-48 bg-slate-200 rounded mb-2"></div>
        <div className="h-3 w-32 bg-slate-100 rounded"></div>
      </div>
    </div>
    <div className="h-9 w-24 bg-slate-200 rounded-full"></div>
  </div>
);

const TestItem = ({ test }) => {
  const navigate = useNavigate();
  const title = test.title || test.name || 'Untitled Test';
  const duration = test.duration_minutes || test.time_limit || 0;
  const subject = test.subject || test.subject_name || '';
  const testId = test.id;

  const dueDate = test.end_time || test.deadline;
  const dueLabel = dueDate
    ? new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : 'Open';

  return (
    <div className="p-5 bg-surface-container-low rounded-xl flex items-center justify-between group hover:bg-surface-bright transition-colors">
      <div className="flex gap-4">
        <div className="w-2 h-12 bg-primary rounded-full"></div>
        <div>
          <h3 className="font-bold text-on-surface">{title}</h3>
          <p className="text-xs text-slate-500 font-medium">
            {subject && `${subject} • `}{duration > 0 ? `${duration} mins` : ''} {dueLabel ? `• Due: ${dueLabel}` : ''}
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate(`/assessments/instructions/${testId}`)}
        className="px-6 py-2 rounded-full font-bold text-sm transition-all bg-gradient-to-r from-primary to-primary-container text-white shadow-md hover:opacity-90"
      >
        Start Test
      </button>
    </div>
  );
};

const ActiveTests = ({ tests = [], loading }) => {
  return (
    <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined" id="timer-icon">timer</span>
          Active Tests
        </h2>
        <a className="text-sm font-bold text-primary-container hover:underline" href="/tests">View All</a>
      </div>
      <div className="space-y-4">
        {loading && <><SkeletonRow /><SkeletonRow /></>}
        {!loading && tests.length === 0 && (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-4xl text-slate-200 mb-2 block">quiz</span>
            <p className="text-slate-400 font-medium text-sm">No active tests right now.</p>
          </div>
        )}
        {!loading && tests.slice(0, 3).map(test => <TestItem key={test.id} test={test} />)}
      </div>
    </section>
  );
};

export default ActiveTests;
