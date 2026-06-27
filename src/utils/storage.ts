import type { AppData, AppSettings, Achievement } from '../types';

const STORAGE_KEY = 'habit-grow-data';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#6366f1',
  showMotivationalQuotes: true,
  weekStartsOn: 1,
  notifications: false,
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-habit',
    title: 'First Step',
    description: 'Create your first habit',
    icon: 'Star',
    condition: 'habits_created >= 1',
  },
  {
    id: 'week-streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak on any habit',
    icon: 'Flame',
    condition: 'streak >= 7',
  },
  {
    id: 'month-streak',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak on any habit',
    icon: 'Crown',
    condition: 'streak >= 30',
  },
  {
    id: 'five-habits',
    title: 'Habit Builder',
    description: 'Create 5 or more habits',
    icon: 'Trophy',
    condition: 'habits_created >= 5',
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete all habits for 7 consecutive days',
    icon: 'Zap',
    condition: 'perfect_days >= 7',
  },
  {
    id: 'century',
    title: 'Centurion',
    description: 'Complete 100 total habit check-ins',
    icon: 'Medal',
    condition: 'total_completions >= 100',
  },
];

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as AppData;
      return {
        ...data,
        settings: { ...DEFAULT_SETTINGS, ...data.settings },
        achievements: DEFAULT_ACHIEVEMENTS.map((defaultAch) => {
          const stored = data.achievements?.find((a) => a.id === defaultAch.id);
          return stored ? { ...defaultAch, unlockedAt: stored.unlockedAt } : defaultAch;
        }),
      };
    }
  } catch (e) {
    console.error('Failed to load data from localStorage', e);
  }

  return {
    habits: [],
    settings: DEFAULT_SETTINGS,
    achievements: DEFAULT_ACHIEVEMENTS,
    lastUpdated: new Date().toISOString(),
  };
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, lastUpdated: new Date().toISOString() }));
  } catch (e) {
    console.error('Failed to save data to localStorage', e);
  }
};

export const exportData = (data: AppData): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habit-grow-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<AppData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as AppData;
        resolve(data);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const clearData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
