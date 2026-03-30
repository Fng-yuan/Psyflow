import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, ChevronRight, Mic, Check, CreditCard, Banknote, Building2, FileCheck,
  Clock, Sparkles, ArrowRight, UserCheck, FileText, Euro, Coffee,
  CheckCircle, Sun, Moon as MoonIcon, TrendingDown,
} from 'lucide-react';
import { todayAppointments, getTodayStats } from '../data/mockData';
import type { Appointment } from '../data/types';

// ─── Types for the roadmap flow ───
type FlowPhase =
  | 'overview'       // Morning: see all patients, "Commencer la journée"
  | 'briefing'       // Pre-session: AI briefing for next patient
  | 'in-session'     // Session in progress (timer)
  | 'note'           // Post-session: write note (vocal/text)
  | 'payment'        // Payment prompt
  | 'transition'     // Between patients: summary + next briefing
  | 'day-recap';     // End of day: stats + validation

const fadeSlide = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { type: 'spring' as const, stiffness: 260, damping: 25 },
};

// ─── Helpers ───
function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

const greetings = {
  morning: { icon: Sun, text: 'Bonjour', sub: 'Prêt à commencer votre journée ?' },
  afternoon: { icon: Sun, text: 'Bon après-midi', sub: 'La journée avance bien.' },
  evening: { icon: MoonIcon, text: 'Bonsoir', sub: 'Fin de journée en vue.' },
};

export default function AgendaInteractifPage() {
  const [phase, setPhase] = useState<FlowPhase>('overview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [noteGenerated, setNoteGenerated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const activeAppointments = todayAppointments.filter((a) => a.status !== 'cancelled');
  const currentApt = activeAppointments[currentIndex] as Appointment | undefined;
  const nextApt = activeAppointments[currentIndex + 1] as Appointment | undefined;
  const stats = getTodayStats();
  const timeOfDay = getTimeOfDay();
  const greeting = greetings[timeOfDay];
  const GreetingIcon = greeting.icon;

  // ─── Flow actions ───
  const startDay = () => {
    setCurrentIndex(0);
    setPhase('briefing');
  };

  const startSession = () => setPhase('in-session');

  const endSession = () => {
    setNoteText('');
    setNoteGenerated(false);
    setPhase('note');
  };

  const generateNote = () => setNoteGenerated(true);

  const validateNote = () => {
    setPaymentMethod(null);
    setPhase('payment');
  };

  const confirmPayment = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentIndex));
    if (nextApt) {
      setPhase('transition');
    } else {
      setPhase('day-recap');
    }
  };

  const goToNext = () => {
    setCurrentIndex((i) => i + 1);
    setPhase('briefing');
  };

  const resetDay = () => {
    setPhase('overview');
    setCurrentIndex(0);
    setCompletedSteps(new Set());
  };

  return (
    <div className="min-h-full">
      {/* Top bar */}
      <div className="px-5 lg:px-8 pt-6 lg:pt-8 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] lg:text-[34px] font-bold tracking-tight">Agenda Interactif</h1>
          <p className="text-ios-gray-1 text-[14px] mt-0.5">
            {phase === 'overview' ? 'Votre journée en un coup d\'œil' :
             phase === 'day-recap' ? 'Récapitulatif de fin de journée' :
             currentApt ? `${currentApt.startTime} — ${currentApt.patient.firstName} ${currentApt.patient.lastName}` : ''}
          </p>
        </div>
        {phase !== 'overview' && phase !== 'day-recap' && (
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-ios-gray-2">
              {currentIndex + 1}/{activeAppointments.length}
            </span>
            <div className="flex gap-1">
              {activeAppointments.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    completedSteps.has(i) ? 'bg-ios-green' :
                    i === currentIndex ? 'bg-ios-blue animate-pulse' :
                    'bg-ios-gray-4'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="px-5 lg:px-8 mt-6 lg:max-w-3xl">
        <AnimatePresence mode="wait">

          {/* ══════ OVERVIEW ══════ */}
          {phase === 'overview' && (
            <motion.div key="overview" {...fadeSlide} className="space-y-5">
              {/* Greeting card */}
              <div className="ios-card-elevated p-6 text-center">
                <GreetingIcon size={40} className="text-ios-orange mx-auto mb-3" />
                <h2 className="text-[22px] font-bold">{greeting.text}, Dr. Martin</h2>
                <p className="text-ios-gray-1 text-[15px] mt-1">{greeting.sub}</p>
                <div className="flex justify-center gap-6 mt-5">
                  <div className="text-center">
                    <span className="text-[28px] font-bold text-ios-blue">{activeAppointments.length}</span>
                    <p className="text-[12px] text-ios-gray-1">patients</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[28px] font-bold text-ios-green">{stats.totalRevenue} €</span>
                    <p className="text-[12px] text-ios-gray-1">prévisionnel</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[28px] font-bold text-ios-purple">
                      {activeAppointments[0]?.startTime ?? '—'}
                    </span>
                    <p className="text-[12px] text-ios-gray-1">début</p>
                  </div>
                </div>
              </div>

              {/* Timeline preview */}
              <div className="ios-card p-4">
                <h3 className="text-[13px] font-semibold text-ios-gray-2 uppercase tracking-wide mb-3">
                  Roadmap de la journée
                </h3>
                <div className="relative">
                  <div className="roadmap-line" style={{ left: 15 }} />
                  <div className="space-y-3">
                    {activeAppointments.map((apt, i) => (
                      <div key={apt.id} className="flex items-center gap-3 relative">
                        <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 z-10 text-white text-[11px] font-bold ${
                          apt.status === 'no-show' ? 'bg-ios-red' :
                          apt.status === 'completed' ? 'bg-ios-green' :
                          apt.status === 'in-progress' ? 'bg-ios-blue animate-pulse' :
                          'bg-ios-gray-3'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 flex items-center justify-between py-2">
                          <div>
                            <p className="text-[15px] font-medium">
                              {apt.patient.firstName} {apt.patient.lastName}
                            </p>
                            <p className="text-[12px] text-ios-gray-1">
                              {apt.startTime} — {apt.endTime} · Séance #{apt.patient.sessionCount + 1}
                            </p>
                          </div>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            apt.status === 'no-show' ? 'bg-ios-red/15 text-ios-red' :
                            apt.status === 'completed' ? 'bg-ios-green/15 text-ios-green' :
                            apt.status === 'in-progress' ? 'bg-ios-blue/15 text-ios-blue' :
                            'bg-ios-gray-5 text-ios-gray-1'
                          }`}>
                            {apt.status === 'no-show' ? 'Absent' :
                             apt.status === 'completed' ? 'Terminé' :
                             apt.status === 'in-progress' ? 'En cours' : apt.startTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start button */}
              <motion.button
                onClick={startDay}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="ios-button flex items-center justify-center gap-3 py-5 text-[18px] animate-pulse-glow"
              >
                <Play size={22} fill="white" />
                Commencer la journée
              </motion.button>
            </motion.div>
          )}

          {/* ══════ BRIEFING ══════ */}
          {phase === 'briefing' && currentApt && (
            <motion.div key="briefing" {...fadeSlide} className="space-y-4">
              <div className="flex items-center gap-2 text-ios-blue mb-2">
                <UserCheck size={18} />
                <span className="text-[13px] font-semibold uppercase tracking-wide">Briefing pré-séance</span>
              </div>

              {/* Patient card */}
              <div className="ios-card-elevated p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: currentApt.patient.avatarColor }}
                  >
                    {currentApt.patient.firstName[0]}{currentApt.patient.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-[22px] font-bold">
                      {currentApt.patient.firstName} {currentApt.patient.lastName}
                    </h2>
                    <p className="text-ios-gray-1 text-[14px]">
                      {currentApt.patient.age} ans · Séance #{currentApt.patient.sessionCount + 1} · {currentApt.patient.orientation}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {currentApt.patient.themes.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-ios-blue/10 text-ios-blue text-[12px] font-medium">{t}</span>
                  ))}
                </div>

                {/* Scores */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-ios-gray-6 rounded-2xl p-3 text-center">
                    <p className="text-[11px] text-ios-gray-1 font-medium">GAD-7</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-[20px] font-bold">{currentApt.patient.gad7Scores.slice(-1)[0]}</span>
                      <TrendingDown size={14} className="text-ios-green" />
                    </div>
                  </div>
                  <div className="flex-1 bg-ios-gray-6 rounded-2xl p-3 text-center">
                    <p className="text-[11px] text-ios-gray-1 font-medium">PHQ-9</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-[20px] font-bold">{currentApt.patient.phq9Scores.slice(-1)[0]}</span>
                      <TrendingDown size={14} className="text-ios-green" />
                    </div>
                  </div>
                  <div className="flex-1 bg-ios-gray-6 rounded-2xl p-3 text-center">
                    <p className="text-[11px] text-ios-gray-1 font-medium">Séances</p>
                    <span className="text-[20px] font-bold">{currentApt.patient.sessionCount}</span>
                  </div>
                </div>
              </div>

              {/* Last session summary */}
              {currentApt.patient.notes[0] && (
                <div className="ios-card p-4">
                  <h3 className="text-[12px] font-semibold text-ios-gray-2 uppercase tracking-wide mb-2">
                    Dernière séance
                  </h3>
                  <p className="text-[14px] leading-relaxed">{currentApt.patient.notes[0].patientState}</p>
                  <p className="text-[13px] text-ios-orange mt-2 font-medium">
                    → {currentApt.patient.notes[0].plan}
                  </p>
                </div>
              )}

              {/* AI suggestions */}
              <div className="ios-card p-4 bg-gradient-to-br from-ios-blue/5 to-ios-purple/5 border border-ios-blue/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={15} className="text-ios-blue" />
                  <span className="text-[12px] font-semibold text-ios-blue uppercase tracking-wide">Points à aborder</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-ios-blue mt-1.5 shrink-0" />
                    <p className="text-[14px]">Demander si l'exercice a été pratiqué</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-ios-blue mt-1.5 shrink-0" />
                    <p className="text-[14px]">Évaluer l'évolution de : {currentApt.patient.themes[0]}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-ios-blue mt-1.5 shrink-0" />
                    <p className="text-[14px]">Relations clés : {currentApt.patient.relationships.slice(0, 2).map(r => r.name).join(', ')}</p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={startSession}
                whileTap={{ scale: 0.97 }}
                className="ios-button flex items-center justify-center gap-2 py-5"
              >
                <Play size={20} fill="white" />
                Démarrer la séance
              </motion.button>
            </motion.div>
          )}

          {/* ══════ IN SESSION ══════ */}
          {phase === 'in-session' && currentApt && (
            <motion.div key="in-session" {...fadeSlide} className="space-y-5">
              <div className="ios-card-elevated p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-ios-blue/15 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Clock size={36} className="text-ios-blue" />
                </div>
                <h2 className="text-[24px] font-bold">Séance en cours</h2>
                <p className="text-ios-gray-1 text-[16px] mt-1">
                  {currentApt.patient.firstName} {currentApt.patient.lastName}
                </p>
                <p className="text-[14px] text-ios-gray-2 mt-1">
                  {currentApt.startTime} — {currentApt.endTime}
                </p>

                <div className="mt-8 flex items-center justify-center gap-3 text-[48px] font-bold tracking-tight text-ios-blue">
                  50:00
                </div>
                <p className="text-[13px] text-ios-gray-2 mt-2">Durée de séance</p>
              </div>

              <div className="ios-card p-4">
                <h3 className="text-[12px] font-semibold text-ios-gray-2 uppercase tracking-wide mb-2">Pense-bête</h3>
                <div className="space-y-1">
                  {currentApt.patient.notes[0] && (
                    <p className="text-[13px] text-ios-orange">→ {currentApt.patient.notes[0].plan}</p>
                  )}
                  <p className="text-[13px] text-ios-gray-1">Thèmes récurrents : {currentApt.patient.themes.slice(0, 3).join(', ')}</p>
                </div>
              </div>

              <motion.button
                onClick={endSession}
                whileTap={{ scale: 0.97 }}
                className="w-full py-5 rounded-[14px] bg-ios-green text-white text-[17px] font-semibold flex items-center justify-center gap-2"
              >
                <Check size={22} />
                Terminer la séance
              </motion.button>
            </motion.div>
          )}

          {/* ══════ NOTE ══════ */}
          {phase === 'note' && currentApt && (
            <motion.div key="note" {...fadeSlide} className="space-y-4">
              <div className="flex items-center gap-2 text-ios-purple mb-2">
                <FileText size={18} />
                <span className="text-[13px] font-semibold uppercase tracking-wide">Note clinique</span>
              </div>

              <div className="ios-card p-4">
                <p className="text-[15px] font-medium mb-3">
                  {currentApt.patient.firstName} {currentApt.patient.lastName} — Séance #{currentApt.patient.sessionCount + 1}
                </p>

                {!noteGenerated ? (
                  <>
                    {/* Voice button */}
                    <div className="flex flex-col items-center py-6 mb-4 bg-ios-gray-6 rounded-2xl">
                      <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-16 h-16 rounded-full bg-ios-red/15 flex items-center justify-center mb-3 cursor-pointer"
                      >
                        <Mic size={28} className="text-ios-red" />
                      </motion.div>
                      <p className="text-[14px] text-ios-gray-1">Dictez vos observations</p>
                      <p className="text-[12px] text-ios-gray-2 mt-1">ou tapez ci-dessous</p>
                    </div>

                    {/* Text input */}
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Patient détendu, travail sur l'anxiété sociale, exercice de respiration donné..."
                      rows={4}
                      className="ios-input text-[15px] leading-relaxed resize-none mb-4"
                    />

                    <motion.button
                      onClick={generateNote}
                      whileTap={{ scale: 0.97 }}
                      className="ios-button flex items-center justify-center gap-2"
                    >
                      <Sparkles size={18} />
                      Générer la note IA
                    </motion.button>
                  </>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {[
                        { label: 'État du patient', text: `Le patient se présente dans un état stable. ${noteText || 'Séance productive avec bonne participation.'}`, color: 'text-ios-blue' },
                        { label: 'Thèmes abordés', text: currentApt.patient.themes.slice(0, 3).join(', '), color: 'text-ios-blue' },
                        { label: 'Interventions', text: currentApt.patient.notes[0]?.interventions.join(', ') || 'Écoute active, restructuration cognitive', color: 'text-ios-purple' },
                        { label: 'Progression', text: 'Évolution positive observée sur les indicateurs cliniques.', color: 'text-ios-green' },
                        { label: 'Plan', text: 'Poursuivre le travail engagé. Prochaine séance prévue.', color: 'text-ios-orange' },
                      ].map((section) => (
                        <div key={section.label} className="bg-ios-gray-6 rounded-xl p-3">
                          <p className={`text-[11px] font-semibold uppercase tracking-wide mb-1 ${section.color}`}>{section.label}</p>
                          <p className="text-[14px] leading-relaxed">{section.text}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-[12px] text-ios-gray-2 text-center mb-3 italic">
                      Note générée à partir de vos observations
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setNoteGenerated(false)}
                        className="flex-1 py-4 rounded-[14px] bg-ios-gray-5 text-[16px] font-semibold"
                      >
                        Modifier
                      </button>
                      <motion.button
                        onClick={validateNote}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 py-4 rounded-[14px] bg-ios-green text-white text-[16px] font-semibold flex items-center justify-center gap-2"
                      >
                        <Check size={18} />
                        Valider
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* ══════ PAYMENT ══════ */}
          {phase === 'payment' && currentApt && (
            <motion.div key="payment" {...fadeSlide} className="space-y-4">
              <div className="flex items-center gap-2 text-ios-green mb-2">
                <Euro size={18} />
                <span className="text-[13px] font-semibold uppercase tracking-wide">Paiement</span>
              </div>

              <div className="ios-card-elevated p-6 text-center">
                <p className="text-[15px] text-ios-gray-1">
                  {currentApt.patient.firstName} {currentApt.patient.lastName}
                </p>
                <p className="text-[42px] font-bold mt-2">{currentApt.patient.tarif} €</p>
                <p className="text-[13px] text-ios-gray-2 mt-1">
                  Séance #{currentApt.patient.sessionCount + 1}
                  {currentApt.patient.isMonPsy && ' · MonPsy'}
                </p>
              </div>

              <div className="ios-card p-4">
                <p className="text-[13px] font-semibold text-ios-gray-2 uppercase tracking-wide mb-3">Moyen de paiement</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'cb', label: 'Carte', icon: CreditCard },
                    { id: 'especes', label: 'Espèces', icon: Banknote },
                    { id: 'virement', label: 'Virement', icon: Building2 },
                    { id: 'cheque', label: 'Chèque', icon: FileCheck },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <motion.button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        whileTap={{ scale: 0.96 }}
                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-ios-green/15 ring-2 ring-ios-green'
                            : 'bg-ios-gray-6'
                        }`}
                      >
                        <Icon size={24} className={isSelected ? 'text-ios-green' : 'text-ios-gray-1'} />
                        <span className={`text-[14px] font-medium ${isSelected ? 'text-ios-green' : 'text-ios-gray-1'}`}>{m.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmPayment}
                  className="flex-1 py-4 rounded-[14px] bg-ios-gray-5 text-[16px] font-semibold"
                >
                  Pas encore payé
                </button>
                <motion.button
                  onClick={confirmPayment}
                  whileTap={{ scale: 0.97 }}
                  disabled={!paymentMethod}
                  className={`flex-1 py-4 rounded-[14px] text-white text-[16px] font-semibold flex items-center justify-center gap-2 ${
                    paymentMethod ? 'bg-ios-green' : 'bg-ios-gray-3'
                  }`}
                >
                  <Check size={18} />
                  Payé
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ══════ TRANSITION ══════ */}
          {phase === 'transition' && currentApt && nextApt && (
            <motion.div key="transition" {...fadeSlide} className="space-y-4">
              <div className="flex items-center gap-2 text-ios-teal mb-2">
                <Coffee size={18} />
                <span className="text-[13px] font-semibold uppercase tracking-wide">Transition</span>
              </div>

              {/* Just completed */}
              <div className="ios-card p-4 border-l-4 border-ios-green">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-ios-green" />
                  <span className="text-[13px] font-semibold text-ios-green">Terminé</span>
                </div>
                <p className="text-[15px] font-medium">
                  {currentApt.patient.firstName} {currentApt.patient.lastName}
                </p>
                <p className="text-[13px] text-ios-gray-1">
                  Note validée · Facture {paymentMethod ? 'payée' : 'en attente'}
                </p>
              </div>

              {/* Buffer */}
              <div className="ios-card p-4 text-center bg-ios-gray-6">
                <Coffee size={20} className="text-ios-gray-1 mx-auto mb-2" />
                <p className="text-[14px] text-ios-gray-1">10 minutes de pause</p>
                <p className="text-[12px] text-ios-gray-2">Prochain patient à {nextApt.startTime}</p>
              </div>

              {/* Next patient preview */}
              <div className="ios-card p-4 border-l-4 border-ios-blue">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight size={16} className="text-ios-blue" />
                  <span className="text-[13px] font-semibold text-ios-blue">Suivant</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: nextApt.patient.avatarColor }}
                  >
                    {nextApt.patient.firstName[0]}{nextApt.patient.lastName[0]}
                  </div>
                  <div>
                    <p className="text-[15px] font-medium">
                      {nextApt.patient.firstName} {nextApt.patient.lastName}
                    </p>
                    <p className="text-[13px] text-ios-gray-1">
                      {nextApt.startTime} · {nextApt.patient.themes[0]}
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={goToNext}
                whileTap={{ scale: 0.97 }}
                className="ios-button flex items-center justify-center gap-2 py-5"
              >
                Patient suivant
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          )}

          {/* ══════ DAY RECAP ══════ */}
          {phase === 'day-recap' && (
            <motion.div key="recap" {...fadeSlide} className="space-y-5">
              <div className="ios-card-elevated p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-ios-green/15 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={32} className="text-ios-green" />
                </div>
                <h2 className="text-[24px] font-bold">Journée terminée !</h2>
                <p className="text-ios-gray-1 text-[15px] mt-1">Voici votre récapitulatif</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="ios-card p-4 text-center">
                  <span className="text-[28px] font-bold text-ios-blue">{completedSteps.size}</span>
                  <p className="text-[12px] text-ios-gray-1 mt-1">Séances réalisées</p>
                </div>
                <div className="ios-card p-4 text-center">
                  <span className="text-[28px] font-bold text-ios-green">{completedSteps.size * 70} €</span>
                  <p className="text-[12px] text-ios-gray-1 mt-1">Facturé</p>
                </div>
                <div className="ios-card p-4 text-center">
                  <span className="text-[28px] font-bold text-ios-purple">{completedSteps.size}</span>
                  <p className="text-[12px] text-ios-gray-1 mt-1">Notes validées</p>
                </div>
                <div className="ios-card p-4 text-center">
                  <span className="text-[28px] font-bold text-ios-orange">{stats.unpaidCount}</span>
                  <p className="text-[12px] text-ios-gray-1 mt-1">Impayés</p>
                </div>
              </div>

              {/* Patients seen */}
              <div className="ios-card p-4">
                <h3 className="text-[12px] font-semibold text-ios-gray-2 uppercase tracking-wide mb-3">
                  Patients vus aujourd'hui
                </h3>
                <div className="space-y-2.5">
                  {activeAppointments.map((apt, i) => (
                    <div key={apt.id} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                        completedSteps.has(i) ? 'bg-ios-green' : 'bg-ios-gray-3'
                      }`}>
                        {completedSteps.has(i) ? <Check size={12} /> : i + 1}
                      </div>
                      <p className="text-[14px] flex-1">{apt.patient.firstName} {apt.patient.lastName}</p>
                      <span className="text-[13px] font-semibold">{apt.patient.tarif} €</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={resetDay}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-4 rounded-[14px] bg-ios-gray-5 text-[16px] font-semibold"
                >
                  Retour à l'aperçu
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-4 rounded-[14px] bg-ios-blue text-white text-[16px] font-semibold"
                >
                  Export du jour
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
