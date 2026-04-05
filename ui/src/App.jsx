import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Tests from './pages/Tests';
import Resources from './pages/Resources';
import MyUploads from './pages/MyUploads';
import Management from './pages/Management';
import PreTestInstructions from './pages/Assessments/PreTestInstructions';
import ActiveTest from './pages/Assessments/ActiveTest';
import TestSubmitted from './pages/Assessments/TestSubmitted';
import StudentResults from './pages/Results/StudentResults';
import AdminResults from './pages/Results/AdminResults';
import CreateTestWizard from './pages/AdminWizards/CreateTestWizard';
import BulkUserUploadWizard from './pages/AdminWizards/BulkUserUpload';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherProfile from './pages/TeacherProfile';
import TeacherResources from './pages/TeacherResources';
import TestManagement from './pages/Admin/TestManagement';
import CreateTest from './pages/Admin/Tests/CreateTest';
import DepartmentManagement from './pages/Admin/Department';
import TestSubmissions from './pages/Admin/Submissions';
import AttemptDetail from './pages/Admin/Submissions/AttemptDetail';
import AddUser from './pages/Admin/Users/AddUser';
import UserManagement from './pages/Admin/Users';
import BulkUserUpload from './pages/Admin/Users/BulkUpload';
import ContentModeration from './pages/Admin/Moderation';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProfile from './pages/Admin/Profile';
import DocumentViewer from './pages/Utilities/DocumentViewer';
import UploadDocument from './pages/Utilities/UploadDocument';
import SystemSettings from './pages/Settings/SystemSettings';
import ForgotPassword from './pages/Login/ForgotPassword';
import NotFound from './pages/System/NotFound';
import AccessDenied from './pages/System/AccessDenied';
import SessionExpired from './pages/System/SessionExpired';
import ForcePasswordChange from './pages/System/ForcePasswordChange';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Assessment Hub Flow */}
        <Route path="/assessments/instructions" element={<Layout><PreTestInstructions /></Layout>} />
        <Route path="/assessments/active" element={<ActiveTest />} />
        <Route path="/assessments/submitted" element={<TestSubmitted />} />

        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/tests" element={<Layout><Tests /></Layout>} />
        <Route path="/resources" element={<Layout><Resources /></Layout>} />
        <Route path="/uploads" element={<Layout><MyUploads /></Layout>} />
        <Route path="/management" element={<Layout><Management /></Layout>} />
        <Route path="/settings" element={<Layout><SystemSettings /></Layout>} />
        
        {/* Teacher Module */}
        <Route path="/teacher/dashboard" element={<Layout><TeacherDashboard /></Layout>} />
        <Route path="/teacher/profile" element={<Layout><TeacherProfile /></Layout>} />
        <Route path="/teacher/resources" element={<Layout><TeacherResources /></Layout>} />
        
        {/* Results & Analytics */}
        <Route path="/results/student" element={<Layout><StudentResults /></Layout>} />
        <Route path="/results/admin" element={<Layout><AdminResults /></Layout>} />

        {/* Administration Wizards */}
        <Route path="/admin/create-test" element={<Layout><CreateTestWizard /></Layout>} />
        <Route path="/admin/bulk-upload" element={<Layout><BulkUserUploadWizard /></Layout>} />
        <Route path="/admin/tests" element={<Layout><TestManagement /></Layout>} />
        <Route path="/admin/tests/create" element={<Layout><CreateTest /></Layout>} />
        <Route path="/admin/departments" element={<Layout><DepartmentManagement /></Layout>} />
        <Route path="/admin/submissions" element={<Layout><TestSubmissions /></Layout>} />
        <Route path="/admin/submissions/:id" element={<Layout><AttemptDetail /></Layout>} />
        <Route path="/admin/users" element={<Layout><UserManagement /></Layout>} />
        <Route path="/admin/users/add" element={<Layout><AddUser /></Layout>} />
        <Route path="/admin/users/bulk-upload" element={<Layout><BulkUserUpload /></Layout>} />
        <Route path="/admin/moderation" element={<Layout><ContentModeration /></Layout>} />
        <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/admin/profile" element={<Layout><AdminProfile /></Layout>} />
        
        {/* Utilities */}
        <Route path="/utilities/viewer" element={<DocumentViewer />} />
        <Route path="/utilities/upload" element={<Layout><UploadDocument /></Layout>} />
        
        {/* System Pages */}
        <Route path="/system/403" element={<AccessDenied />} />
        <Route path="/system/expired" element={<SessionExpired />} />
        <Route path="/system/force-password" element={<ForcePasswordChange />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
