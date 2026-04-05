import React from 'react';

const uploadData = [
  {
    id: 1,
    name: "Final_Year_Project_Proposal_v2.pdf",
    type: "PDF",
    size: "1.2 MB",
    status: "Approved",
    date: "Oct 12, 2023",
    category: "Projects"
  },
  {
    id: 2,
    name: "Data_Structures_Assignment_3.docx",
    type: "DOCX",
    size: "840 KB",
    status: "Pending",
    date: "Oct 14, 2023",
    category: "Assignments"
  },
  {
    id: 3,
    name: "Lab_Report_Networking_Exp5.zip",
    type: "ZIP",
    size: "4.5 MB",
    status: "Approved",
    date: "Oct 08, 2023",
    category: "Lab Reports"
  },
  {
    id: 4,
    name: "Identity_Verification_Document.jpg",
    type: "JPG",
    size: "2.1 MB",
    status: "Rejected",
    date: "Oct 05, 2023",
    category: "Institutional"
  },
  {
    id: 5,
    name: "Seminar_Presentation_Draft.pptx",
    type: "PPTX",
    size: "3.8 MB",
    status: "Pending",
    date: "Oct 15, 2023",
    category: "Seminar"
  }
];

const UploadList = () => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-slate-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Name</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Date</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadData.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-xl">description</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface truncate max-w-[200px]">{doc.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{doc.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-semibold text-slate-500">{doc.category}</span>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-semibold text-slate-500">{doc.size}</span>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-semibold text-slate-500">{doc.date}</span>
                </td>
                <td className="px-8 py-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getStatusStyle(doc.status)}`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-error transition-colors shadow-sm">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadList;
