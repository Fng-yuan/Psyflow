import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Calendar, Euro, FileText, AlertCircle, TrendingUp, TrendingDown,
  Users, Clock, Plus, Bell, Sparkles, Activity,
} from 'lucide-react';
import AppointmentCard from '../components/AppointmentCard';
import NoteEditor from '../components/NoteEditor';
import { todayAppointments, getTodayStats, patients, recentInvoices } from '../data/mockData';
import type { Appointment } from '../data/types';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function DashboardPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const stats = getTodayStats();
  const today = new Date();
  const dateStr = format(today, "EEEE d MMMM yyyy", { locale: fr });
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const unpaidInvoices = recentInvoices.filter((i) => !i.paid);
  const activePatients = patients.filter((p) => p.sessionCount > 0);
  const nextAppointment = todayAppointments.find((a) => a.status === 'upcoming' || a.status === 'in-progress');

  // Suggestions IA mock
  const aiSuggestions = [
    { text: 'Paul D. n\'a pas de RDV depuis 3 semaines. Relancer ?', type: 'alert' as const },
    { text: 'Le GAD-7 de Camille a baissé de 18 à 8 — progression remarquable.', type: 'success' as const },
    { text: 'Créneau libre jeudi 14h — 2 patients en liste d\'attente.', type: 'info' as const },
  ];

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="px-5 lg:px-8 pt-6 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-ios-gray-1 text-[15px]">{getGreeting()}</p>
          <h1 className="text-[28px] lg:text-[34px] font-bold text-black tracking-tight">Dr. Martin</h1>
          <p className="text-ios-gray-1 text-[15px] mt-0.5">{capitalizedDate}</p>
        </motion.div>
      </div>

      {/* Desktop: 2-column layout / Mobile: single column */}
      <div className="px-5 lg:px-8 mt-6 lg:grid lg:grid-cols-[1fr_420px] lg:gap-8">

        {/* ====== LEFT COLUMN: Dashboard ====== */}
        <div className="space-y-6">

          {/* Stat cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {[
              { icon: Calendar, value: String(stats.totalSessions), label: 'Séances', color: 'text-ios-blue', bg: 'bg-ios-blue/10' },
              { icon: Euro, value: `${stats.totalRevenue} €`, label: 'Revenus', color: 'text-ios-green', bg: 'bg-ios-green/10' },
              { icon: FileText, value: String(stats.notesPending), label: 'Notes à faire', color: 'text-ios-orange', bg: 'bg-ios-orange/10' },
              { icon: AlertCircle, value: String(stats.unpaidCount), label: 'Impayés', color: 'text-ios-red', bg: 'bg-ios-red/10' },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  variants={fadeUp}
                  className="ios-card p-4 flex flex-col gap-3"
                >
                  <div className={`w-10 h-10 rounded-2xl ${card.bg} flex items-center justify-center`}>
                    <Icon size={20} className={card.color} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="text-[24px] font-bold text-black leading-tight">{card.value}</span>
                    <p className="text-[13px] text-ios-gray-1 font-medium mt-0.5">{card.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick overview row */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-3"
          >
            {/* Next patient */}
            {nextAppointment && (
              <motion.div variants={fadeUp} className="ios-card p-4 lg:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-ios-blue" />
                  <p className="text-[12px] font-semibold text-ios-gray-2 uppercase tracking-wide">Prochain patient</p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: nextAppointment.patient.avatarColor }}
                  >
                    {nextAppointment.patient.firstName[0]}{nextAppointment.patient.lastName[0]}
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-black">
                      {nextAppointment.patient.firstName} {nextAppointment.patient.lastName}
                    </p>
                    <p className="text-[13px] text-ios-gray-1">
                      {nextAppointment.startTime} · Séance #{nextAppointment.patient.sessionCount + 1}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Active patients */}
            <motion.div variants={fadeUp} className="ios-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-ios-purple" />
                <p className="text-[12px] font-semibold text-ios-gray-2 uppercase tracking-wide">Patients actifs</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-bold text-black">{activePatients.length}</span>
                <span className="text-[13px] text-ios-gray-1">patients suivis</span>
              </div>
              <div className="flex -space-x-2 mt-3">
                {activePatients.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-semibold"
                    style={{ backgroundColor: p.avatarColor }}
                  >
                    {p.firstName[0]}
                  </div>
                ))}
                {activePatients.length > 5 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-ios-gray-5 flex items-center justify-center text-[10px] text-ios-gray-1 font-semibold">
                    +{activePatients.length - 5}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Activity */}
            <motion.div variants={fadeUp} className="ios-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={16} className="text-ios-green" />
                <p className="text-[12px] font-semibold text-ios-gray-2 uppercase tracking-wide">Activité</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-ios-gray-1">Taux remplissage</span>
                  <span className="text-[14px] font-semibold text-black">87%</span>
                </div>
                <div className="w-full bg-ios-gray-5 rounded-full h-2">
                  <div className="bg-ios-green rounded-full h-2" style={{ width: '87%' }} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[13px] text-ios-gray-1">No-shows ce mois</span>
                  <span className="text-[14px] font-semibold text-ios-orange">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-ios-gray-1">Notes à jour</span>
                  <span className="text-[14px] font-semibold text-ios-green">94%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="ios-card p-5 bg-gradient-to-br from-ios-blue/5 to-ios-purple/5 border border-ios-blue/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-ios-blue" />
              <h3 className="text-[15px] font-bold text-black">Suggestions IA</h3>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-ios-blue/15 text-ios-blue text-[11px] font-semibold">
                {aiSuggestions.length} nouvelles
              </span>
            </div>
            <div className="space-y-3">
              {aiSuggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    s.type === 'alert' ? 'bg-ios-orange' :
                    s.type === 'success' ? 'bg-ios-green' : 'bg-ios-blue'
                  }`} />
                  <p className="text-[14px] text-black leading-snug">{s.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Unpaid invoices */}
          {unpaidInvoices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="ios-card p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={18} className="text-ios-red" />
                <h3 className="text-[15px] font-bold text-black">Impayés</h3>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-ios-red/15 text-ios-red text-[11px] font-semibold">
                  {unpaidInvoices.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {unpaidInvoices.slice(0, 4).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between py-2 border-b border-ios-separator/30 last:border-0">
                    <div>
                      <p className="text-[14px] font-medium text-black">{inv.patientName}</p>
                      <p className="text-[12px] text-ios-gray-2">{inv.date} · {inv.number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[16px] font-bold text-ios-red">{inv.amount} €</p>
                      <button className="text-[12px] text-ios-blue font-medium">Relancer</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent patients with trends — Desktop only */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="hidden lg:block ios-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-ios-purple" />
              <h3 className="text-[15px] font-bold text-black">Évolutions patients</h3>
            </div>
            <div className="space-y-3">
              {patients.slice(0, 5).map((p) => {
                const lastGad = p.gad7Scores[p.gad7Scores.length - 1];
                const prevGad = p.gad7Scores[p.gad7Scores.length - 2];
                const improving = lastGad < (prevGad ?? lastGad);
                return (
                  <div key={p.id} className="flex items-center gap-3 py-2 border-b border-ios-separator/30 last:border-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-semibold shrink-0"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.firstName[0]}{p.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-black truncate">{p.firstName} {p.lastName}</p>
                      <p className="text-[12px] text-ios-gray-2">{p.themes[0]}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold text-black">GAD-7: {lastGad}</span>
                      {improving ? (
                        <TrendingDown size={14} className="text-ios-green" />
                      ) : (
                        <TrendingUp size={14} className="text-ios-red" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Mobile: Agenda list (shown below dashboard on mobile) */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[20px] font-bold text-black">Planning du jour</h2>
              <span className="text-[13px] text-ios-gray-1 font-medium">
                {todayAppointments.filter(a => a.status !== 'cancelled').length} patients
              </span>
            </div>
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {todayAppointments.map((apt) => (
                <motion.div key={apt.id} variants={fadeUp}>
                  <AppointmentCard appointment={apt} onSelect={setSelectedAppointment} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ====== RIGHT COLUMN: Agenda (Desktop only) ====== */}
        <div className="hidden lg:block">
          <div className="sticky top-0 pt-0">
            <div className="ios-card-elevated p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-bold text-black">Planning du jour</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-ios-gray-1 font-medium">
                    {todayAppointments.filter(a => a.status !== 'cancelled').length} patients
                  </span>
                  <button className="w-8 h-8 rounded-full bg-ios-blue flex items-center justify-center">
                    <Plus size={18} className="text-white" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="space-y-2.5 max-h-[calc(100dvh-180px)] overflow-y-auto pr-1"
              >
                {todayAppointments.map((apt) => (
                  <motion.div key={apt.id} variants={fadeUp}>
                    <AppointmentCard appointment={apt} onSelect={setSelectedAppointment} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Quick notifications */}
            <div className="ios-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell size={16} className="text-ios-orange" />
                <p className="text-[13px] font-semibold text-ios-gray-2 uppercase tracking-wide">Rappels</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[13px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-ios-orange shrink-0" />
                  <p className="text-black">Manon G. — note de séance à compléter</p>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-ios-red shrink-0" />
                  <p className="text-black">Alexandre M. — facture impayée (7 jours)</p>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-ios-blue shrink-0" />
                  <p className="text-black">Hugo F. — entretien parents le 06/04</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className="lg:hidden fixed bottom-24 right-5 w-14 h-14 rounded-full bg-ios-blue shadow-lg shadow-ios-blue/30 flex items-center justify-center z-40"
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
