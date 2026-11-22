import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  color = 'indigo',
  size = 'md',
  showPercentage = true
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colorClasses = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          {label && <span className="font-semibold text-slate-700">{label}</span>}
          {showPercentage && <span className="font-bold text-slate-900">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeClasses[size] || sizeClasses.md}`}>
        <div
          className={`${colorClasses[color] || colorClasses.indigo} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
