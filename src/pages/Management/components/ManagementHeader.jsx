import { Link } from 'react-router-dom';

const ManagementHeader = () => {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Institutional Management</h1>
        <p className="text-on-surface-variant font-medium">Control user access, departmental configurations, and system-wide settings.</p>
      </div>
      
      <div className="flex gap-4">
        <Link 
          to="/admin/bulk-upload"
          className="bg-white text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm border border-slate-100 hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">upload_file</span>
          Bulk Import
        </Link>
        <Link 
          to="/admin/create-test"
          className="bg-primary text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Create Test
        </Link>
      </div>
    </div>
  );
};

export default ManagementHeader;
