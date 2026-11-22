import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import GroupsPage from './pages/GroupsPage';
import AssignmentsPage from './pages/AssignmentsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminAssignmentsPage from './pages/AdminAssignmentsPage';
import AdminSubmissionsPage from './pages/AdminSubmissionsPage';
import AdminGroupsPage from './pages/AdminGroupsPage';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/assignments" element={<AssignmentsPage />} />
              </Route>

              {/* Admin (Professor) Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/assignments" element={<AdminAssignmentsPage />} />
                <Route path="/admin/assignments/:assignment_id/submissions" element={<AdminSubmissionsPage />} />
                <Route path="/admin/groups" element={<AdminGroupsPage />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
