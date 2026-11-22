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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        {/* Course Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 mb-2">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {course?.course_code}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {course?.name}
          </h2>
          <p className="text-xs text-slate-500">
            Taught by <strong className="text-slate-800">{course?.professor_name}</strong>
          </p>
          {course?.description && (
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-2">
              {course.description}
            </p>
          )}
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Group Creation Form if student logged in */}
        {user ? (
          user.role === 'student' ? (
            <form onSubmit={handleCreateGroupForCourse} className="space-y-4 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Form Your Student Group for this Subject:
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Distributed Systems Lab Group 1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Topic / Project Focus (Optional)
                </label>
                <textarea
                  rows={2}
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  placeholder="What will your group work on in this course?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Joining & Creating Group...' : 'Create Group in this Subject'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 text-amber-800 text-xs text-center">
              You are logged in as a Professor. Only students can form groups using this student invite link.
            </div>
          )
        ) : (
          <div className="space-y-4 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              You must sign in or register as a student to join this course and form your group.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
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
