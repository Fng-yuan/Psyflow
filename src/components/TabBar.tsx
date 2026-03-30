import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Receipt, User } from 'lucide-react';

export type TabId = 'agenda' | 'patients' | 'factures' | 'profil';

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'agenda', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'factures', label: 'Factures', icon: Receipt },
  { id: 'profil', label: 'Profil', icon: User },
];

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 ios-blur bg-ios-card/80 border-t border-ios-separator/50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-[50px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative"
            >
              <div className="relative">
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-ios-blue' : 'text-ios-gray-1'
                  }`}
                  fill={isActive ? 'currentColor' : 'none'}
                />
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ios-blue"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-ios-blue' : 'text-ios-gray-1'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
