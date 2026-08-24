import React, { useState } from 'react';

interface SupportSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'support' | 'settings';
}

export const SupportSettingsModal: React.FC<SupportSettingsModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'settings',
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'support'>(initialMode);
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lmsSyncEnabled, setLmsSyncEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-white/20 p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('settings')}
              className={`text-base md:text-lg font-bold font-headline-md pb-1 border-b-2 transition-all ${
                activeTab === 'settings'
                  ? 'border-indigo-400 text-white'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              Academic Settings
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`text-base md:text-lg font-bold font-headline-md pb-1 border-b-2 transition-all ${
                activeTab === 'support'
                  ? 'border-indigo-400 text-white'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              Support &amp; Guide
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="relative z-10 space-y-5">
          {activeTab === 'settings' ? (
            <div className="space-y-4">
              {/* User Profile Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 border border-white/30 flex items-center justify-center font-bold text-base text-white shadow-md">
                  AL
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Alex Lin</h4>
                  <p className="text-xs text-white/60">alex.lin@university.edu</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Student • Class of 2025
                  </span>
                </div>
              </div>

              {/* AI Engine Model Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white/80">
                  AI Intelligence Model
                </label>
                <select
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:bg-white/10 focus:border-indigo-400"
                >
                  <option value="gemini-2.5-flash" className="bg-slate-900">
                    Gemini 2.5 Flash (Ultra-Fast Syllabus Indexer &amp; QA)
                  </option>
                  <option value="gemini-2.5-pro" className="bg-slate-900">
                    Gemini 2.5 Pro (Deep Mathematical &amp; Algorithmic Reasoning)
                  </option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <h5 className="text-xs font-bold text-white">LMS Auto-Sync</h5>
                    <p className="text-[11px] text-white/50">
                      Sync Canvas/Blackboard assignments and grades automatically
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={lmsSyncEnabled}
                    onChange={(e) => setLmsSyncEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <h5 className="text-xs font-bold text-white">Focus Deadlines Notifications</h5>
                    <p className="text-[11px] text-white/50">
                      Receive proactive study sprint alerts 48h prior to exams
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs text-white/80">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-indigo-400">
                    lightbulb
                  </span>
                  <span>How to Get the Most Out of SyllabusAI</span>
                </h4>
                <ul className="list-disc pl-4 space-y-1.5 text-white/70">
                  <li>
                    <strong className="text-white">Upload PDFs in AI Lab:</strong> Drop your course syllabi, lab rubrics, or assignment schedules to enable instant Q&amp;A.
                  </li>
                  <li>
                    <strong className="text-white">Use "Focus Next":</strong> Run targeted 25-minute Pomodoro study sprints mapped directly to your upcoming exam units.
                  </li>
                  <li>
                    <strong className="text-white">Generate Subtasks:</strong> Click "AI Breakdown" in the Tasks tab to transform vague assignments into structured checklists.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="font-bold text-white text-sm">Need Help or Feedback?</h4>
                <p className="text-white/60">
                  Encountered a bug or want to suggest new academic workflows? Contact our student development team at <span className="text-indigo-300 font-mono">support@syllabusai.edu</span>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 flex items-center justify-end pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-white hover:bg-white/90 text-indigo-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
