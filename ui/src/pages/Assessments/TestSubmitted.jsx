import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const TestSubmitted = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const testId = location.state?.testId;
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttemptDetails = async () => {
      if (!testId) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/assessments/tests/${testId}/attempt/`);
        setAttempt(response.data);
      } catch (err) {
        console.error("Failed to fetch attempt details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttemptDetails();
  }, [testId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[200] flex items-center justify-center font-body">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-surface-container-lowest z-[200] flex items-center justify-center p-8 font-body text-on-surface">
      <div className="max-w-xl w-full bg-white rounded-[48px] p-12 lg:p-20 shadow-[0_32px_128px_rgba(25,28,29,0.12)] border border-slate-50 text-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-green-500 text-white rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-500/20 rotate-12 scale-110">
            <span className="material-symbols-outlined text-5xl">task_alt</span>
          </div>

          <h1 className="text-4xl font-black text-on-surface mb-4 tracking-tight leading-tight">
            Assessment Successfully Submitted
          </h1>
          <p className="text-on-surface-variant font-medium mb-12 text-lg">
            Your attempt has been securely processed and logged in the institutional ledger.
          </p>

          <div className="bg-slate-50 rounded-3xl p-8 mb-12 border border-white">
            <div className="grid grid-cols-2 gap-8 text-left">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time Finished</p>
                <p className="text-base font-black text-on-surface">
                  {attempt?.submitted_at ? new Date(attempt.submitted_at).toLocaleTimeString() : 'Just Now'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Result Status</p>
                <p className="text-base font-black text-on-surface uppercase tracking-wider">
                  {attempt?.status === 'submitted' ? 'Processing' : attempt?.status}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Attempt ID</p>
                <p className="text-base font-black text-on-surface">#{attempt?.id?.substring(0, 8).toUpperCase() || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">System Status</p>
                <p className="text-base font-black text-green-600 flex items-center gap-1">
                  Verified
                  <span className="w-1 h-1 bg-green-600 rounded-full animate-ping"></span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/tests')}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Back to Test Dashboard
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-sm hover:bg-slate-200 active:scale-[0.98] transition-all"
            >
              Go to Homepage
            </button>
          </div>

          <p className="mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Institutional Honor Code Verified
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestSubmitted;
