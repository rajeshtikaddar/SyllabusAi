import React, { useState } from 'react';
import { NavTab, Course, Task, TaskStatus, SyllabusDocument, SummaryItem, Deadline } from './types';
import {
  INITIAL_COURSES,
  INITIAL_TASKS,
  INITIAL_DEADLINES,
  INITIAL_DOCUMENTS,
  INITIAL_SUMMARIES,
} from './data/initialData';
import { SideNav } from './components/SideNav';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { SyllabusTrackerView } from './components/SyllabusTrackerView';
import { TasksKanbanView } from './components/TasksKanbanView';
import { AILabView } from './components/AILabView';
import { CalendarView } from './components/CalendarView';
import { FocusNextModal } from './components/FocusNextModal';
import { SupportSettingsModal } from './components/SupportSettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES);
  const [documents, setDocuments] = useState<SyllabusDocument[]>(INITIAL_DOCUMENTS);
  const [summaries, setSummaries] = useState<SummaryItem[]>(INITIAL_SUMMARIES);

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Focus modal state
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [focusTopic, setFocusTopic] = useState('Study Linear Algebra: Vector Spaces');
  const [focusCourse, setFocusCourse] = useState('Linear Algebra (MATH 201)');

  // Support / Settings modal
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportModalMode, setSupportModalMode] = useState<'support' | 'settings'>('settings');

  // AI Lab prefilled prompt
  const [aiLabPrompt, setAiLabPrompt] = useState<string>('');

  const handleStartFocusSession = (topic: string, course: string) => {
    setFocusTopic(topic);
    setFocusCourse(course);
    setIsFocusModalOpen(true);
  };

  const handleOpenAILabWithTopic = (topicPrompt: string, course: string) => {
    setAiLabPrompt(topicPrompt);
    setActiveTab('ai-lab');
  };

  const handleUpdateModuleStatus = (
    courseId: string,
    moduleId: string,
    status: 'completed' | 'in_progress' | 'pending'
  ) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const updatedModules = c.modules.map((m) => (m.id === moduleId ? { ...m, status } : m));
        const completedCount = updatedModules.filter((m) => m.status === 'completed').length;
        const newProgress = Math.round((completedCount / updatedModules.length) * 100);
        return {
          ...c,
          modules: updatedModules,
          progress: newProgress,
        };
      })
    );
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleUpdateSubtasks = (taskId: string, subtasks: Task['subtasks']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks } : t))
    );
  };

  const handleUploadDocument = (newDoc: SyllabusDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col antialiased relative overflow-hidden">
      {/* Ambient Frosted Glass Glowing Orbs Background */}
      <div className="fixed top-[-120px] left-[-120px] w-[550px] h-[550px] bg-purple-600/25 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-blue-600/25 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[25%] right-[15%] w-[380px] h-[380px] bg-pink-500/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[60%] left-[20%] w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Main App Glass Wrapper */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Side Navigation Rail (Desktop fixed, Mobile drawer) */}
        <SideNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setAiLabPrompt('');
          }}
          onOpenFocusModal={() => setIsFocusModalOpen(true)}
          onOpenSupportModal={() => {
            setSupportModalMode('support');
            setIsSupportModalOpen(true);
          }}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Main Workspace Area (Offset by 280px on desktop) */}
        <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen">
          {/* Top Header */}
          <TopHeader
            activeTab={activeTab}
            onOpenMobileMenu={() => setIsMobileNavOpen(true)}
            onOpenSettingsModal={() => {
              setSupportModalMode('settings');
              setIsSupportModalOpen(true);
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Tab Views */}
          <main className="flex-1 flex flex-col pb-12">
            {activeTab === 'dashboard' && (
              <DashboardView
                courses={courses}
                deadlines={deadlines}
                onStartFocusSession={handleStartFocusSession}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenSyllabusUnit={(courseId) => {
                  setActiveTab('syllabus');
                }}
              />
            )}

            {activeTab === 'syllabus' && (
              <SyllabusTrackerView
                courses={courses}
                onOpenAILabWithTopic={handleOpenAILabWithTopic}
                onUpdateModuleStatus={handleUpdateModuleStatus}
              />
            )}

            {(activeTab === 'tasks' || activeTab === 'projects') && (
              <TasksKanbanView
                tasks={tasks}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onAddTask={handleAddTask}
                onUpdateSubtasks={handleUpdateSubtasks}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                deadlines={deadlines}
                courses={courses}
              />
            )}

            {activeTab === 'ai-lab' && (
              <AILabView
                documents={documents}
                summaries={summaries}
                initialPrompt={aiLabPrompt}
                onUploadDocument={handleUploadDocument}
              />
            )}
          </main>
        </div>
      </div>

      {/* Focus Next Study Timer Modal */}
      <FocusNextModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        defaultTopic={focusTopic}
        defaultCourse={focusCourse}
      />

      {/* Support & Settings Modal */}
      <SupportSettingsModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        initialMode={supportModalMode}
      />
    </div>
  );
}
