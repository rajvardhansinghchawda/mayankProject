import React from 'react';

const ResourceItem = ({ icon, title, meta, actionIcon }) => (
  <li className="flex items-center justify-between p-3 border-b border-outline-variant/10">
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-primary-fixed-dim" id={`${title.toLowerCase().replace(/\s/g, '-')}-icon`}>{icon}</span>
      <div>
        <p className="text-sm font-bold text-on-surface">{title}</p>
        <p className="text-[10px] text-slate-400">{meta}</p>
      </div>
    </div>
    <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors" id={`${title.toLowerCase().replace(/\s/g, '-')}-action`}>{actionIcon}</button>
  </li>
);

const RecentResources = () => {
  return (
    <section className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined" id="auto-stories-icon">auto_stories</span>
          Recent Resources
        </h2>
        <span className="bg-secondary-container text-on-secondary-container text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">New Content</span>
      </div>
      <ul className="space-y-4">
        <ResourceItem 
          icon="description" 
          title="Operating Systems: Kernel Architecture.pdf" 
          meta="Published: 2 hours ago by Dr. Sharma" 
          actionIcon="download"
        />
        <ResourceItem 
          icon="video_library" 
          title="Lecture 14: B+ Trees & Indexing" 
          meta="Published: Yesterday • Video Resource" 
          actionIcon="play_circle"
        />
        <ResourceItem 
          icon="folder_zip" 
          title="Lab Manual: Computer Networks Set A" 
          meta="Published: 2 days ago • Archive" 
          actionIcon="download"
        />
      </ul>
    </section>
  );
};

export default RecentResources;
