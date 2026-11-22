import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'indigo' }) {
  const colorStyles = {
    indigo: {
      bg: 'bg-stone-100',
      text: 'text-[#1c1917]',
      border: 'border-[#1c1917]'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-300'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-300'
    },
    blue: {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-300'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-[#E11D48]',
      border: 'border-rose-300'
    }
  };

  const scheme = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-[#1c1917] shadow-[4px_4px_0px_0px_#1c1917] hover:shadow-[6px_6px_0px_0px_#1c1917] transition-all font-sans">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl ${scheme.bg} ${scheme.text} border ${scheme.border}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <div className="font-display text-3xl sm:text-4xl text-[#1c1917] tracking-tight">{value}</div>
        {subtitle && <p className="text-[11px] font-medium text-stone-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
