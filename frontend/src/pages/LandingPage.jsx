import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Sparkle
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Scroll tracking for parallax & rotational physics
  const [scrollY, setScrollY] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Interactive 2-step verification preview state inside the capsule
  const [simStep, setSimStep] = useState(0); // 0: unsubmitted, 1: step 1 checked, 2: confirmed

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

  // Compute scroll-linked transformation factors
  // 0 to 800px: Hero tilt to upright
  const tiltAngle = Math.max(0, 22 - (scrollY / 400) * 22); // from 22deg to 0deg
  const heroScale = Math.min(1.08, 1 + (scrollY / 1200) * 0.08);
  const parallaxTextY1 = scrollY * 0.35;
  const parallaxTextY2 = scrollY * 0.2;

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
      a: 'Yes, 100%. JoinEazy is integrated with a cloud PostgreSQL database (Neon DB) with schema enforcement and automated persistent backups, ensuring zero data loss across sessions, server restarts, or device switches.'
    },
    {
      q: 'How do I reach human support if I encounter an issue?',
      a: 'Click "Need Help?" or "Contact Support" anywhere on the site. Inquiries route directly to priyansh191882@gmail.com and are logged to our cloud database ticket queue.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1c1917] relative selection:bg-[#E11D48] selection:text-white font-sans overflow-x-hidden">
      {/* Editorial Paper Grid Background */}
      <div className="fixed inset-0 pointer-events-none paper-grain opacity-60 z-0"></div>

      {/* LEFT FIXED DOCK NAVIGATION (Inspired by Lagunitas / Sandhill Studio style) */}
      <aside className="fixed left-0 top-0 bottom-0 w-16 sm:w-20 border-r border-[#E6DFD5] bg-[#FAF7F2]/90 backdrop-blur-sm z-50 flex flex-col justify-between items-center py-6">
        {/* Menu Toggle */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full border border-[#D5CCC0] hover:border-[#1c1917] flex items-center justify-center text-[#1c1917] hover:bg-white transition-all shadow-xs cursor-pointer group"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <a
            href="#features"
            className="w-10 h-10 rounded-full border border-transparent hover:border-[#D5CCC0] flex items-center justify-center text-stone-500 hover:text-[#1c1917] transition-all"
            title="Jump to Features"
          >
            <Layers className="w-4 h-4" />
          </a>

          <button
            onClick={() => setIsSupportOpen(true)}
            className="w-10 h-10 rounded-full border border-transparent hover:border-[#D5CCC0] flex items-center justify-center text-stone-500 hover:text-[#1c1917] transition-all"
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
          <div className="w-80 h-full bg-[#FAF7F2] border-r border-[#E6DFD5] p-8 flex flex-col justify-between shadow-2xl">
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <span className="font-display text-2xl tracking-wider text-[#1c1917]">NAVIGATION</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors"
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
                  01. OVERVIEW
                </a>
                <a
                  href="#verification"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#E11D48] hover:translate-x-2 transition-all"
                >
                  02. 2-STEP VERIFY
                </a>
                <a
                  href="#features"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#E11D48] hover:translate-x-2 transition-all"
                >
                  03. SYSTEM PILLARS
                </a>
                <a
                  href="#roles"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#E11D48] hover:translate-x-2 transition-all"
                >
                  04. ROLE LINEUP
                </a>
                <a
                  href="#faq"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#E11D48] hover:translate-x-2 transition-all"
                >
                  05. FREQUENT QUESTIONS
                </a>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#E6DFD5] space-y-3">
              <div className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                Support & Contact
              </div>
              <p className="text-xs text-stone-700">
                Inquiries routed to <span className="font-bold text-[#E11D48]">priyansh191882@gmail.com</span>
              </p>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSupportOpen(true);
                }}
                className="w-full py-2.5 bg-[#1c1917] hover:bg-[#E11D48] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Open Support Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT CONTAINER (Padded for Left Fixed Dock) */}
      <div className="pl-16 sm:pl-20 min-h-screen relative z-10">
        
        {/* TOP BAR */}
        <header className="h-20 border-b border-[#E6DFD5] px-6 sm:px-12 flex items-center justify-between sticky top-0 bg-[#FAF7F2]/90 backdrop-blur-md z-40">
          {/* Logo & Stamp */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-display text-3xl sm:text-4xl tracking-wider text-[#1c1917] group-hover:text-[#E11D48] transition-colors">
                JOINEAZY
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-[#D5CCC0] text-stone-600 hidden sm:inline-block">
                STUDENT & GROUP SYSTEM
              </span>
            </Link>

            {/* Vintage Circular Stamp Badge */}
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#E6DFD5]">
              <div className="w-8 h-8 rounded-full border border-dashed border-[#1c1917] flex items-center justify-center font-display text-[10px] text-[#1c1917]">
                2026
              </div>
              <div className="text-[10px] font-bold text-stone-500 leading-tight">
                NEON CLOUD DB<br />
                <span className="text-emerald-700">PERSISTENT</span>
              </div>
            </div>
          </div>

          {/* Right Action Pill Buttons */}
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
                  className="px-4 py-2 border border-[#D5CCC0] hover:border-[#1c1917] text-[#1c1917] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-white transition-all cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </header>

        {/* SECTION 1: EDITORIAL HERO WITH 3D ROTATING CENTERPIECE */}
        <section id="overview" className="relative min-h-[90vh] flex flex-col justify-between p-6 sm:p-12 overflow-hidden border-b border-[#E6DFD5]">
          
          {/* GIANT PARALLAX CONDENSED BACKGROUND TYPOGRAPHY (Like the Lagunitas "UNLIMITED RELEASE IPA") */}
          <div
            className="absolute inset-0 pointer-events-none select-none flex flex-col justify-center items-center opacity-[0.14] text-[#E11D48] font-display text-[15vw] sm:text-[18vw] leading-[0.8] tracking-tight whitespace-nowrap -z-10"
            style={{ transform: `translateY(-${parallaxTextY1}px)` }}
          >
            <div>ACADEMIC</div>
            <div>WORKFLOW</div>
          </div>

          {/* TOP ACCENT TAG */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
            <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping"></span>
            <span>Task 1 &bull; Student, Group & Assignment Management Platform</span>
          </div>

          {/* MAIN HERO CENTER AREA WITH ROTATING 3D TABLET CAPSULE */}
          <div className="relative my-12 flex items-center justify-center">
            
            {/* The 3D Floating Academic Device Capsule */}
            <div
              className="relative w-full max-w-lg transition-transform duration-300 ease-out z-20"
              style={{
                transform: `rotate(${tiltAngle}deg) scale(${heroScale})`,
                perspective: '1000px'
              }}
            >
              {/* Dynamic Drop Shadow beneath the tilted centerpiece */}
              <div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-stone-900/25 blur-2xl rounded-full transition-all"
                style={{
                  transform: `translateX(-50%) scale(${1 - tiltAngle / 60})`,
                  opacity: 0.6 + (1 - tiltAngle / 22) * 0.3
                }}
              ></div>

              {/* The Tablet / Capsule Body */}
              <div className="bg-gradient-to-b from-stone-900 via-stone-800 to-black text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-stone-800 ring-1 ring-white/20 relative overflow-hidden">
                {/* Gloss Reflection Overlay */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

                {/* Device Screen Header */}
                <div className="flex justify-between items-center pb-4 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="font-mono text-stone-300 text-[11px]">JOINEAZY LIVE CORE</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-stone-300 font-mono text-[10px]">
                    PORT 3000 &bull; NEON DB
                  </span>
                </div>

                {/* Center Content: Interactive 2-Step Simulation on Device */}
                <div className="py-6 space-y-4">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex justify-between items-center">
                    <span>Course: CS401 &bull; Cloud Computing</span>
                    <span className="text-[#E11D48] font-bold">DUE IN 3 DAYS</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                    Milestone 2: Database & Backend Architecture
                  </h3>

                  {/* External OneDrive Directory pill */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-stone-300">
                      <FolderOpen className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate max-w-[220px]">onedrive.live.com/?id=cs401-groups</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                      OneDrive
                    </span>
                  </div>

                  {/* Two-Step Verification Progress on Screen */}
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-stone-300">Submission Verification State:</span>
                      <span className={simStep === 2 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                        {simStep === 2 ? 'Verified & Timestamped' : simStep === 1 ? 'Step 1 Confirmed' : 'Pending Upload'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setSimStep(simStep === 0 ? 1 : 0)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          simStep >= 1
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/10 hover:bg-white/20 text-stone-300'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Step 1: Uploaded</span>
                      </button>

                      <button
                        onClick={() => setSimStep(simStep === 1 ? 2 : simStep === 2 ? 0 : 0)}
                        disabled={simStep < 1}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          simStep === 2
                            ? 'bg-[#E11D48] text-white'
                            : simStep === 1
                            ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                            : 'bg-white/5 text-stone-600 cursor-not-allowed'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Step 2: Confirm</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Device Screen Footer */}
                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-stone-400">
                  <span className="font-mono">Team: Binary Pioneers (4 members)</span>
                  <span className="text-emerald-400 font-bold font-mono">100% PERSISTED</span>
                </div>
              </div>
            </div>
          </div>

          {/* HERO BOTTOM SPLIT: EDITORIAL COPY (LEFT) + SPECS CARD (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-8">
            
            {/* Left: Handwritten script + Bold Headline */}
            <div className="lg:col-span-7 space-y-3">
              <div className="font-script text-3xl sm:text-4xl text-[#E11D48] -rotate-2">
                Effortless coursework management &bull; Built for modern universities
              </div>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#1c1917] leading-[0.95]">
                STUDENT, GROUP &amp; ASSIGNMENT SYSTEM
              </h1>
              <p className="text-sm sm:text-base text-stone-600 max-w-xl font-medium leading-relaxed">
                Connect students into collaborative groups with unique invite links, link external OneDrive submission folders, enforce two-step submission verification, and monitor real-time group progress.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/register"
                  className="px-6 py-3.5 bg-[#1c1917] hover:bg-[#E11D48] text-[#FAF7F2] font-display text-lg tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>LAUNCH WORKSPACE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#verification"
                  className="px-6 py-3.5 border-2 border-[#1c1917] hover:bg-[#1c1917] hover:text-[#FAF7F2] text-[#1c1917] font-display text-lg tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  HOW IT WORKS
                </a>
              </div>
            </div>

            {/* Right: Clean Editorial Specs Card (Framed like the ABV 6.2% Box in the video) */}
            <div className="lg:col-span-5 bg-[#FAF7F2] border-2 border-[#1c1917] p-6 rounded-2xl shadow-[6px_6px_0px_0px_#1c1917] space-y-4">
              <div className="flex justify-between items-center border-b-2 border-[#1c1917] pb-3">
                <span className="font-display text-xl tracking-wider text-[#1c1917]">SYSTEM SPECIFICATIONS</span>
                <span className="text-[10px] font-mono font-bold bg-[#E11D48] text-white px-2 py-0.5 rounded">V1.0 LIVE</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">VERIFICATION</div>
                  <div className="font-display text-3xl sm:text-4xl text-[#1c1917]">2-STEP</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">Two-step check eliminates accidental or premature submissions.</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">ISOLATION</div>
                  <div className="font-display text-3xl sm:text-4xl text-[#E11D48]">100%</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">Unique Course Invite Links isolate groups per subject.</div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D5CCC0] flex justify-between items-center text-xs text-stone-600">
                <span className="font-mono font-semibold">STORAGE: Neon PostgreSQL</span>
                <span className="font-bold text-emerald-700">&bull; ZERO DATA LOSS</span>
              </div>
            </div>

          </div>

        </section>

        {/* SECTION 2: THE TWO-STEP VERIFICATION ENGINE (Parallax Header like MOUTHFEELS) */}
        <section id="verification" className="relative p-6 sm:p-12 lg:p-16 border-b border-[#E6DFD5] overflow-hidden">
          
          {/* Big Background Parallax Text */}
          <div
            className="absolute inset-0 pointer-events-none select-none flex justify-center items-center opacity-[0.12] text-[#1c1917] font-display text-[16vw] leading-none tracking-tight whitespace-nowrap -z-10"
            style={{ transform: `translateY(${parallaxTextY2 - 80}px)` }}
          >
            TWO-STEP VERIFY
          </div>

          <div className="max-w-6xl mx-auto space-y-12">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E11D48]">
                CORE SUBMISSION PROTOCOL
              </span>
              <h2 className="font-display text-4xl sm:text-6xl text-[#1c1917] tracking-tight">
                HOW TWO-STEP VERIFICATION WORKS
              </h2>
              <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto font-medium">
                Eliminate the confusion of missed deadlines and incomplete group work with our foolproof submission protocol.
              </p>
            </div>

            {/* 3 Step Editorial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-7 shadow-[4px_4px_0px_0px_#1c1917] space-y-4 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-[#1c1917] text-[#FAF7F2] font-display text-2xl flex items-center justify-center">
                  01
                </div>
                <h3 className="font-display text-2xl text-[#1c1917] tracking-wide">
                  UPLOAD TO ONEDRIVE
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  Students access the direct OneDrive folder URL designated by their professor. Upload code, PDFs, diagrams, or zip archives without file size limits.
                </p>
                <div className="pt-2 text-[11px] font-mono font-bold text-sky-700 bg-sky-50 p-2.5 rounded-xl border border-sky-200">
                  Direct OneDrive Directory Link
                </div>
              </div>

              <div className="bg-white border-2 border-[#E11D48] rounded-3xl p-7 shadow-[4px_4px_0px_0px_#E11D48] space-y-4 hover:-translate-y-1 transition-transform relative">
                <div className="absolute top-4 right-4 bg-[#E11D48] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Step 1
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#E11D48] text-white font-display text-2xl flex items-center justify-center">
                  02
                </div>
                <h3 className="font-display text-2xl text-[#1c1917] tracking-wide">
                  INITIATE CONFIRMATION
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  The team leader toggles "Yes, I have submitted to OneDrive" inside the modal and adds optional release notes for the professor.
                </p>
                <div className="pt-2 text-[11px] font-mono font-bold text-[#E11D48] bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  First-Pass Checkpoint &bull; Logged
                </div>
              </div>

              <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-7 shadow-[4px_4px_0px_0px_#1c1917] space-y-4 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-display text-2xl flex items-center justify-center">
                  03
                </div>
                <h3 className="font-display text-2xl text-[#1c1917] tracking-wide">
                  PEER SYNC &amp; BADGES
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  Group members receive immediate notification to confirm their individual participation. Visual progress meters fill to 100% and award verified badges.
                </p>
                <div className="pt-2 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  Individual Timestamp Verification
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* SECTION 3: SYSTEM PILLARS WITH INK-STAMP ACCENTS (Like the hops/malt splashes in the video) */}
        <section id="features" className="p-6 sm:p-12 lg:p-16 border-b border-[#E6DFD5] bg-[#F5F0E8]/50">
          <div className="max-w-6xl mx-auto space-y-12">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b-2 border-[#1c1917] pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                  ARCHITECTURAL ADVANTAGES
                </span>
                <h2 className="font-display text-4xl sm:text-5xl text-[#1c1917] tracking-tight">
                  THE FOUR SYSTEM PILLARS
                </h2>
              </div>
              <div className="font-script text-2xl text-[#E11D48]">
                Engineered for clarity and accountability
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Pillar 1 */}
              <div className="bg-[#FAF7F2] border border-[#D5CCC0] rounded-2xl p-6 space-y-3 relative overflow-hidden group hover:border-[#1c1917] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#E11D48] text-white flex items-center justify-center font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <h4 className="font-display text-2xl text-[#1c1917] tracking-wide">
                  COURSE INVITE LINKS
                </h4>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  Professors generate unique codes (e.g. <span className="font-mono font-bold text-stone-900">CS401-7M9K</span>) that keep students and groups strictly segregated by subject.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-[#FAF7F2] border border-[#D5CCC0] rounded-2xl p-6 space-y-3 relative overflow-hidden group hover:border-[#1c1917] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#1c1917] text-white flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-display text-2xl text-[#1c1917] tracking-wide">
                  STUDENT ID INVITES
                </h4>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  Add peers to your team directly by their registered Student ID or university email, or distribute an 8-character group code.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-[#FAF7F2] border border-[#D5CCC0] rounded-2xl p-6 space-y-3 relative overflow-hidden group hover:border-[#1c1917] transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="font-display text-2xl text-[#1c1917] tracking-wide">
                  CLOUD DB PERSISTENCE
                </h4>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  Connected to Neon Cloud PostgreSQL with automatic schema verification and local disk backup. Zero lost submissions or courses.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="bg-[#FAF7F2] border border-[#D5CCC0] rounded-2xl p-6 space-y-3 relative overflow-hidden group hover:border-[#1c1917] transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-display text-2xl text-[#1c1917] tracking-wide">
                  BADGES &amp; PROGRESS
                </h4>
                <p className="text-xs text-stone-600 font-medium leading-relaxed">
                  Visual progress bars, submission timestamp badges, and group analytics keep everyone aligned before deadlines expire.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 4: ROLE SHOWCASE (Like the bottle lineup "YEAR ROUND" in the video) */}
        <section id="roles" className="p-6 sm:p-12 lg:p-16 border-b border-[#E6DFD5]">
          <div className="max-w-6xl mx-auto space-y-10">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E11D48]">
                MULTI-ROLE ARCHITECTURE
              </span>
              <h2 className="font-display text-4xl sm:text-6xl text-[#1c1917] tracking-tight">
                BUILT FOR EVERY STAKEHOLDER
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto font-medium">
                Whether you are a student group leader or a professor managing hundreds of students, JoinEazy adapts to your workflow.
              </p>
            </div>

            {/* Role Cards Lineup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 space-y-4 shadow-[4px_4px_0px_0px_#1c1917]">
                <div className="text-[11px] font-mono font-bold text-[#E11D48] uppercase">ROLE 01</div>
                <h3 className="font-display text-2xl text-[#1c1917]">GROUP LEADER</h3>
                <ul className="text-xs text-stone-600 space-y-2 font-medium">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Create group under subject</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Invite peers via ID/Email</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Submit 2-step verification</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 space-y-4 shadow-[4px_4px_0px_0px_#1c1917]">
                <div className="text-[11px] font-mono font-bold text-[#E11D48] uppercase">ROLE 02</div>
                <h3 className="font-display text-2xl text-[#1c1917]">TEAM MEMBER</h3>
                <ul className="text-xs text-stone-600 space-y-2 font-medium">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Join via 8-char code</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Access OneDrive directory</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Confirm own participation</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 space-y-4 shadow-[4px_4px_0px_0px_#1c1917]">
                <div className="text-[11px] font-mono font-bold text-[#E11D48] uppercase">ROLE 03</div>
                <h3 className="font-display text-2xl text-[#1c1917]">PROFESSOR</h3>
                <ul className="text-xs text-stone-600 space-y-2 font-medium">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Create subjects &amp; links</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Target all or specific groups</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Audit submissions &amp; notes</li>
                </ul>
              </div>

              <div className="bg-white border-2 border-[#1c1917] rounded-3xl p-6 space-y-4 shadow-[4px_4px_0px_0px_#1c1917]">
                <div className="text-[11px] font-mono font-bold text-[#E11D48] uppercase">ROLE 04</div>
                <h3 className="font-display text-2xl text-[#1c1917]">ADMIN ANALYTICS</h3>
                <ul className="text-xs text-stone-600 space-y-2 font-medium">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Cohort completion rates</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Group-wise breakdowns</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Overdue alerts &amp; tracking</li>
                </ul>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 5: FAQ ACCORDION */}
        <section id="faq" className="p-6 sm:p-12 lg:p-16 border-b border-[#E6DFD5] bg-[#F5F0E8]/50">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E11D48]">
                QUESTIONS &amp; ANSWERS
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

        {/* SECTION 6: DIRECT CONTACT BANNER & FOOTER */}
        <footer className="p-8 sm:p-16 bg-[#1c1917] text-[#FAF7F2] space-y-12">
          
          {/* Direct Support Card in Footer */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-stone-900 to-stone-800 border border-stone-700 p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-mono font-bold text-[#E11D48] uppercase tracking-wider">
                NEED DIRECT ASSISTANCE?
              </span>
              <h3 className="font-display text-2xl sm:text-3xl tracking-wide">
                SEND A MESSAGE DIRECTLY
              </h3>
              <p className="text-xs text-stone-400">
                Messages route directly to <span className="text-white font-bold font-mono">priyansh191882@gmail.com</span>
              </p>
            </div>

            <button
              onClick={() => setIsSupportOpen(true)}
              className="px-6 py-3 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              Contact Support
            </button>
          </div>

          {/* Footer Bottom Links */}
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-stone-800 text-xs text-stone-400">
            <div className="flex items-center gap-3">
              <span className="font-display text-xl text-[#FAF7F2] tracking-wider">JOINEAZY</span>
              <span>&bull; Full Stack Technical Task Assignment</span>
            </div>
            <div>
              &copy; 2026 JoinEazy Platform. Built for University Excellence.
            </div>
          </div>

        </footer>

      </div>

      {/* FLOATING ACTION BUTTON IN BOTTOM RIGHT CORNER (Like in the video) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsSupportOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1c1917] hover:bg-[#E11D48] text-white font-display text-sm tracking-wider shadow-2xl transition-all transform hover:scale-105 border-2 border-white/20 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>NEED HELP?</span>
        </button>
      </div>

      {/* SUPPORT MODAL (Configured to send to priyansh191882@gmail.com) */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

    </div>
  );
}
