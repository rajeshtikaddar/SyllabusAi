import React from 'react';
import { Course, Deadline, NavTab } from '../types';

interface DashboardViewProps {
  courses: Course[];
  deadlines: Deadline[];
  onStartFocusSession: (topic: string, course: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenSyllabusUnit: (courseId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  courses,
  deadlines,
  onStartFocusSession,
  onNavigateTab,
  onOpenSyllabusUnit,
}) => {
  const nextUpCourse = courses.find((c) => c.code === 'MATH 201') || courses[0];
  const nextModule = nextUpCourse?.modules.find((m) => m.status === 'in_progress') || nextUpCourse?.modules[0];

  const totalModules = courses.reduce((acc, c) => acc + c.modules.length, 0);
  const completedModules = courses.reduce(
    (acc, c) => acc + c.modules.filter((m) => m.status === 'completed').length,
    0
  );
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Banner: Smart AI Focus Recommendation (Glass Card) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-2xl border border-white/15 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <span className="material-symbols-outlined text-[16px] text-indigo-400 animate-pulse">
                auto_awesome
              </span>
              <span>AI Priority Recommendation</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Resume: {nextModule?.title || 'Linear Algebra: Eigenvectors'}
            </h2>
            <p className="text-sm md:text-base text-white/70 leading-relaxed">
              Based on your syllabus schedule and upcoming quiz on Friday, spend 25 minutes reviewing{' '}
              <span className="text-white font-medium">{nextUpCourse?.name}</span> ({nextUpCourse?.code}).
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-white/60">
                <span className="material-symbols-outlined text-[16px] text-white/40">timer</span>
                <span>25m Focus Block</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/60">
                <span className="material-symbols-outlined text-[16px] text-white/40">menu_book</span>
                <span>Unit 3 / Week 4</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>High Exam Weight (20%)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
            <button
              onClick={() =>
                onStartFocusSession(
                  nextModule?.title || 'Linear Algebra Study Block',
                  `${nextUpCourse?.name} (${nextUpCourse?.code})`
                )
              }
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-white/90 text-indigo-950 font-bold text-sm shadow-xl shadow-indigo-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px] text-indigo-700">play_arrow</span>
              <span>Start Focus Session</span>
            </button>
            <button
              onClick={() => onNavigateTab('syllabus')}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-white/60">visibility</span>
              <span>View Syllabus Unit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Semester Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Overall Progress</p>
            <h3 className="text-2xl font-bold text-white mt-1">{overallProgress}%</h3>
            <p className="text-xs text-indigo-300 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>{completedModules} of {totalModules} modules</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <span className="material-symbols-outlined text-[24px]">donut_large</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Study Streak</p>
            <h3 className="text-2xl font-bold text-white mt-1">7 Days</h3>
            <p className="text-xs text-amber-300 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
              <span>Personal record!</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <span className="material-symbols-outlined text-[24px]">local_fire_department</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Due This Week</p>
            <h3 className="text-2xl font-bold text-white mt-1">{deadlines.length} Tasks</h3>
            <p className="text-xs text-rose-300 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>Next in 2 days</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
            <span className="material-symbols-outlined text-[24px]">assignment_late</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Active Courses</p>
            <h3 className="text-2xl font-bold text-white mt-1">{courses.length} Courses</h3>
            <p className="text-xs text-emerald-300 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">school</span>
              <span>16 Credit Hours</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <span className="material-symbols-outlined text-[24px]">school</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Course Progress & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Course Progress Trackers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-headline-md">Course Progress &amp; Syllabi</h3>
              <p className="text-xs text-white/50">Tracking modules and exam weights</p>
            </div>
            <button
              onClick={() => onNavigateTab('syllabus')}
              className="text-xs text-indigo-300 hover:text-indigo-200 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore all</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((course) => {
              const completedCount = course.modules.filter((m) => m.status === 'completed').length;
              return (
                <div
                  key={course.id}
                  onClick={() => onOpenSyllabusUnit(course.id)}
                  className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-xl bg-white/10 text-white/90 text-xs font-bold font-mono border border-white/10">
                        {course.code}
                      </span>
                      <span className="text-xs font-bold text-white/80">{course.progress}%</span>
                    </div>
                    <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors text-base leading-snug">
                      {course.name}
                    </h4>
                    <p className="text-xs text-white/50 mt-1">Instructor: {course.instructor}</p>
                  </div>

                  <div className="mt-5 space-y-2">
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${course.progress}%`,
                          backgroundColor: course.color,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-white/50">
                      <span>
                        {completedCount} / {course.modules.length} Modules done
                      </span>
                      <span className="text-white/70 font-medium group-hover:translate-x-0.5 transition-transform flex items-center">
                        View Unit <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Deadlines & AI Tools */}
        <div className="space-y-6">
          {/* Deadlines Widget */}
          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-400 text-[20px]">
                  alarm
                </span>
                <h3 className="font-bold text-white text-base">Upcoming Deadlines</h3>
              </div>
              <button
                onClick={() => onNavigateTab('calendar')}
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-3">
              {deadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-white/10 text-white/70">
                        {dl.courseCode}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                          dl.urgency === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {dl.urgency === 'high' ? 'Urgent' : 'Upcoming'}
                      </span>
                    </div>
                    <h5 className="text-sm font-semibold text-white truncate mt-1">{dl.title}</h5>
                    <p className="text-xs text-white/50 mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                      <span>Due: {dl.dueDate}</span>
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      onStartFocusSession(
                        `Work on: ${dl.title}`,
                        `${dl.courseCode} Deadline Prep`
                      )
                    }
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all flex-shrink-0"
                    title="Focus on this"
                  >
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Tools Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-900/30 to-indigo-900/20 backdrop-blur-xl border border-purple-500/20 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-purple-300">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
              <h4 className="font-bold text-sm text-white">AI Syllabus Assistant</h4>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Ask questions across all your syllabi, generate study guides, or simulate exam questions with Gemini AI.
            </p>
            <button
              onClick={() => onNavigateTab('ai-lab')}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600/50 hover:bg-purple-600/70 border border-purple-400/30 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch AI Lab</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
