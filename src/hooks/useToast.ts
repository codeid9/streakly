import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function useToastAutoRemove() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    state.toasts.forEach((toast) => {
      const duration = toast.duration ?? 3500;
      const timer = setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', id: toast.id });
      }, duration);
      return () => clearTimeout(timer);
    });
  }, [state.toasts, dispatch]);
}
