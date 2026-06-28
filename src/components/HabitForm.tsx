import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Habit, HabitCategory } from '../types';
import { useApp } from '../context/AppContext';
import { HABIT_COLORS, HABIT_ICONS, getCategoryLabel } from '../utils/habitUtils';
import { HabitIcon } from './HabitIcon';

interface HabitFormProps {
  habit?: Habit | null;
  onClose: () => void;
}

const CATEGORIES: HabitCategory[] = ['health', 'fitness', 'study', 'work', 'personal', 'mindfulness', 'finance'];

export function HabitForm({ habit, onClose }: HabitFormProps) {
  const { dispatch, addToast } = useApp();
  const isEdit = !!habit;

  const [name, setName] = useState(habit?.name ?? '');
  const [description, setDescription] = useState(habit?.description ?? '');
  const [category, setCategory] = useState<HabitCategory>(habit?.category ?? 'personal');
  const [color, setColor] = useState(habit?.color ?? HABIT_COLORS[0]);
  const [icon, setIcon] = useState(habit?.icon ?? 'Star');
  const [dailyTarget] = useState(habit?.dailyTarget ?? 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEdit && habit) {
      dispatch({ type: 'UPDATE_HABIT', id: habit.id, updates: { name, description, category, color, icon, dailyTarget } });
      addToast({ type: 'success', message: 'Habit updated successfully!' });
    } else {
      dispatch({ type: 'ADD_HABIT', habit: { name, description, category, color, icon, dailyTarget, frequency: 'daily' } });
      addToast({ type: 'success', message: 'New habit created! 🎉' });
    }
    dispatch({ type: 'CHECK_ACHIEVEMENTS' });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-secondary mb-1.5 uppercase tracking-wider">Habit Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning meditation"
          className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/10 text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
          required
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-secondary mb-1.5 uppercase tracking-wider">Description <span className="text-tertiary normal-case">(optional)</span></label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this habit do for you?"
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/10 text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-secondary mb-1.5 uppercase tracking-wider">Category</label>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                category === cat
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-white/4 border-white/8 text-secondary hover:text-primary hover:bg-white/8'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-xs font-semibold text-secondary mb-1.5 uppercase tracking-wider">Color</label>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full transition-all duration-200 ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-surface scale-110' : 'hover:scale-105'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Icon */}
      <div>
        <label className="block text-xs font-semibold text-secondary mb-1.5 uppercase tracking-wider">Icon</label>
        <div className="grid grid-cols-8 gap-1.5">
          {HABIT_ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => setIcon(ic)}
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                icon === ic ? 'bg-white/15 ring-1 ring-white/30' : 'bg-white/4 hover:bg-white/8'
              }`}
            >
              <HabitIcon name={ic} size={16} color={icon === ic ? color : undefined} className={icon === ic ? '' : 'text-tertiary'} />
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-3 rounded-xl border border-white/8 bg-white/3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '25', border: `1px solid ${color}40` }}>
          <HabitIcon name={icon} size={20} color={color} />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{name || 'Habit Name'}</p>
          <p className="text-xs text-tertiary">{getCategoryLabel(category)} · Daily</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-secondary text-sm font-medium hover:bg-white/5 transition-all"
        >
          Cancel
        </button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
        >
          {isEdit ? 'Save Changes' : 'Create Habit'}
        </motion.button>
      </div>
    </form>
  );
}
