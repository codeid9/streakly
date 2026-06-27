import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getHabitStats, getTodayProgress, getCurrentStreak, getLongestStreak } from '../utils/habitUtils';

export function useHabitStats() {
  const { state } = useApp();
  const { habits } = state.data;

  const activeHabits = useMemo(() => habits.filter((h) => !h.archived), [habits]);
  const todayProgress = useMemo(() => getTodayProgress(habits), [habits]);

  const allStats = useMemo(() => activeHabits.map((h) => getHabitStats(h)), [activeHabits]);

  const overallStreak = useMemo(() => {
    if (activeHabits.length === 0) return 0;
    return Math.max(...activeHabits.map(getCurrentStreak));
  }, [activeHabits]);

  const longestEverStreak = useMemo(() => {
    if (activeHabits.length === 0) return 0;
    return Math.max(...activeHabits.map(getLongestStreak));
  }, [activeHabits]);

  return {
    habits: activeHabits,
    allHabits: habits,
    todayProgress,
    allStats,
    overallStreak,
    longestEverStreak,
  };
}
