import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Receipt, User, Sparkles } from 'lucide-react';
import type { TabId } from './TabBar';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'agenda', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'factures', label: 'Factures', icon: Receipt },
  { id: 'profil', label: 'Profil', icon: User },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-dvh bg-white/80 ios-blur border-r border-ios-separator/30 shrink-0">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-ios-blue to-ios-purple flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-black tracking-tight">PsyFlow</h1>
          <p className="text-[11px] text-ios-gray-2 font-medium">Assistant IA</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 relative ${
                isActive
                  ? 'bg-ios-blue/10 text-ios-blue'
                  : 'text-ios-gray-1 hover:bg-ios-gray-6'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-ios-blue/10 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={21}
                strokeWidth={isActive ? 2.2 : 1.6}
                className="relative z-10"
                fill={isActive ? 'currentColor' : 'none'}
              />
              <span className={`text-[15px] font-medium relative z-10 ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom profile */}
      <div className="px-4 pb-6 pt-4 border-t border-ios-separator/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ios-blue to-ios-purple flex items-center justify-center text-white font-semibold text-sm">
            CM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-black truncate">Dr. Claire Martin</p>
            <p className="text-[12px] text-ios-gray-2">Psychologue</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
