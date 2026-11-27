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
  Award,
  BookOpen
} from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/analytics/admin');
      if (res.data.success) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics data.');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center font-sans">
        <div className="w-8 h-8 border-3 border-[#1c1917] border-t-[#E11D48] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#1c1917] text-[#FAF7F2] border-2 border-[#1c1917] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#E11D48] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-stone-300 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E11D48]" />
            Professor &amp; Admin Dashboard
          </div>
          <h1 className="font-display text-3xl sm:text-5xl tracking-wide text-white">
            PROGRESS &amp; SUBMISSION ANALYTICS
          </h1>
          <p className="font-script text-xl text-stone-300 mt-1 max-w-xl">
            Monitor coursework completion, track student collaboration, and review OneDrive confirmations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/courses"
            className="px-4 py-2.5 bg-white/10 hover:bg-white text-white hover:text-[#1c1917] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            Manage Courses
          </Link>
          <Link
            to="/admin/assignments"
            className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Post Assignment
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-[#E11D48] text-[#E11D48] text-xs font-bold">
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
          title="Enrolled Students"
          value={analytics?.total_students || 0}
          subtitle="In your courses & groups"
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

      {/* Overall Completion Rate Card */}
      <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 sm:p-7 shadow-[5px_5px_0px_0px_#1c1917] space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b-2 border-[#1c1917] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              COHORT METRICS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
              COHORT-WIDE SUBMISSION COMPLETION RATE
            </h2>
          </div>
          <div className="text-right">
            <span className="font-display text-4xl text-[#E11D48]">
              {analytics?.overall_completion_rate || 0}%
            </span>
            <span className="text-xs font-bold uppercase text-stone-500 ml-1">Overall Rate</span>
          </div>
        </div>

        <ProgressBar
          value={analytics?.overall_completion_rate || 0}
          size="lg"
          color={analytics?.overall_completion_rate >= 75 ? 'emerald' : analytics?.overall_completion_rate >= 40 ? 'indigo' : 'amber'}
          showPercentage={false}
        />

        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-stone-200">
            <span className="text-stone-500 block text-[10px] uppercase font-bold">Total Target Submissions</span>
            <span className="font-display text-2xl text-stone-900">
              {analytics?.assignment_breakdown?.reduce((acc, curr) => acc + curr.total_target, 0) || 0}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-700 block text-[10px] uppercase font-bold">Confirmed</span>
            <span className="font-display text-2xl text-emerald-800">{analytics?.total_submissions || 0}</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-amber-700 block text-[10px] uppercase font-bold">Pending</span>
            <span className="font-display text-2xl text-amber-800">
              {analytics?.assignment_breakdown?.reduce((acc, curr) => acc + curr.pending_count, 0) || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Courses Taught & Curricular Analytics (Task 2 Requirement) */}
      <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 sm:p-7 shadow-[5px_5px_0px_0px_#1c1917] space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b-2 border-[#1c1917] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-[#E11D48] border border-rose-200 mb-1">
              <BookOpen className="w-3 h-3" />
              Curriculum Management
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
              COURSES TAUGHT &amp; ENROLLMENT ANALYTICS
            </h2>
            <p className="text-xs text-stone-500">
              Overview of active academic subjects, student rosters, and aggregate submission tracking
            </p>
          </div>
          <Link
            to="/admin/courses"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#1c1917] bg-[#FAF7F2] hover:bg-[#1c1917] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Manage All Courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {analytics?.courses_analytics && analytics.courses_analytics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.courses_analytics.map((course) => (
              <div
                key={course.id}
                className="p-5 rounded-2xl border-2 border-[#1c1917] bg-[#FAF7F2] space-y-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#1c1917] text-white font-mono text-xs font-bold">
                      {course.course_code}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-stone-500">
                      Code: {course.join_code}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-[#1c1917] leading-snug">
                    {course.name}
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200 text-center font-mono text-xs">
                  <div className="p-2 rounded-xl bg-white border border-stone-200">
                    <span className="text-[9px] uppercase font-bold text-stone-400 block">Students</span>
                    <span className="font-bold text-stone-900 text-base">{course.student_count}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-stone-200">
                    <span className="text-[9px] uppercase font-bold text-stone-400 block">Groups</span>
                    <span className="font-bold text-stone-900 text-base">{course.group_count}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-stone-200">
                    <span className="text-[9px] uppercase font-bold text-stone-400 block">Submissions</span>
                    <span className="font-bold text-[#E11D48] text-base">{course.submission_count}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-bold">{course.assignment_count} Coursework Items</span>
                  <Link
                    to="/admin/assignments"
                    className="text-[#E11D48] hover:underline font-bold flex items-center gap-1"
                  >
                    Assignments <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-stone-500">
            No courses registered yet. Click "Manage Courses" to create your first subject.
          </div>
        )}
      </div>

      {/* Two Column Layout: Group Performance + Assignment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Group Performance Table */}
        <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#1c1917] space-y-4">
          <div className="flex justify-between items-center border-b-2 border-[#1c1917] pb-3">
            <div>
              <h3 className="font-display text-2xl text-[#1c1917]">GROUP PERFORMANCE</h3>
              <p className="text-xs text-stone-500">Track progress by collaborative team</p>
            </div>
            <Link
              to="/admin/groups"
              className="text-xs font-bold uppercase tracking-wider text-[#E11D48] hover:underline flex items-center gap-1"
            >
              All Groups <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {analytics?.group_performance && analytics.group_performance.length > 0 ? (
            <div className="divide-y divide-stone-200">
              {analytics.group_performance.map((grp) => (
                <div key={grp.id} className="py-3.5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-stone-900">{grp.name}</span>
                      <span className="text-stone-400 ml-2">({grp.member_count} members)</span>
                    </div>
                    <span className="font-mono font-bold text-[#E11D48]">
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
            <div className="py-6 text-center text-xs text-stone-400">No student groups created yet.</div>
          )}
        </div>

        {/* Assignment Completion Breakdown */}
        <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#1c1917] space-y-4">
          <div className="flex justify-between items-center border-b-2 border-[#1c1917] pb-3">
            <div>
              <h3 className="font-display text-2xl text-[#1c1917]">ASSIGNMENT SUBMISSIONS</h3>
              <p className="text-xs text-stone-500">Monitor completion per assignment</p>
            </div>
            <Link
              to="/admin/assignments"
              className="text-xs font-bold uppercase tracking-wider text-[#E11D48] hover:underline flex items-center gap-1"
            >
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {analytics?.assignment_breakdown && analytics.assignment_breakdown.length > 0 ? (
            <div className="divide-y divide-stone-200">
              {analytics.assignment_breakdown.map((assign) => (
                <div key={assign.id} className="py-3.5 space-y-2">
                  <div className="flex justify-between items-start gap-2 text-xs">
                    <div>
                      <Link
                        to={`/admin/assignments/${assign.id}/submissions`}
                        className="font-bold text-stone-900 hover:text-[#E11D48] transition-colors"
                      >
                        {assign.title}
                      </Link>
                      <div className="text-[11px] text-stone-400 mt-0.5 font-medium">
                        Due: {new Date(assign.due_date).toLocaleDateString()}
                      </div>
                    </div>
                    <Link
                      to={`/admin/assignments/${assign.id}/submissions`}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#1c1917] hover:text-white text-stone-700 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
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
            <div className="py-6 text-center text-xs text-stone-400">No assignments created yet.</div>
          )}
        </div>

      </div>

      {/* Recent Submissions Feed */}
      <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#1c1917] space-y-4">
        <h3 className="font-display text-2xl text-[#1c1917]">RECENT SUBMISSIONS ACTIVITY</h3>
        {analytics?.recent_activity && analytics.recent_activity.length > 0 ? (
          <div className="divide-y divide-stone-200">
            {analytics.recent_activity.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs font-medium">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">{act.group_name}</span> confirmed submission for{' '}
                    <span className="font-semibold text-[#E11D48]">{act.assignment_title}</span>
                    <div className="text-[11px] text-stone-400">
                      Confirmed by {act.student_name} on {new Date(act.submitted_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <Badge variant={act.status} label={act.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-stone-400 font-medium">No submissions recorded yet.</div>
        )}
      </div>

    </div>
  );
}
