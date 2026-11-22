import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function JoinCoursePage() {
  const { code } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/courses/code/${code}`);
        if (res.data.success) {
          setCourse(res.data.course);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid or expired course link.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [code]);

  const handleCreateGroupForCourse = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await api.post('/groups', {
        name: groupName,
        description: groupDesc,
        course_id: course.id
      });

      if (res.data.success) {
        navigate('/groups');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group for this course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-3 border-[#1c1917] border-t-[#E11D48] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#1c1917] shadow-[8px_8px_0px_0px_#1c1917]">
        
        {/* Course Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1c1917] text-white shadow-md mx-auto mb-2">
            <BookOpen className="w-7 h-7 text-[#E11D48]" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-xl bg-[#1c1917] text-white text-xs font-mono font-bold tracking-wider">
              {course?.course_code}
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1c1917] tracking-tight mt-2 uppercase">
            {course?.name}
          </h2>
          <p className="font-script text-lg text-stone-600">
            Taught by <strong className="text-stone-900">{course?.professor_name}</strong>
          </p>
          {course?.description && (
            <p className="text-xs text-stone-600 bg-[#FAF7F2] p-3 rounded-2xl border-2 border-[#1c1917] mt-3 font-medium">
              {course.description}
            </p>
          )}
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-[#E11D48] text-[#E11D48] text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Group Creation Form if student logged in */}
        {user ? (
          user.role === 'student' ? (
            <form onSubmit={handleCreateGroupForCourse} className="space-y-4 pt-2 border-t-2 border-stone-200">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Form Your Student Group for this Subject:
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Distributed Systems Lab Group 1"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Topic / Project Focus (Optional)
                </label>
                <textarea
                  rows={2}
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  placeholder="What will your group work on in this course?"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1c1917] hover:bg-[#E11D48] text-white font-display text-sm uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#E11D48] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Joining & Creating Group...' : 'Create Group in this Subject'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-600 text-amber-900 text-xs font-bold text-center">
              You are logged in as a Professor. Only students can form groups using this student invite link.
            </div>
          )
        ) : (
          <div className="space-y-4 pt-4 border-t-2 border-stone-200 text-center">
            <p className="text-xs text-stone-600 font-medium">
              You must sign in or register as a student to join this course and form your group.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl border-2 border-[#1c1917] text-stone-900 hover:bg-[#1c1917] hover:text-white transition-all shadow-xs"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-xs transition-all"
              >
                Register as Student
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
