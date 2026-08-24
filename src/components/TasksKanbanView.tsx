import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';

interface TasksKanbanViewProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateSubtasks: (taskId: string, subtasks: Task['subtasks']) => void;
}

export const TasksKanbanView: React.FC<TasksKanbanViewProps> = ({
  tasks,
  onUpdateTaskStatus,
  onAddTask,
  onUpdateSubtasks,
}) => {
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCourse, setNewTaskCourse] = useState('CS 301');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2024-11-20');
  const [newTaskEstimatedTime, setNewTaskEstimatedTime] = useState('1h 30m');

  // AI Breakdown state
  const [generatingSubtasksFor, setGeneratingSubtasksFor] = useState<string | null>(null);

  const columns: { id: TaskStatus; title: string; icon: string; countColor: string }[] = [
    { id: 'todo', title: 'To Do', icon: 'list_alt', countColor: 'text-amber-400' },
    { id: 'in_progress', title: 'In Progress', icon: 'pending', countColor: 'text-indigo-400' },
    { id: 'completed', title: 'Completed', icon: 'task_alt', countColor: 'text-emerald-400' },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (filterCourse === 'all') return true;
    return t.courseCode === filterCourse;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      title: newTaskTitle,
      courseCode: newTaskCourse,
      status: 'todo',
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      estimatedTime: newTaskEstimatedTime,
      subtasks: [
        { id: `st-${Date.now()}-1`, title: 'Review lecture notes & assignment specs', completed: false },
        { id: `st-${Date.now()}-2`, title: 'Draft initial outline & code implementation', completed: false },
      ],
    });

    setNewTaskTitle('');
    setIsNewTaskModalOpen(false);
  };

  const handleToggleSubtask = (task: Task, subtaskId: string) => {
    const updated = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdateSubtasks(task.id, updated);
  };

  const handleAIBreakdown = async (task: Task) => {
    setGeneratingSubtasksFor(task.id);
    try {
      const response = await fetch('/api/ai/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: task.title,
          description: task.description || 'Academic deliverable',
          course: task.courseCode,
          dueDate: task.dueDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.subtasks && Array.isArray(data.subtasks) && data.subtasks.length > 0) {
          const formatted = data.subtasks.map((st: any, idx: number) => ({
            id: `ai-st-${Date.now()}-${idx}`,
            title: st.title,
            completed: false,
          }));
          onUpdateSubtasks(task.id, [...(task.subtasks || []), ...formatted]);
          setGeneratingSubtasksFor(null);
          return;
        }
      }
    } catch {
      // fallback if offline
    }

    setTimeout(() => {
      const generated = [
        { id: `ai-st-${Date.now()}-1`, title: `[AI] Breakdown requirements for ${task.title}`, completed: false },
        { id: `ai-st-${Date.now()}-2`, title: `[AI] Conduct core analysis & draft solution`, completed: false },
        { id: `ai-st-${Date.now()}-3`, title: `[AI] Run edge test cases & format final submission`, completed: false },
      ];
      onUpdateSubtasks(task.id, [...(task.subtasks || []), ...generated]);
      setGeneratingSubtasksFor(null);
    }, 800);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-headline-md text-white">
            Actionable Tasks &amp; Milestones
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Syllabus-derived assignments, lab work, and exam preparations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Course filter */}
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            aria-label="Filter tasks by course"
            className="bg-white/10 border border-white/20 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:bg-white/15 cursor-pointer backdrop-blur-md"
          >
            <option value="all" className="bg-slate-900 text-white">
              All Courses
            </option>
            <option value="CS 301" className="bg-slate-900 text-white">
              CS 301 (Algorithms)
            </option>
            <option value="MATH 201" className="bg-slate-900 text-white">
              MATH 201 (Linear Algebra)
            </option>
            <option value="PHYS 150" className="bg-slate-900 text-white">
              PHYS 150 (Mechanics)
            </option>
            <option value="HIST 110" className="bg-slate-900 text-white">
              HIST 110 (World History)
            </option>
          </select>

          {/* Add Task Button */}
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-white/20 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="p-4 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-white/70">
                    {col.icon}
                  </span>
                  <h3 className="font-bold text-white text-sm">{col.title}</h3>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 ${col.countColor}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List in Column */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-2xl text-xs text-white/30">
                    No tasks in this stage
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const completedSubtasks = task.subtasks.filter((st) => st.completed).length;

                    return (
                      <div
                        key={task.id}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all backdrop-blur-md shadow-md space-y-3"
                      >
                        {/* Tags & Priority */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-white/10 text-white/80">
                            {task.courseCode}
                          </span>
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                              task.priority === 'high'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : task.priority === 'medium'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-white leading-snug">{task.title}</h4>

                        {/* Subtasks Checklist */}
                        {task.subtasks.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[11px] text-white/50">
                              <span>Subtasks ({completedSubtasks}/{task.subtasks.length})</span>
                              <span>{Math.round((completedSubtasks / task.subtasks.length) * 100)}%</span>
                            </div>
                            <div className="space-y-1">
                              {task.subtasks.map((st) => (
                                <div
                                  key={st.id}
                                  onClick={() => handleToggleSubtask(task, st.id)}
                                  className="flex items-center gap-2 text-xs text-white/80 hover:text-white cursor-pointer select-none group"
                                >
                                  <div
                                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                                      st.completed
                                        ? 'bg-indigo-500 border-indigo-400 text-white'
                                        : 'border-white/30 group-hover:border-white/60 bg-white/5'
                                    }`}
                                  >
                                    {st.completed && (
                                      <span className="material-symbols-outlined text-[10px]">check</span>
                                    )}
                                  </div>
                                  <span className={`text-[11px] truncate ${st.completed ? 'line-through text-white/40' : ''}`}>
                                    {st.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Meta: Due Date & Estimated Time */}
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                            <span>{task.dueDate}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">schedule</span>
                            <span>{task.estimatedTime}</span>
                          </span>
                        </div>

                        {/* Action Buttons: Status shift & AI Subtask generator */}
                        <div className="pt-2 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleAIBreakdown(task)}
                            disabled={generatingSubtasksFor === task.id}
                            className="text-[11px] text-purple-300 hover:text-purple-200 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 rounded-xl px-2.5 py-1 flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {generatingSubtasksFor === task.id ? 'sync' : 'auto_fix_high'}
                            </span>
                            <span>
                              {generatingSubtasksFor === task.id ? 'Generating...' : 'AI Breakdown'}
                            </span>
                          </button>

                          <div className="flex items-center gap-1">
                            {col.id !== 'todo' && (
                              <button
                                onClick={() =>
                                  onUpdateTaskStatus(
                                    task.id,
                                    col.id === 'completed' ? 'in_progress' : 'todo'
                                  )
                                }
                                title="Move back"
                                className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white border border-white/10"
                              >
                                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                              </button>
                            )}
                            {col.id !== 'completed' && (
                              <button
                                onClick={() =>
                                  onUpdateTaskStatus(
                                    task.id,
                                    col.id === 'todo' ? 'in_progress' : 'completed'
                                  )
                                }
                                title="Move forward"
                                className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white border border-white/10"
                              >
                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-white">Create New Task</h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Dijkstra's Algorithm"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Course</label>
                  <select
                    value={newTaskCourse}
                    onChange={(e) => setNewTaskCourse(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:bg-white/10"
                  >
                    <option value="CS 301" className="bg-slate-900">CS 301</option>
                    <option value="MATH 201" className="bg-slate-900">MATH 201</option>
                    <option value="PHYS 150" className="bg-slate-900">PHYS 150</option>
                    <option value="HIST 110" className="bg-slate-900">HIST 110</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:bg-white/10"
                  >
                    <option value="low" className="bg-slate-900">Low</option>
                    <option value="medium" className="bg-slate-900">Medium</option>
                    <option value="high" className="bg-slate-900">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:bg-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Estimated Time</label>
                  <input
                    type="text"
                    value={newTaskEstimatedTime}
                    onChange={(e) => setNewTaskEstimatedTime(e.target.value)}
                    placeholder="e.g. 2h 30m"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:bg-white/10"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-white/20 shadow-lg shadow-indigo-600/30"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
