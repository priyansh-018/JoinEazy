import React, { useState } from 'react';
import api from '../services/api';
import {
  HelpCircle,
  X,
  Mail,
  CheckCircle2,
  FileQuestion,
  ExternalLink,
  Send,
  Sparkles,
  Copy,
  Check,
  Inbox
} from 'lucide-react';

const TARGET_EMAIL = 'priyansh191882@gmail.com';

export default function SupportModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const mailSubject = `[JoinEazy Support] ${subject} - from ${name || 'User'}`;
  const mailBody = `Hello JoinEazy Support,

Name: ${name}
Email: ${email}
Topic: ${subject}

Message:
${message}

---------------------------
Sent via JoinEazy Academic Management Platform`;

  const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${TARGET_EMAIL}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      // 1. Send to backend endpoint for persistence & SMTP dispatch
      await api.post('/support/contact', {
        name,
        email,
        subject,
        message,
        recipient: TARGET_EMAIL
      });

      // 2. Open default mail client or Gmail web link
      try {
        window.open(mailtoUrl, '_blank');
      } catch (err) {
        console.log('Popup mailto prevented by browser', err);
      }

      setSent(true);
    } catch (err) {
      console.warn('Backend contact route notification:', err);
      // Even if backend fails, trigger mailto directly so user is never blocked
      window.open(mailtoUrl, '_blank');
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(TARGET_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const resetAndClose = () => {
    setSent(false);
    setName('');
    setEmail('');
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 text-white flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              JoinEazy Support & Help Desk
            </div>
            <h3 className="text-xl font-bold tracking-tight">How can we help you?</h3>
            <p className="text-indigo-100 text-xs mt-1">
              Have questions about student groups, OneDrive submissions, or course links?
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Email Banner */}
        <div className="px-6 py-2.5 bg-indigo-50/80 border-b border-indigo-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-indigo-900 font-semibold truncate">
            <Inbox className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-slate-600 font-normal">Direct Support Inbox:</span>
            <span className="font-mono font-bold text-indigo-700 truncate">{TARGET_EMAIL}</span>
          </div>
          <button
            onClick={handleCopyEmail}
            type="button"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-[11px] font-bold transition-all shrink-0 ml-2 shadow-xs"
            title="Copy recipient email"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">Message Dispatched!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your inquiry has been processed and routed to <span className="font-bold text-indigo-600">{TARGET_EMAIL}</span>. We will review your query and reply to <span className="font-semibold text-slate-700">{email}</span> shortly.
              </p>
            </div>

            {/* Quick Email Launcher Options */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Direct Email Launchers:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={gmailWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-red-500" />
                  Open in Gmail Web
                  <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                </a>

                <a
                  href={mailtoUrl}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all shadow-xs"
                >
                  <Inbox className="w-3.5 h-3.5 text-indigo-600" />
                  Open Default Mail App
                  <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Quick Tips */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <FileQuestion className="w-4 h-4 text-indigo-600 mb-1.5" />
                <div className="text-xs font-bold text-indigo-950">2-Step Verification</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Confirm OneDrive upload before submitting coursework.
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <Sparkles className="w-4 h-4 text-indigo-600 mb-1.5" />
                <div className="text-xs font-bold text-slate-900">Course Invite Links</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Professors copy share links to group their students.
                </div>
              </div>
            </div>

            {/* Support Ticket Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@university.edu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Topic / Issue Type
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Group Creation or Join Code Issue">Group Creation or Join Code Issue</option>
                  <option value="Two-Step Verification Question">Two-Step Verification Question</option>
                  <option value="Course Links & Professor Roster">Course Links & Professor Roster</option>
                  <option value="Technical Bug Report">Technical Bug Report</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Your Message
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  Sends directly to <span className="font-semibold text-slate-600">{TARGET_EMAIL}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
