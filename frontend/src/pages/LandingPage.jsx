import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSupport } from '../context/SupportContext';
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
  Check,
  ExternalLink,
  Laptop,
  Play,
  Search,
  Menu,
  X,
  ShieldCheck,
  Clock,
  Send,
  Layers,
  Sparkle,
  Copy,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Scroll tracking for animations & parallax
  const [scrollY, setScrollY] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const { openSupport } = useSupport();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hero interactive console tab: 'submission' | 'professor' | 'progress'
  const [consoleTab, setConsoleTab] = useState('submission');

  // Interactive 2-step verification simulation state
  const [simStep1, setSimStep1] = useState(true);
  const [simStep2, setSimStep2] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Interactive join code test box
  const [testCode, setTestCode] = useState('');
  const [codeTested, setCodeTested] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyDemoLink = () => {
    navigator.clipboard.writeText('https://onedrive.live.com/?id=cs401-coursework-team4');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTestCodeSubmit = (e) => {
    e.preventDefault();
    if (!testCode.trim()) return;
    setCodeTested(true);
  };

  // Parallax offsets
  const parallaxHeader = scrollY * 0.2;

  const faqs = [
    {
      q: 'How does the Two-Step Verification submission work?',
      a: 'Students first upload their deliverables to the shared OneDrive directory provided by the professor. In JoinEazy, the group leader toggles Step 1 ("Yes, files uploaded") and finalizes with Step 2, generating an immutable timestamp for both the team and individual peers.'
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
      a: 'Yes, 100%. JoinEazy features real-time cloud data synchronization with automated backups and session persistence, guaranteeing zero coursework or group data loss across devices, network interruptions, or page refreshes.'
    },
    {
      q: 'How do I reach human support if I encounter an issue?',
      a: 'Click "Need Help?" or "Contact Support" anywhere on the platform. Inquiries route directly to our priority support desk at priyansh191882@gmail.com with dedicated response tracking.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1c1917] relative selection:bg-[#E11D48] selection:text-white font-sans overflow-x-hidden">
      {/* Editorial Paper Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none paper-grain opacity-60 z-0"></div>

      {/* LEFT FIXED DOCK NAVIGATION */}
      <aside className="fixed left-0 top-0 bottom-0 w-16 sm:w-20 border-r border-[#E6DFD5] bg-[#FAF7F2]/95 backdrop-blur-sm z-50 flex flex-col justify-between items-center py-6 shadow-xs">
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full border-2 border-[#1c1917] flex items-center justify-center text-[#1c1917] hover:bg-[#1c1917] hover:text-[#FAF7F2] transition-all cursor-pointer shadow-xs group"
            title="Open Menu"
          >
            <Menu className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          <a
            href="#demo"
            className="w-10 h-10 rounded-full border border-stone-300 hover:border-[#1c1917] flex items-center justify-center text-stone-600 hover:text-[#1c1917] hover:bg-white transition-all cursor-pointer"
            title="Jump to Interactive Demo"
          >
            <Zap className="w-4 h-4 text-[#E11D48]" />
          </a>

          <a
            href="#pillars"
            className="w-10 h-10 rounded-full border border-transparent hover:border-[#1c1917] flex items-center justify-center text-stone-500 hover:text-[#1c1917] transition-all cursor-pointer"
            title="System Architecture"
          >
            <Layers className="w-4 h-4" />
          </a>

          <button
            onClick={openSupport}
            className="w-10 h-10 rounded-full border border-transparent hover:border-[#1c1917] flex items-center justify-center text-stone-500 hover:text-[#1c1917] transition-all cursor-pointer"
            title="Direct Support Inbox"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Vertical Editorial Text */}
        <div className="rotate-180 [writing-mode:vertical-rl] text-[10px] font-bold tracking-[0.25em] text-stone-400 uppercase select-none">
          JOINEAZY &bull; ACADEMIC SYSTEM 2026
        </div>

        {/* Brand Monogram */}
        <Link
          to="/"
          className="w-10 h-10 rounded-xl bg-[#1c1917] text-[#FAF7F2] flex items-center justify-center font-display text-lg tracking-wider hover:bg-[#E11D48] transition-colors shadow-sm"
        >
          JE
        </Link>
      </aside>

      {/* QUICK MENU DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#1c1917]/50 backdrop-blur-sm flex items-start pl-16 sm:pl-20 animate-in fade-in duration-200">
          <div className="w-80 h-full bg-[#FAF7F2] border-r-2 border-[#1c1917] p-8 flex flex-col justify-between shadow-2xl">
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b-2 border-[#1c1917] pb-4">
                <span className="font-display text-2xl tracking-wider text-[#1c1917]">QUICK MENU</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-4 font-display text-2xl tracking-wide text-stone-700">
                <a
                  href="#overview"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#E11D48] hover:translate-x-2 transition-all"
                >
                  01. PLATFORM OVERVIEW
                </a>
                <a
                  href="#demo"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#E11D48] hover:translate-x-2 transition-all"
                >
                  02. INTERACTIVE DEMO
                </a>
                <a
                  href="#verification"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#E11D48] hover:translate-x-2 transition-all"
                >
                  03. TWO-STEP VERIFY
                </a>
                <a
                  href="#pillars"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#E11D48] hover:translate-x-2 transition-all"
                >
                  04. FOUR PILLARS
                </a>
                <a
                  href="#faq"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#E11D48] hover:translate-x-2 transition-all"
                >
                  05. FAQ
                </a>
              </nav>
            </div>

            <div className="pt-6 border-t-2 border-[#1c1917] space-y-3">
              <div className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                Direct Help Desk
              </div>
              <p className="text-xs text-stone-700">
                Email support: <span className="font-bold text-[#E11D48]">priyansh191882@gmail.com</span>
              </p>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openSupport();
                }}
                className="w-full py-2.5 bg-[#1c1917] hover:bg-[#E11D48] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Send Support Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="pl-16 sm:pl-20 min-h-screen relative z-10">
        
        {/* TOP BAR */}
        <header className="h-20 border-b border-[#E6DFD5] px-6 sm:px-12 flex items-center justify-between sticky top-0 bg-[#FAF7F2]/95 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-display text-3xl sm:text-4xl tracking-wider text-[#1c1917] group-hover:text-[#E11D48] transition-colors">
                JOINEAZY
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-[#D5CCC0] text-stone-600 hidden sm:inline-block">
                STUDENT &bull; GROUP &bull; ASSIGNMENT
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#E6DFD5]">
              <div className="w-8 h-8 rounded-full border border-dashed border-[#1c1917] flex items-center justify-center font-display text-[11px] text-[#1c1917]">
                2026
              </div>
              <div className="text-[10px] font-bold text-stone-500 leading-tight">
                ENTERPRISE READY<br />
                <span className="text-emerald-700 font-mono">CLOUD SYNCHRONIZED</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="px-5 py-2.5 bg-[#1c1917] hover:bg-[#E11D48] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Dashboard ({user.name?.split(' ')[0]})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border-2 border-[#1c1917] text-[#1c1917] hover:bg-[#1c1917] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#1c1917] transition-all cursor-pointer"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </header>

        {/* HERO SECTION WITH STRAIGHT, SLEEK INTERACTIVE CONSOLE */}
        <section id="overview" className="relative p-6 sm:p-12 lg:p-16 border-b border-[#E6DFD5] overflow-hidden">
          
          {/* Subtle Parallax Background Typography */}
          <div
            className="absolute inset-0 pointer-events-none select-none flex flex-col justify-center items-center opacity-[0.08] text-[#1c1917] font-display text-[15vw] sm:text-[18vw] leading-[0.85] tracking-tight whitespace-nowrap -z-10"
            style={{ transform: `translateY(-${parallaxHeader}px)` }}
          >
            <div>ACADEMIC</div>
            <div>COLLABORATION</div>
          </div>

          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* Top Tagline Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D5CCC0] text-xs font-bold uppercase tracking-wider text-stone-700 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse"></span>
                <span>Unified Academic Platform &bull; Coursework &amp; Cohort Management</span>
              </div>
              <div className="font-script text-2xl text-[#E11D48]">
                Streamlined group formation &amp; submission accountability
              </div>
            </div>

            {/* Hero Main Headline */}
            <div className="space-y-4 max-w-4xl">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#1c1917] leading-[0.95]">
                EFFORTLESS COURSEWORK, GROUP FORMATION &amp; VERIFIED SUBMISSIONS.
              </h1>
              <p className="text-base sm:text-lg text-stone-600 font-medium max-w-2xl leading-relaxed">
                Connect students with unique invite links, link shared OneDrive folders, enforce two-step submission verification, and isolate coursework by professor subject.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/register"
                  className="px-7 py-3.5 bg-[#1c1917] hover:bg-[#E11D48] text-[#FAF7F2] font-display text-lg tracking-wider rounded-xl shadow-[4px_4px_0px_0px_#E11D48] hover:shadow-[6px_6px_0px_0px_#1c1917] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>GET STARTED FREE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#demo"
                  className="px-6 py-3.5 border-2 border-[#1c1917] hover:bg-white text-[#1c1917] font-display text-lg tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  TEST INTERACTIVE DEMO
                </a>
              </div>
            </div>

            {/* THE HERO SHOWCASE: STRAIGHT, HIGH-TECH INTERACTIVE WORKSPACE CONSOLE */}
            <div className="relative pt-6">
              
              {/* Outer Decorative Frame */}
              <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-2 sm:p-3 shadow-[8px_8px_0px_0px_#1c1917] relative">
                
                {/* Console Top Toolbar */}
                <div className="bg-[#FAF7F2] border-b-2 border-[#1c1917] px-4 py-3 rounded-2xl flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500 border border-stone-800"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400 border border-stone-800"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500 border border-stone-800"></div>
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-800 tracking-tight">
                      JOINEAZY LIVE CONSOLE &bull; v1.0
                    </span>
                  </div>

                  {/* Interactive Switcher Tabs */}
                  <div className="flex bg-white p-1 rounded-xl border border-stone-300 text-xs font-bold">
                    <button
                      onClick={() => setConsoleTab('submission')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        consoleTab === 'submission'
                          ? 'bg-[#1c1917] text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Two-Step Verification
                    </button>
                    <button
                      onClick={() => setConsoleTab('professor')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        consoleTab === 'professor'
                          ? 'bg-[#1c1917] text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Professor Course Links
                    </button>
                    <button
                      onClick={() => setConsoleTab('progress')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        consoleTab === 'progress'
                          ? 'bg-[#1c1917] text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Student Badges &amp; Metrics
                    </button>
                  </div>
                </div>

                {/* Console Screen Inner Content */}
                <div className="p-6 sm:p-8 bg-[#18181B] text-white rounded-2xl space-y-6 mt-2 relative overflow-hidden">
                  
                  {/* TAB 1: TWO-STEP VERIFICATION PREVIEW */}
                  {consoleTab === 'submission' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-stone-800">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#E11D48] text-white font-mono text-[10px] font-bold">
                              CS401 &bull; CLOUD COMPUTING
                            </span>
                            <span className="text-stone-400 font-mono text-xs">Assigned to: Binary Pioneers (Group #4)</span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Milestone 2: Distributed Cloud Systems Architecture
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono text-amber-400 font-bold block">DEADLINE APPROACHING</span>
                          <span className="text-xs text-stone-400">Due Nov 29, 2026 &bull; 11:59 PM</span>
                        </div>
                      </div>

                      {/* OneDrive Link Card */}
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-700 flex flex-wrap justify-between items-center gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                            <FolderOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                              Professor's Designated OneDrive Folder Link
                            </span>
                            <span className="font-mono text-xs text-stone-200">
                              https://onedrive.live.com/?id=cs401-coursework-team4
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleCopyDemoLink}
                          className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xs font-bold text-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
                        </button>
                      </div>

                      {/* Interactive Two-Step Verification Control Box */}
                      <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-700 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                            Two-Step Verification Protocol State:
                          </span>
                          <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                            simStep1 && simStep2
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : simStep1
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-stone-800 text-stone-400'
                          }`}>
                            {simStep1 && simStep2 ? '100% VERIFIED & TIMESTAMPED' : simStep1 ? 'STEP 1 COMPLETE &bull; STEP 2 PENDING' : 'AWAITING STEP 1'}
                          </span>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            onClick={() => setSimStep1(!simStep1)}
                            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                              simStep1
                                ? 'bg-emerald-950/40 border-emerald-500/60 text-white'
                                : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:border-stone-500'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                              simStep1 ? 'bg-emerald-500 text-stone-950' : 'border border-stone-600'
                            }`}>
                              {simStep1 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="text-xs">
                              <span className="font-bold text-white block">Step 1: Upload Check</span>
                              <span className="text-stone-400 text-[11px]">"I confirm all team files are placed in OneDrive."</span>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              if (!simStep1) return;
                              setSimStep2(!simStep2);
                            }}
                            disabled={!simStep1}
                            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                              !simStep1
                                ? 'bg-stone-900 border-stone-800 text-stone-600 cursor-not-allowed opacity-60'
                                : simStep2
                                ? 'bg-rose-950/40 border-[#E11D48] text-white'
                                : 'bg-stone-800/80 border-amber-500/50 text-stone-200 hover:border-amber-400 animate-pulse'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                              simStep2 ? 'bg-[#E11D48] text-white' : 'border border-stone-600'
                            }`}>
                              {simStep2 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="text-xs">
                              <span className="font-bold text-white block">Step 2: Final Submission Lock</span>
                              <span className="text-stone-400 text-[11px]">Locks verifiable timestamp in institutional records.</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Team Peer Confirmations List */}
                      <div className="pt-2 flex flex-wrap justify-between items-center text-xs text-stone-400">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-300">Team Members:</span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[11px]">Alex Rivera (Leader) &bull; Verified</span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[11px]">Jordan Lee &bull; Verified</span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-amber-400 text-[11px]">Morgan Wu &bull; Pending</span>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold text-[11px]">
                          CLOUD SYNCHRONIZED
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PROFESSOR COURSE LINKS */}
                  {consoleTab === 'professor' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="flex justify-between items-center pb-4 border-b border-stone-800">
                        <div>
                          <span className="text-[11px] font-mono text-[#E11D48] font-bold uppercase tracking-wider block">
                            PROFESSOR MANAGEMENT PORTAL
                          </span>
                          <h3 className="text-2xl font-black text-white">Course &amp; Subject Invite Links</h3>
                        </div>
                        <span className="px-3 py-1 bg-white/10 rounded-xl text-xs font-mono text-stone-300">
                          Active Courses: 3
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-stone-900 border border-stone-700 space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-white text-sm">CS401 &bull; Cloud Computing</span>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded">
                              4 Groups
                            </span>
                          </div>
                          <p className="text-xs text-stone-400">Shareable Invite Link for students:</p>
                          <div className="p-2 rounded bg-black font-mono text-[11px] text-stone-300 truncate">
                            joineazy.com/courses/join/CS401-7M9K
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-stone-900 border border-stone-700 space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-white text-sm">MATH302 &bull; Linear Algebra</span>
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded">
                              6 Groups
                            </span>
                          </div>
                          <p className="text-xs text-stone-400">Shareable Invite Link for students:</p>
                          <div className="p-2 rounded bg-black font-mono text-[11px] text-stone-300 truncate">
                            joineazy.com/courses/join/MATH-9R2B
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-stone-900/50 border border-dashed border-stone-700 text-xs text-stone-300 flex items-center justify-between">
                        <span>Groups created via these links are automatically categorized under their subject.</span>
                        <span className="font-bold text-[#E11D48]">Zero Mixed Rosters</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PROGRESS & METRICS */}
                  {consoleTab === 'progress' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="flex justify-between items-center pb-4 border-b border-stone-800">
                        <div>
                          <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                            REAL-TIME ANALYTICS
                          </span>
                          <h3 className="text-2xl font-black text-white">Cohort Completion &amp; Progress Meters</h3>
                        </div>
                        <span className="font-display text-2xl text-emerald-400">85% COMPLETE</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-stone-300">
                          <span>Verified Cohort Submissions</span>
                          <span>17 of 20 Groups</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-stone-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-[#E11D48] w-[85%] rounded-full transition-all duration-500"></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center text-xs">
                        <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                          <span className="text-stone-400 block text-[10px]">TOTAL GROUPS</span>
                          <span className="font-display text-2xl text-white">24</span>
                        </div>
                        <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                          <span className="text-emerald-400 block text-[10px]">CONFIRMED</span>
                          <span className="font-display text-2xl text-emerald-400">17</span>
                        </div>
                        <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                          <span className="text-amber-400 block text-[10px]">PENDING</span>
                          <span className="font-display text-2xl text-amber-400">3</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* DYNAMIC SCROLLING MARQUEE BANNER (Continuous Smooth Animation) */}
        <div className="py-4 bg-[#1c1917] text-[#FAF7F2] overflow-hidden whitespace-nowrap border-y-2 border-[#1c1917]">
          <div className="animate-marquee font-display text-xl sm:text-2xl tracking-widest uppercase flex items-center gap-8 select-none">
            <span>&bull; TWO-STEP VERIFICATION PROTOCOL</span>
            <span className="text-[#E11D48]">&bull; ONEDRIVE INTEGRATION</span>
            <span>&bull; SUBJECT &amp; COURSE ROSTERS</span>
            <span className="text-emerald-400">&bull; REAL-TIME CLOUD SYNCHRONIZATION</span>
            <span>&bull; INDIVIDUAL PARTICIPATION TRACKING</span>
            <span className="text-amber-400">&bull; PROGRESS &amp; MILESTONE ANALYTICS</span>
            <span>&bull; TWO-STEP VERIFICATION PROTOCOL</span>
            <span className="text-[#E11D48]">&bull; ONEDRIVE INTEGRATION</span>
            <span>&bull; SUBJECT &amp; COURSE ROSTERS</span>
            <span className="text-emerald-400">&bull; REAL-TIME CLOUD SYNCHRONIZATION</span>
          </div>
        </div>

        {/* SECTION 2: INTERACTIVE DEMO TEST LAB */}
        <section id="demo" className="p-6 sm:p-12 lg:p-16 border-b border-[#E6DFD5] bg-[#F5F0E8]/40">
          <div className="max-w-5xl mx-auto space-y-10">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E11D48]">
                TRY IT YOURSELF
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-[#1c1917] tracking-tight">
                TEST A COURSE OR GROUP JOIN CODE
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto font-medium">
                Experience how student enrollment works by trying an invite code right now:
              </p>
            </div>

            <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1c1917] space-y-6 max-w-2xl mx-auto">
              <form onSubmit={handleTestCodeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Enter Invite or Join Code (e.g. <button type="button" onClick={() => setTestCode('CS401-7M9K')} className="text-[#E11D48] underline cursor-pointer">CS401-7M9K</button> or <button type="button" onClick={() => setTestCode('GRP-8812')} className="text-[#E11D48] underline cursor-pointer">GRP-8812</button>)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testCode}
                      onChange={(e) => {
                        setTestCode(e.target.value);
                        setCodeTested(false);
                      }}
                      placeholder="e.g. CS401-7M9K"
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-[#1c1917] font-mono text-sm uppercase font-bold focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#1c1917] hover:bg-[#E11D48] text-white font-display text-base tracking-wider rounded-xl transition-colors cursor-pointer shadow-sm"
                    >
                      VERIFY CODE
                    </button>
                  </div>
                </div>
              </form>

              {codeTested && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-600 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Valid Code Recognized: {testCode.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Course: <span className="font-bold">CS401 Cloud Computing</span> &bull; Professor: <span className="font-bold">Prof. Priyansh</span>. Ready to create or join group under this syllabus!
                  </p>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#E11D48] hover:underline pt-1"
                  >
                    <span>Sign up or login to enter this course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* SECTION 3: SYSTEM ARCHITECTURE PILLARS */}
        <section id="pillars" className="p-6 sm:p-12 lg:p-16 border-b border-[#E6DFD5]">
          <div className="max-w-6xl mx-auto space-y-12">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b-2 border-[#1c1917] pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E11D48]">
                  SYSTEM DESIGN
                </span>
                <h2 className="font-display text-4xl sm:text-5xl text-[#1c1917] tracking-tight">
                  THE FOUR CORE ADVANTAGES
                </h2>
              </div>
              <div className="font-script text-2xl text-stone-500">
                Designed for precision, scalability, and ease
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#1c1917] space-y-3 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#E11D48] text-white flex items-center justify-center font-bold">
                  <Share2 className="w-6 h-6" />
                </div>
                <h4 className="font-display text-2xl text-[#1c1917]">COURSE LINKS</h4>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  Professors generate unique codes (e.g. <span className="font-mono font-bold text-stone-900">CS401-7M9K</span>) that keep students and groups strictly segregated by subject.
                </p>
              </div>

              <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#1c1917] space-y-3 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#1c1917] text-white flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="font-display text-2xl text-[#1c1917]">PEER INVITES</h4>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  Add peers to your team directly by their registered Student ID or university email, or distribute an 8-character group code.
                </p>
              </div>

              <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#1c1917] space-y-3 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <Database className="w-6 h-6" />
                </div>
                <h4 className="font-display text-2xl text-[#1c1917]">INSTITUTIONAL RELIABILITY</h4>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  Engineered with resilient cloud replication, automated verification, and fail-safe redundancy. Guarantees zero lost coursework or submissions across cohorts.
                </p>
              </div>

              <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#1c1917] space-y-3 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-display text-2xl text-[#1c1917]">REAL-TIME BADGES</h4>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  Visual progress bars, submission timestamp badges, and group analytics keep everyone aligned before deadlines expire.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 4: FAQ ACCORDION */}
        <section id="faq" className="p-6 sm:p-12 lg:p-16 border-b border-[#E6DFD5] bg-[#F5F0E8]/40">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E11D48]">
                NEED TO KNOW
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-[#1c1917] tracking-tight">
                FREQUENTLY ASKED QUESTIONS
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-[#FAF7F2] border-2 border-[#1c1917] rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#1c1917] transition-all"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-stone-50"
                    >
                      <span className="font-display text-xl text-[#1c1917] tracking-wide">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#E11D48] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 font-medium leading-relaxed border-t border-[#D5CCC0]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* SECTION 5: DIRECT CONTACT BANNER & FOOTER */}
        <footer className="p-8 sm:p-16 bg-[#1c1917] text-[#FAF7F2] space-y-12">
          
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-stone-900 to-stone-800 border-2 border-stone-700 p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-mono font-bold text-[#E11D48] uppercase tracking-wider">
                DIRECT HELP DESK &bull; 24/7 SUPPORT
              </span>
              <h3 className="font-display text-2xl sm:text-3xl tracking-wide">
                SEND A MESSAGE DIRECTLY
              </h3>
              <p className="text-xs text-stone-400">
                Inquiries dispatched directly to <span className="text-white font-bold font-mono">priyansh191882@gmail.com</span>
              </p>
            </div>

            <button
              onClick={openSupport}
              className="px-6 py-3 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              Contact Support
            </button>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-stone-800 text-xs text-stone-400">
            <div className="flex items-center gap-3">
              <span className="font-display text-xl text-[#FAF7F2] tracking-wider">JOINEAZY</span>
              <span>&bull; Academic Student &amp; Group Management Platform</span>
            </div>
            <div>
              &copy; 2026 JoinEazy. All rights reserved. Academic Coursework &amp; Group Collaboration Platform.
            </div>
          </div>

        </footer>

      </div>

    </div>
  );
}
