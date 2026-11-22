import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/admin');
      if (res.data.success) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      setError('Failed to fetch analytics data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Professor / Admin Management Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assignment & Group Progress Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor coursework completion, track student collaboration, and review OneDrive submission confirmations.
          </p>
        </div>

        <div className="flex gap-2.5">
          <Link
            to="/admin/assignments"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Assignment
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Assignments"
          value={analytics?.total_assignments || 0}
          subtitle="Coursework items posted"
          icon={FileText}
          color="indigo"
        />
        <StatsCard
          title="Student Groups"
          value={analytics?.total_groups || 0}
          subtitle="Active collaborative teams"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Registered Students"
          value={analytics?.total_students || 0}
          subtitle="Enrolled in system"
          icon={TrendingUp}
          color="emerald"
        />
        <StatsCard
          title="Confirmed Submissions"
          value={analytics?.total_submissions || 0}
          subtitle="Verified via 2-step check"
          icon={CheckCircle2}
          color="amber"
        />
      </div>

      {/* Overall Completion Rate Card with Visual Chart & Gauge */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Cohort-wide Submission Completion Rate
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated completion percentage across all assigned coursework and groups
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-indigo-600">
              {analytics?.overall_completion_rate || 0}%
            </span>
            <span className="text-xs font-semibold text-slate-400 ml-1">Overall Rate</span>
          </div>
        </div>

        <ProgressBar
          value={analytics?.overall_completion_rate || 0}
          size="lg"
          color={analytics?.overall_completion_rate >= 75 ? 'emerald' : analytics?.overall_completion_rate >= 40 ? 'indigo' : 'amber'}
          showPercentage={false}
        />

        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[11px] font-semibold">Total Target Submissions</span>
            <span className="text-lg font-extrabold text-slate-800">
              {analytics?.assignment_breakdown?.reduce((acc, curr) => acc + curr.total_target, 0) || 0}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-emerald-700 block text-[11px] font-semibold">Submitted & Confirmed</span>
            <span className="text-lg font-extrabold text-emerald-800">{analytics?.total_submissions || 0}</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
            <span className="text-amber-700 block text-[11px] font-semibold">Pending Submissions</span>
            <span className="text-lg font-extrabold text-amber-800">
              {analytics?.assignment_breakdown?.reduce((acc, curr) => acc + curr.pending_count, 0) || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Group Performance + Assignment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group Performance Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Group Performance</h3>
              <p className="text-xs text-slate-500">Track progress by collaborative team</p>
            </div>
            <Link
              to="/admin/groups"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              All Groups <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {analytics?.group_performance && analytics.group_performance.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {analytics.group_performance.map((grp) => (
                <div key={grp.id} className="py-3.5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{grp.name}</span>
                      <span className="text-slate-400 ml-2">({grp.member_count} members)</span>
                    </div>
                    <span className="font-extrabold text-indigo-600">
                      {grp.completed_count}/{grp.assigned_count} ({grp.completion_rate}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={grp.completion_rate}
                    size="sm"
                    color={grp.completion_rate >= 80 ? 'emerald' : grp.completion_rate >= 40 ? 'indigo' : 'amber'}
                    showPercentage={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">No student groups created yet.</div>
          )}
        </div>

        {/* Assignment Completion Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Assignment Submissions</h3>
              <p className="text-xs text-slate-500">Monitor completion per assignment</p>
            </div>
            <Link
              to="/admin/assignments"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {analytics?.assignment_breakdown && analytics.assignment_breakdown.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {analytics.assignment_breakdown.map((assign) => (
                <div key={assign.id} className="py-3.5 space-y-2">
                  <div className="flex justify-between items-start gap-2 text-xs">
                    <div>
                      <Link
                        to={`/admin/assignments/${assign.id}/submissions`}
                        className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {assign.title}
                      </Link>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Due: {new Date(assign.due_date).toLocaleDateString()}
                      </div>
                    </div>
                    <Link
                      to={`/admin/assignments/${assign.id}/submissions`}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 flex-shrink-0"
                    >
                      {assign.submitted_count}/{assign.total_target} Submissions
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <ProgressBar
                    value={assign.completion_rate}
                    size="sm"
                    color={assign.completion_rate >= 80 ? 'emerald' : 'indigo'}
                    showPercentage={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">No assignments created yet.</div>
          )}
        </div>
      </div>

      {/* Recent Submissions Feed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Submissions Activity</h3>
        {analytics?.recent_activity && analytics.recent_activity.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {analytics.recent_activity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{act.group_name}</span> confirmed submission for{' '}
                    <span className="font-semibold text-indigo-700">{act.assignment_title}</span>
                    <div className="text-[11px] text-slate-400">
                      Confirmed by {act.student_name} on {new Date(act.submitted_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <Badge variant={act.status} label={act.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">No submissions recorded yet.</div>
        )}
      </div>
    </div>
  );
}
