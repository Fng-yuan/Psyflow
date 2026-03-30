import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TabBar, { type TabId } from './components/TabBar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import InvoicesPage from './pages/InvoicesPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('agenda');

  const pages: Record<TabId, React.ReactNode> = {
    agenda: <DashboardPage />,
    patients: <PatientsPage />,
    factures: <InvoicesPage />,
    profil: <ProfilePage />,
  };

  return (
    <div className="min-h-dvh bg-ios-bg flex">
      {/* Desktop sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 min-h-dvh overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="min-h-dvh pb-20 lg:pb-8"
          >
            {pages[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile tab bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
