import { motion } from 'framer-motion';
import { Edit2, Trash2, Flame, CheckCircle2, Circle } from 'lucide-react';
import type { Habit } from '../types';
import { useApp } from '../context/AppContext';
import { HabitIcon } from './HabitIcon';
import { getTodayString, getCurrentStreak, getCompletionForDate, getCategoryLabel } from '../utils/habitUtils';
import { listItemVariants } from '../animations/variants';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { toggleHabit, openModal } = useApp();
  const today = getTodayString();
  const isCompleted = getCompletionForDate(habit, today);
  const streak = getCurrentStreak(habit);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    return getCompletionForDate(habit, dateStr);
  });

  return (
    <motion.div
      variants={listItemVariants}
      layout
      className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
        isCompleted
          ? 'bg-gradient-to-r from-white/5 to-white/3 border-white/15'
          : 'bg-surface-elevated/60 border-white/8 hover:border-white/15'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className="relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: habit.color + '20', border: `1px solid ${habit.color}35` }}
        >
          <HabitIcon name={habit.icon} size={22} color={habit.color} />
          {isCompleted && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-sm truncate transition-colors ${isCompleted ? 'text-primary/60 line-through' : 'text-primary'}`}>
              {habit.name}
            </h3>
            {streak > 0 && (
              <span className="flex items-center gap-0.5 text-[11px] font-semibold text-orange-400 shrink-0">
                <Flame size={11} />
                {streak}
              </span>
            )}
          </div>
          <p className="text-xs text-tertiary mt-0.5">{getCategoryLabel(habit.category)}</p>

          {/* Last 7 days dots */}
          <div className="flex items-center gap-1 mt-2">
            {last7.map((done, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${done ? 'opacity-100' : 'opacity-20'}`}
                style={{ backgroundColor: done ? habit.color : '#6b7280' }}
              />
            ))}
            <span className="ml-1 text-[10px] text-tertiary">7d</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); openModal('edit', habit); }}
            className="p-2 rounded-lg text-tertiary hover:text-primary hover:bg-white/8 transition-all opacity-0 group-hover:opacity-100"
          >
            <Edit2 size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); openModal('delete', habit); }}
            className="p-2 rounded-lg text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => toggleHabit(habit.id)}
            className={`ml-1 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isCompleted
                ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                : 'text-tertiary hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/6'
            }`}
          >
            {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
