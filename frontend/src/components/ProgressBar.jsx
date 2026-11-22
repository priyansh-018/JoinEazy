import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  color = 'crimson',
  size = 'md',
  showPercentage = true
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5'
  };

  const colorClasses = {
    indigo: 'bg-[#1c1917]',
    crimson: 'bg-[#E11D48]',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    blue: 'bg-[#1c1917]'
  };

  return (
    <div className="w-full font-sans">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-bold uppercase tracking-wider text-stone-700">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono text-stone-900">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-[#FAF7F2] border-2 border-[#1c1917] rounded-full overflow-hidden p-0.5 ${sizeClasses[size] || sizeClasses.md}`}>
        <div
          className={`${colorClasses[color] || 'bg-[#E11D48]'} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
