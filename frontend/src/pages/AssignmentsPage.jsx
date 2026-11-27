import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TwoStepConfirmModal from '../components/TwoStepConfirmModal';
import Badge from '../components/Badge';
import {
  FileText,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderOpen,
  UserCheck,
  Search,
  Users,
  Sparkles,
  BookOpen,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCourseId = searchParams.get('courseId');

  const [assignments, setAssignments] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter state
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'submitted', 'overdue'
  const [searchQuery, setSearchQuery] = useState('');

  // Two-step modal
  const [activeAssignmentForSubmission, setActiveAssignmentForSubmission] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      const [assignRes, groupsRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/groups/my')
      ]);

      if (assignRes.data.success) {
        setAssignments(assignRes.data.assignments);
      }
      if (groupsRes.data.success) {
        setUserGroups(groupsRes.data.groups);
      }
    } catch (err) {
      setError('Failed to load assignments.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleTwoStepSubmit = async (submissionPayload) => {
    try {
      setIsSubmitting(true);
      const res = await api.post('/submissions/two-step-confirm', submissionPayload);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setActiveAssignmentForSubmission(null);
        fetchAssignments();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission confirmation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePeerConfirm = async (submissionId) => {
    try {
      const res = await api.post('/submissions/peer-confirm', { submission_id: submissionId });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        fetchAssignments();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record student confirmation.');
    }
  };

  // Filter logic (supports Course filter from Student Dashboard click)
  const filteredAssignments = assignments.filter((a) => {
    if (selectedCourseId && String(a.course_id) !== String(selectedCourseId)) {
      return false;
    }
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.course_name && a.course_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (a.course_code && a.course_code.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (filter === 'submitted') return a.submission_status === 'submitted' || a.submission_status === 'verified';
    if (filter === 'pending') return a.submission_status === 'not_submitted' && !a.is_overdue;
    if (filter === 'overdue') return a.is_overdue;
    return true;
  });

  const selectedCourse = assignments.find(a => String(a.course_id) === String(selectedCourseId));
  const selectedCourseLabel = selectedCourse
    ? `${selectedCourse.course_code || ''} ${selectedCourse.course_name || ''}`.trim()
    : `Course #${selectedCourseId}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#1c1917] text-[#FAF7F2] border-2 border-[#1c1917] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#E11D48] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-stone-300 mb-3">
            <FileText className="w-3.5 h-3.5 text-[#E11D48]" />
            Student Coursework &amp; Submissions
          </div>
          <h1 className="font-display text-3xl sm:text-5xl tracking-wide text-white">
            ASSIGNMENTS &amp; SUBMISSIONS
          </h1>
          <p className="font-script text-xl text-stone-300 mt-1 max-w-xl">
            Access OneDrive folders, review project briefs, and execute two-step submission verification.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-2xl border-2 border-white/20">
          {['all', 'pending', 'submitted', 'overdue'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl capitalize text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === f
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search coursework by title or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#1c1917] bg-white text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
        />
      </div>

      {/* Course Filter Pill / Active Indicator (Task 2 Requirement) */}
      {selectedCourseId && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border-2 border-[#E11D48] text-xs font-bold text-[#1c1917] shadow-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#E11D48]" />
            <span>
              Filtered by Course: <span className="text-[#E11D48] underline">{selectedCourseLabel}</span>
            </span>
          </div>
          <button
            onClick={() => {
              searchParams.delete('courseId');
              setSearchParams(searchParams);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#1c1917] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#E11D48] transition-colors cursor-pointer"
          >
            Clear Filter ✕
          </button>
        </div>
      )}

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

      {/* Assignments List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#1c1917] border-t-[#E11D48] rounded-full animate-spin"></div>
        </div>
      ) : filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map((assign) => (
            <div
              key={assign.id}
              className="bg-white rounded-3xl p-6 border-2 border-[#1c1917] shadow-[5px_5px_0px_0px_#1c1917] hover:shadow-[7px_7px_0px_0px_#1c1917] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {assign.course_code && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#FAF7F2] border-2 border-[#1c1917] text-[#1c1917] font-mono text-[11px] font-bold">
                        {assign.course_code}
                      </span>
                    )}
                    <h3 className="font-display text-2xl text-[#1c1917] tracking-tight">
                      {assign.title}
                    </h3>
                    {assign.submission_status === 'submitted' || assign.submission_status === 'verified' ? (
                      <Badge variant="submitted" label="Group Submitted" />
                    ) : assign.is_overdue ? (
                      <Badge variant="overdue" label="Past Due" />
                    ) : (
                      <Badge variant="pending" label="Pending Submission" />
                    )}
                    {assign.submission_type === 'individual' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-900 border-2 border-blue-800">
                        <UserCheck className="w-3 h-3" /> Individual Submission
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border-2 border-amber-800">
                        <Users className="w-3 h-3" /> Group Submission
                      </span>
                    )}
                    {assign.target_type === 'specific_groups' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-900 border-2 border-purple-800">
                        <Users className="w-3 h-3" /> Specific Groups
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-3xl font-medium">
                    {assign.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-end gap-1 flex-shrink-0 text-right">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700">
                    <Calendar className="w-3.5 h-3.5 text-[#E11D48]" />
                    Due: {new Date(assign.due_date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <span className="text-[11px] font-bold text-stone-500">
                    Prof. {assign.professor_name || 'Faculty Member'}
                  </span>
                </div>
              </div>

              {/* Action Ribbon & OneDrive Link */}
              <div className="pt-4 border-t-2 border-stone-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <a
                    href={assign.onedrive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#1c1917] hover:text-white text-[#1c1917] border-2 border-[#1c1917] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <FolderOpen className="w-4 h-4 text-[#E11D48]" />
                    Open OneDrive Folder
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-70" />
                  </a>

                  {assign.submission && (
                    <div className="text-[11px] text-stone-600 hidden sm:block font-medium">
                      Submitted on {new Date(assign.submission.submitted_at).toLocaleDateString()} by{' '}
                      <strong className="text-stone-900">{assign.submission.submitted_by_name}</strong>
                    </div>
                  )}
                </div>

                {/* Submission CTA buttons */}
                <div className="flex items-center gap-2">
                  {assign.submission_status === 'submitted' || assign.submission_status === 'verified' ? (
                    <div className="flex items-center gap-2">
                      {assign.my_confirmation ? (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border-2 border-emerald-600 shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          You Confirmed Submission
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePeerConfirm(assign.submission.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#1c1917] hover:text-white border-2 border-[#1c1917] text-stone-900 text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4 text-[#E11D48]" />
                          Confirm My Participation
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveAssignmentForSubmission(assign)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1c1917] hover:bg-[#E11D48] text-white font-display text-xs uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#E11D48] transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Two-Step Submission Confirmation
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-[#1c1917] max-w-lg mx-auto space-y-3 shadow-[4px_4px_0px_0px_#1c1917]">
          <FileText className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-display text-2xl text-[#1c1917]">NO ASSIGNMENTS FOUND</h3>
          <p className="text-xs text-stone-600 font-medium">
            Check your search terms or switch the filter to view all assignments.
          </p>
        </div>
      )}

      {/* Two-Step Verification Modal */}
      <TwoStepConfirmModal
        isOpen={Boolean(activeAssignmentForSubmission)}
        onClose={() => setActiveAssignmentForSubmission(null)}
        assignment={activeAssignmentForSubmission}
        groups={userGroups}
        onSubmit={handleTwoStepSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
