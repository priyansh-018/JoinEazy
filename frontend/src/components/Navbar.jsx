import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  FileText,
  LayoutDashboard,
  LogOut,
  GraduationCap,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Don't render top navbar on Landing page (LandingPage has its own dedicated floating nav)
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-[#FAF7F2] border-b-2 border-[#1c1917] sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 py-2">
          
          {/* Left: Brand & Nav Links */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#1c1917] group-hover:bg-[#E11D48] flex items-center justify-center text-[#FAF7F2] font-display text-xl transition-colors shadow-sm">
                JE
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl tracking-wider text-[#1c1917]">
                  JOINEAZY
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-stone-500 -mt-1">
                  {isAdmin ? 'PROFESSOR PORTAL' : 'STUDENT WORKSPACE'}
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            {user && (
              <div className="hidden md:flex space-x-1.5">
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive('/admin/dashboard')
                          ? 'bg-[#1c1917] text-white shadow-xs'
                          : 'text-stone-700 hover:text-[#1c1917] hover:bg-white border border-transparent hover:border-stone-300'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/courses"
                      className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive('/admin/courses')
                          ? 'bg-[#1c1917] text-white shadow-xs'
                          : 'text-stone-700 hover:text-[#1c1917] hover:bg-white border border-transparent hover:border-stone-300'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                      Subjects &amp; Courses
                    </Link>
                    <Link
                      to="/admin/assignments"
                      className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive('/admin/assignments')
                          ? 'bg-[#1c1917] text-white shadow-xs'
                          : 'text-stone-700 hover:text-[#1c1917] hover:bg-white border border-transparent hover:border-stone-300'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5" />
                      Assignments
                    </Link>
                    <Link
                      to="/admin/groups"
                      className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive('/admin/groups')
                          ? 'bg-[#1c1917] text-white shadow-xs'
                          : 'text-stone-700 hover:text-[#1c1917] hover:bg-white border border-transparent hover:border-stone-300'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      Student Groups
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive('/dashboard')
                          ? 'bg-[#1c1917] text-white shadow-xs'
                          : 'text-stone-700 hover:text-[#1c1917] hover:bg-white border border-transparent hover:border-stone-300'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                      Overview
                    </Link>
                    <Link
                      to="/groups"
                      className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive('/groups')
                          ? 'bg-[#1c1917] text-white shadow-xs'
                          : 'text-stone-700 hover:text-[#1c1917] hover:bg-white border border-transparent hover:border-stone-300'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      My Groups
                    </Link>
                    <Link
                      to="/assignments"
                      className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive('/assignments')
                          ? 'bg-[#1c1917] text-white shadow-xs'
                          : 'text-stone-700 hover:text-[#1c1917] hover:bg-white border border-transparent hover:border-stone-300'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5" />
                      Coursework
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right: User Profile & Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-extrabold text-[#1c1917]">{user.name}</div>
                  <div className="text-[10px] font-mono uppercase text-stone-500 font-semibold">
                    {user.role === 'admin' ? 'PROFESSOR' : (user.student_id || 'STUDENT')}
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-white border-2 border-[#1c1917] text-[#1c1917] flex items-center justify-center font-display text-sm font-bold shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-stone-500 hover:text-[#E11D48] hover:bg-white rounded-xl border border-transparent hover:border-stone-300 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-[#1c1917]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#E11D48] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs"
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
