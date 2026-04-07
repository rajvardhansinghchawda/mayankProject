import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import DashboardWelcome from './components/DashboardWelcome';
import QuickActions from './components/QuickActions';
import ActiveTests from './components/ActiveTests';
import SystemAlerts from './components/SystemAlerts';
import RecentResources from './components/RecentResources';
import MyUploads from './components/MyUploads';

const Dashboard = () => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState([]);
  const [resources, setResources] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uploadsRes, resourcesRes, testsRes] = await Promise.allSettled([
          api.get('/documents/my-uploads/'),
          api.get('/documents/'),
          api.get('/assessments/tests/'),
        ]);

        if (uploadsRes.status === 'fulfilled') {
          const data = uploadsRes.value.data?.results || uploadsRes.value.data?.data || uploadsRes.value.data || [];
          setUploads(Array.isArray(data) ? data : []);
        }
        if (resourcesRes.status === 'fulfilled') {
          const data = resourcesRes.value.data?.results || resourcesRes.value.data?.data || resourcesRes.value.data || [];
          setResources(Array.isArray(data) ? data.slice(0, 5) : []);
        }
        if (testsRes.status === 'fulfilled') {
          const data = testsRes.value.data?.results || testsRes.value.data?.data || testsRes.value.data || [];
          setTests(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const publishedCount = uploads.filter(u => u.status === 'published').length;
  const draftCount = uploads.filter(u => u.status === 'draft').length;
  const activeTests = tests.filter(t => t.is_active || t.status === 'active');

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardWelcome user={user} />
      <QuickActions />
      
      <div className="grid grid-cols-12 gap-8">
        <ActiveTests tests={activeTests} loading={loading} />
        <SystemAlerts />
        <RecentResources resources={resources} loading={loading} />
        <MyUploads publishedCount={publishedCount} draftCount={draftCount} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
