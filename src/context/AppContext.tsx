import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { AppData, Habit, AppSettings, Toast, ModalState, Page } from '../types';
import { loadData, saveData } from '../utils/storage';
import { generateId, getTodayString, getCurrentStreak } from '../utils/habitUtils';


// ─── State ────────────────────────────────────────────────────────────────────

interface AppState {
  data: AppData;
  currentPage: Page;
  toasts: Toast[];
  modal: ModalState;
  isLoading: boolean;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_PAGE'; page: Page }
  | { type: 'ADD_HABIT'; habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completions' | 'archived'> }
  | { type: 'UPDATE_HABIT'; id: string; updates: Partial<Habit> }
  | { type: 'DELETE_HABIT'; id: string }
  | { type: 'TOGGLE_HABIT'; habitId: string; date: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'ADD_TOAST'; toast: Omit<Toast, 'id'> }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'OPEN_MODAL'; modalType: ModalState['type']; data?: Habit }
  | { type: 'CLOSE_MODAL' }
  | { type: 'IMPORT_DATA'; data: AppData }
  | { type: 'RESET_DATA' }
  | { type: 'CHECK_ACHIEVEMENTS' };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.page };

    case 'ADD_HABIT': {
      const now = new Date().toISOString();
      const newHabit: Habit = {
        ...action.habit,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        completions: [],
        archived: false,
      };
      const newData = { ...state.data, habits: [...state.data.habits, newHabit] };
      return { ...state, data: newData, modal: { isOpen: false, type: null } };
    }

    case 'UPDATE_HABIT': {
      const habits = state.data.habits.map((h) =>
        h.id === action.id ? { ...h, ...action.updates, updatedAt: new Date().toISOString() } : h,
      );
      return { ...state, data: { ...state.data, habits }, modal: { isOpen: false, type: null } };
    }

    case 'DELETE_HABIT': {
      const habits = state.data.habits.filter((h) => h.id !== action.id);
      return { ...state, data: { ...state.data, habits }, modal: { isOpen: false, type: null } };
    }

    case 'TOGGLE_HABIT': {
      const habits = state.data.habits.map((h) => {
        if (h.id !== action.habitId) return h;
        const existingIdx = h.completions.findIndex((c) => c.date === action.date);
        let completions;
        if (existingIdx >= 0) {
          completions = h.completions.map((c, i) => (i === existingIdx ? { ...c, completed: !c.completed } : c));
        } else {
          completions = [...h.completions, { date: action.date, completed: true }];
        }
        return { ...h, completions, updatedAt: new Date().toISOString() };
      });
      return { ...state, data: { ...state.data, habits } };
    }

    case 'UPDATE_SETTINGS':
      return { ...state, data: { ...state.data, settings: { ...state.data.settings, ...action.settings } } };

    case 'ADD_TOAST': {
      const toast: Toast = { ...action.toast, id: generateId() };
      return { ...state, toasts: [...state.toasts, toast] };
    }

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    case 'OPEN_MODAL':
      return { ...state, modal: { isOpen: true, type: action.modalType, data: action.data ?? null } };

    case 'CLOSE_MODAL':
      return { ...state, modal: { isOpen: false, type: null, data: null } };

    case 'IMPORT_DATA':
      return { ...state, data: action.data, modal: { isOpen: false, type: null } };

    case 'RESET_DATA':
      return {
        ...state,
        data: {
          habits: [],
          settings: state.data.settings,
          achievements: state.data.achievements.map((a) => ({ ...a, unlockedAt: undefined })),
          lastUpdated: new Date().toISOString(),
        },
      };

    case 'CHECK_ACHIEVEMENTS': {
      const habits = state.data.habits;
      const totalCompletions = habits.reduce((sum, h) => sum + h.completions.filter((c) => c.completed).length, 0);
      const maxStreak = Math.max(...habits.map(getCurrentStreak), 0);
      const todayStr = getTodayString();
      const allDone = habits.length > 0 && habits.every((h) => h.completions.some((c) => c.date === todayStr && c.completed));

      const achievements = state.data.achievements.map((ach) => {
        if (ach.unlockedAt) return ach;
        let shouldUnlock = false;
        if (ach.id === 'first-habit' && habits.length >= 1) shouldUnlock = true;
        if (ach.id === 'week-streak' && maxStreak >= 7) shouldUnlock = true;
        if (ach.id === 'month-streak' && maxStreak >= 30) shouldUnlock = true;
        if (ach.id === 'five-habits' && habits.length >= 5) shouldUnlock = true;
        if (ach.id === 'century' && totalCompletions >= 100) shouldUnlock = true;
        if (ach.id === 'perfect-week' && allDone) shouldUnlock = true;
        return shouldUnlock ? { ...ach, unlockedAt: new Date().toISOString() } : ach;
      });

      return { ...state, data: { ...state.data, achievements } };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  openModal: (type: ModalState['type'], data?: Habit) => void;
  closeModal: () => void;
  navigate: (page: Page) => void;
  toggleHabit: (habitId: string, date?: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initialData = loadData();
  const [state, dispatch] = useReducer(reducer, {
    data: initialData,
    currentPage: 'dashboard',
    toasts: [],
    modal: { isOpen: false, type: null },
    isLoading: false,
  });

  // Persist on change
  useEffect(() => {
    saveData(state.data);
  }, [state.data]);

  // Apply theme
  useEffect(() => {
    const { theme } = state.data.settings;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, [state.data.settings.theme]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    dispatch({ type: 'ADD_TOAST', toast });
  }, []);

  const openModal = useCallback((type: ModalState['type'], data?: Habit) => {
    dispatch({ type: 'OPEN_MODAL', modalType: type, data });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const navigate = useCallback((page: Page) => {
    dispatch({ type: 'SET_PAGE', page });
  }, []);

  const toggleHabit = useCallback(
    (habitId: string, date?: string) => {
      const targetDate = date || getTodayString();
      dispatch({ type: 'TOGGLE_HABIT', habitId, date: targetDate });
      dispatch({ type: 'CHECK_ACHIEVEMENTS' });
    },
    [],
  );

  return (
    <AppContext.Provider value={{ state, dispatch, addToast, openModal, closeModal, navigate, toggleHabit }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
