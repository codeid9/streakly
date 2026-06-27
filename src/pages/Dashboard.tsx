import { motion } from 'framer-motion';
import { Plus, Flame, Target, CheckCheck, TrendingUp, Quote } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useHabitStats } from '../hooks/useHabitStats';
import { HabitCard } from '../components/HabitCard';
import { CircularProgress } from '../components/CircularProgress';
import { pageVariants, cardVariants, listContainerVariants } from '../animations/variants';
import { getRandomQuote, getTodayString, getCompletionForDate } from '../utils/habitUtils';
import { useMemo } from 'react';
import { format } from 'date-fns';

const quote = getRandomQuote();

export function Dashboard() {
  const { openModal } = useApp();
  const { habits, todayProgress, overallStreak } = useHabitStats();

  const today = getTodayString();
  const todayHabits = habits.filter((h) => !h.archived);
  const completedToday = todayHabits.filter((h) => getCompletionForDate(h, today));
  const pendingToday = todayHabits.filter((h) => !getCompletionForDate(h, today));

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const STATS = [
    { label: 'Total Habits', value: todayProgress.total, icon: Target, color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-500/5', border: 'border-blue-500/20' },
    { label: 'Done Today', value: todayProgress.completed, icon: CheckCheck, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-500/5', border: 'border-emerald-500/20' },
    { label: 'Best Streak', value: overallStreak, icon: Flame, color: 'text-orange-400', bg: 'from-orange-500/15 to-orange-500/5', border: 'border-orange-500/20', suffix: ' days' },
    { label: 'Completion', value: todayProgress.percentage, icon: TrendingUp, color: 'text-purple-400', bg: 'from-purple-500/15 to-purple-500/5', border: 'border-purple-500/20', suffix: '%' },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">{greeting} 👋</h1>
          <p className="text-secondary text-sm mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal('create')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-primary text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all"
        >
          <Plus size={16} />
          New Habit
        </motion.button>
      </div>

      {/* Hero Progress */}
      <motion.div
        variants={cardVariants}
        className="relative overflow-hidden p-6 rounded-3xl bg-linear-to-br from-indigo-600/20 via-purple-600/15 to-pink-600/10 border border-indigo-500/20 shadow-xl"
      >
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-8">
          <CircularProgress
            percentage={todayProgress.percentage}
            size={110}
            strokeWidth={9}
            color="#6366f1"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{todayProgress.percentage}%</p>
            </div>
          </CircularProgress>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-primary">Today's Progress</h2>
            <p className="text-secondary text-sm mt-1">
              {todayProgress.completed} of {todayProgress.total} habits completed
            </p>
            <div className="mt-3 h-2 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${todayProgress.percentage}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500"
              />
            </div>
            {todayProgress.percentage === 100 && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs font-semibold text-emerald-400"
              >
                🎉 All habits completed for today!
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            custom={i}
            className={`p-4 rounded-2xl bg-linear-to-br ${stat.bg} border ${stat.border}`}
          >
            <stat.icon size={18} className={stat.color} />
            <p className="text-2xl font-bold text-primary mt-2">{stat.value}{stat.suffix ?? ''}</p>
            <p className="text-xs text-secondary mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quote */}
      <motion.div
        variants={cardVariants}
        className="p-5 rounded-2xl border border-white/8 bg-white/3 flex gap-4 items-start"
      >
        <Quote size={20} className="text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-primary italic leading-relaxed">"{quote.quote}"</p>
          <p className="text-xs text-tertiary mt-1.5">— {quote.author}</p>
        </div>
      </motion.div>

      {/* Pending Habits */}
      {pendingToday.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Pending Today</h2>
          <motion.div variants={listContainerVariants} animate="animate" className="space-y-2">
            {pendingToday.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Completed Habits */}
      {completedToday.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Completed ✓</h2>
          <motion.div variants={listContainerVariants} animate="animate" className="space-y-2">
            {completedToday.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {habits.length === 0 && (
        <motion.div
          variants={cardVariants}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mb-5">
            <Target size={32} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-primary">No habits yet</h3>
          <p className="text-sm text-secondary mt-2 max-w-xs">Start building better habits today. Create your first habit and track your daily progress.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal('create')}
            className="mt-5 px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/30"
          >
            Create Your First Habit
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
