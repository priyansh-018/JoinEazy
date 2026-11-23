import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  Search,
  BookOpen,
  X,
  Share2
} from 'lucide-react';

export default function GroupsPage() {
  const { user } = useAuth();
  const location = useLocation();
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
  const [isInviting, setIsInviting] = useState(false);
  const [inviteGmailUrl, setInviteGmailUrl] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');

  // Auto-detect ?join=CODE in URL (e.g. from invite email link)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const joinCodeParam = params.get('join');
    if (joinCodeParam) {
      setJoinCode(joinCodeParam.toUpperCase());
      setShowJoinModal(true);
    }
  }, [location.search]);

  const fetchMyGroups = async () => {
    try {
      setLoading(true);
      setError('');
      const [groupsRes, coursesRes] = await Promise.all([
        api.get('/groups/my'),
        api.get('/courses/all')
      ]);

      if (groupsRes.data.success) {
        setGroups(groupsRes.data.groups);
      }
      if (coursesRes.data.success) {
        setAvailableCourses(coursesRes.data.courses || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your groups.');
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
      setIsInviting(true);
      setError('');
      const res = await api.post(`/groups/${groupId}/members`, {
        student_identifier: studentIdentifier.trim()
      });
      if (res.data.success) {
        setStudentIdentifier('');
        setActiveGroupIdForInvite(null);
        fetchMyGroups();
        setSuccessMsg(res.data.message);
        setInviteGmailUrl(res.data.gmailUrl || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send invitation.';
      setError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsInviting(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Page Header Banner */}
      <div className="bg-[#1c1917] text-[#FAF7F2] border-2 border-[#1c1917] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#E11D48] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-stone-300 mb-3">
            <Users className="w-3.5 h-3.5 text-[#E11D48]" />
            Student Team Collaboration
          </div>
          <h1 className="font-display text-3xl sm:text-5xl tracking-wide text-white">
            COLLABORATIVE STUDENT GROUPS
          </h1>
          <p className="font-script text-xl text-stone-300 mt-1 max-w-xl">
            Form groups under course subjects, invite peers via email or ID, and complete team submissions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white text-white hover:text-[#1c1917] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <KeyRound className="w-4 h-4" />
            Join with Code
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Group
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-[#E11D48] text-[#E11D48] text-xs font-bold flex justify-between items-center shadow-xs">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold ml-2 underline cursor-pointer">Dismiss</button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-600 text-emerald-800 text-xs font-bold flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
          <span>{successMsg}</span>
          <div className="flex items-center gap-2 shrink-0">
            {inviteGmailUrl && (
              <a
                href={inviteGmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-[#1c1917] hover:bg-[#E11D48] text-white rounded-xl text-xs font-display uppercase tracking-wider transition-colors inline-flex items-center gap-1 shadow-xs"
              >
                <span>Send via Gmail &rarr;</span>
              </a>
            )}
            <button
              onClick={() => {
                setSuccessMsg('');
                setInviteGmailUrl(null);
              }}
              className="font-bold ml-2 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Group Cards List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#1c1917] border-t-[#E11D48] rounded-full animate-spin"></div>
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groups.map((grp) => (
            <div
              key={grp.id}
              className="bg-white rounded-3xl p-6 border-2 border-[#1c1917] shadow-[5px_5px_0px_0px_#1c1917] hover:shadow-[7px_7px_0px_0px_#1c1917] transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-3">
                  <div>
                    {grp.course_name && (
                      <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF7F2] border border-stone-300 text-stone-900 text-xs font-bold">
                        <span className="font-mono text-[#E11D48]">[{grp.course_code}]</span>
                        <span>{grp.course_name}</span>
                        {grp.professor_name && (
                          <span className="text-stone-400 font-normal">&bull; Prof. {grp.professor_name}</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-2xl text-[#1c1917] tracking-tight">{grp.name}</h3>
                      {grp.my_role === 'leader' ? (
                        <Badge variant="leader" label="Leader" />
                      ) : (
                        <Badge variant="member" label="Member" />
                      )}
                    </div>
                    {grp.description && (
                      <p className="text-xs text-stone-600 mt-1 font-medium leading-relaxed">{grp.description}</p>
                    )}
                  </div>

                  {/* Join code pill */}
                  <button
                    onClick={() => copyToClipboard(grp.join_code)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 border-[#1c1917] bg-[#FAF7F2] hover:bg-[#1c1917] hover:text-white text-stone-900 text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
                    title="Click to copy join code"
                  >
                    <span>{grp.join_code}</span>
                    {copiedCode === grp.join_code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                    )}
                  </button>
                </div>

                {/* Members Section */}
                <div className="mt-5 pt-4 border-t-2 border-stone-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      Team Members ({grp.members?.length || 0})
                    </span>
                    <button
                      onClick={() => setActiveGroupIdForInvite(activeGroupIdForInvite === grp.id ? null : grp.id)}
                      className="text-xs font-bold uppercase tracking-wider text-[#E11D48] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Add Member
                    </button>
                  </div>

                  {/* Add member input box */}
                  {activeGroupIdForInvite === grp.id && (
                    <div className="mb-4 p-4 bg-[#FAF7F2] rounded-2xl border-2 border-[#1c1917] space-y-2">
                      <div className="text-[11px] font-bold text-stone-900 uppercase tracking-wider">
                        Invite peer by Student Email or Student ID:
                      </div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddMember(grp.id);
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          placeholder="e.g. emma@university.edu or STU2024-002"
                          value={studentIdentifier}
                          onChange={(e) => setStudentIdentifier(e.target.value)}
                          disabled={isInviting}
                          className="flex-1 px-3.5 py-2 text-xs rounded-xl border-2 border-[#1c1917] bg-white text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48] disabled:opacity-60"
                        />
                        <button
                          type="submit"
                          disabled={isInviting || !studentIdentifier.trim()}
                          className="px-4 py-2 bg-[#1c1917] hover:bg-[#E11D48] disabled:opacity-50 text-white text-xs font-display uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0"
                        >
                          {isInviting ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <span>Invite</span>
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Member list */}
                  <div className="space-y-2">
                    {grp.members?.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors text-xs font-medium border border-transparent hover:border-stone-200"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-white border border-[#1c1917] flex items-center justify-center font-display text-xs text-stone-900 shadow-xs">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 flex items-center gap-1.5">
                              {member.name}
                              {member.id === user.id && (
                                <span className="text-[10px] text-[#E11D48] font-bold">(You)</span>
                              )}
                              {member.role === 'leader' && (
                                <Crown className="w-3.5 h-3.5 text-amber-500" />
                              )}
                            </div>
                            <div className="text-[11px] text-stone-500 font-mono">
                              {member.email} {member.student_id ? `• ${member.student_id}` : ''}
                            </div>
                          </div>
                        </div>

                        {/* Remove or Leave Action */}
                        {(grp.my_role === 'leader' || member.id === user.id) && (
                          <button
                            onClick={() => handleRemoveMember(grp.id, member.id, member.id === user.id)}
                            className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
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

              <div className="mt-4 pt-3 border-t-2 border-stone-100 text-[11px] text-stone-500 flex justify-between items-center font-medium">
                <span>Created: {new Date(grp.created_at).toLocaleDateString()}</span>
                <span>Code: <strong className="text-stone-900 font-mono">{grp.join_code}</strong></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-[#1c1917] max-w-lg mx-auto space-y-4 shadow-[4px_4px_0px_0px_#1c1917]">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-[#1c1917] flex items-center justify-center mx-auto text-[#1c1917]">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-display text-2xl text-[#1c1917]">YOU ARE NOT IN ANY GROUP YET</h3>
          <p className="text-xs text-stone-600 font-medium max-w-sm mx-auto">
            Create your own project group under your subject, or join an existing group using a code provided by a classmate.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-5 py-2.5 border-2 border-[#1c1917] rounded-xl text-xs font-bold uppercase tracking-wider text-stone-800 hover:bg-stone-50 transition-all cursor-pointer"
            >
              Join with Code
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-[#1c1917] hover:bg-[#E11D48] text-white rounded-xl text-xs font-display uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Create Group
            </button>
          </div>
        </div>
      )}

      {/* Modal: Create Group */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-[8px_8px_0px_0px_#1c1917] border-2 border-[#1c1917] animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#1c1917] pb-3">
              <div>
                <h3 className="font-display text-2xl text-[#1c1917]">CREATE NEW GROUP</h3>
                <p className="text-xs text-stone-500 font-medium">You will automatically become the group leader.</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Subject / Course (Optional)
                </label>
                {availableCourses.length > 0 ? (
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E11D48] bg-white cursor-pointer"
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
                    className="w-full px-3.5 py-2 text-xs rounded-xl border-2 border-[#1c1917] uppercase font-mono font-bold placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Distributed Systems Lab Group 4"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Description / Topic (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="What is this group focusing on?"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t-2 border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1c1917] hover:bg-[#E11D48] text-white font-display text-sm uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#E11D48] transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-[8px_8px_0px_0px_#1c1917] border-2 border-[#1c1917] animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#1c1917] pb-3">
              <div>
                <h3 className="font-display text-2xl text-[#1c1917]">JOIN WITH CODE</h3>
                <p className="text-xs text-stone-500 font-medium">Enter 8-char code from group leader.</p>
              </div>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJoinByCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Join Code
                </label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. GRP-ALPHA"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-sm font-mono uppercase font-bold focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t-2 border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1c1917] hover:bg-[#E11D48] text-white font-display text-sm uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#E11D48] transition-all cursor-pointer"
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
