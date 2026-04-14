import React, { useState, useEffect } from 'react';
import TestsHeader from './components/TestsHeader';
import TestFilters from './components/TestFilters';
import TestGrid from './components/TestGrid';
import api from '../../services/api';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get('/assessments/tests/');
        const data = response.data?.results ?? response.data;
        setTests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch tests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <TestsHeader />
      <TestFilters />
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <TestGrid tests={tests} />
      )}
      
      {/* Test Guidelines / Footer Section */}
      <div className="mt-16 bg-surface-container-low rounded-2xl p-8 border border-white flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-3xl">gavel</span>
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-primary mb-1">Institutional Integrity & Exam Conduct</h4>
          <p className="text-sm text-on-surface-variant">All assessments are monitored via SARAS AI Proctoring. Ensure you have a stable connection and follow the specific instructions provided for each test module. Academic dishonesty will lead to immediate disqualification.</p>
        </div>
        <button
          onClick={() => {
            window.alert('Guidelines: keep camera on, avoid tab switching, and submit before timer expiry. Contact your faculty for full exam policy.');
          }}
          className="px-6 py-3 bg-white text-primary font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-sm flex items-center gap-2"
        >
          View All Guidelines
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </button>
      </div>
    </div>
  );
};

export default Tests;
