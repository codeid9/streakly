import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, addMonths } from 'date-fns';
import { useHabitStats } from '../hooks/useHabitStats';
import { pageVariants, cardVariants } from '../animations/variants';
import { HabitIcon } from '../components/HabitIcon';
import { getCompletionForDate } from '../utils/habitUtils';
import type { Habit } from '../types';

function HeatmapCell({ date, habits }: { date: Date; habits: Habit[] }) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const total = habits.length;
  const completed = habits.filter((h) => getCompletionForDate(h, dateStr)).length;
  const ratio = total > 0 ? completed / total : 0;

  const intensity = ratio === 0 ? 0 : ratio < 0.33 ? 1 : ratio < 0.66 ? 2 : ratio < 1 ? 3 : 4;
  const colors = [
    'bg-white/5',
    'bg-indigo-500/20',
    'bg-indigo-500/40',
    'bg-indigo-500/65',
    'bg-indigo-500',
  ];

  const today = format(new Date(), 'yyyy-MM-dd');
  const isToday = dateStr === today;
  const isFuture = dateStr > today;

  return (
    <motion.div
      whileHover={{ scale: 1.3 }}
      title={`${format(date, 'MMM d')}: ${completed}/${total} completed`}
      className={`w-full aspect-square rounded-sm transition-colors cursor-pointer ${colors[intensity]} ${isToday ? 'ring-1 ring-indigo-400' : ''} ${isFuture ? 'opacity-30' : ''}`}
    />
  );
}

function HabitHeatmap({ habit }: { habit: Habit }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const startWeekday = days[0].getDay(); // 0 = Sunday

  return (
    <motion.div variants={cardVariants} className="p-4 rounded-2xl border border-white/8 bg-surface-elevated/40">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: habit.color + '20', border: `1px solid ${habit.color}35` }}
        >
          <HabitIcon name={habit.icon} size={14} color={habit.color} />
        </div>
        <p className="text-sm font-semibold text-primary flex-1 truncate">{habit.name}</p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-1 rounded-lg hover:bg-white/8 text-tertiary transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-secondary w-16 text-center">{format(currentMonth, 'MMM yyyy')}</span>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-1 rounded-lg hover:bg-white/8 text-tertiary transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-[9px] text-tertiary text-center font-medium">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startWeekday }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => (
            <HeatmapCell key={day.toISOString()} date={day} habits={[habit]} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] text-tertiary">Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-sm ${['bg-white/5', 'bg-indigo-500/20', 'bg-indigo-500/40', 'bg-indigo-500/65', 'bg-indigo-500'][i]}`}
          />
        ))}
        <span className="text-[10px] text-tertiary">More</span>
      </div>
    </motion.div>
  );
}

export function Calendar() {
  const { habits } = useHabitStats();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const startWeekday = days[0].getDay();
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Calendar</h1>
        <p className="text-sm text-secondary mt-0.5">Visualize your habit streaks</p>
      </div>

      {/* Overall Month Calendar */}
      <motion.div variants={cardVariants} className="p-5 rounded-2xl border border-white/8 bg-surface-elevated/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-primary">{format(currentMonth, 'MMMM yyyy')}</h2>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentMonth((m) => subMonths(m, 1))} className="p-1.5 rounded-lg hover:bg-white/8 text-secondary transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setCurrentMonth((m) => addMonths(m, 1))} className="p-1.5 rounded-lg hover:bg-white/8 text-secondary transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-[10px] text-tertiary text-center font-semibold py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startWeekday }, (_, i) => <div key={i} />)}
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const total = habits.length;
            const completed = habits.filter((h) => getCompletionForDate(h, dateStr)).length;
            const ratio = total > 0 ? completed / total : 0;
            const isToday = dateStr === today;
            const isFuture = dateStr > today;
            const intensity = ratio === 0 ? 0 : ratio < 0.33 ? 1 : ratio < 0.66 ? 2 : ratio < 1 ? 3 : 4;
            const colors = ['bg-white/5', 'bg-indigo-500/20', 'bg-indigo-500/40', 'bg-indigo-500/65', 'bg-indigo-500'];

            return (
              <motion.div
                key={dateStr}
                whileHover={{ scale: 1.1 }}
                title={`${format(day, 'MMM d')}: ${completed}/${total}`}
                className={`relative aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${colors[intensity]} ${isToday ? 'ring-2 ring-indigo-400' : ''} ${isFuture ? 'opacity-30' : ''}`}
              >
                <span className={`text-xs font-medium ${intensity >= 3 ? 'text-white' : 'text-secondary'}`}>
                  {format(day, 'd')}
                </span>
                {total > 0 && !isFuture && completed === total && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-tertiary">All habits done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-tertiary">Less</span>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${['bg-white/5', 'bg-indigo-500/20', 'bg-indigo-500/40', 'bg-indigo-500/65', 'bg-indigo-500'][i]}`} />
            ))}
            <span className="text-[10px] text-tertiary">More</span>
          </div>
        </div>
      </motion.div>

      {/* Per-Habit Heatmaps */}
      {habits.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Per-Habit Heatmaps</h2>
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitHeatmap key={habit.id} habit={habit} />
            ))}
          </div>
        </div>
      )}

      {habits.length === 0 && (
        <motion.div variants={cardVariants} className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-base font-semibold text-primary">No habits to show</h3>
          <p className="text-sm text-secondary mt-1.5">Create habits to see your calendar heatmap.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
