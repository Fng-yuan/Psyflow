import { motion } from 'framer-motion';
import { Calendar, Euro, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DayStats } from '../data/types';

interface DayHeaderProps {
  stats: DayStats;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon apres-midi';
  return 'Bonsoir';
}

const statCards = (stats: DayStats) => [
  {
    icon: Calendar,
    value: stats.totalSessions,
    label: 'Seances',
    color: 'text-ios-blue',
    bg: 'bg-ios-blue/10',
  },
  {
    icon: Euro,
    value: `${stats.totalRevenue}\u202F\u20AC`,
    label: 'Revenus',
    color: 'text-ios-green',
    bg: 'bg-ios-green/10',
  },
  {
    icon: FileText,
    value: stats.notesPending,
    label: 'Notes',
    color: 'text-ios-orange',
    bg: 'bg-ios-orange/10',
  },
  {
    icon: AlertCircle,
    value: stats.unpaidCount,
    label: 'Impayes',
    color: 'text-ios-red',
    bg: 'bg-ios-red/10',
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function DayHeader({ stats }: DayHeaderProps) {
  const today = new Date();
  const dateStr = format(today, "EEEE d MMMM yyyy", { locale: fr });
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  const cards = statCards(stats);

  return (
    <div className="px-4 pt-[env(safe-area-inset-top)] pb-2">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4"
      >
        <p className="text-ios-gray-1 text-[15px]">{getGreeting()}</p>
        <h1 className="text-[28px] font-bold text-black tracking-tight">Dr. Martin</h1>
        <p className="text-ios-gray-1 text-[15px] mt-0.5">{capitalizedDate}</p>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex gap-2.5 mt-5 overflow-x-auto pb-1 -mx-4 px-4"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={item}
              className="ios-card p-3 min-w-[90px] flex flex-col items-start gap-1.5 shrink-0"
            >
              <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center`}>
                <Icon size={17} className={card.color} strokeWidth={2} />
              </div>
              <span className="text-[20px] font-bold text-black leading-tight">{card.value}</span>
              <span className="text-[12px] text-ios-gray-1 font-medium">{card.label}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
