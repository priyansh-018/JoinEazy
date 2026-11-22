import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  Crown,
  Users,
  Flame,
  ShieldCheck
} from 'lucide-react';

export default function Badge({ type = 'status', variant = 'submitted', label, iconOnly = false }) {
  const icons = {
    submitted: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    verified: <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />,
    pending: <Clock className="w-3.5 h-3.5 text-amber-600" />,
    overdue: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
    leader: <Crown className="w-3.5 h-3.5 text-amber-500" />,
    member: <Users className="w-3.5 h-3.5 text-slate-500" />,
    all_caught_up: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    momentum: <Flame className="w-4 h-4 text-orange-500" />,
    first_submission: <Award className="w-4 h-4 text-purple-500" />
  };

  const styles = {
    submitted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    verified: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    overdue: 'bg-rose-50 text-rose-700 border-rose-200',
    leader: 'bg-amber-50 text-amber-800 border-amber-200',
    member: 'bg-slate-100 text-slate-700 border-slate-200',
    all_caught_up: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    momentum: 'bg-orange-50 text-orange-800 border-orange-200',
    first_submission: 'bg-purple-50 text-purple-800 border-purple-200'
  };

  const defaultLabels = {
    submitted: 'Submitted',
    verified: 'Verified by Professor',
    pending: 'Pending Submission',
    overdue: 'Past Due',
    leader: 'Leader',
    member: 'Member'
  };

  const displayLabel = label || defaultLabels[variant] || variant;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[variant] || 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {icons[variant]}
      {!iconOnly && <span>{displayLabel}</span>}
    </span>
  );
}
