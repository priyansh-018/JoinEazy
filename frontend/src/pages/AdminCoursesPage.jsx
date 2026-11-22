import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  BookOpen,
  Plus,
  Copy,
  Check,
  Users,
  FileText,
  Trash2,
  ExternalLink,
  Share2,
  Sparkles,
  X,
  AlertCircle
} from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create course modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses/my');
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      setError('Failed to fetch your courses/subjects.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!name.trim() || !courseCode.trim()) return;

    try {
      const res = await api.post('/courses', {
        name,
        course_code: courseCode,
        description
      });

      if (res.data.success) {
        setSuccessMsg(`Subject/Course "${name}" created successfully!`);
        setShowModal(false);
        setName('');
        setCourseCode('');
        setDescription('');
        fetchCourses();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
    }
  };

  const handleDeleteCourse = async (id, courseName) => {
    if (!window.confirm(`Are you sure you want to delete course: "${courseName}"?`)) {
      return;
    }
    try {
      const res = await api.delete(`/courses/${id}`);
      if (res.data.success) {
        setSuccessMsg('Course deleted successfully.');
        fetchCourses();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  const copyInviteLink = (joinCode) => {
    const inviteUrl = `${window.location.origin}/courses/join/${joinCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedCode(joinCode);
    setSuccessMsg(`Invite link copied to clipboard: ${inviteUrl}`);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Professor Subject & Course Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Courses & Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create courses, share unique invite links with students to form groups, and keep each subject's groups organized.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Course / Subject
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold ml-2">Dismiss</button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex justify-between items-center">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="font-bold ml-2">Dismiss</button>
        </div>
      )}

      {/* Courses List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                    {course.course_code}
                  </span>
                  <button
                    onClick={() => handleDeleteCourse(course.id, course.name)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                    title="Delete course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                    {course.name}
                  </h3>
                  {course.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  )}
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Enrolled Groups</span>
                      <span className="font-extrabold text-slate-800">{course.group_count || 0}</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Assignments</span>
                      <span className="font-extrabold text-slate-800">{course.assignment_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shareable Invite Box */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                  <span>Student Group Invite Link:</span>
                  <span className="font-mono text-indigo-600">{course.join_code}</span>
                </div>

                <button
                  onClick={() => copyInviteLink(course.join_code)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                >
                  {copiedCode === course.join_code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      Copy Shareable Invite Link
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300 max-w-lg mx-auto space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No courses created yet</h3>
          <p className="text-xs text-slate-500">
            Create your subjects/courses (e.g. "CS401 - Cloud Computing") to generate shareable invite links for your students.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md transition-colors"
          >
            Create Your First Course
          </button>
        </div>
      )}

      {/* Modal: Create Course */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Create New Course / Subject</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Course / Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Systems & Cloud Computing"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Course / Subject Code
                </label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CS401"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description / Syllabus Outline (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief course objectives..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Create Subject & Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
