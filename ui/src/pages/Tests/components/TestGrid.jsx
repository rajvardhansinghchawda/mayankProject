import React from 'react';
import { Link } from 'react-router-dom';

const testData = [
  {
    id: 1,
    title: "Data Structures - Mid-Term Assessment",
    subject: "Computer Science",
    date: "TODAY, 10:00 AM",
    duration: "90 Mins",
    questions: 45,
    status: "Active",
    type: "Theory + MCQ",
    points: 100
  },
  {
    id: 2,
    title: "Operating Systems - Unit Test 3",
    subject: "Computer Science",
    date: "TOMORROW, 02:00 PM",
    duration: "60 Mins",
    questions: 30,
    status: "Upcoming",
    type: "MCQ",
    points: 50
  },
  {
    id: 3,
    title: "Advanced Web Technologies - Lab Exam",
    subject: "Information Technology",
    date: "OCT 20, 2023",
    duration: "180 Mins",
    questions: 5,
    status: "Upcoming",
    type: "Practical",
    points: 100
  },
  {
    id: 4,
    title: "Digital Logic Design - Quiz 2",
    subject: "Electronics",
    date: "YESTERDAY",
    duration: "30 Mins",
    questions: 15,
    status: "Completed",
    type: "MCQ",
    points: 25
  },
  {
    id: 5,
    title: "Discrete Mathematics - Final Prep",
    subject: "Curriculum Management",
    date: "OCT 25, 2023",
    duration: "120 Mins",
    questions: 20,
    status: "Upcoming",
    type: "Theory",
    points: 80
  },
  {
    id: 6,
    title: "Computer Networks - Semester Review",
    subject: "Computer Science",
    date: "OCT 28, 2023",
    duration: "150 Mins",
    questions: 60,
    status: "Upcoming",
    type: "Theory + Practical",
    points: 150
  }
];

const TestCard = ({ test }) => {
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'active': return { label: 'Active', classes: 'bg-primary text-white shadow-lg shadow-primary/20 animate-pulse' };
      case 'published': return { label: 'Upcoming', classes: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' };
      case 'closed': 
      case 'results_released': return { label: 'Completed', classes: 'bg-green-100 text-green-700' };
      default: return { label: status, classes: 'bg-slate-100 text-slate-500' };
    }
  };

  const displayStatus = getStatusDisplay(test.status);
  const formattedDate = new Date(test.availability_start).toLocaleString([], {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_32px_rgba(25,28,29,0.04)] hover:shadow-[0_20px_40px_rgba(25,28,29,0.08)] transition-all group flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${displayStatus.classes}`}>
            {displayStatus.label}
          </span>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">more_vert</span>
        </div>
        
        <h3 className="text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors leading-tight">
          {test.title}
        </h3>
        <p className="text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">{test.subject_name}</p>
        
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">timer</span>
            <span className="text-sm font-medium">{test.duration_minutes} Mins</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span className="text-sm font-medium">{test.total_marks || 'NA'} Marks</span>
          </div>
        </div>
      </div>

      <Link 
        to={test.status === 'active' || test.status === 'published' ? `/assessments/instructions/${test.id}` : '#'}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
          test.status === 'active' 
            ? 'bg-primary text-white hover:opacity-90' 
            : 'bg-surface-container-high text-primary hover:bg-primary hover:text-white'
        }`}
      >
        {test.status === 'active' ? 'Begin Assessment' : 'View Instructions'}
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </Link>
    </div>
  );
};

const TestGrid = ({ tests }) => {
  if (!tests || tests.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-100">
        <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">event_busy</span>
        <p className="text-slate-400 font-medium">No assessments scheduled for your section.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tests.map(test => (
        <TestCard key={test.id} test={test} />
      ))}
    </div>
  );
};

export default TestGrid;
