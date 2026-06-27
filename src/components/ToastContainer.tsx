import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToastAutoRemove } from '../hooks/useToast';
import { toastVariants } from '../animations/variants';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
  error: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
  info: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
  warning: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
};

export function ToastContainer() {
  const { state, dispatch } = useApp();
  useToastAutoRemove();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {state.toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          const colorClass = COLORS[toast.type];
          return (
            <motion.div
              key={toast.id}
              variants={toastVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl bg-gradient-to-r ${colorClass} shadow-2xl min-w-[280px] max-w-sm`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="text-sm font-medium text-white/90 flex-1">{toast.message}</span>
              <button
                onClick={() => dispatch({ type: 'REMOVE_TOAST', id: toast.id })}
                className="shrink-0 text-white/50 hover:text-white/80 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
