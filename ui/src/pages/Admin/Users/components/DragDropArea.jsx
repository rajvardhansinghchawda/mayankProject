import React, { useRef, useState } from 'react';

const DragDropArea = ({ onFileSelect }) => {
  const [isOver, setIsOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const downloadTemplate = (type) => {
    let headers = '';
    let filename = '';
    if (type === 'student') {
      headers = 'full_name,email,roll_number,enrollment_number,section_id\nJohn Doe,student1@uni.edu,CS101,EN1001,\n';
      filename = 'saras_student_import_template.csv';
    } else {
      headers = 'full_name,email,employee_id,department_id\nJane Smith,prof1@uni.edu,EMP001,\n';
      filename = 'saras_teacher_import_template.csv';
    }
    const blob = new Blob([headers], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="mb-16">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={() => setIsOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`h-80 rounded-[48px] border-4 border-dashed mb-6 flex flex-col items-center justify-center transition-all cursor-pointer group ${
          isOver ? 'bg-primary/20 border-primary shadow-2xl shadow-primary/20 scale-[0.98]' : 'bg-slate-50 border-slate-100 hover:border-primary/20 shadow-inner'
        }`}
      >
        <input 
          type="file" 
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 transition-all ${
          isOver ? 'bg-white shadow-xl text-primary' : 'bg-white shadow-sm text-slate-300 group-hover:text-primary group-hover:scale-110'
        }`}>
          <span className="material-symbols-outlined text-4xl">upload_file</span>
        </div>
        <h3 className={`text-xl font-black mb-2 transition-colors ${isOver ? 'text-primary' : 'text-on-surface'}`}>
          Ready for Processing
        </h3>
        <p className="text-sm font-medium text-slate-400">Drag and drop your spreadsheet or <span className="text-primary underline underline-offset-4 cursor-pointer font-bold">select file</span></p>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-6 opacity-60 italic">Only .csv files supported</p>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={() => downloadTemplate('student')} className="text-xs font-bold text-slate-400 hover:text-primary bg-slate-50 px-4 py-2 rounded-xl transition-all">
          Download Student Template
        </button>
        <button onClick={() => downloadTemplate('teacher')} className="text-xs font-bold text-slate-400 hover:text-primary bg-slate-50 px-4 py-2 rounded-xl transition-all">
          Download Teacher Template
        </button>
      </div>
    </div>
  );
};

export default DragDropArea;
