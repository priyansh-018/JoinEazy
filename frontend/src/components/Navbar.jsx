import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  FileText,
  LayoutDashboard,
  LogOut,
  FolderKanban,
  GraduationCap,
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Switch demo account quickly
  const handleQuickSwitch = async (role) => {
    try {
      if (role === 'admin') {
        await login('admin@joineazy.com', 'admin123');
        navigate('/admin/dashboard');
      } else {
        await login('alex@joineazy.com', 'student123');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Quick switch failed:', err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Brand & Nav Links */}
          <div className="flex items-center space-x-8">
            <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                  Join<span className="text-indigo-600">Eazy</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 -mt-1">
                  Task Management
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            {user && (
              <div className="hidden md:flex space-x-1">
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isActive('/admin/dashboard')
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/assignments"
                      className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isActive('/admin/assignments')
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Assignments
                    </Link>
                    <Link
                      to="/admin/groups"
                      className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isActive('/admin/groups')
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Student Groups
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isActive('/dashboard')
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      My Progress
                    </Link>
                    <Link
                      to="/groups"
                      className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isActive('/groups')
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      My Groups
                    </Link>
                    <Link
                      to="/assignments"
                      className={`inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isActive('/assignments')
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Assignments
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right: Quick Role Switcher + User Info & Logout */}
          <div className="flex items-center space-x-3">
            {/* Demo Quick Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <span className="text-slate-400 px-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" /> Demo:
              </span>
              <button
                onClick={() => handleQuickSwitch('admin')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  isAdmin ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Professor Sarah Jenkins (Admin)"
              >
                Professor
              </button>
              <button
                onClick={() => handleQuickSwitch('student')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  !isAdmin ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Alex Rivera (Student)"
              >
                Student
              </button>
            </div>

            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                  <div className="text-[11px] font-medium text-slate-500">
                    {user.role === 'admin' ? (
                      <span className="text-indigo-600 font-semibold">Professor (Admin)</span>
                    ) : (
                      <span>Student {user.student_id ? `(${user.student_id})` : ''}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
