import React from 'react';

const QuestionAnalysis = () => {
  const questions = [
    { num: 1, text: 'Select the primary advantage of a Binary Search Tree over a Linked List.', studentAnswer: 'Option C', correctAnswer: 'Option C', time: '45s', status: 'Correct' },
    { num: 2, text: 'Explain the time complexity of the Mergesort algorithm in the average case.', studentAnswer: 'O(n log n)', correctAnswer: 'O(n log n)', time: '120s', status: 'Correct' },
    { num: 3, text: 'Which of the following is NOT a characteristic of a Red-Black Tree?', studentAnswer: 'Every leaf node is red', correctAnswer: 'Every leaf node is black', time: '15s', status: 'Incorrect' },
    { num: 4, text: 'Identify the most efficient search algorithm for a sorted array.', studentAnswer: 'Binary Search', correctAnswer: 'Binary Search', time: '30s', status: 'Correct' },
    { num: 5, text: 'What is the maximum height of a balanced AVL tree with 16 nodes?', studentAnswer: '5', correctAnswer: '4', time: '210s', status: 'Incorrect' },
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-50 mb-8 relative overflow-hidden">
      <h3 className="text-xl font-black text-on-surface mb-8 bg-slate-50 p-6 rounded-3xl border border-white flex items-center justify-between">
        Question-by-Question Analysis
        <span className="text-primary text-[10px] font-black uppercase tracking-widest">5 of 25 Questions</span>
      </h3>
      
      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={i} className={`p-8 rounded-[32px] border transition-all hover:shadow-lg ${
            q.status === 'Correct' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'
          }`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">{q.num}</span>
                <p className="text-sm font-bold text-on-surface leading-relaxed max-w-2xl">{q.text}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                q.status === 'Correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {q.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Answer</p>
                <p className="text-sm font-bold text-on-surface">{q.studentAnswer}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Correct Answer</p>
                <p className="text-sm font-bold text-green-600">{q.correctAnswer}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Spent</p>
                <p className="text-sm font-bold text-slate-500">{q.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionAnalysis;
