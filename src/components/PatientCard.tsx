import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Patient } from '../data/types';

interface PatientCardProps {
  patient: Patient;
  onSelect: (patient: Patient) => void;
}

function getTrend(scores: number[]): 'up' | 'down' | 'stable' {
  if (scores.length < 2) return 'stable';
  const last = scores[scores.length - 1];
  const prev = scores[scores.length - 2];
  if (last > prev) return 'up';
  if (last < prev) return 'down';
  return 'stable';
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'down')
    return <TrendingDown size={12} className="text-ios-green" strokeWidth={2.5} />;
  if (trend === 'up')
    return <TrendingUp size={12} className="text-ios-red" strokeWidth={2.5} />;
  return <Minus size={12} className="text-ios-gray-2" strokeWidth={2.5} />;
}

export default function PatientCard({ patient, onSelect }: PatientCardProps) {
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`;
  const gadTrend = getTrend(patient.gad7Scores);
  const phqTrend = getTrend(patient.phq9Scores);
  const lastGad = patient.gad7Scores[patient.gad7Scores.length - 1] ?? '-';
  const lastPhq = patient.phq9Scores[patient.phq9Scores.length - 1] ?? '-';

  return (
    <motion.button
      onClick={() => onSelect(patient)}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="w-full ios-card p-4 flex items-center gap-3 text-left"
    >
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-base"
        style={{ backgroundColor: patient.avatarColor }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[16px] font-semibold text-black truncate">
            {patient.firstName} {patient.lastName}
          </span>
          <span className="text-[13px] text-ios-gray-1 shrink-0">{patient.age} ans</span>
        </div>

        <p className="text-[13px] text-ios-gray-1 mt-0.5">
          {patient.sessionCount} seances &middot; Suivi depuis {patient.followingSince}
        </p>

        {/* Theme tags */}
        {patient.themes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {patient.themes.slice(0, 4).map((theme) => (
              <span
                key={theme}
                className="px-2 py-0.5 rounded-full bg-ios-gray-6 text-[11px] font-medium text-ios-gray-1"
              >
                {theme}
              </span>
            ))}
            {patient.themes.length > 4 && (
              <span className="px-2 py-0.5 rounded-full bg-ios-gray-6 text-[11px] font-medium text-ios-gray-1">
                +{patient.themes.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Scores */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-ios-gray-2">GAD-7</span>
            <span className="text-[12px] font-semibold text-black">{lastGad}</span>
            <TrendIcon trend={gadTrend} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-ios-gray-2">PHQ-9</span>
            <span className="text-[12px] font-semibold text-black">{lastPhq}</span>
            <TrendIcon trend={phqTrend} />
          </div>
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight size={20} className="text-ios-gray-3 shrink-0" />
    </motion.button>
  );
}
