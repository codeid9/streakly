import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from 'recharts';
import { useHabitStats } from '../hooks/useHabitStats';
import { pageVariants, cardVariants } from '../animations/variants';
import { HabitIcon } from '../components/HabitIcon';
import { Flame, Trophy, TrendingUp, Award } from 'lucide-react';
import { format, subDays } from 'date-fns';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-elevated/95 backdrop-blur border border-white/10 rounded-xl px-3 py-2 shadow-xl">
        <p className="text-xs text-secondary">{label}</p>
        <p className="text-sm font-bold text-primary">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
}

export function Statistics() {
  const { habits, allStats, overallStreak, longestEverStreak } = useHabitStats();

  // Build 30-day chart data
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const day = format(date, 'MMM d');
    const total = habits.length;
    const completed = habits.filter((h) => h.completions.some((c) => c.date === dateStr && c.completed)).length;
    return { day, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  });

  // Weekly chart (last 7 days)
  const weekData = chartData.slice(-7);

  const totalCompletions = allStats.reduce((s, stat) => s + stat.totalCompletions, 0);
  const avgCompletion = allStats.length > 0
    ? Math.round(allStats.reduce((s, stat) => s + stat.completionRate, 0) / allStats.length)
    : 0;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Statistics</h1>
        <p className="text-sm text-secondary mt-0.5">Your progress at a glance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Check-ins', value: totalCompletions, icon: Trophy, color: 'text-amber-400', bg: 'from-amber-500/15 to-amber-500/5', border: 'border-amber-500/20' },
          { label: 'Avg Completion', value: `${avgCompletion}%`, icon: TrendingUp, color: 'text-indigo-400', bg: 'from-indigo-500/15 to-indigo-500/5', border: 'border-indigo-500/20' },
          { label: 'Best Streak', value: `${longestEverStreak}d`, icon: Flame, color: 'text-orange-400', bg: 'from-orange-500/15 to-orange-500/5', border: 'border-orange-500/20' },
          { label: 'Current Streak', value: `${overallStreak}d`, icon: Award, color: 'text-emerald-400', bg: 'from-emerald-500/15 to-emerald-500/5', border: 'border-emerald-500/20' },
        ].map((s) => (
          <motion.div key={s.label} variants={cardVariants} className={`p-4 rounded-2xl border bg-gradient-to-br ${s.bg} ${s.border}`}>
            <s.icon size={18} className={s.color} />
            <p className="text-2xl font-bold text-primary mt-2">{s.value}</p>
            <p className="text-xs text-secondary">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 30-day Area Chart */}
      <motion.div variants={cardVariants} className="p-5 rounded-2xl border border-white/8 bg-surface-elevated/40">
        <h2 className="text-sm font-semibold text-primary mb-4">30-Day Overview</h2>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="percentage" stroke="#6366f1" strokeWidth={2} fill="url(#grad1)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Weekly Bar Chart */}
      <motion.div variants={cardVariants} className="p-5 rounded-2xl border border-white/8 bg-surface-elevated/40">
        <h2 className="text-sm font-semibold text-primary mb-4">This Week</h2>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={weekData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} domain={[0, 100]} hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="percentage" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Per-Habit Stats */}
      {allStats.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Per-Habit Breakdown</h2>
          <div className="space-y-3">
            {allStats.map((stat) => (
              <motion.div key={stat.habit.id} variants={cardVariants} className="p-4 rounded-2xl border border-white/8 bg-surface-elevated/40 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: stat.habit.color + '20', border: `1px solid ${stat.habit.color}35` }}
                >
                  <HabitIcon name={stat.habit.icon} size={18} color={stat.habit.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary truncate">{stat.habit.name}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.completionRate}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: stat.habit.color }}
                      />
                    </div>
                    <span className="text-xs text-secondary shrink-0">{stat.completionRate}%</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame size={12} />
                    <span className="text-xs font-bold">{stat.currentStreak}</span>
                  </div>
                  <p className="text-[10px] text-tertiary">streak</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {habits.length === 0 && (
        <motion.div variants={cardVariants} className="flex flex-col items-center justify-center py-16 text-center">
          <TrendingUp size={40} className="text-tertiary mb-4" />
          <h3 className="text-base font-semibold text-primary">No data yet</h3>
          <p className="text-sm text-secondary mt-1.5">Start tracking habits to see your statistics here.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
