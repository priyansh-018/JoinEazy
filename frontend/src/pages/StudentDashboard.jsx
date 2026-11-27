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
  ArrowUpRight,
  ArrowRight,
  BookOpen
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
      case 'Flame': return <Flame className="w-4 h-4 text-[#E11D48]" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Award': return <Award className="w-4 h-4 text-purple-500" />;
      default: return <Users className="w-4 h-4 text-indigo-500" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="w-8 h-8 border-3 border-[#1c1917] border-t-[#E11D48] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Welcome Banner */}
      <div className="bg-[#1c1917] text-[#FAF7F2] border-2 border-[#1c1917] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#E11D48] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-stone-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
            Student Workspace
          </div>
          <h1 className="font-display text-3xl sm:text-5xl tracking-wide text-white">
            WELCOME BACK, {user?.name?.toUpperCase()}!
          </h1>
          <p className="font-script text-xl text-stone-300 mt-1 max-w-xl">
            Track coursework, collaborate with peers, and verify your OneDrive submissions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/groups"
            className="px-4 py-2.5 bg-white/10 hover:bg-white text-white hover:text-[#1c1917] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            My Groups
          </Link>
          <Link
            to="/assignments"
            className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Coursework
          </Link>
        </div>
      </div>

      {/* Progress & Completion Overview Card */}
      <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 sm:p-7 shadow-[5px_5px_0px_0px_#1c1917] space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b-2 border-[#1c1917] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              SUBMISSION PROGRESS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
              COURSEWORK &amp; GROUP PROGRESS TRACKING
            </h2>
          </div>
          <div className="text-right">
            <span className="font-display text-4xl text-[#E11D48]">
              {progress?.completion_rate || 0}%
            </span>
            <span className="text-xs font-bold uppercase text-stone-500 ml-1">Completed</span>
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
          <div className="flex justify-between text-[11px] font-mono text-stone-500 font-bold">
            <span>0% (Kickoff)</span>
            <span>50% (Milestone)</span>
            <span>100% (Submissions Verified)</span>
          </div>
        </div>

        {/* Badges Ribbon */}
        {progress?.badges && progress.badges.length > 0 && (
          <div className="pt-4 border-t border-stone-200">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#E11D48]" />
              Earned Badges &amp; Milestone Achievements:
            </div>
            <div className="flex flex-wrap gap-2.5">
              {progress.badges.map((b) => (
                <div
                  key={b.id}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-2 border-[#1c1917] bg-[#FAF7F2] text-stone-800 text-xs shadow-xs"
                >
                  <span className="p-1 rounded-lg bg-white shadow-xs">
                    {getBadgeIcon(b.icon)}
                  </span>
                  <div>
                    <span className="font-bold text-stone-900">{b.name}</span>
                    <span className="text-stone-500 text-[10px] block leading-tight">{b.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enrolled Courses Grid (Task 2 Requirement) */}
      <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 sm:p-7 shadow-[5px_5px_0px_0px_#1c1917] space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b-2 border-[#1c1917] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-[#E11D48] border border-rose-200 mb-1">
              <BookOpen className="w-3 h-3" />
              Academic Curricula
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
              ENROLLED COURSES
            </h2>
            <p className="text-xs text-stone-500">
              Click any course to open its respective assignment page and track submissions
            </p>
          </div>
          <Link
            to="/courses/join"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#1c1917] bg-[#FAF7F2] hover:bg-[#1c1917] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Join Another Course <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {progress?.enrolled_courses && progress.enrolled_courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progress.enrolled_courses.map((course) => (
              <Link
                key={course.id}
                to={`/assignments?courseId=${course.id}`}
                className="group p-5 rounded-2xl border-2 border-[#1c1917] bg-[#FAF7F2] hover:bg-white hover:shadow-[5px_5px_0px_0px_#E11D48] transition-all flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#1c1917] text-white font-mono text-xs font-bold">
                      {course.course_code}
                    </span>
                    <span className="text-[11px] font-bold text-stone-500">
                      {course.assignment_count} {course.assignment_count === 1 ? 'Assignment' : 'Assignments'}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-[#1c1917] group-hover:text-[#E11D48] transition-colors leading-snug">
                    {course.name}
                  </h3>
                  {course.description && (
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Instructor</span>
                    <span className="font-bold text-stone-800">Prof. {course.professor_name || 'Faculty Member'}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-[#E11D48] group-hover:translate-x-1 transition-transform">
                    <span>Open Assignments</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-3 bg-[#FAF7F2] rounded-2xl border-2 border-dashed border-stone-300 p-6">
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-xs text-stone-600 font-medium max-w-md mx-auto">
              You haven't enrolled in any courses yet. Join a course using an invite code from your professor, or create a project group.
            </p>
            <Link
              to="/courses/join"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs"
            >
              Enroll with Course Code <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Assigned"
          value={progress?.total_assigned || 0}
          subtitle="Coursework items"
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
          subtitle="Needs attention"
          icon={AlertCircle}
          color="rose"
        />
      </div>

      {/* Recent Assignments & Next Steps */}
      <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#1c1917] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-4">
          <div>
            <h3 className="font-display text-2xl text-[#1c1917]">ACTIVE ASSIGNMENTS</h3>
            <p className="text-xs text-stone-500">View details and verify your group submissions</p>
          </div>
          <Link
            to="/assignments"
            className="text-xs font-bold uppercase tracking-wider text-[#E11D48] hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {progress?.assignments && progress.assignments.length > 0 ? (
          <div className="divide-y divide-stone-200">
            {progress.assignments.slice(0, 4).map((assign) => (
              <div
                key={assign.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1c1917] group-hover:text-[#E11D48] transition-colors">
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
                  <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
                    <span>Due: {new Date(assign.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <a
                      href={assign.onedrive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E11D48] hover:underline flex items-center gap-1 font-bold"
                    >
                      OneDrive Directory <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div>
                  <Link
                    to="/assignments"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#1c1917] text-xs font-bold uppercase tracking-wider text-[#1c1917] hover:bg-[#1c1917] hover:text-white transition-all cursor-pointer shadow-xs"
                  >
                    {assign.has_submitted ? 'View Submission' : 'Confirm Submission'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-stone-500 font-medium">
            No assignments found. Please join or create a group to receive assigned coursework.
          </div>
        )}
      </div>

    </div>
  );
}
