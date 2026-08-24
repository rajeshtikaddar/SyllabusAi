export type NavTab = 'dashboard' | 'syllabus' | 'tasks' | 'projects' | 'calendar' | 'ai-lab';

export type Priority = 'High Priority' | 'Medium' | 'Low Priority' | 'high' | 'medium' | 'low';

export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'todo';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours?: number;
  priority?: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  courseCode: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  dueLabel?: string;
  estimatedTime?: string;
  progress?: number;
  avatars?: string[];
  subtasks?: Subtask[];
}

export interface GradingBreakdown {
  category: string;
  percentage: number;
}

export interface SyllabusModule {
  id: string;
  unitNumber?: number;
  weekNumber?: number;
  title: string;
  subtitle?: string;
  description?: string;
  dateLabel?: string;
  status: 'completed' | 'in_progress' | 'pending';
  summary?: string;
  keyTopics?: string[];
  topicsCovered?: string[];
  readings?: string;
}

export interface Course {
  id: string;
  code: string;
  title?: string;
  name?: string;
  instructor: string;
  instructorEmail?: string;
  schedule: string;
  officeHours?: string;
  credits?: number;
  progress: number;
  color: string;
  icon?: string;
  category?: string;
  gradingBreakdown?: GradingBreakdown[];
  modules: SyllabusModule[];
}

export interface Deadline {
  id: string;
  title: string;
  course?: string;
  courseCode: string;
  dueDate: string;
  dueTime?: string;
  dueRelative?: string;
  isUrgent?: boolean;
  urgency?: 'high' | 'medium' | 'low';
  priority?: Priority;
}

export interface SyllabusDocument {
  id: string;
  title?: string;
  name?: string;
  course?: string;
  courseCode?: string;
  fileSize: string;
  uploadDate: string;
  status?: 'processed' | 'processing';
  parsedStatus?: 'ready' | 'processing';
  topics?: string[];
  contentExcerpt?: string;
}

export interface SummaryItem {
  id: string;
  category?: string;
  categoryColor?: string;
  courseCode?: string;
  title: string;
  date?: string;
  summary?: string;
  summaryText?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
