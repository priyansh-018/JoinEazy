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
      setError('');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center font-sans">
        <div className="w-8 h-8 border-3 border-[#1c1917] border-t-[#E11D48] rounded-full animate-spin"></div>
      </div>
    );
  }

  const assignment = data?.assignment;
  const submissions = data?.submissions || [];

  const totalGroups = submissions.length;
  const submittedGroups = submissions.filter(s => s.has_submitted).length;
  const completionRate = totalGroups > 0 ? Math.round((submittedGroups / totalGroups) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Back button & Breadcrumb */}
      <div>
        <Link
          to="/admin/assignments"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-[#1c1917] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Assignments
        </Link>
      </div>

      {/* Assignment Header Card */}
      <div className="bg-[#1c1917] text-[#FAF7F2] border-2 border-[#1c1917] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#E11D48] space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-stone-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E11D48]" />
              Submission Tracking &amp; Verification
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-white tracking-wide uppercase">
              {assignment?.title}
            </h1>
            <p className="text-xs text-stone-300 max-w-3xl leading-relaxed font-medium">
              {assignment?.description}
            </p>
          </div>

          <div className="flex sm:flex-col items-end gap-2 flex-shrink-0">
            <a
              href={assignment?.onedrive_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-200 text-[#1c1917] text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
            >
              <FolderOpen className="w-4 h-4 text-[#E11D48]" />
              Open OneDrive Folder
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
            <span className="text-xs font-mono text-stone-300">
              Due: {new Date(assignment?.due_date).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Aggregate Progress */}
        <div className="pt-4 border-t-2 border-stone-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-300">
            Overall Group Submissions: <span className="text-white font-mono font-bold">{submittedGroups} of {totalGroups} ({completionRate}%)</span>
          </div>
          <div className="w-full sm:w-72">
            <ProgressBar value={completionRate} size="md" color="emerald" showPercentage={false} />
          </div>
        </div>
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

      {/* Group-wise & Student-wise Breakdown List */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-[#1c1917] tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-[#E11D48]" />
          GROUP-WISE &amp; STUDENT-WISE CONFIRMATION ROSTER
        </h2>

        {submissions.length > 0 ? (
          <div className="space-y-6">
            {submissions.map((item) => (
              <div
                key={item.group_id}
                className="bg-white rounded-3xl border-2 border-[#1c1917] shadow-[5px_5px_0px_0px_#1c1917] overflow-hidden space-y-0"
              >
                {/* Group Summary Header */}
                <div className="p-6 bg-[#FAF7F2] border-b-2 border-[#1c1917] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-display text-2xl text-[#1c1917]">{item.group_name}</h3>
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
                      <div className="text-xs text-stone-600 mt-1 font-medium">
                        Submitted by <strong className="text-stone-900">{item.submission_details?.submitted_by_name}</strong> on{' '}
                        {new Date(item.submission_details?.submitted_at).toLocaleString()}
                        {item.submission_details?.notes && (
                          <div className="mt-2 p-3 rounded-xl bg-white border-2 border-[#1c1917] text-stone-800 font-mono text-[11px]">
                            Notes: "{item.submission_details?.notes}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions & Verification */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold uppercase tracking-wider text-stone-800">
                        {item.confirmed_members_count} of {item.total_members} Students Confirmed
                      </div>
                      <div className="text-[11px] font-bold text-stone-500">
                        {item.confirmation_percentage}% Student Participation
                      </div>
                    </div>

                    {item.has_submitted && (
                      <div>
                        {item.submission_details?.status === 'verified' ? (
                          <button
                            onClick={() => handleVerifySubmission(item.submission_details.id, 'submitted')}
                            className="px-3 py-2 rounded-xl border-2 border-[#1c1917] hover:bg-stone-100 text-stone-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Unmark Verified
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifySubmission(item.submission_details.id, 'verified')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1c1917] hover:bg-[#E11D48] text-white font-display text-xs uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#E11D48] transition-all cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            Mark as Verified
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Individual Student Confirmations Table */}
                <div className="p-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                    Student-wise Confirmation Details:
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y-2 divide-stone-200 text-xs">
                      <thead>
                        <tr className="text-left font-display uppercase tracking-wider text-stone-800">
                          <th className="pb-3 pl-2">Student Name</th>
                          <th className="pb-3">Student ID</th>
                          <th className="pb-3">Role in Group</th>
                          <th className="pb-3 text-center">Step 1 Verification</th>
                          <th className="pb-3 text-center">Step 2 Confirmation</th>
                          <th className="pb-3 text-right pr-2">Confirmation Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {item.members.map((member) => (
                          <tr key={member.id} className="hover:bg-stone-50 transition-colors">
                            <td className="py-2.5 pl-2 font-bold text-stone-900 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-[#1c1917] text-white flex items-center justify-center font-display text-[10px]">
                                {member.name.charAt(0)}
                              </div>
                              {member.name}
                            </td>
                            <td className="py-2.5 text-stone-600 font-mono font-bold">
                              {member.student_id || 'N/A'}
                            </td>
                            <td className="py-2.5">
                              {member.role === 'leader' ? (
                                <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-[11px]">
                                  <Crown className="w-3 h-3 text-amber-500" /> Leader
                                </span>
                              ) : (
                                <span className="text-stone-500 text-[11px] font-medium">Member</span>
                              )}
                            </td>
                            <td className="py-2.5 text-center">
                              {member.has_confirmed ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                  <Check className="w-4 h-4 text-emerald-600" /> "Yes, Submitted"
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-stone-400">
                                  <X className="w-3.5 h-3.5" /> Unconfirmed
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 text-center">
                              {member.has_confirmed ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                  <Check className="w-4 h-4 text-emerald-600" /> Confirmed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-stone-400">
                                  <X className="w-3.5 h-3.5" /> Unconfirmed
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 text-right pr-2 text-stone-500 font-mono">
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
          <div className="bg-white rounded-3xl p-8 text-center text-xs text-stone-600 font-medium border-2 border-dashed border-[#1c1917] max-w-lg mx-auto shadow-xs">
            No groups eligible for this assignment.
          </div>
        )}
      </div>
    </div>
  );
}
