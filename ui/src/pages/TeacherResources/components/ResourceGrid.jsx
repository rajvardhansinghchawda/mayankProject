import React, { useState, useEffect } from 'react';
import documentService from '../../../services/documentService';

const ResourceGrid = ({ refreshKey }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, [refreshKey]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      // Get documents uploaded by the user or relevant to them
      const resp = await documentService.getDocuments();
      const data = resp.data?.results || resp.data || resp;
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch resources', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await documentService.deleteDocument(id);
        fetchResources();
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center p-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">folder_off</span>
        <p className="text-slate-400 font-bold">No resources found. Upload your first material!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {resources.map((res, i) => (
        <div key={res.id || i} className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 transition-all hover:shadow-xl hover:-translate-y-1 duration-500 group">
          <div className="flex justify-between items-start mb-8">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${
              res.document_type === 'notes' ? 'text-blue-600 bg-blue-50' : 
              res.document_type === 'reference_books' ? 'text-purple-600 bg-purple-50' : 'text-amber-600 bg-amber-50'
            }`}>
              <span className="material-symbols-outlined text-3xl">
                {res.document_type === 'notes' ? 'book' : res.document_type === 'reference_books' ? 'menu_book' : 'article'}
              </span>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <button 
                onClick={() => handleDelete(res.id)}
                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
          
          <h4 className="text-xl font-black text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-1">{res.title}</h4>
          <div className="flex flex-wrap gap-2 mb-8">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 inline-block px-3 py-1 rounded-lg">
              {res.subject || 'General'}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 inline-block px-3 py-1 rounded-lg">
              {res.section_name || 'All Sections'}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-8 border-t border-slate-50">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="material-symbols-outlined text-sm">visibility</span>
              {res.view_count || 0} views
            </div>
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              {res.status === 'published' ? 'Live' : 'Pending Review'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceGrid;

