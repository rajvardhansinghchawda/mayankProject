import React from 'react';

const QuickActionItem = ({ icon, label, color, bgColor, textColor }) => (
  <button className="group flex items-center justify-between p-6 bg-surface-container-lowest rounded-full shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/10">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${bgColor} ${textColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <span className="material-symbols-outlined" id={`${label.toLowerCase().replace(/\s/g, '-')}-icon`}>{icon}</span>
      </div>
      <span className="font-bold text-primary">{label}</span>
    </div>
    <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform" id={`${label.toLowerCase().replace(/\s/g, '-')}-chevron`}>chevron_right</span>
  </button>
);

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <QuickActionItem 
        icon="search" 
        label="Browse Resources" 
        bgColor="bg-secondary-container" 
        textColor="text-on-secondary-container" 
      />
      <QuickActionItem 
        icon="edit_note" 
        label="Take a Test" 
        bgColor="bg-tertiary-fixed" 
        textColor="text-on-tertiary-fixed-variant" 
      />
      <QuickActionItem 
        icon="upload_file" 
        label="Upload Document" 
        bgColor="bg-primary-fixed" 
        textColor="text-on-primary-fixed-variant" 
      />
    </div>
  );
};

export default QuickActions;
