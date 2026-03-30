import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TabBar, { type TabId } from './components/TabBar';
import AgendaPage from './pages/AgendaPage';
import PatientsPage from './pages/PatientsPage';
import InvoicesPage from './pages/InvoicesPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('agenda');

  const pages: Record<TabId, React.ReactNode> = {
    agenda: <AgendaPage />,
    patients: <PatientsPage />,
    factures: <InvoicesPage />,
    profil: <ProfilePage />,
  };

  return (
    <div className="min-h-dvh bg-gray-200 flex items-center justify-center">
      {/* iPhone-like container */}
      <div className="w-full max-w-[430px] min-h-dvh bg-ios-bg relative overflow-hidden shadow-2xl md:rounded-[40px] md:min-h-[860px] md:max-h-[900px] md:my-6 md:border md:border-black/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full overflow-y-auto pb-24"
          >
            {pages[activeTab]}
          </motion.div>
        </AnimatePresence>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
