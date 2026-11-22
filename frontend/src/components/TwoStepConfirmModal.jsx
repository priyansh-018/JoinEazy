import React, { useState } from 'react';
import {
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  X,
  FileCheck2,
  Users
} from 'lucide-react';

export default function TwoStepConfirmModal({
  isOpen,
  onClose,
  assignment,
  groups,
  onSubmit,
  isSubmitting
}) {
  const [selectedGroupId, setSelectedGroupId] = useState(
    groups && groups.length > 0 ? groups[0].id : ''
  );
  const [step1Confirmed, setStep1Confirmed] = useState(false);
  const [step2Confirmed, setStep2Confirmed] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !assignment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedGroupId) {
      setError('Please select the group submitting this assignment.');
      return;
    }

    if (!step1Confirmed) {
      setError('Please verify Step 1: Confirm that files have been uploaded to OneDrive.');
      return;
    }

    if (!step2Confirmed) {
      setError('Please verify Step 2: Final confirmation before submitting.');
      return;
    }

    onSubmit({
      assignment_id: assignment.id,
      group_id: parseInt(selectedGroupId, 10),
      confirmation_step_1: true,
      confirmation_step_2: true,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex justify-between items-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              Two-Step Submission Verification
            </div>
            <h3 className="text-xl font-bold tracking-tight">Confirm Assignment Submission</h3>
            <p className="text-indigo-100 text-xs mt-1">
              {assignment.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* External OneDrive Link Callout */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                External OneDrive Folder
              </div>
              <p className="text-xs text-blue-700 mt-0.5">
                Ensure your group's documents are uploaded here first.
              </p>
            </div>
            <a
              href={assignment.onedrive_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Open OneDrive <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Select Submitting Group */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Submitting Group
            </label>
            {groups && groups.length > 0 ? (
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.member_role === 'leader' ? 'Leader' : 'Member'})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 rounded-lg bg-amber-50 text-amber-800 text-xs">
                You must be a member of a group to submit assignments.
              </div>
            )}
          </div>

          {/* Verification Steps Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Required Confirmations
            </h4>

            {/* Step 1 Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={step1Confirmed}
                onChange={(e) => setStep1Confirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Step 1: "Yes, I have submitted"
                </span>
                <p className="text-slate-500 mt-0.5">
                  I confirm that our team has uploaded the final project files into the designated OneDrive folder.
                </p>
              </div>
            </label>

            {/* Step 2 Checkbox */}
            <label className={`flex items-start gap-3 cursor-pointer group ${!step1Confirmed ? 'opacity-50 pointer-events-none' : ''}`}>
              <input
                type="checkbox"
                disabled={!step1Confirmed}
                checked={step2Confirmed}
                onChange={(e) => setStep2Confirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Step 2: Final Submission Confirmation
                </span>
                <p className="text-slate-500 mt-0.5">
                  I confirm this submission on behalf of my group and understand it will be logged and visible to the professor.
                </p>
              </div>
            </label>
          </div>

          {/* Submission Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Submission Notes / Remarks (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Uploaded 'GroupAlpha_Assignment1.zip' with OpenAPI specs and system diagrams."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-normal text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !step1Confirmed || !step2Confirmed}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? 'Confirming...' : 'Complete Two-Step Submission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
