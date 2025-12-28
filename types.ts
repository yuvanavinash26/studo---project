
export interface ResourceFile {
  name: string;
  url: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  lastReviewed: number;
  files?: ResourceFile[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  subject: string;
  date: string;
  deadline?: string;
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface StudySession {
  id: string;
  timestamp: number;
  duration: number; // minutes
  taskId?: string;
}

export interface AppData {
  notes: Note[];
  tasks: Task[];
  exams: Exam[];
  sessions: StudySession[];
  settings: {
    darkMode: boolean;
    userName: string;
    accentColor: string;
    pomodoro: {
      work: number;
      short: number;
      long: number;
    };
  };
}

export enum TimerMode {
  WORK = 'work',
  SHORT_BREAK = 'short',
  LONG_BREAK = 'long'
}
