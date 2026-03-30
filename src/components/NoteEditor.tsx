import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Type, ListChecks, Sparkles, X } from 'lucide-react';
import type { Patient, Appointment } from '../data/types';

interface NoteEditorProps {
  patient: Patient;
  appointment: Appointment;
  onClose: () => void;
  onSave: (note: GeneratedNote) => void;
}

interface GeneratedNote {
  patientState: string;
  themes: string[];
  interventions: string[];
  progression: string;
  plan: string;
  rawInput: string;
}

type InputMode = 'vocal' | 'texte' | 'guide';

const THEMES = [
  'Anxiete', 'Depression', 'Relations', 'Travail',
  'Sommeil', 'Estime de soi', 'Deuil', 'Trauma',
];

const TECHNIQUES = [
  'TCC', 'EMDR', 'Pleine conscience', 'Ecoute active', 'Relaxation',
];

const MOOD_EMOJIS = ['😞', '😟', '😕', '😐', '🙂', '😊', '😄', '😃', '🤩', '🌟'];

const inputModes: { id: InputMode; label: string; icon: typeof Mic }[] = [
  { id: 'vocal', label: 'Vocal', icon: Mic },
  { id: 'texte', label: 'Texte', icon: Type },
  { id: 'guide', label: 'Guide', icon: ListChecks },
];

export default function NoteEditor({ patient, appointment, onClose, onSave }: NoteEditorProps) {
  const [mode, setMode] = useState<InputMode>('texte');
  const [rawText, setRawText] = useState('');
  const [mood, setMood] = useState(5);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [generatedNote, setGeneratedNote] = useState<GeneratedNote | null>(null);

  const toggleItem = (item: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleGenerate = () => {
    const note: GeneratedNote = {
      patientState: mode === 'guide'
        ? `Humeur evaluee a ${mood}/10. Le patient presente un etat ${mood >= 6 ? 'plutot positif' : mood >= 4 ? 'neutre' : 'plutot negatif'}.`
        : `Le patient se presente a la seance dans un etat ${rawText.length > 50 ? 'detaille ci-dessous' : 'general'}.`,
      themes: mode === 'guide' ? selectedThemes : ['A completer'],
      interventions: mode === 'guide' ? selectedTechniques : ['A completer'],
      progression: 'Evolution a evaluer sur les prochaines seances.',
      plan: 'Poursuivre le suivi. Prochaine seance prevue.',
      rawInput: mode === 'texte' ? rawText : `Mode guide - Humeur: ${mood}/10, Themes: ${selectedThemes.join(', ')}, Techniques: ${selectedTechniques.join(', ')}`,
    };
    setGeneratedNote(note);
  };

  const sessionNumber = patient.sessionCount + 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 right-0 bg-ios-bg rounded-t-[20px] max-h-[92vh] flex flex-col"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-9 h-[5px] rounded-full bg-ios-gray-4" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex-1">
              <h2 className="text-[17px] font-bold text-black">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-[13px] text-ios-gray-1">
                Seance #{sessionNumber} &middot; {appointment.date}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-ios-gray-5 flex items-center justify-center"
            >
              <X size={16} className="text-ios-gray-1" />
            </button>
          </div>

          {/* Mode tabs */}
          <div className="flex mx-4 p-0.5 bg-ios-gray-5 rounded-xl mb-4">
            {inputModes.map((m) => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-[13px] font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black shadow-sm'
                      : 'text-ios-gray-1'
                  }`}
                >
                  <Icon size={15} />
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 pb-[env(safe-area-inset-bottom)]">
            {!generatedNote ? (
              <>
                {/* Vocal mode */}
                {mode === 'vocal' && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-20 h-20 rounded-full bg-ios-red/15 flex items-center justify-center"
                    >
                      <Mic size={32} className="text-ios-red" />
                    </motion.div>
                    <p className="text-ios-gray-1 text-[15px] text-center">
                      Appuyez pour dicter vos observations
                    </p>
                    <p className="text-ios-gray-2 text-[13px] text-center">
                      Fonctionnalite bientot disponible
                    </p>
                  </div>
                )}

                {/* Text mode */}
                {mode === 'texte' && (
                  <div>
                    <textarea
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder="Decrivez la seance en quelques mots..."
                      rows={8}
                      className="ios-input text-[15px] leading-relaxed resize-none w-full"
                    />
                  </div>
                )}

                {/* Guided mode */}
                {mode === 'guide' && (
                  <div className="space-y-5">
                    {/* Mood slider */}
                    <div>
                      <label className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-wide">
                        Humeur du patient
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-2xl">{MOOD_EMOJIS[mood - 1]}</span>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          value={mood}
                          onChange={(e) => setMood(Number(e.target.value))}
                          className="flex-1 accent-ios-blue"
                        />
                        <span className="text-[15px] font-bold text-black w-8 text-center">{mood}</span>
                      </div>
                    </div>

                    {/* Themes */}
                    <div>
                      <label className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-wide">
                        Themes abordes
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {THEMES.map((theme) => {
                          const selected = selectedThemes.includes(theme);
                          return (
                            <button
                              key={theme}
                              onClick={() => toggleItem(theme, selectedThemes, setSelectedThemes)}
                              className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                                selected
                                  ? 'bg-ios-blue text-white'
                                  : 'bg-ios-gray-6 text-ios-gray-1'
                              }`}
                            >
                              {theme}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Techniques */}
                    <div>
                      <label className="text-[13px] font-semibold text-ios-gray-1 uppercase tracking-wide">
                        Techniques utilisees
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {TECHNIQUES.map((tech) => {
                          const selected = selectedTechniques.includes(tech);
                          return (
                            <button
                              key={tech}
                              onClick={() => toggleItem(tech, selectedTechniques, setSelectedTechniques)}
                              className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                                selected
                                  ? 'bg-ios-purple text-white'
                                  : 'bg-ios-gray-6 text-ios-gray-1'
                              }`}
                            >
                              {tech}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={mode === 'texte' && rawText.trim().length === 0}
                  className="ios-button mt-6 mb-6 flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} />
                  Generer la note
                </button>
              </>
            ) : (
              /* Generated note preview */
              <div className="space-y-4 pb-6">
                <div className="ios-card p-4">
                  <h3 className="text-[13px] font-semibold text-ios-blue uppercase tracking-wide mb-1">
                    Etat du patient
                  </h3>
                  <p className="text-[15px] text-black leading-relaxed">{generatedNote.patientState}</p>
                </div>

                <div className="ios-card p-4">
                  <h3 className="text-[13px] font-semibold text-ios-blue uppercase tracking-wide mb-1">
                    Themes
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedNote.themes.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full bg-ios-blue/10 text-ios-blue text-[13px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ios-card p-4">
                  <h3 className="text-[13px] font-semibold text-ios-purple uppercase tracking-wide mb-1">
                    Interventions
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedNote.interventions.map((i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-ios-purple/10 text-ios-purple text-[13px] font-medium">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ios-card p-4">
                  <h3 className="text-[13px] font-semibold text-ios-green uppercase tracking-wide mb-1">
                    Progression
                  </h3>
                  <p className="text-[15px] text-black leading-relaxed">{generatedNote.progression}</p>
                </div>

                <div className="ios-card p-4">
                  <h3 className="text-[13px] font-semibold text-ios-orange uppercase tracking-wide mb-1">
                    Plan
                  </h3>
                  <p className="text-[15px] text-black leading-relaxed">{generatedNote.plan}</p>
                </div>

                <div className="flex gap-3 mt-4 mb-6">
                  <button
                    onClick={() => setGeneratedNote(null)}
                    className="flex-1 py-4 rounded-[14px] bg-ios-gray-5 text-[17px] font-semibold text-black"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onSave(generatedNote)}
                    className="flex-1 ios-button"
                  >
                    Valider
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
