import React, { useState, useEffect } from 'react';

interface FocusNextModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
  defaultCourse?: string;
}

export const FocusNextModal: React.FC<FocusNextModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'Study Session Block',
  defaultCourse = 'General Academic Sprint',
}) => {
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

  useEffect(() => {
    setSecondsRemaining(durationMinutes * 60);
  }, [durationMinutes]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      setIsActive(false);
      if (!isBreak) {
        alert('🎉 Focus session completed! Time for a 5-minute restorative break.');
        setIsBreak(true);
        setDurationMinutes(5);
      } else {
        alert('Break completed! Ready for the next focus sprint.');
        setIsBreak(false);
        setDurationMinutes(25);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining, isBreak]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = durationMinutes * 60;
  const progressPercent = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/20 p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow ambient background in modal */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-400 text-[24px]">flare</span>
            <h3 className="text-xl font-bold font-headline-md text-white">Focus Next Sprint</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Topic Title & Course */}
        <div className="relative z-10 space-y-1">
          <div className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider">
            {defaultCourse}
          </div>
          <h4 className="text-lg font-extrabold text-white">{defaultTopic}</h4>
        </div>

        {/* Timer Display Circle / Pill */}
        <div className="relative z-10 flex flex-col items-center justify-center py-6 space-y-4">
          <div className="text-6xl md:text-7xl font-mono font-extrabold tracking-tight text-white drop-shadow-md">
            {formattedTime}
          </div>

          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden max-w-xs">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 pt-2">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setDurationMinutes(mins);
                  setIsActive(false);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  durationMinutes === mins
                    ? 'bg-white text-indigo-950 font-bold shadow-md'
                    : 'bg-white/5 hover:bg-white/15 text-white/70 border border-white/10'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Notes input */}
        <div className="relative z-10 space-y-1.5">
          <label className="block text-xs font-semibold text-white/70">
            Sprint Objectives / Active Notes
          </label>
          <textarea
            rows={2}
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Record key takeaways, formulas derived, or questions to ask the professor..."
            className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-xs text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-indigo-400 resize-none shadow-inner"
          />
        </div>

        {/* Actions Bar */}
        <div className="relative z-10 flex items-center justify-between pt-2">
          <button
            onClick={() => {
              setIsActive(false);
              setSecondsRemaining(durationMinutes * 60);
            }}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-semibold"
          >
            Reset
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isActive ? 'pause' : 'play_arrow'}
            </span>
            <span>{isActive ? 'Pause Sprint' : 'Start Focus Session'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
