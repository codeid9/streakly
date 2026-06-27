import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useHabitStats } from '../hooks/useHabitStats';
import { HabitCard } from '../components/HabitCard';
import { Modal } from '../components/Modal';
import { HabitForm } from '../components/HabitForm';
import { pageVariants, listContainerVariants, cardVariants } from '../animations/variants';
import type { HabitCategory } from '../types';

const CATEGORY_FILTERS: { value: 'all' | HabitCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'health', label: 'Health' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'study', label: 'Study' },
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'mindfulness', label: 'Mind' },
  { value: 'finance', label: 'Finance' },
];

export function Habits() {
  const { state, openModal, closeModal, dispatch, addToast } = useApp();
  const { habits } = useHabitStats();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | HabitCategory>('all');

  const { modal } = state;

  const filtered = habits.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || h.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleDeleteConfirm = () => {
    if (modal.data) {
      dispatch({ type: 'DELETE_HABIT', id: modal.data.id });
      addToast({ type: 'success', message: 'Habit deleted.' });
      closeModal();
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">My Habits</h1>
          <p className="text-sm text-secondary mt-0.5">{habits.length} active habits</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal('create')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-primary text-sm font-semibold shadow-lg shadow-indigo-500/30"
        >
          <Plus size={16} />
          Add Habit
        </motion.button>
      </div>

      {/* Search + Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search habits..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setCategoryFilter(f.value)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === f.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-secondary border border-white/8 hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Habit List */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div variants={listContainerVariants} initial="initial" animate="animate" className="space-y-2">
            {filtered.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Layers size={28} className="text-tertiary" />
            </div>
            <h3 className="text-base font-semibold text-primary">No habits found</h3>
            <p className="text-sm text-secondary mt-1.5">
              {search ? 'Try a different search term' : 'Create your first habit to get started'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <Modal
        title={modal.type === 'edit' ? 'Edit Habit' : 'Create New Habit'}
        isOpen={modal.isOpen && (modal.type === 'create' || modal.type === 'edit')}
        onClose={closeModal}
        size="md"
      >
        <HabitForm habit={modal.type === 'edit' ? modal.data : null} onClose={closeModal} />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        title="Delete Habit"
        isOpen={modal.isOpen && modal.type === 'delete'}
        onClose={closeModal}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary">
            Are you sure you want to delete <span className="text-primary font-semibold">"{modal.data?.name}"</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={closeModal} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-secondary text-sm font-medium hover:bg-white/5 transition-all">Cancel</button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleDeleteConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-all">Delete</motion.button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
