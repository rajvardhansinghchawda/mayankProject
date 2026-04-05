import React from 'react';

const TestProctoringSettings = () => {
  const settings = [
    { id: 'eye', label: 'AI Eye Tracking', desc: 'Monitor pupil movement and gaze direction.', icon: 'visibility' },
    { id: 'tab', label: 'Tab Lockdown', desc: 'Prevent browser tab switching during exam.', icon: 'tab_unselected' },
    { id: 'face', label: 'Face Verification', desc: 'Continuous identity authentication.', icon: 'face' },
    { id: 'noise', label: 'Noise Detection', desc: 'Flag suspicious audio environment.', icon: 'mic' },
    { id: 'multi', label: 'Multiple People Detection', desc: 'Identify if more than one person is present.', icon: 'group' },
    { id: 'record', label: 'Session Recording', desc: 'Full screen and camera recording.', icon: 'videocam' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {settings.map((s) => (
        <div key={s.id} className="p-8 rounded-[40px] bg-slate-50 border-2 border-slate-50 hover:border-primary/20 transition-all group flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-2xl">{s.icon}</span>
            </div>
            <div>
              <h4 className="text-lg font-black text-on-surface mb-2">{s.label}</h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">{s.desc}</p>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer mt-2">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestProctoringSettings;
