import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  X,
  FileCheck2,
  Users,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

export default function TwoStepConfirmModal({
  isOpen,
  onClose,
  assignment,
  groups,
  onSubmit,
  isSubmitting
}) {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [step1Confirmed, setStep1Confirmed] = useState(false);
  const [step2Confirmed, setStep2Confirmed] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Automatically select the appropriate group when modal opens or groups load
  useEffect(() => {
    if (isOpen && groups && groups.length > 0) {
      const matchingGroup = assignment?.course_id 
        ? groups.find((g) => String(g.course_id) === String(assignment.course_id)) 
        : null;
      const initialGroup = matchingGroup || groups[0];
      setSelectedGroupId(String(initialGroup.id));
      setError('');
    }
  }, [isOpen, assignment, groups]);

  if (!isOpen || !assignment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const targetGroupId = selectedGroupId || (groups && groups.length > 0 ? String(groups[0].id) : '');

    if (!targetGroupId) {
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
      group_id: parseInt(targetGroupId, 10),
      confirmation_step_1: true,
      confirmation_step_2: true,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-[8px_8px_0px_0px_#1c1917] border-2 border-[#1c1917] overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 bg-[#1c1917] text-[#FAF7F2] flex justify-between items-start border-b-2 border-[#1c1917]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-stone-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E11D48]" />
              TWO-STEP SUBMISSION VERIFICATION
            </div>
            <h3 className="font-display text-2xl sm:text-3xl tracking-wide text-white uppercase">
              CONFIRM ASSIGNMENT SUBMISSION
            </h3>
            <p className="font-script text-lg text-stone-300 mt-0.5">
              {assignment.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-[#E11D48] text-[#E11D48] text-xs font-bold flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* External OneDrive Link Callout */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#1c1917] flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1">
                <FolderOpen className="w-3.5 h-3.5 text-[#E11D48]" />
                External OneDrive Folder
              </div>
              <p className="text-xs text-stone-600 mt-0.5 font-medium">
                Ensure your group's documents are uploaded here first.
              </p>
            </div>
            <a
              href={assignment.onedrive_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 bg-[#1c1917] hover:bg-[#E11D48] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-colors shrink-0"
            >
              Open Folder <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>

          {/* Select Submitting Group */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
              Submitting Group
            </label>
            {groups && groups.length > 0 ? (
              <select
                value={selectedGroupId || (groups[0] ? String(groups[0].id) : '')}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] bg-white text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#E11D48] cursor-pointer"
              >
                {groups.map((g) => (
                  <option key={g.id} value={String(g.id)}>
                    {g.name} ({g.member_role === 'leader' || g.my_role === 'leader' ? 'Leader' : 'Member'})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-600 text-amber-900 text-xs font-bold">
                You must be a member of a group to submit assignments.
              </div>
            )}
          </div>

          {/* Verification Steps Box */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border-2 border-[#1c1917] space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Required Confirmations:
            </h4>

            {/* Step 1 Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={step1Confirmed}
                onChange={(e) => setStep1Confirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-2 border-[#1c1917] accent-[#E11D48] focus:ring-0 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-stone-900 group-hover:text-[#E11D48] transition-colors">
                  Step 1: "Yes, I have submitted to OneDrive"
                </span>
                <p className="text-stone-600 mt-0.5 font-medium leading-relaxed">
                  I confirm that our team has completed the upload into the designated OneDrive folder.
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
                className="mt-0.5 h-4 w-4 rounded border-2 border-[#1c1917] accent-[#E11D48] focus:ring-0 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-stone-900 group-hover:text-[#E11D48] transition-colors">
                  Step 2: Final Submission Confirmation
                </span>
                <p className="text-stone-600 mt-0.5 font-medium leading-relaxed">
                  I confirm this submission on behalf of my group and understand it will be logged in institutional records and verified by the instructor.
                </p>
              </div>
            </label>
          </div>

          {/* Submission Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
              Submission Notes / Remarks (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Uploaded 'GroupAlpha_Assignment1.zip' with OpenAPI specs and system diagrams."
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1c1917] bg-white text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t-2 border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !step1Confirmed || !step2Confirmed}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#1c1917] hover:bg-[#E11D48] disabled:opacity-50 disabled:cursor-not-allowed text-white font-display text-sm uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#E11D48] transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? 'CONFIRMING...' : 'COMPLETE TWO-STEP SUBMISSION'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
