import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Euro, CheckCircle, AlertTriangle } from 'lucide-react';
import InvoiceCard from '../components/InvoiceCard';
import { recentInvoices, getTodayStats } from '../data/mockData';

const tabs = ['Aujourd\'hui', 'Cette semaine', 'Ce mois'] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
} as const;
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const stats = getTodayStats();

  const todayInvoices = recentInvoices.filter((i) => i.date === '2026-03-30');
  const displayedInvoices = activeTab === tabs[0] ? todayInvoices : recentInvoices;

  return (
    <div className="min-h-full">
      <div className="px-5 lg:px-8 pt-6 lg:pt-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-[28px] lg:text-[34px] font-bold text-black tracking-tight"
        >
          Factures
        </motion.h1>

        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mt-5"
        >
          <div className="ios-card p-3 text-center">
            <div className="w-8 h-8 rounded-xl bg-ios-blue/10 flex items-center justify-center mx-auto mb-1.5">
              <Euro size={17} className="text-ios-blue" />
            </div>
            <span className="text-[20px] font-bold text-black">{stats.totalRevenue}€</span>
            <p className="text-[11px] text-ios-gray-1 font-medium mt-0.5">Total du jour</p>
          </div>
          <div className="ios-card p-3 text-center">
            <div className="w-8 h-8 rounded-xl bg-ios-green/10 flex items-center justify-center mx-auto mb-1.5">
              <CheckCircle size={17} className="text-ios-green" />
            </div>
            <span className="text-[20px] font-bold text-ios-green">{stats.paidAmount}€</span>
            <p className="text-[11px] text-ios-gray-1 font-medium mt-0.5">Payé</p>
          </div>
          <div className="ios-card p-3 text-center">
            <div className="w-8 h-8 rounded-xl bg-ios-red/10 flex items-center justify-center mx-auto mb-1.5">
              <AlertTriangle size={17} className="text-ios-red" />
            </div>
            <span className="text-[20px] font-bold text-ios-red">{stats.unpaidCount}</span>
            <p className="text-[11px] text-ios-gray-1 font-medium mt-0.5">Impayés</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === t ? 'bg-ios-blue text-white' : 'bg-ios-gray-5 text-ios-gray-1'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice list */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-5 lg:px-8 mt-4 space-y-2.5 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-3 lg:space-y-0"
      >
        {displayedInvoices.map((inv) => (
          <motion.div key={inv.id} variants={item}>
            <InvoiceCard invoice={inv} />
          </motion.div>
        ))}
      </motion.div>

      {/* Export button */}
      <div className="px-5 lg:px-8 mt-6 pb-8">
        <button className="ios-button flex items-center justify-center gap-2">
          <Download size={18} />
          Exporter en PDF
        </button>
      </div>
    </div>
  );
}
