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
      setError('');
      const res = await api.get('/courses/my');
      if (res.data.success) {
        setCourses(res.data.courses || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your courses/subjects.');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Page Header Banner */}
      <div className="bg-[#1c1917] text-[#FAF7F2] border-2 border-[#1c1917] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#E11D48] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-stone-300 mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#E11D48]" />
            Professor Subject &amp; Course Management
          </div>
          <h1 className="font-display text-3xl sm:text-5xl tracking-wide text-white">
            MY COURSES &amp; SUBJECTS
          </h1>
          <p className="font-script text-xl text-stone-300 mt-1 max-w-xl">
            Create subjects, generate unique invite links for student groups, and keep classes organized.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-[#E11D48] hover:bg-[#BE123C] text-white font-display text-base uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#FAF7F2] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course / Subject</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-[#E11D48] text-[#E11D48] text-xs font-bold flex justify-between items-center shadow-xs">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold ml-2 underline cursor-pointer">Dismiss</button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-600 text-emerald-800 text-xs font-bold flex justify-between items-center shadow-xs">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="font-bold ml-2 underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Courses List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#1c1917] border-t-[#E11D48] rounded-full animate-spin"></div>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl p-6 border-2 border-[#1c1917] shadow-[5px_5px_0px_0px_#1c1917] hover:shadow-[7px_7px_0px_0px_#1c1917] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-3 py-1 rounded-xl bg-[#1c1917] text-white text-xs font-mono font-bold tracking-wider">
                    {course.course_code}
                  </span>
                  <button
                    onClick={() => handleDeleteCourse(course.id, course.name)}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                    title="Delete course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-display text-2xl text-[#1c1917] tracking-tight leading-snug">
                    {course.name}
                  </h3>
                  {course.description && (
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2 font-medium">
                      {course.description}
                    </p>
                  )}
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-stone-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#E11D48]" />
                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase font-bold">Enrolled Groups</span>
                      <span className="font-display text-2xl text-stone-900">{course.group_count || 0}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-stone-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase font-bold">Assignments</span>
                      <span className="font-display text-2xl text-stone-900">{course.assignment_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shareable Invite Box */}
              <div className="pt-3 border-t-2 border-stone-200 space-y-2">
                <div className="text-[11px] font-bold text-stone-700 flex items-center justify-between">
                  <span className="uppercase tracking-wider">Student Group Invite Link:</span>
                  <span className="font-mono font-bold text-[#E11D48]">{course.join_code}</span>
                </div>

                <button
                  onClick={() => copyInviteLink(course.join_code)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 border-[#1c1917] bg-[#FAF7F2] hover:bg-[#1c1917] hover:text-white text-[#1c1917] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  {copiedCode === course.join_code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Link Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-[#E11D48]" />
                      Copy Shareable Invite Link
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-[#1c1917] max-w-lg mx-auto space-y-4 shadow-[4px_4px_0px_0px_#1c1917]">
          <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-display text-2xl text-[#1c1917]">NO COURSES CREATED YET</h3>
          <p className="text-xs text-stone-600 font-medium max-w-sm mx-auto">
            Create your subjects/courses (e.g. "CS401 - Cloud Computing") to generate shareable invite links for your students.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-[#1c1917] hover:bg-[#E11D48] text-white font-display text-sm uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
          >
            Create Your First Course
          </button>
        </div>
      )}

      {/* Modal: Create Course */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-[8px_8px_0px_0px_#1c1917] border-2 border-[#1c1917] animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#1c1917] pb-3">
              <h3 className="font-display text-2xl text-[#1c1917]">CREATE NEW COURSE</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Course / Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Systems & Cloud Computing"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Course / Subject Code
                </label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CS401"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-sm uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Description / Syllabus Outline (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief course objectives..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t-2 border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1c1917] hover:bg-[#E11D48] text-white font-display text-sm uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#E11D48] transition-all cursor-pointer"
                >
                  Create &amp; Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
