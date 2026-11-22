import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Badge from '../components/Badge';
import {
  Users,
  Calendar,
  Mail,
  Copy,
  Check,
  Crown
} from 'lucide-react';

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/groups/all');
      if (res.data.success) {
        setGroups(res.data.groups);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch student groups.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#1c1917] text-[#FAF7F2] border-2 border-[#1c1917] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#E11D48]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-stone-300 mb-3">
          <Users className="w-3.5 h-3.5 text-[#E11D48]" />
          Student Collaboration Oversight
        </div>
        <h1 className="font-display text-3xl sm:text-5xl tracking-wide text-white">
          ALL STUDENT GROUPS
        </h1>
        <p className="font-script text-xl text-stone-300 mt-1 max-w-xl">
          Review collaborative groups formed by students across all enrolled courses and subjects.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-[#E11D48] text-[#E11D48] text-xs font-bold shadow-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#1c1917] border-t-[#E11D48] rounded-full animate-spin"></div>
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((grp) => (
            <div
              key={grp.id}
              className="bg-white rounded-3xl p-6 border-2 border-[#1c1917] shadow-[5px_5px_0px_0px_#1c1917] hover:shadow-[7px_7px_0px_0px_#1c1917] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-display text-2xl text-[#1c1917]">{grp.name}</h3>
                  <button
                    onClick={() => copyCode(grp.join_code)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border border-[#1c1917] bg-[#FAF7F2] hover:bg-[#1c1917] hover:text-white text-stone-900 text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
                    title="Copy join code"
                  >
                    <span>{grp.join_code}</span>
                    {copiedCode === grp.join_code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                    )}
                  </button>
                </div>

                {grp.description && (
                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    {grp.description}
                  </p>
                )}

                <div className="pt-3 border-t-2 border-stone-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-bold uppercase text-[10px] tracking-wider">Created By:</span>
                    <span className="font-bold text-stone-900">{grp.creator_name || 'Student'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-bold uppercase text-[10px] tracking-wider">Total Members:</span>
                    <span className="font-bold text-[#E11D48] font-mono">{grp.member_count} enrolled</span>
                  </div>
                </div>

                {/* Member avatars / roster */}
                {grp.members && grp.members.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                      Roster:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {grp.members.map((m) => (
                        <span
                          key={m.id}
                          className="px-2 py-0.5 rounded-lg bg-[#FAF7F2] border border-stone-300 text-[11px] font-semibold text-stone-800 flex items-center gap-1"
                        >
                          {m.role === 'leader' && <Crown className="w-3 h-3 text-amber-600" />}
                          {m.name} {m.student_id ? `(${m.student_id})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-[#1c1917] max-w-lg mx-auto space-y-4 shadow-[4px_4px_0px_0px_#1c1917]">
          <Users className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-display text-2xl text-[#1c1917]">NO GROUPS CREATED YET</h3>
          <p className="text-xs text-stone-600 font-medium max-w-sm mx-auto">
            Once students register and join your courses via your Course Invite Links, their collaborative groups will appear here.
          </p>
        </div>
      )}

    </div>
  );
}
