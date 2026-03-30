export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  sessionCount: number;
  followingSince: string;
  motif: string;
  orientation: string;
  tarif: number;
  isMonPsy: boolean;
  themes: string[];
  avatarColor: string;
  gad7Scores: number[];
  phq9Scores: number[];
  nextSession?: string;
  notes: ClinicalNote[];
  invoices: Invoice[];
  relationships: Relationship[];
}

export interface ClinicalNote {
  id: string;
  date: string;
  sessionNumber: number;
  patientState: string;
  themes: string[];
  interventions: string[];
  progression: string;
  plan: string;
  rawInput?: string;
  validated: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  paid: boolean;
  paymentMethod?: 'especes' | 'cheque' | 'virement' | 'cb';
  patientId: string;
  patientName: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  date: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'no-show' | 'cancelled';
  noteId?: string;
  invoiceId?: string;
}

export interface Relationship {
  name: string;
  role: string;
  type: 'famille' | 'travail' | 'ami' | 'medical' | 'ex';
  state: 'positive' | 'tension' | 'conflit';
  mentionCount: number;
  totalSessions: number;
}

export interface DayStats {
  totalSessions: number;
  completedSessions: number;
  totalRevenue: number;
  paidAmount: number;
  unpaidCount: number;
  notesCompleted: number;
  notesPending: number;
}
