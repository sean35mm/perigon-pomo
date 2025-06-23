export interface PomodoroSession {
  id: string;
  type: 'work' | 'shortBreak' | 'longBreak';
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  completed: boolean;
  interrupted: boolean;
}

export interface TimerSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  soundVolume: number; // 0-1
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  currentSession: PomodoroSession | null;
  timeRemaining: number; // in seconds
  currentType: 'work' | 'shortBreak' | 'longBreak';
  completedSessions: number;
  totalWorkSessions: number;
}

export interface DailyStats {
  date: string;
  totalWorkTime: number; // in minutes
  totalBreakTime: number; // in minutes
  completedSessions: number;
  totalSessions: number;
  productivity: number; // percentage
}

export interface WeeklyStats {
  week: string;
  dailyStats: DailyStats[];
  totalWorkTime: number;
  totalBreakTime: number;
  averageProductivity: number;
}

export interface AnalyticsData {
  dailyStats: DailyStats[];
  weeklyStats: WeeklyStats[];
  currentStreak: number;
  longestStreak: number;
  totalWorkTime: number;
  totalSessions: number;
}

export interface AppTheme {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
}

export type AppView = 'timer' | 'settings' | 'analytics' | 'history';
