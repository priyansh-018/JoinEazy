import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Mail,
  MessageSquare,
  CheckCircle2,
  FileQuestion,
  ExternalLink,
  Send,
  Sparkles
} from 'lucide-react';

export default function SupportModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 text-white flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              JoinEazy Support & Knowledge Base
            </div>
            <h3 className="text-xl font-bold tracking-tight">How can we help you?</h3>
            <p className="text-indigo-100 text-xs mt-1">
              Have questions about student groups, OneDrive submissions, or course links?
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Message Received!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Thank you for reaching out. Our academic support team will review your query and reply to your email shortly.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Quick Tips */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <FileQuestion className="w-4 h-4 text-indigo-600 mb-1.5" />
                <div className="text-xs font-bold text-indigo-950">2-Step Verification</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Confirm external OneDrive upload before final submission.
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <Sparkles className="w-4 h-4 text-indigo-600 mb-1.5" />
                <div className="text-xs font-bold text-slate-900">Course Invite Links</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Professors can copy links from the Courses tab to share with classes.
                </div>
              </div>
            </div>

            {/* Support Ticket Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
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
                    Email Address
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
                  placeholder="Describe your question or how we can assist..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
