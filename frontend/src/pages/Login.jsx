import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
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
            SIGN IN TO JOINEAZY
          </h2>
          <p className="font-script text-xl text-[#E11D48] -rotate-1">
            Access your courses, student groups, and coursework portal
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-[#E11D48] text-[#E11D48] text-xs font-bold">
            {error}
          </div>
        )}

        <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#1c1917] bg-white text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#1c1917] bg-white text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1c1917] hover:bg-[#E11D48] text-[#FAF7F2] font-display text-lg tracking-wider rounded-xl shadow-[4px_4px_0px_0px_#E11D48] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN NOW'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-600 pt-2 border-t border-stone-200">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-[#E11D48] hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}
