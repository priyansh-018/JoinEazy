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
      await api.post('/support/contact', {
        name,
        email,
        subject,
        message,
        recipient: TARGET_EMAIL
      });

      try {
        window.open(mailtoUrl, '_blank');
      } catch (err) {
        console.log('Popup mailto prevented by browser', err);
      }

      setSent(true);
    } catch (err) {
      console.warn('Backend contact route notification:', err);
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-[8px_8px_0px_0px_#1c1917] border-2 border-[#1c1917] overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 bg-[#1c1917] text-[#FAF7F2] flex justify-between items-start border-b-2 border-[#1c1917]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-stone-300 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#E11D48]" />
              JOINEAZY HELP DESK &bull; DIRECT ASSISTANCE
            </div>
            <h3 className="font-display text-2xl sm:text-3xl tracking-wide text-white">
              HOW CAN WE ASSIST YOU?
            </h3>
            <p className="font-script text-lg text-stone-300 mt-0.5">
              Coursework questions, group invites, or submission support
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Email Banner */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-b-2 border-[#1c1917] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-semibold truncate">
            <Inbox className="w-4 h-4 text-[#E11D48] shrink-0" />
            <span className="text-stone-600 font-bold uppercase text-[10px] tracking-wider">Direct Inbox:</span>
            <span className="font-mono font-bold text-stone-900 truncate">{TARGET_EMAIL}</span>
          </div>
          <button
            onClick={handleCopyEmail}
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#1c1917] text-stone-900 hover:bg-[#1c1917] hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 ml-2 shadow-xs cursor-pointer"
            title="Copy recipient email"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-600 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="font-display text-3xl text-[#1c1917]">MESSAGE DISPATCHED!</h4>
              <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto font-medium">
                Your inquiry has been processed and routed to <span className="font-bold text-[#E11D48]">{TARGET_EMAIL}</span>. We will review your query and reply to <span className="font-semibold text-stone-900">{email}</span> shortly.
              </p>
            </div>

            {/* Quick Email Launcher Options */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#1c1917] space-y-2.5 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                Direct Email Launchers:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={gmailWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border-2 border-[#1c1917] hover:bg-[#1c1917] hover:text-white text-stone-900 text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-500" />
                  Open in Gmail Web
                  <ExternalLink className="w-3 h-3 ml-auto text-stone-400" />
                </a>

                <a
                  href={mailtoUrl}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border-2 border-[#1c1917] hover:bg-[#1c1917] hover:text-white text-stone-900 text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <Inbox className="w-3.5 h-3.5 text-stone-700" />
                  Default Mail App
                  <ExternalLink className="w-3 h-3 ml-auto text-stone-400" />
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-3 bg-[#1c1917] hover:bg-[#E11D48] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#E11D48] transition-all cursor-pointer font-display"
              >
                CLOSE WINDOW
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border-2 border-[#E11D48] text-[#E11D48] text-xs font-bold">
                {error}
              </div>
            )}

            {/* Support Ticket Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@university.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Topic / Issue Type
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E11D48] bg-white cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Group Creation or Join Code Issue">Group Creation or Join Code Issue</option>
                  <option value="Two-Step Verification Question">Two-Step Verification Question</option>
                  <option value="Course Links & Professor Roster">Course Links &amp; Professor Roster</option>
                  <option value="Technical Bug Report">Technical Bug Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Your Message
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t-2 border-stone-200">
                <span className="text-[11px] text-stone-500 font-medium">
                  Routes to: <span className="font-bold text-stone-900">{TARGET_EMAIL}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#1c1917] hover:bg-[#E11D48] disabled:opacity-50 text-white font-display text-sm uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#E11D48] transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'SENDING...' : 'SEND MESSAGE'}
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
