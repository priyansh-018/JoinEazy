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
      const res = await api.get('/groups/all');
      if (res.data.success) {
        setGroups(res.data.groups);
      }
    } catch (err) {
      setError('Failed to fetch student groups.');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          All Student Groups
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review collaborative groups formed by students across courses.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((grp) => (
            <div
              key={grp.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-base font-bold text-slate-900">{grp.name}</h3>
                  <button
                    onClick={() => copyCode(grp.join_code)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono font-bold"
                    title="Copy join code"
                  >
                    {grp.join_code}
                    {copiedCode === grp.join_code ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </div>

                {grp.description && (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {grp.description}
                  </p>
                )}

                <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Created by:</span>
                    <span className="font-bold text-slate-800">{grp.creator_name || 'Student'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Members:</span>
                    <span className="font-extrabold text-indigo-600">{grp.member_count} students</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Formed On:</span>
                    <span className="text-slate-600">{new Date(grp.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300 max-w-lg mx-auto">
          <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No student groups found</h3>
          <p className="text-xs text-slate-500 mt-1">Students will form groups when they log in.</p>
        </div>
      )}
    </div>
  );
}
