import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherStats from './components/TeacherStats';
import ActiveAssessments from './components/ActiveAssessments';
import EvaluationQueue from './components/EvaluationQueue';
import userService from '../../services/userService';
import assessmentService from '../../services/assessmentService';
import documentService from '../../services/documentService';
import CreateAssessmentModal from './components/CreateAssessmentModal';

const TeacherDashboard = () => {
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeStudents: 0,
    totalResources: 0,
    pendingReviews: 0
  });
  const [latestAssessmentId, setLatestAssessmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [sectionsResp, testsResp, docsResp] = await Promise.all([
        userService.getSections({ mine: 'true' }),
        assessmentService.getTests({ status: 'published' }),
        documentService.getMyDocuments()
      ]);

      const sections = sectionsResp.data || (Array.isArray(sectionsResp) ? sectionsResp : []);
      const tests = testsResp.data?.results || testsResp.data || (Array.isArray(testsResp) ? testsResp : []);
      const docs = docsResp.data || (Array.isArray(docsResp) ? docsResp : []);

      // Find the most recent published test for the header button
      if (tests.length > 0) {
        setLatestAssessmentId(tests[0].id);
      }

      // Calculate real statistics from the fetched data
      const studentCount = sections.reduce((acc, s) => acc + (s.student_count || 0), 0);
      
      setStats({
        totalBatches: sections.length,
        activeStudents: studentCount || 0,
        totalResources: docs.length,
        pendingReviews: docs.filter(d => d.status === 'pending').length
      });


    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 font-body">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Faculty Command Center</h1>
          <p className="text-on-surface-variant font-medium text-lg">Monitoring academic performance across your assigned modules.</p>
        </div>
        <div className="flex bg-surface-container-high p-4 rounded-[32px] shadow-sm gap-4">
          <button 
            onClick={() => setIsAssessmentModalOpen(true)}
            className="px-8 py-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 text-sm font-black transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span>
            New Assessment
          </button>
          <button 
            onClick={() => latestAssessmentId && navigate(`/teacher/test/${latestAssessmentId}/analytics`)}
            disabled={!latestAssessmentId}
            className={`px-8 py-4 rounded-2xl bg-white text-primary text-sm font-black transition-all border border-slate-100 ${!latestAssessmentId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
          >
            Batch Analytics
          </button>
        </div>
      </div>

      <TeacherStats stats={stats} />
      <ActiveAssessments key={refreshKey} />
      <EvaluationQueue />
      
      <CreateAssessmentModal 
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        onSuccess={handleAssessmentCreated}
      />
      
      <div className="mt-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
        SARAS Institutional Engine • Batch 2023-27 • Faculty Portal
      </div>
    </div>
  );
};

export default TeacherDashboard;


