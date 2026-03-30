import { motion } from 'framer-motion';
import { Check, DollarSign } from 'lucide-react';
import type { Appointment } from '../data/types';
import StatusBadge from './StatusBadge';

interface AppointmentCardProps {
  appointment: Appointment;
  onSelect: (appointment: Appointment) => void;
}

const statusConfig: Record<string, { label: string; variant: 'green' | 'red' | 'blue' | 'orange' | 'gray'; pulse?: boolean }> = {
  upcoming: { label: 'A venir', variant: 'gray' },
  completed: { label: 'Terminee', variant: 'green' },
  'in-progress': { label: 'En cours', variant: 'blue', pulse: true },
  'no-show': { label: 'Absent', variant: 'red' },
  cancelled: { label: 'Annulee', variant: 'orange' },
};

export default function AppointmentCard({ appointment, onSelect }: AppointmentCardProps) {
  const { patient, startTime, endTime, status, noteId, invoiceId } = appointment;
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`;
  const config = statusConfig[status] ?? statusConfig.upcoming;

  const hasNote = !!noteId;
  const hasPaidInvoice = !!invoiceId;

  const sessionNumber = patient.notes.length + (status === 'completed' ? 0 : 1);

  return (
    <motion.button
      onClick={() => onSelect(appointment)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="w-full flex items-stretch gap-3 p-0 text-left"
    >
      {/* Time column + blue line */}
      <div className="flex flex-col items-center w-14 shrink-0 pt-1">
        <span className="text-[13px] font-semibold text-black">{startTime}</span>
        <div className="w-[2px] flex-1 bg-ios-blue/30 rounded-full my-1" />
        <span className="text-[11px] text-ios-gray-1">{endTime}</span>
      </div>

      {/* Main card */}
      <div className="flex-1 ios-card p-3.5 flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm"
          style={{ backgroundColor: patient.avatarColor }}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-black truncate">
              {patient.firstName} {patient.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[13px] text-ios-gray-1">
              Seance #{sessionNumber}
            </span>
            <StatusBadge status={config.label} variant={config.variant} pulse={config.pulse} />
          </div>
        </div>

        {/* Quick icons */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          {hasNote && (
            <div className="w-6 h-6 rounded-full bg-ios-green/15 flex items-center justify-center">
              <Check size={13} className="text-ios-green" strokeWidth={2.5} />
            </div>
          )}
          {hasPaidInvoice && (
            <div className="w-6 h-6 rounded-full bg-ios-blue/15 flex items-center justify-center">
              <DollarSign size={13} className="text-ios-blue" strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
