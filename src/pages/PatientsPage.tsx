import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PatientCard from '../components/PatientCard';
import PatientDetailPage from './PatientDetailPage';
import { patients } from '../data/mockData';
import type { Patient } from '../data/types';

const filters = ['Tous', 'Actifs', 'MonPsy', 'En attente'] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
} as const;
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Tous');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filtered = patients.filter((p) => {
    const matchSearch = `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === 'Tous' ||
      (activeFilter === 'MonPsy' && p.isMonPsy) ||
      (activeFilter === 'Actifs' && p.sessionCount > 0) ||
      activeFilter === 'En attente';
    return matchSearch && matchFilter;
  });

  if (selectedPatient) {
    return <PatientDetailPage patient={selectedPatient} onBack={() => setSelectedPatient(null)} />;
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="px-5 lg:px-8 pt-6 lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-baseline gap-2"
        >
          <h1 className="text-[28px] lg:text-[34px] font-bold text-black tracking-tight">Patients</h1>
          <span className="text-[15px] text-ios-gray-1 font-medium">{patients.length}</span>
        </motion.div>

        {/* Search */}
        <div className="relative mt-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ios-gray-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un patient..."
            className="ios-input pl-10 text-[15px]"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-ios-blue text-white'
                  : 'bg-ios-gray-5 text-ios-gray-1'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-5 lg:px-8 mt-4 space-y-2.5 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-3 lg:space-y-0"
      >
        {filtered.map((p) => (
          <motion.div key={p.id} variants={item}>
            <PatientCard patient={p} onSelect={setSelectedPatient} />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-ios-gray-2 py-12 text-[15px]">Aucun patient trouvé</p>
        )}
      </motion.div>
    </div>
  );
}
