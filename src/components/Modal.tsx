import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { overlayVariants, modalVariants } from '../animations/variants';

interface ModalProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
};

export function Modal({ title, children, isOpen, onClose, size = 'md' }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-x-0 z-100 flex items-center justify-center p-4">
          <div className='rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto'>
          <motion.div
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`relative w-full ${SIZE_CLASSES[size]} bg-surface border border-white/8 rounded-3xl shadow-2xl overflow-hidden`}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
                <h2 className="text-lg font-semibold text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/8 transition-colors text-secondary"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
