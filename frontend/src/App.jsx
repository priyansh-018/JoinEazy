import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SupportProvider, useSupport } from './context/SupportContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SupportModal from './components/SupportModal';
import { HelpCircle } from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import GroupsPage from './pages/GroupsPage';
import AssignmentsPage from './pages/AssignmentsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminAssignmentsPage from './pages/AdminAssignmentsPage';
import AdminSubmissionsPage from './pages/AdminSubmissionsPage';
import AdminGroupsPage from './pages/AdminGroupsPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import JoinCoursePage from './pages/JoinCoursePage';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
}

function GlobalSupportWidget() {
  const { isSupportOpen, openSupport, closeSupport } = useSupport();
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openSupport}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1c1917] hover:bg-[#E11D48] text-[#FAF7F2] font-display text-sm tracking-wider shadow-[4px_4px_0px_0px_#E11D48] border-2 border-[#1c1917] cursor-pointer transition-all hover:scale-105 active:scale-95"
          title="Direct Support - priyansh191882@gmail.com"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>NEED HELP?</span>
        </button>
      </div>
      <SupportModal isOpen={isSupportOpen} onClose={closeSupport} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SupportProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1c1917] paper-grain font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses/join" element={<JoinCoursePage />} />
                <Route path="/courses/join/:code" element={<JoinCoursePage />} />

                {/* Student Routes */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                  <Route path="/dashboard" element={<StudentDashboard />} />
                  <Route path="/groups" element={<GroupsPage />} />
                  <Route path="/assignments" element={<AssignmentsPage />} />
                </Route>

                {/* Admin (Professor) Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/courses" element={<AdminCoursesPage />} />
                  <Route path="/admin/assignments" element={<AdminAssignmentsPage />} />
                  <Route path="/admin/assignments/:assignment_id/submissions" element={<AdminSubmissionsPage />} />
                  <Route path="/admin/groups" element={<AdminGroupsPage />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<RootRedirect />} />
              </Routes>
            </main>
            <GlobalSupportWidget />
          </div>
        </BrowserRouter>
      </SupportProvider>
    </AuthProvider>
  );
}
