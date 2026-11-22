import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import StatsCard from '../components/StatsCard';
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Crown,
  Flame,
  ArrowUpRight
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/student-progress');
      if (res.data.success) {
        setProgress(res.data.progress);
      }
    } catch (err) {
      setError('Failed to load progress data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'Crown': return <Crown className="w-4 h-4 text-amber-500" />;
      case 'Flame': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Award': return <Award className="w-4 h-4 text-purple-500" />;
      default: return <Users className="w-4 h-4 text-indigo-500" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            Student Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-xl">
            Track your assignments, collaborate with group members, and verify your external OneDrive submissions.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/groups"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            My Groups
          </Link>
          <Link
            to="/assignments"
            className="px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View Assignments
          </Link>
        </div>
      </div>

      {/* Progress & Completion Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Coursework & Group Progress Tracking
            </h2>
            <p className="text-xs text-slate-500">
              Visual completion status across all coursework assigned to your group(s)
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-600">
              {progress?.completion_rate || 0}%
            </span>
            <span className="text-xs font-semibold text-slate-400 ml-1">Completed</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <ProgressBar
            value={progress?.completion_rate || 0}
            size="lg"
            color={progress?.completion_rate >= 80 ? 'emerald' : progress?.completion_rate >= 40 ? 'indigo' : 'amber'}
            showPercentage={false}
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>0% (Kickoff)</span>
            <span>50% (Milestone)</span>
            <span>100% (All Submissions Complete)</span>
          </div>
        </div>

        {/* Badges Ribbon */}
        {progress?.badges && progress.badges.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              Earned Completion Badges & Achievements:
            </div>
            <div className="flex flex-wrap gap-2.5">
              {progress.badges.map((b) => (
                <div
                  key={b.id}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-indigo-100 bg-indigo-50/60 text-slate-800 text-xs shadow-xs"
                >
                  <span className="p-1 rounded-lg bg-white shadow-xs">
                    {getBadgeIcon(b.icon)}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{b.name}</span>
                    <span className="text-slate-500 text-[10px] block leading-tight">{b.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Assigned"
          value={progress?.total_assigned || 0}
          subtitle="Coursework tasks"
          icon={FileText}
          color="indigo"
        />
        <StatsCard
          title="Completed"
          value={progress?.completed || 0}
          subtitle="Verified submissions"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatsCard
          title="Pending Action"
          value={progress?.pending || 0}
          subtitle="Awaiting submission"
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Past Due"
          value={progress?.overdue || 0}
          subtitle="Needs immediate attention"
          icon={AlertCircle}
          color="rose"
        />
      </div>

      {/* Recent Assignments & Next Steps */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Active Assignments</h3>
            <p className="text-xs text-slate-500">View details and verify your submissions</p>
          </div>
          <Link
            to="/assignments"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {progress?.assignments && progress.assignments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {progress.assignments.slice(0, 4).map((assign) => (
              <div
                key={assign.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {assign.title}
                    </span>
                    {assign.has_submitted ? (
                      <Badge variant="submitted" label="Submitted" />
                    ) : assign.is_overdue ? (
                      <Badge variant="overdue" label="Overdue" />
                    ) : (
                      <Badge variant="pending" label="Pending" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Due: {new Date(assign.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <a
                      href={assign.onedrive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      OneDrive Folder <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div>
                  <Link
                    to="/assignments"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {assign.has_submitted ? 'View Submission' : 'Confirm Submission'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            No assignments found. Please join or create a group to receive assigned coursework.
          </div>
        )}
      </div>
    </div>
  );
}
