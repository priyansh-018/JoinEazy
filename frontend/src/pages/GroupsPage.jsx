import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/Badge';
import {
  Users,
  Plus,
  UserPlus,
  KeyRound,
  Trash2,
  LogOut,
  Crown,
  Check,
  Copy,
  AlertCircle,
  Sparkles,
  Search
} from 'lucide-react';

export default function GroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals & form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courseCodeInput, setCourseCodeInput] = useState('');

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const [activeGroupIdForInvite, setActiveGroupIdForInvite] = useState(null);
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const fetchMyGroups = async () => {
    try {
      setLoading(true);
      const [groupsRes, coursesRes] = await Promise.all([
        api.get('/groups/my'),
        api.get('/courses/all')
      ]);

      if (groupsRes.data.success) {
        setGroups(groupsRes.data.groups);
      }
      if (coursesRes.data.success) {
        setAvailableCourses(coursesRes.data.courses);
      }
    } catch (err) {
      setError('Failed to fetch your groups.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      const res = await api.post('/groups', {
        name: newGroupName,
        description: newGroupDesc,
        course_id: selectedCourseId || null,
        course_join_code: courseCodeInput.trim() || null
      });
      if (res.data.success) {
        setSuccessMsg(`Group "${newGroupName}" created successfully!`);
        setShowCreateModal(false);
        setNewGroupName('');
        setNewGroupDesc('');
        setSelectedCourseId('');
        setCourseCodeInput('');
        fetchMyGroups();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group.');
    }
  };

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    try {
      const res = await api.post('/groups/join', { join_code: joinCode });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setShowJoinModal(false);
        setJoinCode('');
        fetchMyGroups();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group.');
    }
  };

  const handleAddMember = async (groupId) => {
    if (!studentIdentifier.trim()) return;
    try {
      const res = await api.post(`/groups/${groupId}/members`, {
        student_identifier: studentIdentifier
      });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setStudentIdentifier('');
        setActiveGroupIdForInvite(null);
        fetchMyGroups();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member.');
    }
  };

  const handleRemoveMember = async (groupId, memberUserId, isSelf) => {
    if (!window.confirm(isSelf ? 'Are you sure you want to leave this group?' : 'Remove this member from the group?')) {
      return;
    }
    try {
      const res = await api.delete(`/groups/${groupId}/members/${memberUserId}`);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        fetchMyGroups();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member.');
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Collaborative Student Groups
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Form groups, invite peers via student email or ID, and complete team submissions together.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => setShowJoinModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors"
          >
            <KeyRound className="w-4 h-4 text-slate-500" />
            Join with Code
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Group
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold ml-2">Dismiss</button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex justify-between items-center">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="font-bold ml-2">Dismiss</button>
        </div>
      )}

      {/* Group Cards List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groups.map((grp) => (
            <div
              key={grp.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-3">
                  <div>
                    {grp.course_name && (
                      <div className="mb-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-semibold">
                        <span className="font-mono font-bold">[{grp.course_code}]</span>
                        <span>{grp.course_name}</span>
                        {grp.professor_name && (
                          <span className="text-slate-400 font-normal">• Prof. {grp.professor_name}</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{grp.name}</h3>
                      {grp.my_role === 'leader' ? (
                        <Badge variant="leader" label="Leader" />
                      ) : (
                        <Badge variant="member" label="Member" />
                      )}
                    </div>
                    {grp.description && (
                      <p className="text-xs text-slate-500 mt-1">{grp.description}</p>
                    )}
                  </div>

                  {/* Join code pill */}
                  <button
                    onClick={() => copyToClipboard(grp.join_code)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono font-bold transition-colors"
                    title="Click to copy join code"
                  >
                    {grp.join_code}
                    {copiedCode === grp.join_code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Members Section */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Team Members ({grp.members?.length || 0})
                    </span>
                    <button
                      onClick={() => setActiveGroupIdForInvite(activeGroupIdForInvite === grp.id ? null : grp.id)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Add Member
                    </button>
                  </div>

                  {/* Add member input box */}
                  {activeGroupIdForInvite === grp.id && (
                    <div className="mb-4 p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
                      <div className="text-[11px] font-bold text-indigo-900">
                        Add peer by Student Email or Student ID:
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. emma@joineazy.com or STU2024-002"
                          value={studentIdentifier}
                          onChange={(e) => setStudentIdentifier(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-indigo-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => handleAddMember(grp.id)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Member avatars & list */}
                  <div className="space-y-2">
                    {grp.members?.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-[11px]">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {member.name}
                              {member.id === user.id && (
                                <span className="text-[10px] text-indigo-600 font-semibold">(You)</span>
                              )}
                              {member.role === 'leader' && (
                                <Crown className="w-3 h-3 text-amber-500" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {member.email} {member.student_id ? `• ${member.student_id}` : ''}
                            </div>
                          </div>
                        </div>

                        {/* Remove or Leave Action */}
                        {(grp.my_role === 'leader' || member.id === user.id) && (
                          <button
                            onClick={() => handleRemoveMember(grp.id, member.id, member.id === user.id)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                            title={member.id === user.id ? 'Leave group' : 'Remove member'}
                          >
                            {member.id === user.id ? (
                              <LogOut className="w-4 h-4" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
                <span>Created {new Date(grp.created_at).toLocaleDateString()}</span>
                <span>Share Code: <strong className="text-slate-700 font-mono">{grp.join_code}</strong></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300 max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">You are not in any group yet</h3>
          <p className="text-xs text-slate-500">
            Create your own study and project group, or join an existing group using a join code provided by a classmate.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Join with Code
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100"
            >
              Create Group
            </button>
          </div>
        </div>
      )}

      {/* Modal: Create Group */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create a New Group</h3>
            <p className="text-xs text-slate-500 mb-4">
              You will automatically become the group leader and can invite your classmates.
            </p>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subject / Course (Optional)
                </label>
                {availableCourses.length > 0 ? (
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="">-- Choose Subject / Course (or enter code below) --</option>
                    {availableCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.course_code}] {c.name} (Prof. {c.professor_name})
                      </option>
                    ))}
                  </select>
                ) : null}

                <div className="mt-2">
                  <input
                    type="text"
                    value={courseCodeInput}
                    onChange={(e) => setCourseCodeInput(e.target.value.toUpperCase())}
                    placeholder="Or enter Professor's Course Code (e.g. CS401-7M9K)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Distributed Systems Lab Group 4"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description / Topic (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="What is this group focusing on?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Join with Code */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Join Group with Code</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter the unique 8-character join code provided by your group leader.
            </p>

            <form onSubmit={handleJoinByCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Join Code
                </label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. GRP-ALPHA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Join Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
