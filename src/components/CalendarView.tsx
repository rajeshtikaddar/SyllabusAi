import React, { useState } from 'react';
import { Deadline, Course } from '../types';

interface CalendarViewProps {
  deadlines: Deadline[];
  courses: Course[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ deadlines, courses }) => {
  const [currentMonth, setCurrentMonth] = useState('November 2024');

  // Days of November 2024 simulation (Starting Friday Nov 1st -> 30 days)
  const daysInMonth = 30;
  const startDayOffset = 5; // Friday
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankDays = Array.from({ length: startDayOffset }, (_, i) => i);

  // Map deadlines to day numbers
  const getDeadlinesForDay = (day: number) => {
    return deadlines.filter((dl) => {
      // e.g. "Nov 15" or "Nov 22"
      const parts = dl.dueDate.split(' ');
      if (parts[0]?.toLowerCase().startsWith('nov')) {
        const num = parseInt(parts[1], 10);
        return num === day;
      }
      return false;
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Calendar Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-headline-md text-white">
            Academic Schedule &amp; Milestones
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Synchronized with course timelines, lab deadlines, and exam schedules
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 backdrop-blur-md">
            <button
              onClick={() => setCurrentMonth('October 2024')}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="px-3 text-xs font-bold text-white">{currentMonth}</span>
            <button
              onClick={() => setCurrentMonth('December 2024')}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <button
            onClick={() => alert('Calendar synced with Google Calendar & Canvas LMS')}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span>Sync LMS</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Grid & Agenda Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Month Calendar Grid */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-4">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-white/40 uppercase tracking-wider pb-2 border-b border-white/10">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-2">
            {blankDays.map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[90px] rounded-2xl bg-transparent" />
            ))}

            {daysArray.map((day) => {
              const dayDeadlines = getDeadlinesForDay(day);
              const isToday = day === 15;

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-[95px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    isToday
                      ? 'bg-white/15 border-indigo-400/50 shadow-lg shadow-indigo-950/40'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-indigo-500 text-white' : 'text-white/70'
                      }`}
                    >
                      {day}
                    </span>
                    {dayDeadlines.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-1 mt-1">
                    {dayDeadlines.map((dl) => (
                      <div
                        key={dl.id}
                        title={dl.title}
                        className="px-1.5 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-[10px] text-indigo-200 font-medium truncate"
                      >
                        {dl.courseCode}: {dl.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Agenda & Deadlines */}
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="material-symbols-outlined text-indigo-400 text-[20px]">
                event_note
              </span>
              <h3 className="font-bold text-white text-sm">Key Exam &amp; Due Dates</h3>
            </div>

            <div className="space-y-3">
              {deadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-white/80">
                      {dl.courseCode}
                    </span>
                    <span className="text-[11px] font-semibold text-rose-300">
                      {dl.dueDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{dl.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-white/50">
                    <span className="material-symbols-outlined text-[13px]">flag</span>
                    <span className="capitalize">{dl.urgency} Urgency</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Office hours reminder card */}
          <div className="p-5 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
              Weekly Office Hours
            </h4>
            <div className="space-y-2 text-xs text-white/80">
              {courses.map((c) => (
                <div key={c.id} className="flex items-start justify-between gap-2 border-b border-white/5 pb-2">
                  <div>
                    <span className="font-bold text-white">{c.code}:</span>{' '}
                    <span className="text-white/60">{c.instructor}</span>
                  </div>
                  <span className="text-[11px] text-indigo-300 font-medium text-right flex-shrink-0">
                    {c.officeHours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
