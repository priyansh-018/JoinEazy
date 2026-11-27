import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Badge from '../components/Badge';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  BookOpen,
  Calendar,
  X,
  Search,
  Check
} from 'lucide-react';

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search/filter query for groups inside assignment creation modal
  const [groupSearchQuery, setGroupSearchQuery] = useState('');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    onedrive_link: '',
    target_type: 'all',
    submission_type: 'group',
    course_id: '',
    group_ids: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [assignRes, groupsRes, coursesRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/groups/all'),
        api.get('/courses/my')
      ]);

      if (assignRes.data.success) {
        setAssignments(assignRes.data.assignments);
      }
      if (groupsRes.data.success) {
        setAllGroups(groupsRes.data.groups);
      }
      if (coursesRes.data.success) {
        setCourses(coursesRes.data.courses || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assignment data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      onedrive_link: 'https://onedrive.live.com/?id=joineazy-coursework',
      target_type: 'all',
      submission_type: 'group',
      course_id: courses.length > 0 ? courses[0].id : '',
      group_ids: []
    });
    setEditingAssignment(null);
    setGroupSearchQuery('');
    setShowCreateModal(true);
  };

  const openEditModal = (assign) => {
    setFormData({
      title: assign.title,
      description: assign.description,
      due_date: new Date(assign.due_date).toISOString().slice(0, 16),
      onedrive_link: assign.onedrive_link,
      target_type: assign.target_type,
      submission_type: assign.submission_type || 'group',
      course_id: assign.course_id || (courses.length > 0 ? courses[0].id : ''),
      group_ids: assign.assigned_groups ? assign.assigned_groups.map(g => g.id) : []
    });
    setEditingAssignment(assign);
    setGroupSearchQuery('');
    setShowCreateModal(true);
  };

  const handleGroupCheckboxToggle = (groupId) => {
    const current = [...formData.group_ids];
    const index = current.indexOf(groupId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(groupId);
    }
    setFormData({ ...formData, group_ids: current });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        const res = await api.put(`/assignments/${editingAssignment.id}`, formData);
        if (res.data.success) {
          setSuccessMsg('Assignment updated successfully!');
        }
      } else {
        const res = await api.post('/assignments', formData);
        if (res.data.success) {
          setSuccessMsg('Assignment created and published successfully!');
        }
      }
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete assignment: "${title}"?`)) {
      return;
    }
    try {
      const res = await api.delete(`/assignments/${id}`);
      if (res.data.success) {
        setSuccessMsg('Assignment deleted successfully.');
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete assignment.');
    }
  };

  // Filter groups in modal by selected course and search query
  const availableGroupsForCourse = allGroups.filter((g) => {
    if (formData.course_id) {
      if (String(g.course_id) !== String(formData.course_id)) {
        return false;
      }
    }
    if (groupSearchQuery.trim()) {
      const q = groupSearchQuery.toLowerCase();
      const nameMatch = g.name.toLowerCase().includes(q);
      const memberMatch = g.members && g.members.some(
        m => m.name.toLowerCase().includes(q) || (m.student_id && m.student_id.toLowerCase().includes(q))
      );
      return nameMatch || memberMatch;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#1c1917] text-[#FAF7F2] border-2 border-[#1c1917] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#E11D48] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-stone-300 mb-3">
            <FileText className="w-3.5 h-3.5 text-[#E11D48]" />
            Coursework Administration
          </div>
          <h1 className="font-display text-3xl sm:text-5xl tracking-wide text-white">
            MANAGE COURSE ASSIGNMENTS
          </h1>
          <p className="font-script text-xl text-stone-300 mt-1 max-w-xl">
            Post assignments for specific subjects, share OneDrive links, and track group confirmations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/courses"
            className="px-4 py-2.5 bg-white/10 hover:bg-white text-white hover:text-[#1c1917] text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            My Courses &amp; Links
          </Link>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Assignment
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
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-600 text-emerald-800 text-xs font-bold flex justify-between items-center shadow-xs">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="font-bold ml-2 underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Assignments Table / Cards */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#1c1917] border-t-[#E11D48] rounded-full animate-spin"></div>
        </div>
      ) : assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assign) => (
            <div
              key={assign.id}
              className="bg-white rounded-3xl p-6 border-2 border-[#1c1917] shadow-[5px_5px_0px_0px_#1c1917] hover:shadow-[7px_7px_0px_0px_#1c1917] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {assign.course_code && (
                      <span className="px-3 py-1 rounded-lg bg-[#1c1917] text-white text-xs font-mono font-bold">
                        {assign.course_code}
                      </span>
                    )}
                    <h3 className="font-display text-2xl text-[#1c1917] tracking-tight">
                      {assign.title}
                    </h3>
                    {assign.submission_type === 'individual' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-300">
                        Individual
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                        Group (Leader Acknowledgment)
                      </span>
                    )}
                    {assign.target_type === 'all' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-800 border border-stone-300">
                        <Users className="w-3 h-3" /> All Groups in Subject
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-[#E11D48] border border-rose-200">
                        <Users className="w-3 h-3" /> Specific Groups ({assign.assigned_groups?.length || 0})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 font-medium leading-relaxed max-w-3xl">
                    {assign.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#E11D48]" />
                      Due: {new Date(assign.due_date).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <a
                      href={assign.onedrive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#E11D48] hover:underline flex items-center gap-1"
                    >
                      OneDrive Submission Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/admin/assignments/${assign.id}/submissions`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1c1917] hover:bg-[#E11D48] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Submissions
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => openEditModal(assign)}
                    className="p-2 text-stone-500 hover:text-stone-900 border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                    title="Edit assignment"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(assign.id, assign.title)}
                    className="p-2 text-stone-500 hover:text-rose-600 border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                    title="Delete assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Targeted Groups Pills */}
              {assign.target_type === 'specific_groups' && assign.assigned_groups && assign.assigned_groups.length > 0 && (
                <div className="pt-2 border-t border-stone-200 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Assigned to:
                  </span>
                  {assign.assigned_groups.map((g) => (
                    <span
                      key={g.id}
                      className="px-2.5 py-0.5 rounded-lg bg-[#FAF7F2] text-stone-800 text-xs font-bold border border-stone-300"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-[#1c1917] max-w-lg mx-auto space-y-4 shadow-[4px_4px_0px_0px_#1c1917]">
          <FileText className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-display text-2xl text-[#1c1917]">NO ASSIGNMENTS POSTED YET</h3>
          <p className="text-xs text-stone-600 font-medium max-w-sm mx-auto">
            Create coursework deliverables with due dates and OneDrive submission folder links for your students.
          </p>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-[#1c1917] hover:bg-[#E11D48] text-white font-display text-sm uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
          >
            Create First Assignment
          </button>
        </div>
      )}

      {/* Modal: Create/Edit Assignment */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-[8px_8px_0px_0px_#1c1917] border-2 border-[#1c1917] my-8 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b-2 border-[#1c1917] pb-3">
              <h3 className="font-display text-2xl text-[#1c1917]">
                {editingAssignment ? 'EDIT ASSIGNMENT' : 'CREATE NEW ASSIGNMENT'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Select Course / Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Subject / Course
                </label>
                {courses.length > 0 ? (
                  <select
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E11D48] bg-white cursor-pointer"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.course_code}] {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-900 font-medium flex items-center justify-between">
                    <span>You haven't created any courses yet.</span>
                    <Link
                      to="/admin/courses"
                      className="font-bold text-[#E11D48] underline"
                    >
                      Create a Course first
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Milestone 2: Cloud Systems Architecture & Implementation"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  Description &amp; Submission Instructions
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail what students should upload into the shared OneDrive directory..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Due Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={formData.target_type}
                    onChange={(e) => setFormData({ ...formData, target_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#E11D48] bg-white cursor-pointer"
                  >
                    <option value="all">All Groups in Subject</option>
                    <option value="specific_groups">Specific Groups</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                    Submission Format
                  </label>
                  <select
                    value={formData.submission_type || 'group'}
                    onChange={(e) => setFormData({ ...formData, submission_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#E11D48] bg-white cursor-pointer"
                  >
                    <option value="group">Group Submission (Leader)</option>
                    <option value="individual">Individual Submission</option>
                  </select>
                </div>
              </div>

              {/* Specific Groups Selector */}
              {formData.target_type === 'specific_groups' && (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#1c1917] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                      Select Groups to Assign ({availableGroupsForCourse.length} available):
                    </span>
                  </div>

                  {/* Search box for groups / student names */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search by student name, ID, or group name..."
                      value={groupSearchQuery}
                      onChange={(e) => setGroupSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border-2 border-[#1c1917] bg-white font-medium"
                    />
                  </div>

                  {/* List of groups with student member rosters */}
                  {availableGroupsForCourse.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                      {availableGroupsForCourse.map((grp) => (
                        <label
                          key={grp.id}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-stone-300 hover:border-[#1c1917] transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.group_ids.includes(grp.id)}
                            onChange={() => handleGroupCheckboxToggle(grp.id)}
                            className="mt-0.5 rounded border-stone-400 text-[#E11D48] focus:ring-[#E11D48]"
                          />
                          <div className="text-xs flex-1">
                            <div className="font-bold text-stone-900 flex items-center justify-between">
                              <span>{grp.name}</span>
                              <span className="text-[10px] text-[#E11D48] font-bold">
                                {grp.members?.length || 0} members
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              Students:{' '}
                              {grp.members && grp.members.length > 0
                                ? grp.members.map(m => `${m.name} (${m.student_id || 'N/A'})`).join(', ')
                                : 'No members yet'}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-stone-500 font-medium">
                      No student groups have formed for this subject yet.
                      <div className="mt-1">
                        <Link to="/admin/courses" className="text-[#E11D48] font-bold underline">
                          Share your Course Invite Link
                        </Link>{' '}
                        with students to invite them to form groups.
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1">
                  OneDrive Submission Folder Link
                </label>
                <input
                  type="url"
                  required
                  value={formData.onedrive_link}
                  onChange={(e) => setFormData({ ...formData, onedrive_link: e.target.value })}
                  placeholder="https://onedrive.live.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t-2 border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1c1917] hover:bg-[#E11D48] text-white font-display text-sm uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#E11D48] transition-all cursor-pointer"
                >
                  {editingAssignment ? 'Save Changes' : 'Publish Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
