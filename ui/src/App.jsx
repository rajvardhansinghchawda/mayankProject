import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Assessment Hub Flow - Protected for students */}
          <Route path="/assessments/instructions/:id" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout><PreTestInstructions /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/assessments/active/:id" element={
            <ProtectedRoute allowedRoles={['student']}>
              <ActiveTest />
            </ProtectedRoute>
          } />
          <Route path="/assessments/submitted" element={
            <ProtectedRoute allowedRoles={['student']}>
              <TestSubmitted />
            </ProtectedRoute>
          } />

          {/* Student Dashboard & Core Pages */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student']}><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['student']}><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/tests" element={<ProtectedRoute allowedRoles={['student']}><Layout><Tests /></Layout></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}><Layout><Resources /></Layout></ProtectedRoute>} />
          <Route path="/uploads" element={<ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}><Layout><MyUploads /></Layout></ProtectedRoute>} />
          <Route path="/management" element={<ProtectedRoute allowedRoles={['admin']}><Layout><Management /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin']}><Layout><SystemSettings /></Layout></ProtectedRoute>} />
          
          {/* Teacher Module */}
          <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><Layout><TeacherDashboard /></Layout></ProtectedRoute>} />
          <Route path="/teacher/profile" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><Layout><TeacherProfile /></Layout></ProtectedRoute>} />
          <Route path="/teacher/resources" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><Layout><TeacherResources /></Layout></ProtectedRoute>} />
          
          {/* Results & Analytics */}
          <Route path="/results/student" element={<ProtectedRoute allowedRoles={['student']}><Layout><StudentResults /></Layout></ProtectedRoute>} />
          <Route path="/results/admin" element={<ProtectedRoute allowedRoles={['admin']}><Layout><AdminResults /></Layout></ProtectedRoute>} />

          {/* Administration Wizards */}
          <Route path="/admin/create-test" element={<ProtectedRoute allowedRoles={['admin']}><Layout><CreateTestWizard /></Layout></ProtectedRoute>} />
          <Route path="/admin/bulk-upload" element={<ProtectedRoute allowedRoles={['admin']}><Layout><BulkUserUploadWizard /></Layout></ProtectedRoute>} />
          <Route path="/admin/tests" element={<ProtectedRoute allowedRoles={['admin']}><Layout><TestManagement /></Layout></ProtectedRoute>} />
          <Route path="/admin/tests/create" element={<ProtectedRoute allowedRoles={['admin']}><Layout><CreateTest /></Layout></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><Layout><DepartmentManagement /></Layout></ProtectedRoute>} />
          <Route path="/admin/submissions" element={<ProtectedRoute allowedRoles={['admin']}><Layout><TestSubmissions /></Layout></ProtectedRoute>} />
          <Route path="/admin/submissions/:id" element={<ProtectedRoute allowedRoles={['admin']}><Layout><AttemptDetail /></Layout></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><Layout><UserManagement /></Layout></ProtectedRoute>} />
          <Route path="/admin/users/add" element={<ProtectedRoute allowedRoles={['admin']}><Layout><AddUser /></Layout></ProtectedRoute>} />
          <Route path="/admin/users/bulk-upload" element={<ProtectedRoute allowedRoles={['admin']}><Layout><BulkUserUpload /></Layout></ProtectedRoute>} />
          <Route path="/admin/moderation" element={<ProtectedRoute allowedRoles={['admin']}><Layout><ContentModeration /></Layout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><Layout><AdminProfile /></Layout></ProtectedRoute>} />
          
          {/* Utilities - Login required for all roles */}
          <Route path="/utilities/viewer" element={<ProtectedRoute><DocumentViewer /></ProtectedRoute>} />
          <Route path="/utilities/upload" element={<ProtectedRoute><Layout><UploadDocument /></Layout></ProtectedRoute>} />
          
          {/* System Pages - Public */}
          <Route path="/system/403" element={<AccessDenied />} />
          <Route path="/system/expired" element={<SessionExpired />} />
          <Route path="/system/force-password" element={<ForcePasswordChange />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
