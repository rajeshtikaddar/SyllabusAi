import React, { useState } from 'react';
import { Course } from '../types';

interface SyllabusTrackerViewProps {
  courses: Course[];
  onOpenAILabWithTopic: (topicPrompt: string, course: string) => void;
  onUpdateModuleStatus: (
    courseId: string,
    moduleId: string,
    status: 'completed' | 'in_progress' | 'pending'
  ) => void;
}

export const SyllabusTrackerView: React.FC<SyllabusTrackerViewProps> = ({
  courses,
  onOpenAILabWithTopic,
  onUpdateModuleStatus,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  if (!selectedCourse) {
    return (
      <div className="p-8 text-center text-white/50">
        No courses found. Please import a syllabus to begin tracking.
      </div>
    );
  }

  const filteredModules = selectedCourse.modules.filter((m) => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Course Selection Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {courses.map((c) => {
          const isSelected = c.id === selectedCourse.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all border flex items-center gap-2.5 cursor-pointer ${
                isSelected
                  ? 'bg-white/20 text-white border-white/30 shadow-lg backdrop-blur-xl'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/10'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              <span>{c.code}</span>
              <span className="text-[11px] opacity-70 hidden sm:inline">({c.progress}%)</span>
            </button>
          );
        })}
      </div>

      {/* Selected Course Header Banner */}
      <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: selectedCourse.color }}
        />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-white/10 text-white font-mono text-xs font-bold border border-white/15">
                {selectedCourse.code}
              </span>
              <span className="text-xs text-white/60 font-medium">
                Instructor: {selectedCourse.instructor} • {selectedCourse.instructorEmail}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
              {selectedCourse.name}
            </h2>
            <p className="text-xs md:text-sm text-white/70 mt-1 max-w-2xl">
              {selectedCourse.schedule} • Office Hours: {selectedCourse.officeHours}
            </p>
          </div>

          {/* Quick AI Syllabus Breakdown action */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                onOpenAILabWithTopic(
                  `Generate a comprehensive study roadmap and key concepts summary for ${selectedCourse.name} (${selectedCourse.code}).`,
                  selectedCourse.name
                )
              }
              className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              <span>AI Course Summary</span>
            </button>
          </div>
        </div>

        {/* Grading Weights breakdown pill chips */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
            Grade Weights:
          </span>
          {selectedCourse.gradingBreakdown.map((gb, idx) => (
            <div
              key={idx}
              className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 flex items-center gap-2"
            >
              <span className="font-medium">{gb.category}</span>
              <span className="font-bold text-indigo-300">{gb.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Module Timeline & Topic Progress */}
      <div className="space-y-4">
        {/* Filter / Status tab bar */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-headline-md">
            <span>Syllabus Modules &amp; Weekly Topics</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
              {filteredModules.length} Modules
            </span>
          </h3>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            {(['all', 'in_progress', 'pending', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  filterStatus === status
                    ? 'bg-white/20 text-white font-bold'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {filteredModules.map((module, idx) => {
            const isCompleted = module.status === 'completed';
            const isInProgress = module.status === 'in_progress';

            return (
              <div
                key={module.id}
                className={`p-5 rounded-2xl transition-all border ${
                  isInProgress
                    ? 'bg-white/10 border-indigo-400/40 shadow-lg shadow-indigo-950/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                } backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-white/10 text-white/80">
                      Week {module.weekNumber}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isInProgress
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {module.status === 'completed'
                        ? 'Completed'
                        : module.status === 'in_progress'
                        ? 'In Progress'
                        : 'Upcoming'}
                    </span>
                  </div>

                  <h4 className="text-base md:text-lg font-bold text-white leading-snug">
                    {module.title}
                  </h4>
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Topics covered chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {module.topicsCovered.map((topic, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white/70"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Actions & Status Changer */}
                <div className="flex flex-wrap md:flex-col items-end gap-2 flex-shrink-0">
                  {/* Status Dropdown */}
                  <select
                    value={module.status}
                    onChange={(e) =>
                      onUpdateModuleStatus(
                        selectedCourse.id,
                        module.id,
                        e.target.value as 'completed' | 'in_progress' | 'pending'
                      )
                    }
                    aria-label={`Status for ${module.title}`}
                    className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:bg-white/20 cursor-pointer"
                  >
                    <option value="pending" className="bg-slate-900 text-white">
                      Pending
                    </option>
                    <option value="in_progress" className="bg-slate-900 text-white">
                      In Progress
                    </option>
                    <option value="completed" className="bg-slate-900 text-white">
                      Completed
                    </option>
                  </select>

                  {/* Generate Quiz/Flashcards with AI */}
                  <button
                    onClick={() =>
                      onOpenAILabWithTopic(
                        `Generate 5 practice quiz questions with step-by-step explanations for the topic: "${module.title}" in ${selectedCourse.name}.`,
                        selectedCourse.name
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">quiz</span>
                    <span>AI Quiz Prep</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
