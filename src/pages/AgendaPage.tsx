import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import DayHeader from '../components/DayHeader';
import AppointmentCard from '../components/AppointmentCard';
import NoteEditor from '../components/NoteEditor';
import { todayAppointments, getTodayStats } from '../data/mockData';
import type { Appointment } from '../data/types';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function AgendaPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const stats = getTodayStats();

  const handleSelect = (apt: Appointment) => {
    setSelectedAppointment(apt);
  };

  return (
    <div className="min-h-full">
      <DayHeader stats={stats} />

      {/* Section title */}
      <div className="px-4 mt-6 mb-3 flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-black">Planning du jour</h2>
        <span className="text-[13px] text-ios-gray-1 font-medium">
          {todayAppointments.filter(a => a.status !== 'cancelled').length} patients
        </span>
      </div>

      {/* Timeline */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 space-y-3"
      >
        {todayAppointments.map((apt) => (
          <motion.div key={apt.id} variants={item}>
            <AppointmentCard appointment={apt} onSelect={handleSelect} />
          </motion.div>
        ))}
      </motion.div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-ios-blue shadow-lg shadow-ios-blue/30 flex items-center justify-center z-40"
      >
        <Plus size={26} className="text-white" strokeWidth={2.5} />
      </motion.button>

      {/* Note Editor modal */}
      {selectedAppointment && (
        <NoteEditor
          patient={selectedAppointment.patient}
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSave={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}
