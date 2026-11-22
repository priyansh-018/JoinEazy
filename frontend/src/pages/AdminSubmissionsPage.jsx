import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronLeft,
  FolderOpen,
  ShieldCheck,
  Check,
  X,
  Crown
} from 'lucide-react';

export default function AdminSubmissionsPage() {
  const { assignment_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/submissions/assignment/${assignment_id}`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError('Failed to fetch submission details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignment_id]);

  const handleVerifySubmission = async (submissionId, newStatus) => {
    try {
      const res = await api.put(`/submissions/${submissionId}/verify`, { status: newStatus });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        fetchSubmissions();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification update failed.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const assignment = data?.assignment;
  const submissions = data?.submissions || [];

  const totalGroups = submissions.length;
  const submittedGroups = submissions.filter(s => s.has_submitted).length;
  const completionRate = totalGroups > 0 ? Math.round((submittedGroups / totalGroups) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumb */}
      <div>
        <Link
          to="/admin/assignments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Assignments
        </Link>
      </div>

      {/* Assignment Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Submission Tracking & Verification
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {assignment?.title}
            </h1>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              {assignment?.description}
            </p>
          </div>

          <div className="flex sm:flex-col items-end gap-2 flex-shrink-0">
            <a
              href={assignment?.onedrive_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Open OneDrive Folder
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-xs text-slate-400">
              Due: {new Date(assignment?.due_date).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Aggregate Progress */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="text-xs font-bold text-slate-700">
            Overall Group Submissions: {submittedGroups} of {totalGroups} ({completionRate}%)
          </div>
          <div className="w-full sm:w-64">
            <ProgressBar value={completionRate} size="sm" color="emerald" showPercentage={false} />
          </div>
        </div>
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

      {/* Group-wise & Student-wise Breakdown List */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Group-Wise & Student-Wise Confirmation Roster
        </h2>

        {submissions.length > 0 ? (
          <div className="space-y-6">
            {submissions.map((item) => (
              <div
                key={item.group_id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden"
              >
                {/* Group Summary Header */}
                <div className="p-6 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{item.group_name}</h3>
                      {item.has_submitted ? (
                        <Badge
                          variant={item.submission_details?.status === 'verified' ? 'verified' : 'submitted'}
                          label={item.submission_details?.status === 'verified' ? 'Verified by Professor' : 'Confirmed Submitted'}
                        />
                      ) : (
                        <Badge variant="pending" label="Awaiting Submission" />
                      )}
                    </div>
                    {item.has_submitted && (
                      <div className="text-xs text-slate-500 mt-1">
                        Submitted by <strong className="text-slate-800">{item.submission_details?.submitted_by_name}</strong> on{' '}
                        {new Date(item.submission_details?.submitted_at).toLocaleString()}
                        {item.submission_details?.notes && (
                          <div className="mt-1 p-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-mono text-[11px]">
                            Notes: "{item.submission_details?.notes}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions & Verification */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-700">
                        {item.confirmed_members_count} of {item.total_members} Students Confirmed
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.confirmation_percentage}% Student Participation
                      </div>
                    </div>

                    {item.has_submitted && (
                      <div>
                        {item.submission_details?.status === 'verified' ? (
                          <button
                            onClick={() => handleVerifySubmission(item.submission_details.id, 'submitted')}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold"
                          >
                            Unmark Verified
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifySubmission(item.submission_details.id, 'verified')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Mark as Verified
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Individual Student Confirmations Table */}
                <div className="p-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Student-wise Confirmation Details:
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-xs">
                      <thead>
                        <tr className="text-left font-bold text-slate-500">
                          <th className="pb-3 pl-2">Student Name</th>
                          <th className="pb-3">Student ID</th>
                          <th className="pb-3">Role in Group</th>
                          <th className="pb-3 text-center">Step 1 Verification</th>
                          <th className="pb-3 text-center">Step 2 Final Confirmation</th>
                          <th className="pb-3 text-right pr-2">Confirmation Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {item.members.map((member) => (
                          <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2.5 pl-2 font-bold text-slate-900 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-[10px]">
                                {member.name.charAt(0)}
                              </div>
                              {member.name}
                            </td>
                            <td className="py-2.5 text-slate-500 font-mono">
                              {member.student_id || 'N/A'}
                            </td>
                            <td className="py-2.5">
                              {member.role === 'leader' ? (
                                <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-[11px]">
                                  <Crown className="w-3 h-3 text-amber-500" /> Leader
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[11px]">Member</span>
                              )}
                            </td>
                            <td className="py-2.5 text-center">
                              {member.has_confirmed ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <Check className="w-4 h-4" /> "Yes, Submitted"
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-slate-300">
                                  <X className="w-3.5 h-3.5" /> Unconfirmed
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 text-center">
                              {member.has_confirmed ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                  <Check className="w-4 h-4" /> Confirmed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-slate-300">
                                  <X className="w-3.5 h-3.5" /> Unconfirmed
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 text-right pr-2 text-slate-500">
                              {member.confirmed_at
                                ? new Date(member.confirmed_at).toLocaleString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-500 border border-slate-200">
            No groups eligible for this assignment.
          </div>
        )}
      </div>
    </div>
  );
}
