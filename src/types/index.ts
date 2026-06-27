export type HabitCategory = 'health' | 'study' | 'fitness' | 'work' | 'personal' | 'mindfulness' | 'finance';

export type HabitFrequency = 'daily' | 'weekly';

export interface HabitCompletion {
  date: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
  note?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  color: string;
  icon: string;
  frequency: HabitFrequency;
  dailyTarget: number;
  createdAt: string;
  updatedAt: string;
  completions: HabitCompletion[];
  archived: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  condition: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  showMotivationalQuotes: boolean;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  notifications: boolean;
}

export interface AppData {
  habits: Habit[];
  settings: AppSettings;
  achievements: Achievement[];
  lastUpdated: string;
}

export interface DailyStats {
  date: string;
  total: number;
  completed: number;
  percentage: number;
}

export interface WeeklyStats {
  week: string;
  days: DailyStats[];
  averageCompletion: number;
}

export interface HabitStats {
  habit: Habit;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
  last7Days: DailyStats[];
  last30Days: DailyStats[];
}

export type Page = 'dashboard' | 'habits' | 'statistics' | 'calendar' | 'settings';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: 'create' | 'edit' | 'delete' | 'confirm' | null;
  data?: Habit | null;
}
