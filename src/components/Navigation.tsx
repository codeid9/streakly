import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import type { Page } from '../types';
import {
  LayoutDashboard, CheckSquare, BarChart3, Calendar, Settings, Zap,
} from 'lucide-react';

const NAV_ITEMS: { page: Page; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { page: 'habits', label: 'Habits', icon: CheckSquare },
  { page: 'statistics', label: 'Statistics', icon: BarChart3 },
  { page: 'calendar', label: 'Calendar', icon: Calendar },
  { page: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { state, navigate } = useApp();
  const { currentPage } = state;

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-white/8 bg-surface-elevated/50 backdrop-blur-xl shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/8">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-primary text-sm tracking-tight">Streakly</p>
          <p className="text-[11px] text-tertiary">Track your progress</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ page, label, icon: Icon }) => {
          const isActive = currentPage === page;
          return (
            <motion.button
              key={page}
              onClick={() => navigate(page)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                isActive
                  ? 'text-white bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25'
                  : 'text-secondary hover:text-primary hover:bg-white/6'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon size={17} className="relative z-10 shrink-0" />
              <span className="relative z-10">{label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-white/8">
        <div className="px-3 py-3 rounded-xl bg-linear-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <p className="text-xs font-semibold text-indigo-400">Build better habits</p>
          <p className="text-[11px] text-tertiary mt-0.5">One day at a time 🌱</p>
        </div>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const { state, navigate } = useApp();
  const { currentPage } = state;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/8 bg-surface-elevated/90 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ page, label, icon: Icon }) => {
          const isActive = currentPage === page;
          return (
            <motion.button
              key={page}
              onClick={() => navigate(page)}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-indigo-400' : 'text-tertiary'
              }`}
            >
              <div className={`relative p-1.5 rounded-lg transition-all ${isActive ? 'bg-indigo-500/15' : ''}`}>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-lg bg-indigo-500/15"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={18} className="relative z-10" />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
