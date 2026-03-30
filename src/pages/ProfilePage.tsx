import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-[51px] h-[31px] rounded-full p-[2px] transition-colors duration-300 ${
        on ? 'bg-ios-blue' : 'bg-ios-gray-4'
      }`}
    >
      <motion.div
        animate={{ x: on ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-[27px] h-[27px] rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[15px] text-black">{label}</span>
      <span className="text-[15px] text-ios-gray-1">{value}</span>
    </div>
  );
}

function ToggleRow({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[15px] text-black">{label}</span>
      <Toggle on={on} onToggle={() => setOn(!on)} />
    </div>
  );
}

function Separator() {
  return <div className="h-[0.5px] bg-ios-separator/50 ml-0" />;
}

export default function ProfilePage() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-full">
      <div className="px-5 lg:px-8 pt-6 lg:pt-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-[28px] lg:text-[34px] font-bold text-black tracking-tight"
        >
          Profil
        </motion.h1>
      </div>

      <div className="px-5 lg:px-8 mt-5 space-y-5 pb-8 lg:max-w-2xl">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="ios-card p-5 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ios-blue to-ios-purple flex items-center justify-center text-white font-bold text-xl">
            DM
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-black">Dr. Claire Martin</h2>
            <p className="text-[14px] text-ios-gray-1">Psychologue clinicienne</p>
            <p className="text-[13px] text-ios-gray-2">ADELI: 75 93 1234 5</p>
          </div>
        </motion.div>

        {/* Cabinet */}
        <div>
          <p className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-wide px-1 mb-2">
            Cabinet
          </p>
          <div className="ios-card px-4">
            <SettingRow label="Tarif par défaut" value="70 €" />
            <Separator />
            <SettingRow label="Durée séance" value="50 min" />
            <Separator />
            <SettingRow label="Buffer entre séances" value="10 min" />
            <Separator />
            <SettingRow label="Orientation" value="TCC" />
          </div>
        </div>

        {/* Facturation */}
        <div>
          <p className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-wide px-1 mb-2">
            Facturation
          </p>
          <div className="ios-card px-4">
            <SettingRow label="ADELI" value="75 93 1234 5" />
            <Separator />
            <SettingRow label="SIRET" value="123 456 789 00012" />
            <Separator />
            <SettingRow label="TVA" value="Non assujetti" />
            <Separator />
            <SettingRow label="Format facture" value="Factur-X" />
          </div>
        </div>

        {/* Apparence */}
        <div>
          <p className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-wide px-1 mb-2">
            Apparence
          </p>
          <div className="ios-card px-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={18} className="text-ios-purple" /> : <Sun size={18} className="text-ios-orange" />}
                <span className="text-[15px]">Mode sombre</span>
              </div>
              <Toggle on={theme === 'dark'} onToggle={toggle} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <p className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-wide px-1 mb-2">
            Notifications
          </p>
          <div className="ios-card px-4">
            <ToggleRow label="Rappels patients" defaultOn={true} />
            <Separator />
            <ToggleRow label="Relance impayés" defaultOn={true} />
            <Separator />
            <ToggleRow label="Suggestions IA" defaultOn={true} />
            <Separator />
            <ToggleRow label="Briefing pré-séance" defaultOn={true} />
          </div>
        </div>

        {/* Données */}
        <div>
          <p className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-wide px-1 mb-2">
            Données
          </p>
          <div className="ios-card px-4">
            <button className="flex items-center gap-3 py-3 w-full">
              <Download size={18} className="text-ios-blue" />
              <span className="text-[15px] text-ios-blue">Exporter mes données</span>
            </button>
            <Separator />
            <button className="flex items-center gap-3 py-3 w-full">
              <Trash2 size={18} className="text-ios-red" />
              <span className="text-[15px] text-ios-red">Supprimer mon compte</span>
            </button>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-[12px] text-ios-gray-2 mt-4">
          PsyFlow v1.0.0 · Conforme RGPD & HDS
        </p>
      </div>
    </div>
  );
}
