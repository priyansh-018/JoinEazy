import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SupportModal from '../components/SupportModal';
import {
  GraduationCap,
  Users,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Share2,
  ChevronDown,
  HelpCircle,
  FolderOpen,
  Crown,
  Award,
  BookOpen,
  Database,
  Flame,
  Check,
  ExternalLink,
  Laptop
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'professor'
  const [activeFaq, setActiveFaq] = useState(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does the Two-Step Verification submission work?',
      a: 'Students first upload their deliverables (code, PDFs, diagrams) to the external OneDrive folder designated by their professor. Then, in JoinEazy, they confirm via Step 1 ("Yes, I have submitted") and Step 2 (Final Confirmation), which logs the group submission and individual student confirmation with exact timestamps.'
    },
    {
      q: 'How do professors keep groups separated across different subjects?',
      a: 'Professors create subjects/courses (e.g. CS401 Cloud Computing) which generate unique Course Invite Links and codes. When students form their groups using that link, they are automatically organized under that subject and professor. When the professor assigns coursework, only groups in that course appear!'
    },
    {
      q: 'Can fellow team members confirm their individual participation?',
      a: 'Yes! Once a group leader or member initiates the submission, other group members can log in and click "Confirm My Participation", allowing professors to track both group-level completion and individual student-level accountability.'
    },
    {
      q: 'Is our coursework and group data permanently stored?',
      a: 'Yes, 100%. JoinEazy is integrated with a cloud PostgreSQL database (Neon DB) with schema enforcement and automated persistent backups, ensuring zero data loss across sessions, server restarts, or device switches.'
    },
    {
      q: 'Can students invite teammates using their Student ID or Email?',
      a: 'Absolutely. Inside the My Groups page, group leaders or members can invite peers directly by their registered Student ID (e.g. STU2024-001) or university email, or simply share their unique 8-character group join code.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/80 text-slate-800 relative selection:bg-indigo-500 selection:text-white">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute -top-20 right-1/4 w-[450px] h-[450px] bg-sky-200/40 rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* Floating Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                Join<span className="text-indigo-600">Eazy</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 -mt-1">
                Academic Management
              </span>
            </div>
          </Link>

          {/* Center navigation links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-indigo-600 transition-colors">Interactive Demo</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
            <button
              onClick={() => setIsSupportOpen(true)}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              Support
            </button>
          </nav>

          {/* Right action buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-all hover:shadow-indigo-200"
              >
                Go to Workspace
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-all hover:scale-[1.02]"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        {/* Subtle pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm text-xs font-bold text-indigo-700 mx-auto animate-bounce duration-1000">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Next-Gen Academic Collaboration & Group Management</span>
        </div>

        {/* Hero Title */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Where Student Groups Collaborate &{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 bg-clip-text text-transparent">
              Professors Verify Submissions
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Form student teams, share OneDrive links, confirm deliverables via 2-step verification, and track coursework progress through real-time rosters.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-200/60 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Laptop className="w-4 h-4 text-indigo-600" />
            Explore Interactive Demo
          </a>
        </div>

        {/* Metrics Banner */}
        <div className="pt-10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-2xl font-black text-indigo-600">100%</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Cloud Persisted</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-2xl font-black text-indigo-600">2-Step</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Verified Submissions</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-2xl font-black text-indigo-600">1-Click</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Course Invite Links</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-2xl font-black text-indigo-600">Real-Time</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Progress & Badges</div>
          </div>
        </div>
      </section>

      {/* Interactive Live Simulator / Showcase Card */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
            <Laptop className="w-3.5 h-3.5" />
            Live System Experience
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            See JoinEazy in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Switch between the Student and Professor experiences to see how seamless collaboration and verification happen.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl gap-1 mt-4">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student Portal View
            </button>
            <button
              onClick={() => setActiveTab('professor')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'professor'
                  ? 'bg-white text-indigo-700 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Professor Portal View
            </button>
          </div>
        </div>

        {/* Demo Mockup Window */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-all">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="ml-2 text-xs font-mono font-bold text-slate-400">
                {activeTab === 'student' ? 'joineazy.com/dashboard (Student View)' : 'joineazy.com/admin/assignments (Professor View)'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Interactive Preview
            </span>
          </div>

          {activeTab === 'student' ? (
            /* Student Interactive Mockup */
            <div className="space-y-6">
              {/* Progress & Badge preview */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-white border border-indigo-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Coursework Completion</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">Team Alpha Pioneers • [CS401] Cloud Computing</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Crown className="w-3.5 h-3.5 text-amber-500" /> Leader
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Award className="w-3.5 h-3.5 text-emerald-500" /> All Caught Up
                  </span>
                  <span className="text-xl font-extrabold text-indigo-600 ml-2">100%</span>
                </div>
              </div>

              {/* Assignment Card with 2-Step verification button */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 font-mono">
                      CS401
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      Assignment 1: Distributed Microservices Architecture Design
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload system diagrams and OpenAPI specifications to the professor's shared OneDrive folder.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <a
                    href="https://onedrive.live.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:underline"
                  >
                    <FolderOpen className="w-4 h-4" /> Open OneDrive Folder <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    Two-Step Verification Logged
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Professor Interactive Mockup */
            <div className="space-y-6">
              {/* Course Subject Invite Link Box */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-700">COURSE CODE: CS401-CLOUD</span>
                  <div className="text-base font-bold text-slate-900">Distributed Systems & Cloud Computing</div>
                  <div className="text-xs text-slate-500">Share with students to automatically link groups under this subject</div>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
                  <Share2 className="w-3.5 h-3.5" />
                  joineazy.com/courses/join/CS401-CLOUD
                </div>
              </div>

              {/* Roster & Confirmation tracking preview */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Student-Wise Confirmation Roster (Assignment 1)
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">A</div>
                      Alex Rivera (STU2024-001) <Crown className="w-3 h-3 text-amber-500" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <Check className="w-4 h-4" /> Step 1 & Step 2 Confirmed
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">E</div>
                      Emma Watson (STU2024-002)
                    </div>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <Check className="w-4 h-4" /> Participation Confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
            <Sparkles className="w-3.5 h-3.5" />
            Simple 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How JoinEazy Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            From professor subject creation to two-step submission verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">Professor Creates Subject</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Professor creates a course (e.g. CS401) and generates a 1-click shareable invite link with a unique code.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">Students Form Groups</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Students open the link to form project teams under that subject, inviting teammates via email or Student ID.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">OneDrive & 2-Step Check</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Deliverables are uploaded to external OneDrive folders, followed by JoinEazy's two-step submission confirmation.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-sm flex items-center justify-center">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900">Roster & Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Professors inspect group-wise and student-wise participation rosters and mark work as verified.
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Showcase */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
            <BookOpen className="w-3.5 h-3.5" />
            Built for Modern Universities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything Needed for Seamless Group Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 w-fit">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Subject Invite Links</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Professors teaching multiple courses can generate distinct invite links. Groups are tagged with the course code, avoiding all cross-class mix-ups.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Two-Step Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              A mandatory 2-step verification protocol requiring an upload acknowledgment before logging submission timestamps and notes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 w-fit">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Gamified Progress Badges</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Visual completion meters and achievement badges like *"Team Player"*, *"Group Leader"*, and *"All Caught Up"* keep students motivated.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 w-fit">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Student-Wise Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Professors can see which individual students in a group confirmed their participation, complete with student roll numbers.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 w-fit">
              <FolderOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">OneDrive Integration</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct external folder links embedded into assignments so students never need to search for submission dropboxes.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 w-fit">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Neon Cloud Database</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Backed by serverless PostgreSQL cloud storage with persistent disk backup so no coursework data is ever lost.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Got Questions? We've Got Answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    activeFaq === idx ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Footer Ribbon */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl shadow-indigo-200/50">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Streamline Your Academic Group Management?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mx-auto">
            Join hundreds of students and professors managing coursework, OneDrive submissions, and team collaboration today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105"
            >
              Register as Student
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-indigo-900/60 hover:bg-indigo-900/80 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
            >
              Register as Professor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base text-slate-900">
              Join<span className="text-indigo-600">Eazy</span>
            </span>
            <span className="text-slate-400 ml-2">© 2026 Joineazy. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
            <button
              onClick={() => setIsSupportOpen(true)}
              className="text-indigo-600 hover:underline font-bold"
            >
              Contact Support
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Support Button in Bottom-Right Corner */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsSupportOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full shadow-xl shadow-indigo-300 hover:shadow-indigo-400 transition-all hover:scale-105 animate-pulse"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Need Help?</span>
        </button>
      </div>

      {/* Support Modal */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
}
