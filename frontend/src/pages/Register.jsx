import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, User, Hash, ArrowRight, ArrowLeft, ShieldCheck, BookOpen } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    student_id: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role,
      student_id: role === 'admin' ? '' : formData.student_id
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(formData);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1c1917] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Editorial Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none paper-grain opacity-60 z-0"></div>

      <div className="max-w-md w-full space-y-6 bg-white border-2 border-[#1c1917] p-8 sm:p-10 rounded-3xl shadow-[8px_8px_0px_0px_#1c1917] relative z-10">
        
        {/* Back to Home Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#E11D48] transition-colors mb-2 uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1c1917] text-[#FAF7F2] shadow-md mb-2 font-display text-2xl tracking-wider">
            JE
          </div>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-[#1c1917] leading-none">
            CREATE AN ACCOUNT
          </h2>
          <p className="font-script text-xl text-[#E11D48] -rotate-1">
            Join groups, collaborate on coursework, and submit assignments
          </p>
        </div>

        {/* Role Segmented Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 text-center">
            Register As:
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border-2 border-[#1c1917]">
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                formData.role === 'student'
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                formData.role === 'admin'
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Professor (Admin)
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-[#E11D48] text-[#E11D48] text-xs font-bold">
            {error}
          </div>
        )}

        <form className="space-y-3.5 pt-1" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Rivera"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#1c1917] bg-white text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@university.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#1c1917] bg-white text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
              />
            </div>
          </div>

          {formData.role === 'student' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                Student ID / Roll Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  placeholder="e.g. STU2024-001"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#1c1917] bg-white text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#1c1917] bg-white text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1c1917] hover:bg-[#E11D48] text-[#FAF7F2] font-display text-lg tracking-wider rounded-xl shadow-[4px_4px_0px_0px_#E11D48] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'REGISTERING...' : 'CREATE ACCOUNT NOW'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-600 pt-2 border-t border-stone-200">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#E11D48] hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
