import React from 'react';

const StudentResults = () => {
  const resultData = {
    testName: "Data Structures Mid-Term",
    score: 84,
    totalMarks: 100,
    percentile: 92,
    rank: 14,
    totalStudents: 124,
    timeTaken: "58 Mins",
    accuracy: "86%",
    status: "Pass"
  };

  const topicAnalysis = [
    { name: "Binary Trees", score: 90, total: 20 },
    { name: "Linked Lists", score: 85, total: 20 },
    { name: "Complexity Analysis", score: 70, total: 30 },
    { name: "Hash Tables", score: 95, total: 15 },
    { name: "Sorting & Searching", score: 80, total: 15 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Assessment Performance</h1>
          <p className="text-on-surface-variant font-medium">Detailed analysis of your mid-term performance in Data Structures.</p>
        </div>
        <button className="bg-white text-primary border border-slate-100 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">download</span>
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Main Score Card */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-[0_24px_64px_rgba(25,28,29,0.06)] border border-slate-50 flex-1 flex flex-col items-center text-center">
            <div className="relative mb-10">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552.92} strokeDashoffset={552.92 * (1 - resultData.score / 100)} className="text-primary transition-all duration-1000" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-on-surface">{resultData.score}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Out of {resultData.totalMarks}</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-on-surface mb-2">{resultData.status}</h3>
            <p className="text-sm font-medium text-slate-500 mb-8 max-w-[200px]">You performed better than 92% of your peers in this batch.</p>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rank</p>
                <p className="text-lg font-black text-primary">#{resultData.rank}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                <p className="text-lg font-black text-primary">{resultData.accuracy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown & Analytics */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-50">
            <h4 className="text-lg font-black text-on-surface mb-8">Subject Area Proficiency</h4>
            <div className="space-y-6">
              {topicAnalysis.map((topic, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-on-surface-variant">{topic.name}</span>
                    <span className="text-xs font-black text-primary">{topic.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${topic.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-400">timer</span>
                </div>
                <h4 className="font-bold">Time Efficiency</h4>
              </div>
              <p className="text-3xl font-black mb-1">{resultData.timeTaken}</p>
              <p className="text-xs font-medium text-white/50">Average time per question: 1.25 Mins</p>
            </div>
            
            <div className="bg-surface-container-high rounded-[32px] p-8 border border-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <h4 className="font-bold text-primary">Skill Insights</h4>
              </div>
              <p className="text-sm font-medium text-on-surface-variant">Your logical reasoning in <span className="font-bold text-primary">Trees</span> is excellent. Consider focusing on <span className="font-bold text-error">Complexity Analysis</span> for the final semester.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Tabs */}
      <div className="flex gap-4 mb-20">
        <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20">Review Answers</button>
        <button className="bg-white text-slate-600 px-8 py-4 rounded-2xl font-black text-sm border border-slate-100 shadow-sm hover:shadow-md transition-all">Compare with Topper</button>
      </div>
    </div>
  );
};

export default StudentResults;
