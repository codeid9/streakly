import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sun, Moon, Monitor, Download, Upload, Trash2, Award, Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useHabitStats } from '../hooks/useHabitStats';
import { exportData, importData, clearData } from '../utils/storage';
import { pageVariants, cardVariants } from '../animations/variants';
import { HabitIcon } from '../components/HabitIcon';

type Theme = 'light' | 'dark' | 'system';

const THEMES: { value: Theme; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export function Settings() {
  const { state, dispatch, addToast } = useApp();
  const { habits, allStats } = useHabitStats();
  const { settings, achievements } = state.data;
  const fileRef = useRef<HTMLInputElement>(null);

  const handleThemeChange = (theme: Theme) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { theme } });
  };

  const handleExport = () => {
    exportData(state.data);
    addToast({ type: 'success', message: 'Data exported successfully!' });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importData(file);
      dispatch({ type: 'IMPORT_DATA', data });
      addToast({ type: 'success', message: 'Data imported successfully!' });
    } catch {
      addToast({ type: 'error', message: 'Failed to import data. Invalid file.' });
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      dispatch({ type: 'RESET_DATA' });
      clearData();
      addToast({ type: 'info', message: 'All data has been reset.' });
    }
  };

  const totalCompletions = allStats.reduce((s, stat) => s + stat.totalCompletions, 0);
  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-secondary mt-0.5">Manage your preferences and data</p>
      </div>

      {/* Theme */}
      <motion.div variants={cardVariants} className="p-5 rounded-2xl border border-white/8 bg-surface-elevated/40 space-y-3">
        <h2 className="text-sm font-semibold text-primary">Appearance</h2>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                settings.theme === value
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400'
                  : 'border-white/8 text-secondary hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={cardVariants} className="p-5 rounded-2xl border border-white/8 bg-surface-elevated/40 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-primary">Achievements</h2>
          <span className="text-xs text-secondary">{unlockedAchievements.length}/{achievements.length} unlocked</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            return (
              <div
                key={ach.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'border-amber-500/25 bg-amber-500/8'
                    : 'border-white/6 bg-white/2 opacity-60'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-tertiary'}`}>
                  {isUnlocked ? <HabitIcon name={ach.icon} size={16} color="#f59e0b" /> : <Lock size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${isUnlocked ? 'text-primary' : 'text-secondary'}`}>{ach.title}</p>
                  <p className="text-[11px] text-tertiary truncate">{ach.description}</p>
                </div>
                {isUnlocked && <Award size={14} className="text-amber-400 shrink-0" />}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Data Summary */}
      <motion.div variants={cardVariants} className="p-5 rounded-2xl border border-white/8 bg-surface-elevated/40 space-y-3">
        <h2 className="text-sm font-semibold text-primary">Your Data</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Habits', value: habits.length },
            { label: 'Check-ins', value: totalCompletions },
            { label: 'Achievements', value: unlockedAchievements.length },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-xl bg-white/5 border border-white/8">
              <p className="text-xl font-bold text-primary">{item.value}</p>
              <p className="text-[11px] text-tertiary">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data Actions */}
      <motion.div variants={cardVariants} className="p-5 rounded-2xl border border-white/8 bg-surface-elevated/40 space-y-3">
        <h2 className="text-sm font-semibold text-primary">Data Management</h2>
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-all text-left"
          >
            <Download size={16} className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-primary">Export Data</p>
              <p className="text-[11px] text-secondary">Download your data as JSON</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-all text-left"
          >
            <Upload size={16} className="text-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-primary">Import Data</p>
              <p className="text-[11px] text-secondary">Restore from a JSON backup</p>
            </div>
          </motion.button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 hover:bg-red-500/15 transition-all text-left"
          >
            <Trash2 size={16} className="text-red-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-400">Reset All Data</p>
              <p className="text-[11px] text-red-400/60">This action is irreversible</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* About */}
      <motion.div variants={cardVariants} className="p-5 rounded-2xl border border-white/8 bg-surface-elevated/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-lg">⚡</span>
          </div>
          <div>
            <p className="text-sm font-bold text-primary">HabitGrow</p>
            <p className="text-xs text-tertiary">v1.0.0 · Built with React + TypeScript</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
