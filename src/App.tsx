import { AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
import { Sidebar, BottomNav } from './components/Navigation';
import { ToastContainer } from './components/ToastContainer';
import { Modal } from './components/Modal';
import { HabitForm } from './components/HabitForm';
import { Dashboard } from './pages/Dashboard';
import { Habits } from './pages/Habits';
import { Statistics } from './pages/Statistics';
import { Calendar } from './pages/Calendar';
import { Settings } from './pages/Settings';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

function PageContent() {
  const { state } = useApp();
  const { currentPage } = state;

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'dashboard' && <Dashboard key="dashboard" />}
      {currentPage === 'habits' && <Habits key="habits" />}
      {currentPage === 'statistics' && <Statistics key="statistics" />}
      {currentPage === 'calendar' && <Calendar key="calendar" />}
      {currentPage === 'settings' && <Settings key="settings" />}
    </AnimatePresence>
  );
}

function GlobalModal() {
  const { state, closeModal } = useApp();
  const { modal } = state;
  const showGlobalModal = modal.isOpen && (modal.type === 'create' || modal.type === 'edit');

  if (state.currentPage === 'habits') return null; // Habits page manages its own modals

  return (
    <Modal
      title={modal.type === 'edit' ? 'Edit Habit' : 'Create New Habit'}
      isOpen={showGlobalModal}
      onClose={closeModal}
      size="md"
    >
      <HabitForm habit={modal.type === 'edit' ? modal.data : null} onClose={closeModal} />
    </Modal>
  );
}

export default function App() {
  const { openModal } = useApp();

  return (
    <div className="min-h-screen bg-background text-primary font-sans flex">
      <Sidebar />

      <main className="flex-1 overflow-y-auto min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24 lg:pb-8 lg:px-6 lg:py-8">
          <PageContent />
        </div>
      </main>

      <BottomNav />

      {/* FAB for mobile */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => openModal('create')}
        className="lg:hidden fixed bottom-20 right-5 z-40 w-13 h-13 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-center"
      >
        <Plus size={22} />
      </motion.button>

      <GlobalModal />
      <ToastContainer />
    </div>
  );
}
