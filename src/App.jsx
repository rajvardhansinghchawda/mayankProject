import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Placeholders for other student pages
const Profile = () => <Layout><div className="max-w-7xl mx-auto p-10 text-center text-primary font-bold bg-white rounded-3xl shadow-sm">Profile Page Content coming soon...</div></Layout>;
const Tests = () => <Layout><div className="max-w-7xl mx-auto p-10 text-center text-primary font-bold bg-white rounded-3xl shadow-sm">Tests Page Content coming soon...</div></Layout>;
const Resources = () => <Layout><div className="max-w-7xl mx-auto p-10 text-center text-primary font-bold bg-white rounded-3xl shadow-sm">Resources Page Content coming soon...</div></Layout>;
const Uploads = () => <Layout><div className="max-w-7xl mx-auto p-10 text-center text-primary font-bold bg-white rounded-3xl shadow-sm">My Uploads Content coming soon...</div></Layout>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/uploads" element={<Uploads />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
