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
    submitted: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
    verified: <ShieldCheck className="w-3.5 h-3.5 text-white" />,
    pending: <Clock className="w-3.5 h-3.5 text-amber-800" />,
    overdue: <AlertCircle className="w-3.5 h-3.5 text-[#E11D48]" />,
    leader: <Crown className="w-3.5 h-3.5 text-amber-600" />,
    member: <Users className="w-3.5 h-3.5 text-stone-700" />,
    all_caught_up: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    momentum: <Flame className="w-4 h-4 text-[#E11D48]" />,
    first_submission: <Award className="w-4 h-4 text-purple-700" />
  };

  const styles = {
    submitted: 'bg-emerald-100 text-emerald-950 border-2 border-emerald-700',
    verified: 'bg-[#1c1917] text-white border-2 border-[#1c1917]',
    pending: 'bg-amber-100 text-amber-950 border-2 border-amber-600',
    overdue: 'bg-rose-100 text-[#E11D48] border-2 border-[#E11D48]',
    leader: 'bg-amber-50 text-amber-950 border-2 border-amber-600',
    member: 'bg-[#FAF7F2] text-stone-800 border-2 border-[#1c1917]',
    all_caught_up: 'bg-emerald-100 text-emerald-950 border-2 border-emerald-700',
    momentum: 'bg-rose-100 text-[#E11D48] border-2 border-[#E11D48]',
    first_submission: 'bg-purple-100 text-purple-950 border-2 border-purple-800'
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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
        styles[variant] || 'bg-stone-100 text-stone-800 border-2 border-[#1c1917]'
      }`}
    >
      {icons[variant]}
      {!iconOnly && <span>{displayLabel}</span>}
    </span>
  );
}
