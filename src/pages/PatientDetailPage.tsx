import { motion } from 'framer-motion';
import { ChevronLeft, TrendingDown, TrendingUp, Minus, Sparkles } from 'lucide-react';
import type { Patient } from '../data/types';

interface Props {
  patient: Patient;
  onBack: () => void;
}

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[3px] h-8">
      {values.slice(-6).map((v, i) => (
        <div
          key={i}
          className="w-[6px] rounded-full"
          style={{
            height: `${Math.max((v / max) * 100, 12)}%`,
            backgroundColor: color,
            opacity: i === values.length - 1 || i === values.slice(-6).length - 1 ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}

function TrendIcon({ scores }: { scores: number[] }) {
  if (scores.length < 2) return <Minus size={14} className="text-ios-gray-2" />;
  const last = scores[scores.length - 1];
  const prev = scores[scores.length - 2];
  if (last < prev) return <TrendingDown size={14} className="text-ios-green" />;
  if (last > prev) return <TrendingUp size={14} className="text-ios-red" />;
  return <Minus size={14} className="text-ios-gray-2" />;
}

const stateColors: Record<string, string> = {
  positive: '#34C759',
  tension: '#FF9500',
  conflit: '#FF3B30',
};

export default function PatientDetailPage({ patient, onBack }: Props) {
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`;
  const lastNote = patient.notes[0];
  const lastGad = patient.gad7Scores[patient.gad7Scores.length - 1] ?? '-';
  const lastPhq = patient.phq9Scores[patient.phq9Scores.length - 1] ?? '-';

  const suggestions = [
    lastNote?.plan || 'Continuer le suivi thérapeutique',
    `Évaluer l'évolution des thèmes : ${patient.themes.slice(0, 2).join(', ')}`,
    patient.gad7Scores.length > 3 ? 'Proposer un nouveau GAD-7 pour réévaluation' : 'Poursuivre l\'observation clinique',
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="min-h-full bg-ios-bg"
    >
      {/* Nav bar */}
      <div className="px-5 lg:px-8 pt-6 lg:pt-8 pb-2 flex items-center gap-2">
        <button onClick={onBack} className="flex items-center gap-1 text-ios-blue">
          <ChevronLeft size={22} />
          <span className="text-[17px]">Patients</span>
        </button>
      </div>

      <div className="px-5 lg:px-8 space-y-4 pb-8 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 lg:items-start">
        {/* Section 1: C'est qui? */}
        <div className="ios-card p-4">
          <p className="text-[11px] font-semibold text-ios-gray-2 uppercase tracking-wider mb-3">C'est qui ?</p>
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: patient.avatarColor }}
            >
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-[20px] font-bold text-black">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-[14px] text-ios-gray-1">
                {patient.age} ans · Séance #{patient.sessionCount} · {patient.orientation}
              </p>
            </div>
          </div>
          <p className="text-[14px] text-ios-gray-1 mt-3">{patient.motif}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {patient.themes.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-ios-blue/10 text-ios-blue text-[12px] font-medium">
                {t}
              </span>
            ))}
            {patient.isMonPsy && (
              <span className="px-2.5 py-1 rounded-full bg-ios-green/10 text-ios-green text-[12px] font-semibold">
                MonPsy
              </span>
            )}
          </div>
        </div>

        {/* Section 2: Ça avance? */}
        <div className="ios-card p-4">
          <p className="text-[11px] font-semibold text-ios-gray-2 uppercase tracking-wider mb-3">Ça avance ?</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-ios-bg rounded-2xl p-3 text-center">
              <p className="text-[11px] text-ios-gray-1 font-medium mb-1">GAD-7</p>
              <MiniSparkline values={patient.gad7Scores} color="#007AFF" />
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-[17px] font-bold text-black">{lastGad}</span>
                <TrendIcon scores={patient.gad7Scores} />
              </div>
            </div>
            <div className="bg-ios-bg rounded-2xl p-3 text-center">
              <p className="text-[11px] text-ios-gray-1 font-medium mb-1">PHQ-9</p>
              <MiniSparkline values={patient.phq9Scores} color="#5856D6" />
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-[17px] font-bold text-black">{lastPhq}</span>
                <TrendIcon scores={patient.phq9Scores} />
              </div>
            </div>
            <div className="bg-ios-bg rounded-2xl p-3 text-center">
              <p className="text-[11px] text-ios-gray-1 font-medium mb-1">Séances</p>
              <div className="flex items-end justify-center gap-[3px] h-8">
                {Array.from({ length: Math.min(patient.sessionCount, 6) }, (_, i) => (
                  <div
                    key={i}
                    className="w-[6px] rounded-full bg-ios-green"
                    style={{
                      height: `${40 + Math.random() * 60}%`,
                      opacity: i === Math.min(patient.sessionCount, 6) - 1 ? 1 : 0.4,
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-[17px] font-bold text-black">{patient.sessionCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Où on en était? */}
        {lastNote && (
          <div className="ios-card p-4">
            <p className="text-[11px] font-semibold text-ios-gray-2 uppercase tracking-wider mb-3">Où on en était ?</p>
            <p className="text-[14px] text-black font-medium">{lastNote.patientState}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {lastNote.themes.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-ios-gray-6 text-[11px] text-ios-gray-1 font-medium">{t}</span>
              ))}
            </div>
            <p className="text-[13px] text-ios-gray-1 mt-2">{lastNote.progression}</p>
            {lastNote.plan && (
              <p className="text-[13px] text-ios-orange mt-2 font-medium">→ {lastNote.plan}</p>
            )}
          </div>
        )}

        {/* Section 4: Suggestions IA */}
        <div className="ios-card p-4 bg-gradient-to-br from-ios-blue/5 to-ios-purple/5 border border-ios-blue/10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-ios-blue" />
            <p className="text-[11px] font-semibold text-ios-blue uppercase tracking-wider">
              Suggestions pour la prochaine séance
            </p>
          </div>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-ios-blue mt-1.5 shrink-0" />
                <p className="text-[14px] text-black">{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Relationships */}
        {patient.relationships.length > 0 && (
          <div className="ios-card p-4">
            <p className="text-[11px] font-semibold text-ios-gray-2 uppercase tracking-wider mb-4">Carte relationnelle</p>
            <div className="relative flex items-center justify-center min-h-[200px]">
              {/* Center: patient */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg"
                style={{ backgroundColor: patient.avatarColor }}
              >
                {initials}
              </div>

              {/* Relationships around */}
              {patient.relationships.map((rel, i) => {
                const angle = (i * (360 / patient.relationships.length) - 90) * (Math.PI / 180);
                const radius = 80;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const color = stateColors[rel.state];

                return (
                  <motion.div
                    key={rel.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                    className="absolute flex flex-col items-center"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
                    {/* Line to center */}
                    <svg
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        width: 0, height: 0, overflow: 'visible',
                      }}
                    >
                      <line
                        x1="0" y1="0"
                        x2={-x} y2={-y}
                        stroke={color}
                        strokeWidth={rel.state === 'conflit' ? 1 : 2}
                        strokeDasharray={rel.state === 'conflit' ? '4 3' : 'none'}
                        opacity={0.5}
                      />
                    </svg>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[11px] font-semibold z-10"
                      style={{ backgroundColor: color }}
                    >
                      {rel.name[0]}
                    </div>
                    <p className="text-[10px] font-semibold text-black mt-1 whitespace-nowrap">{rel.name}</p>
                    <p className="text-[9px] text-ios-gray-1">{rel.role}</p>
                    <p className="text-[9px] text-ios-gray-2">{rel.mentionCount}/{rel.totalSessions}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Session history */}
        <div>
          <p className="text-[11px] font-semibold text-ios-gray-2 uppercase tracking-wider mb-3 px-1">
            Historique des séances
          </p>
          <div className="space-y-2">
            {patient.notes.map((n) => (
              <div key={n.id} className="ios-card p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-semibold text-black">Séance #{n.sessionNumber}</span>
                  <span className="text-[12px] text-ios-gray-2">{n.date}</span>
                </div>
                <p className="text-[13px] text-ios-gray-1">{n.patientState}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {n.themes.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-ios-gray-6 text-[10px] text-ios-gray-1">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
