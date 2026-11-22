import React, { useState, useEffect } from 'react';
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
  Users
} from 'lucide-react';

export default function AssignmentsPage() {
  const { user } = useAuth();
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

  // Filter logic
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'submitted') return a.submission_status === 'submitted' || a.submission_status === 'verified';
    if (filter === 'pending') return a.submission_status === 'not_submitted' && !a.is_overdue;
    if (filter === 'overdue') return a.is_overdue;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assignments & Submissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access OneDrive links, review requirements, and verify submission status via 2-step verification.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['all', 'pending', 'submitted', 'overdue'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === f
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search assignments by title or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
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

      {/* Assignments List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map((assign) => (
            <div
              key={assign.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {assign.title}
                    </h3>
                    {assign.submission_status === 'submitted' || assign.submission_status === 'verified' ? (
                      <Badge variant="submitted" label="Group Submitted" />
                    ) : assign.is_overdue ? (
                      <Badge variant="overdue" label="Past Due" />
                    ) : (
                      <Badge variant="pending" label="Pending Submission" />
                    )}
                    {assign.target_type === 'specific_groups' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <Users className="w-3 h-3" /> Specific Groups
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {assign.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-end gap-1.5 flex-shrink-0 text-right">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Due: {new Date(assign.due_date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Prof. {assign.professor_name || 'Dr. Jenkins'}
                  </span>
                </div>
              </div>

              {/* Action Ribbon & OneDrive Link */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <a
                    href={assign.onedrive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                  >
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    Open OneDrive Folder
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  {assign.submission && (
                    <div className="text-[11px] text-slate-500 hidden sm:block">
                      Submitted on {new Date(assign.submission.submitted_at).toLocaleDateString()} by{' '}
                      <strong className="text-slate-700">{assign.submission.submitted_by_name}</strong>
                    </div>
                  )}
                </div>

                {/* Submission CTA buttons */}
                <div className="flex items-center gap-2">
                  {assign.submission_status === 'submitted' || assign.submission_status === 'verified' ? (
                    <div className="flex items-center gap-2">
                      {assign.my_confirmation ? (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          You Confirmed Submission
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePeerConfirm(assign.submission.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                        >
                          <UserCheck className="w-4 h-4" />
                          Confirm My Participation
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveAssignmentForSubmission(assign)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Two-Step Submission Confirmation
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300 max-w-lg mx-auto space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No assignments match your filter</h3>
          <p className="text-xs text-slate-500">
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
