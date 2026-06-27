import type { Habit, HabitCategory, HabitStats, DailyStats } from '../types';
import { format, subDays, differenceInDays, parseISO } from 'date-fns';

export const getTodayString = (): string => format(new Date(), 'yyyy-MM-dd');

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
};

export const getCompletionForDate = (habit: Habit, date: string): boolean => {
  return habit.completions.some((c) => c.date === date && c.completed);
};

export const getCurrentStreak = (habit: Habit): number => {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i <= 365; i++) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    const completed = getCompletionForDate(habit, date);

    if (completed) {
      streak++;
    } else if (i === 0) {
      // Today not completed yet, check yesterday
      continue;
    } else {
      break;
    }
  }

  return streak;
};

export const getLongestStreak = (habit: Habit): number => {
  if (habit.completions.length === 0) return 0;

  const sortedDates = habit.completions
    .filter((c) => c.completed)
    .map((c) => c.date)
    .sort();

  let longest = 0;
  let current = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = parseISO(sortedDates[i - 1]);
    const curr = parseISO(sortedDates[i]);
    const diff = differenceInDays(curr, prev);

    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diff > 1) {
      current = 1;
    }
  }

  return Math.max(longest, sortedDates.length > 0 ? current : 0);
};

export const getHabitStats = (habit: Habit): HabitStats => {
  const today = new Date();
  const last7Days: DailyStats[] = [];
  const last30Days: DailyStats[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    const completed = getCompletionForDate(habit, date) ? 1 : 0;
    last7Days.push({ date, total: 1, completed, percentage: completed * 100 });
  }

  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    const completed = getCompletionForDate(habit, date) ? 1 : 0;
    last30Days.push({ date, total: 1, completed, percentage: completed * 100 });
  }

  const totalCompletions = habit.completions.filter((c) => c.completed).length;
  const createdDate = parseISO(habit.createdAt);
  const daysSinceCreation = Math.max(1, differenceInDays(today, createdDate) + 1);
  const completionRate = Math.round((totalCompletions / daysSinceCreation) * 100);

  return {
    habit,
    currentStreak: getCurrentStreak(habit),
    longestStreak: getLongestStreak(habit),
    totalCompletions,
    completionRate: Math.min(100, completionRate),
    last7Days,
    last30Days,
  };
};

export const getTodayProgress = (habits: Habit[]): { total: number; completed: number; percentage: number } => {
  const today = getTodayString();
  const activeHabits = habits.filter((h) => !h.archived);
  const total = activeHabits.length;
  const completed = activeHabits.filter((h) => getCompletionForDate(h, today)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percentage };
};

export const getCategoryColor = (category: HabitCategory): string => {
  const colors: Record<HabitCategory, string> = {
    health: '#10b981',
    study: '#6366f1',
    fitness: '#f59e0b',
    work: '#3b82f6',
    personal: '#ec4899',
    mindfulness: '#8b5cf6',
    finance: '#14b8a6',
  };
  return colors[category];
};

export const getCategoryLabel = (category: HabitCategory): string => {
  const labels: Record<HabitCategory, string> = {
    health: 'Health',
    study: 'Study',
    fitness: 'Fitness',
    work: 'Work',
    personal: 'Personal',
    mindfulness: 'Mindfulness',
    finance: 'Finance',
  };
  return labels[category];
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const MOTIVATIONAL_QUOTES = [
  { quote: 'Small daily improvements lead to staggering long-term results.', author: 'Robin Sharma' },
  { quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
  { quote: 'Motivation is what gets you started. Habit is what keeps you going.', author: 'Jim Ryun' },
  { quote: "You don't rise to the level of your goals, you fall to the level of your systems.", author: 'James Clear' },
  { quote: 'The secret of your success is found in your daily routine.', author: 'John Maxwell' },
  { quote: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
  { quote: 'Chains of habit are too light to be felt until they are too heavy to be broken.', author: 'Warren Buffett' },
  { quote: 'Good habits are worth being fanatical about.', author: 'John Irving' },
];

export const getRandomQuote = () => {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
};

export const HABIT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#f59e0b', '#84cc16', '#10b981', '#14b8a6', '#06b6d4',
  '#3b82f6', '#0ea5e9',
];

export const HABIT_ICONS = [
  'Dumbbell', 'Heart', 'Brain', 'BookOpen', 'Code2',
  'Coffee', 'Moon', 'Sun', 'Music', 'Leaf',
  'Target', 'Zap', 'Star', 'Flame', 'Droplets',
  'Bike', 'Running', 'Pencil', 'DollarSign', 'Smile',
];
