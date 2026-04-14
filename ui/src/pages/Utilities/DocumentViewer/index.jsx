import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../../services/api';

const DocumentViewer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('id');
  
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(100);

  const buildServeSrc = () => {
    if (!doc?.serve_url) return '';
    const isAbsolute = /^https?:\/\//i.test(doc.serve_url);
    const apiOrigin = String(api.defaults.baseURL || '').replace(/\/api\/?$/, '');
    const baseUrl = isAbsolute ? doc.serve_url : `${apiOrigin}${doc.serve_url}`;
    const suffix = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${suffix}embedded=true#toolbar=0&navpanes=0&scrollbar=1`;
  };

  useEffect(() => {
    const fetchDoc = async () => {
      if (!documentId) {
        setError("No document ID provided.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/documents/${documentId}/`);
        setDoc(response.data.data);
      } catch (err) {
        console.error("Failed to load document", err);
        setError("Failed to load document content. Please verify your permissions.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [documentId]);

  // Privacy Protection: Disable right-click
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-red-400 mb-4">error</span>
        <h2 className="text-xl font-bold mb-2">{error || "Document not found"}</h2>
        <button onClick={() => navigate(-1)} className="bg-white/10 px-6 py-2 rounded-xl text-sm font-bold mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900 font-body text-white select-none">
      {/* Viewer Header */}
      <div className="h-20 bg-slate-800/50 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
          <div>
            <h1 className="text-sm font-black tracking-tight truncate max-w-[300px]">{doc.title}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {doc.subject || 'Institutional Resource'} • {doc.page_count} Pages • {new Date(doc.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-2xl border border-white/5">
          <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-all">
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
          <span className="text-[10px] font-black w-12 text-center">{zoom}%</span>
          <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => alert("Institutional Security Policy: Direct downloads are restricted. Contact administrator for authorized hard copies.")}
            className="bg-white/5 text-white/50 h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">lock</span>
            Protected
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Content Area - Using iframe for the PDF bytes */}
        <div className="flex-1 bg-slate-950 overflow-auto flex justify-center custom-scrollbar p-4 lg:p-12">
          <div 
            className="bg-white shadow-2xl transition-all duration-300 relative overflow-hidden"
            style={{ 
              width: `${zoom}%`,
              maxWidth: '1200px',
              height: 'fit-content',
              minHeight: '80vh'
            }}
          >
            {/* The Secure Iframe */}
            <iframe 
              src={buildServeSrc()}
              className="w-full h-[85vh] border-0"
              title="SARAS Secure Viewer"
              onContextMenu={(e) => e.preventDefault()}
            />
            
            {/* Transparent Protection Overlay - pointer-events-none allows scrolling while keeping a "glass" layer */}
            <div 
              className="absolute inset-0 z-10 cursor-default pointer-events-none" 
              style={{ background: 'transparent' }}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
