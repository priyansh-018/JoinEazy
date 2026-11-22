import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'indigo' }) {
  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-50/70',
      text: 'text-indigo-600',
      border: 'border-indigo-100'
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-600',
      border: 'border-emerald-100'
    },
    amber: {
      bg: 'bg-amber-50/70',
      text: 'text-amber-600',
      border: 'border-amber-100'
    },
    blue: {
      bg: 'bg-blue-50/70',
      text: 'text-blue-600',
      border: 'border-blue-100'
    },
    rose: {
      bg: 'bg-rose-50/70',
      text: 'text-rose-600',
      border: 'border-rose-100'
    }
  };

  const scheme = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${scheme.bg} ${scheme.text} border ${scheme.border}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {subtitle && <p className="text-xs font-medium text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
