import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Badge from '../components/Badge';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Calendar,
  Users,
  CheckCircle2,
  FolderOpen,
  X,
  Search,
  ArrowRight
} from 'lucide-react';

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    onedrive_link: '',
    target_type: 'all',
    group_ids: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignRes, groupsRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/groups/all')
      ]);

      if (assignRes.data.success) {
        setAssignments(assignRes.data.assignments);
      }
      if (groupsRes.data.success) {
        setAllGroups(groupsRes.data.groups);
      }
    } catch (err) {
      setError('Failed to fetch assignments.');
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
      group_ids: []
    });
    setEditingAssignment(null);
    setShowCreateModal(true);
  };

  const openEditModal = (assign) => {
    setFormData({
      title: assign.title,
      description: assign.description,
      due_date: new Date(assign.due_date).toISOString().slice(0, 16),
      onedrive_link: assign.onedrive_link,
      target_type: assign.target_type,
      group_ids: assign.assigned_groups ? assign.assigned_groups.map(g => g.id) : []
    });
    setEditingAssignment(assign);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Course Assignments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Post assignments, share OneDrive submission folders, assign to all or specific groups, and track confirmations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Assignment
        </button>
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

      {/* Assignments Table / Cards */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assign) => (
            <div
              key={assign.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {assign.title}
                    </h3>
                    {assign.target_type === 'all' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <Users className="w-3 h-3" /> All Groups
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <Users className="w-3 h-3" /> Specific Groups ({assign.assigned_groups?.length || 0})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                    {assign.description}
                  </p>
                </div>

                <div className="flex sm:flex-col items-end gap-1 flex-shrink-0 text-right">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Due: {new Date(assign.due_date).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="text-xs font-extrabold text-indigo-600 mt-1">
                    {assign.submission_count} / {assign.total_target_groups} Groups Submitted
                  </div>
                </div>
              </div>

              {/* Action Buttons Ribbon */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={assign.onedrive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                    OneDrive Folder
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  {assign.target_type === 'specific_groups' && assign.assigned_groups && (
                    <div className="text-[11px] text-slate-500 hidden md:block">
                      Assigned to: {assign.assigned_groups.map(g => g.name).join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(assign)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    title="Edit assignment"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(assign.id, assign.title)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/admin/assignments/${assign.id}/submissions`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    Track Submissions
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300 max-w-lg mx-auto space-y-4">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No assignments created yet</h3>
          <p className="text-xs text-slate-500">
            Publish your first assignment and provide a OneDrive folder for students to submit to.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md transition-colors"
          >
            Create Assignment
          </button>
        </div>
      )}

      {/* Modal: Create / Edit Assignment */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Milestone 2: Cloud Infrastructure & Database Setup"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description & Submission Instructions
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail what students should upload into the shared OneDrive directory..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={formData.target_type}
                    onChange={(e) => setFormData({ ...formData, target_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">Assign to All Student Groups</option>
                    <option value="specific_groups">Assign to Specific Groups</option>
                  </select>
                </div>
              </div>

              {/* Specific Groups Selector */}
              {formData.target_type === 'specific_groups' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-700">Select Groups to Assign:</div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5">
                    {allGroups.map((grp) => (
                      <label key={grp.id} className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.group_ids.includes(grp.id)}
                          onChange={() => handleGroupCheckboxToggle(grp.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{grp.name} ({grp.member_count} members)</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  OneDrive Submission Folder Link
                </label>
                <input
                  type="url"
                  required
                  value={formData.onedrive_link}
                  onChange={(e) => setFormData({ ...formData, onedrive_link: e.target.value })}
                  placeholder="https://onedrive.live.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
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
