import type { Patient, ClinicalNote, Invoice, Appointment, DayStats } from './types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const today = '2026-03-30';

function note(
  id: string,
  date: string,
  sessionNumber: number,
  patientState: string,
  themes: string[],
  interventions: string[],
  progression: string,
  plan: string,
  validated = true,
): ClinicalNote {
  return { id, date, sessionNumber, patientState, themes, interventions, progression, plan, validated };
}

function inv(
  id: string,
  number: string,
  date: string,
  amount: number,
  paid: boolean,
  method: Invoice['paymentMethod'] | undefined,
  patientId: string,
  patientName: string,
): Invoice {
  return { id, number, date, amount, paid, paymentMethod: method, patientId, patientName };
}

// ---------------------------------------------------------------------------
// Patients
// ---------------------------------------------------------------------------
export const patients: Patient[] = [
  // 1 -----------------------------------------------------------------------
  {
    id: 'p1',
    firstName: 'Camille',
    lastName: 'Durand',
    age: 34,
    gender: 'F',
    phone: '06 12 34 56 78',
    email: 'camille.durand@mail.fr',
    sessionCount: 18,
    followingSince: '2025-06-12',
    motif: 'Trouble anxieux generalis\u00e9 avec attaques de panique',
    orientation: 'TCC',
    tarif: 70,
    isMonPsy: true,
    themes: ['Anxi\u00e9t\u00e9', 'Sommeil', 'Relations familiales', 'Estime de soi'],
    avatarColor: '#7C3AED',
    gad7Scores: [18, 16, 15, 13, 12, 10, 9, 8],
    phq9Scores: [12, 11, 10, 9, 8, 7, 6, 5],
    nextSession: '2026-03-30',
    notes: [
      note('n1-1', '2026-03-23', 17, '\u00c9tat stable, moins de ruminations le soir', ['Sommeil', 'Anxi\u00e9t\u00e9'], ['Restructuration cognitive', 'Relaxation de Jacobson'], 'Am\u00e9lioration notable du sommeil. Camille rapporte 2 nuits compl\u00e8tes sans r\u00e9veil.', 'Continuer le journal de pens\u00e9es. Introduire l\'exposition graduee aux situations sociales.'),
      note('n1-2', '2026-03-16', 16, 'L\u00e9g\u00e8re recrudescence de l\'anxi\u00e9t\u00e9 li\u00e9e au travail', ['Travail', 'Anxi\u00e9t\u00e9'], ['Analyse fonctionnelle', 'Techniques de d\u00e9fusion'], 'R\u00e9action contextuelle (conflit avec coll\u00e8gue). Bonne utilisation des outils appris.', 'Travailler l\'affirmation de soi dans le cadre professionnel.'),
      note('n1-3', '2026-03-09', 15, 'Bonne semaine, motivation \u00e9lev\u00e9e', ['Estime de soi', 'Relations familiales'], ['Renforcement positif', 'Psycho\u00e9ducation'], 'Camille a pu poser des limites \u00e0 sa m\u00e8re pour la premi\u00e8re fois.', 'Consolider les acquis, pr\u00e9parer la diminution de fr\u00e9quence.'),
    ],
    invoices: [
      inv('inv1-1', 'F2026-0087', '2026-03-23', 70, true, 'cb', 'p1', 'Camille Durand'),
      inv('inv1-2', 'F2026-0078', '2026-03-16', 70, true, 'cb', 'p1', 'Camille Durand'),
      inv('inv1-3', 'F2026-0065', '2026-03-09', 70, true, 'virement', 'p1', 'Camille Durand'),
    ],
    relationships: [
      { name: 'Sophie', role: 'M\u00e8re', type: 'famille', state: 'tension', mentionCount: 14, totalSessions: 18 },
      { name: 'Marc', role: 'Conjoint', type: 'famille', state: 'positive', mentionCount: 9, totalSessions: 18 },
      { name: 'Nathalie', role: 'Coll\u00e8gue', type: 'travail', state: 'conflit', mentionCount: 5, totalSessions: 18 },
    ],
  },

  // 2 -----------------------------------------------------------------------
  {
    id: 'p2',
    firstName: 'Thomas',
    lastName: 'Petit',
    age: 42,
    gender: 'M',
    phone: '06 98 76 54 32',
    email: 'thomas.petit@outlook.fr',
    sessionCount: 9,
    followingSince: '2025-11-04',
    motif: '\u00c9pisode d\u00e9pressif majeur suite \u00e0 une s\u00e9paration',
    orientation: 'Psychodynamique',
    tarif: 80,
    isMonPsy: false,
    themes: ['D\u00e9pression', 'Deuil relationnel', 'Paternit\u00e9', 'Culpabilit\u00e9'],
    avatarColor: '#2563EB',
    gad7Scores: [10, 9, 9, 8, 7],
    phq9Scores: [21, 19, 17, 15, 13],
    nextSession: '2026-03-30',
    notes: [
      note('n2-1', '2026-03-23', 9, 'Humeur basse mais \u00e9bauche de projets', ['D\u00e9pression', 'Paternit\u00e9'], ['Exploration des affects', '\u00c9coute active'], 'Thomas commence \u00e0 envisager un nouveau logement. Parle davantage de ses enfants.', 'Explorer le lien entre culpabilit\u00e9 parentale et immobilisme.'),
      note('n2-2', '2026-03-16', 8, 'Pleurs en s\u00e9ance, aborde la col\u00e8re', ['Deuil relationnel', 'Culpabilit\u00e9'], ['Ventilation \u00e9motionnelle', 'Reformulation'], 'Acc\u00e8s \u00e0 la col\u00e8re pour la premi\u00e8re fois. Phase de deuil en \u00e9volution.', 'Laisser \u00e9merger les \u00e9motions, ne pas pr\u00e9cipiter.'),
    ],
    invoices: [
      inv('inv2-1', 'F2026-0088', '2026-03-23', 80, true, 'cheque', 'p2', 'Thomas Petit'),
      inv('inv2-2', 'F2026-0079', '2026-03-16', 80, false, undefined, 'p2', 'Thomas Petit'),
    ],
    relationships: [
      { name: 'Claire', role: 'Ex-conjointe', type: 'ex', state: 'conflit', mentionCount: 8, totalSessions: 9 },
      { name: 'L\u00e9o', role: 'Fils (8 ans)', type: 'famille', state: 'positive', mentionCount: 6, totalSessions: 9 },
      { name: 'Emma', role: 'Fille (5 ans)', type: 'famille', state: 'positive', mentionCount: 5, totalSessions: 9 },
      { name: 'Dr Lefebvre', role: 'Psychiatre', type: 'medical', state: 'positive', mentionCount: 3, totalSessions: 9 },
    ],
  },

  // 3 -----------------------------------------------------------------------
  {
    id: 'p3',
    firstName: 'Manon',
    lastName: 'Garcia',
    age: 27,
    gender: 'F',
    phone: '07 45 12 89 34',
    email: 'manon.garcia@gmail.com',
    sessionCount: 24,
    followingSince: '2025-03-20',
    motif: 'Trouble du comportement alimentaire (boulimie)',
    orientation: 'TCC + Pleine conscience',
    tarif: 70,
    isMonPsy: true,
    themes: ['TCA', 'Image corporelle', 'Contr\u00f4le', 'Perfectionnisme'],
    avatarColor: '#EC4899',
    gad7Scores: [14, 14, 13, 11, 10, 9, 8, 7, 6, 6],
    phq9Scores: [16, 15, 14, 12, 11, 9, 8, 7, 6, 5],
    nextSession: '2026-03-30',
    notes: [
      note('n3-1', '2026-03-23', 23, 'Semaine sans \u00e9pisode de crise. Fi\u00e8re d\'elle.', ['TCA', 'Image corporelle'], ['Pleine conscience alimentaire', 'Renforcement positif'], '3 semaines cons\u00e9cutives sans crise boulimique. Record personnel.', 'Maintenir le carnet alimentaire. Pr\u00e9parer le repas en famille dimanche.'),
      note('n3-2', '2026-03-16', 22, 'Petite rechute vendredi soir apr\u00e8s dispute', ['TCA', 'Contr\u00f4le'], ['Analyse de la cha\u00eene comportementale', 'Auto-compassion'], 'Rechute contextuelle identifi\u00e9e. Facteur d\u00e9clencheur clair (conflit avec Julien).', 'Travailler la gestion du conflit sans recourir \u00e0 la nourriture.'),
    ],
    invoices: [
      inv('inv3-1', 'F2026-0089', '2026-03-23', 70, true, 'cb', 'p3', 'Manon Garcia'),
      inv('inv3-2', 'F2026-0080', '2026-03-16', 70, true, 'cb', 'p3', 'Manon Garcia'),
    ],
    relationships: [
      { name: 'Julien', role: 'Conjoint', type: 'famille', state: 'tension', mentionCount: 11, totalSessions: 24 },
      { name: 'H\u00e9l\u00e8ne', role: 'M\u00e8re', type: 'famille', state: 'tension', mentionCount: 15, totalSessions: 24 },
      { name: 'Dr Benali', role: 'Nutritionniste', type: 'medical', state: 'positive', mentionCount: 7, totalSessions: 24 },
    ],
  },

  // 4 -----------------------------------------------------------------------
  {
    id: 'p4',
    firstName: 'Alexandre',
    lastName: 'Moreau',
    age: 51,
    gender: 'M',
    phone: '06 33 77 21 09',
    email: 'a.moreau@laposte.net',
    sessionCount: 5,
    followingSince: '2026-01-15',
    motif: 'Burn-out professionnel',
    orientation: 'TCC',
    tarif: 80,
    isMonPsy: false,
    themes: ['Burn-out', 'Surcharge', 'Identit\u00e9 professionnelle', 'Insomnie'],
    avatarColor: '#F59E0B',
    gad7Scores: [19, 17, 16],
    phq9Scores: [18, 16, 15],
    nextSession: '2026-03-30',
    notes: [
      note('n4-1', '2026-03-23', 5, 'Toujours en arr\u00eat. Dort mieux mais fatigue persistante.', ['Burn-out', 'Insomnie'], ['Psycho\u00e9ducation burn-out', 'Hygiene du sommeil'], 'Comprend mieux le m\u00e9canisme d\'\u00e9puisement. Commence \u00e0 identifier ses limites.', 'Lister les signaux d\'alerte corporels. Reprendre une activit\u00e9 physique l\u00e9g\u00e8re.'),
    ],
    invoices: [
      inv('inv4-1', 'F2026-0090', '2026-03-23', 80, false, undefined, 'p4', 'Alexandre Moreau'),
      inv('inv4-2', 'F2026-0081', '2026-03-16', 80, true, 'especes', 'p4', 'Alexandre Moreau'),
    ],
    relationships: [
      { name: 'Isabelle', role: '\u00c9pouse', type: 'famille', state: 'positive', mentionCount: 4, totalSessions: 5 },
      { name: 'M. Renaud', role: 'Directeur (N+1)', type: 'travail', state: 'conflit', mentionCount: 5, totalSessions: 5 },
      { name: 'Dr Martin', role: 'M\u00e9decin traitant', type: 'medical', state: 'positive', mentionCount: 3, totalSessions: 5 },
    ],
  },

  // 5 -----------------------------------------------------------------------
  {
    id: 'p5',
    firstName: 'Yasmine',
    lastName: 'Belhaj',
    age: 19,
    gender: 'F',
    phone: '07 61 43 28 55',
    email: 'yasmine.b@hotmail.fr',
    sessionCount: 12,
    followingSince: '2025-09-09',
    motif: 'Phobie sociale et difficult\u00e9s universitaires',
    orientation: 'TCC',
    tarif: 60,
    isMonPsy: true,
    themes: ['Phobie sociale', 'Performance acad\u00e9mique', '\u00c9vitement', 'Autonomie'],
    avatarColor: '#10B981',
    gad7Scores: [17, 16, 15, 13, 11, 10, 9],
    phq9Scores: [10, 9, 9, 8, 7, 6, 5],
    nextSession: '2026-03-30',
    notes: [
      note('n5-1', '2026-03-23', 12, 'A pos\u00e9 une question en amphi ! Tr\u00e8s fi\u00e8re.', ['Phobie sociale', 'Performance acad\u00e9mique'], ['Exposition in vivo', 'Renforcement positif'], 'Progr\u00e8s remarquable. Premi\u00e8re prise de parole publique depuis le lyc\u00e9e.', 'Consolider par 2 autres expositions cette semaine. Pr\u00e9parer l\'oral de mai.'),
      note('n5-2', '2026-03-16', 11, '\u00c9vitement d\'un TD, culpabilit\u00e9', ['Phobie sociale', '\u00c9vitement'], ['Analyse fonctionnelle', 'Restructuration cognitive'], '\u00c9vitement ponctuel. Yasmine identifie le sch\u00e9ma et le remet en question.', 'Pr\u00e9parer une hi\u00e9rarchie d\'exposition pour les TD.'),
    ],
    invoices: [
      inv('inv5-1', 'F2026-0091', '2026-03-23', 60, true, 'virement', 'p5', 'Yasmine Belhaj'),
      inv('inv5-2', 'F2026-0082', '2026-03-16', 60, true, 'virement', 'p5', 'Yasmine Belhaj'),
    ],
    relationships: [
      { name: 'Fatima', role: 'M\u00e8re', type: 'famille', state: 'positive', mentionCount: 7, totalSessions: 12 },
      { name: 'Rachid', role: 'P\u00e8re', type: 'famille', state: 'tension', mentionCount: 4, totalSessions: 12 },
      { name: 'Lina', role: 'Meilleure amie', type: 'ami', state: 'positive', mentionCount: 6, totalSessions: 12 },
    ],
  },

  // 6 -----------------------------------------------------------------------
  {
    id: 'p6',
    firstName: 'Philippe',
    lastName: 'Roux',
    age: 63,
    gender: 'M',
    phone: '06 54 22 11 87',
    email: 'ph.roux@free.fr',
    sessionCount: 31,
    followingSince: '2024-11-18',
    motif: 'Deuil compliqu\u00e9 (d\u00e9c\u00e8s de l\'\u00e9pouse)',
    orientation: 'Psychodynamique',
    tarif: 70,
    isMonPsy: false,
    themes: ['Deuil', 'Solitude', 'Retraite', 'Sens de la vie'],
    avatarColor: '#6366F1',
    gad7Scores: [11, 10, 10, 9, 8, 8, 7, 6, 5, 5, 4],
    phq9Scores: [22, 20, 19, 17, 15, 13, 11, 10, 8, 7, 6],
    nextSession: '2026-03-30',
    notes: [
      note('n6-1', '2026-03-23', 31, 'Parle de Monique avec sourire pour la premi\u00e8re fois', ['Deuil', 'Sens de la vie'], ['\u00c9coute active', 'Accompagnement du processus de deuil'], 'Passage \u00e0 un deuil int\u00e9gr\u00e9. Philippe \u00e9voque des souvenirs heureux sans s\'effondrer.', 'Encourager la r\u00e9investissement social. Reprendre le bridge le jeudi.'),
      note('n6-2', '2026-03-16', 30, 'Sortie avec son fils dimanche. Moment agr\u00e9able.', ['Solitude', 'Sens de la vie'], ['Valorisation', 'Exploration des ressources'], 'Reconnecte avec son r\u00e9seau. Moins d\'isolement.', 'Planifier une activit\u00e9 sociale par semaine.'),
    ],
    invoices: [
      inv('inv6-1', 'F2026-0092', '2026-03-23', 70, true, 'cheque', 'p6', 'Philippe Roux'),
      inv('inv6-2', 'F2026-0083', '2026-03-16', 70, true, 'cheque', 'p6', 'Philippe Roux'),
    ],
    relationships: [
      { name: 'Monique', role: '\u00c9pouse d\u00e9c\u00e9d\u00e9e', type: 'famille', state: 'positive', mentionCount: 28, totalSessions: 31 },
      { name: 'Fran\u00e7ois', role: 'Fils', type: 'famille', state: 'positive', mentionCount: 12, totalSessions: 31 },
      { name: 'Bernard', role: 'Ami d\'enfance', type: 'ami', state: 'positive', mentionCount: 5, totalSessions: 31 },
    ],
  },

  // 7 -----------------------------------------------------------------------
  {
    id: 'p7',
    firstName: 'Sarah',
    lastName: 'Lemoine',
    age: 38,
    gender: 'F',
    phone: '06 78 99 12 34',
    email: 'sarah.lemoine@proton.me',
    sessionCount: 7,
    followingSince: '2025-12-01',
    motif: 'Syndrome de stress post-traumatique (agression)',
    orientation: 'EMDR + TCC',
    tarif: 80,
    isMonPsy: true,
    themes: ['TSPT', 'Hypervigilance', 'Cauchemars', 'Confiance'],
    avatarColor: '#EF4444',
    gad7Scores: [20, 19, 18, 16],
    phq9Scores: [17, 16, 14, 13],
    nextSession: '2026-03-30',
    notes: [
      note('n7-1', '2026-03-23', 7, 'Premi\u00e8re s\u00e9ance EMDR. Bien tol\u00e9r\u00e9e mais fatigue ensuite.', ['TSPT', 'Cauchemars'], ['EMDR phase 3-4', 'Stabilisation'], 'D\u00e9sensibilisation amorc\u00e9e sur la sc\u00e8ne index. SUD pass\u00e9 de 9 \u00e0 6.', 'Lieu s\u00fbr \u00e0 pratiquer quotidiennement. Prochaine s\u00e9ance EMDR lundi.'),
      note('n7-2', '2026-03-16', 6, 'Pr\u00e9paration EMDR. Historique traumatique cartographi\u00e9.', ['TSPT', 'Confiance'], ['Installation du lieu s\u00fbr', 'Psycho\u00e9ducation TSPT'], 'Bonne alliance. Sarah se sent pr\u00eate pour le retraitement.', 'Exercice de contenant entre les s\u00e9ances.'),
    ],
    invoices: [
      inv('inv7-1', 'F2026-0093', '2026-03-23', 80, true, 'cb', 'p7', 'Sarah Lemoine'),
      inv('inv7-2', 'F2026-0084', '2026-03-16', 80, true, 'cb', 'p7', 'Sarah Lemoine'),
    ],
    relationships: [
      { name: 'Vincent', role: 'Compagnon', type: 'famille', state: 'positive', mentionCount: 5, totalSessions: 7 },
      { name: 'A\u00e9la', role: 'S\u0153ur', type: 'famille', state: 'positive', mentionCount: 3, totalSessions: 7 },
      { name: 'L\'agresseur', role: 'Inconnu', type: 'ex', state: 'conflit', mentionCount: 6, totalSessions: 7 },
      { name: 'Dr Nguyen', role: 'Psychiatre', type: 'medical', state: 'positive', mentionCount: 4, totalSessions: 7 },
    ],
  },

  // 8 -----------------------------------------------------------------------
  {
    id: 'p8',
    firstName: 'Hugo',
    lastName: 'Fabre',
    age: 16,
    gender: 'M',
    phone: '06 11 22 33 44',
    email: 'fabre.parents@orange.fr',
    sessionCount: 14,
    followingSince: '2025-07-02',
    motif: 'Harc\u00e8lement scolaire et anxi\u00e9t\u00e9 de performance',
    orientation: 'TCC + Th\u00e9rapie du sch\u00e9ma (adapt\u00e9e ado)',
    tarif: 65,
    isMonPsy: true,
    themes: ['Harc\u00e8lement', 'Anxi\u00e9t\u00e9 scolaire', 'Confiance en soi', 'Col\u00e8re'],
    avatarColor: '#F97316',
    gad7Scores: [16, 15, 14, 12, 11, 10, 8, 7],
    phq9Scores: [14, 13, 12, 11, 9, 8, 7, 6],
    nextSession: '2026-04-06',
    notes: [
      note('n8-1', '2026-03-23', 14, 'A r\u00e9pondu calmement \u00e0 une provocation. Fier de lui.', ['Harc\u00e8lement', 'Confiance en soi'], ['Jeu de r\u00f4le', 'Affirmation de soi'], 'Progr\u00e8s net dans la gestion des provocations. Hugo gagne en assurance.', 'Continuer les exercices d\'affirmation. Entretien avec les parents le 06/04.'),
      note('n8-2', '2026-03-16', 13, 'Episode de col\u00e8re au coll\u00e8ge, convocation CPE', ['Col\u00e8re', 'Harc\u00e8lement'], ['Analyse fonctionnelle', 'Technique de la tortue'], 'R\u00e9action disproportionn\u00e9e mais compr\u00e9hensible. Travail sur la r\u00e9gulation.', 'Fiche de gestion de col\u00e8re \u00e0 garder dans le carnet.'),
    ],
    invoices: [
      inv('inv8-1', 'F2026-0094', '2026-03-23', 65, true, 'virement', 'p8', 'Hugo Fabre'),
      inv('inv8-2', 'F2026-0085', '2026-03-16', 65, false, undefined, 'p8', 'Hugo Fabre'),
    ],
    relationships: [
      { name: 'Anne', role: 'M\u00e8re', type: 'famille', state: 'positive', mentionCount: 8, totalSessions: 14 },
      { name: 'Pierre', role: 'P\u00e8re', type: 'famille', state: 'tension', mentionCount: 6, totalSessions: 14 },
      { name: 'Enzo', role: 'Harceleur principal', type: 'travail', state: 'conflit', mentionCount: 10, totalSessions: 14 },
      { name: 'Mathis', role: 'Ami proche', type: 'ami', state: 'positive', mentionCount: 5, totalSessions: 14 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Today's appointments (2026-03-30, 8 slots from 9:00 to 17:00)
// ---------------------------------------------------------------------------
export const todayAppointments: Appointment[] = [
  {
    id: 'apt1',
    patientId: 'p1',
    patient: patients[0],
    date: today,
    startTime: '09:00',
    endTime: '09:50',
    status: 'completed',
    noteId: 'n1-today',
    invoiceId: 'inv-today-1',
  },
  {
    id: 'apt2',
    patientId: 'p2',
    patient: patients[1],
    date: today,
    startTime: '10:00',
    endTime: '10:50',
    status: 'completed',
    noteId: 'n2-today',
    invoiceId: 'inv-today-2',
  },
  {
    id: 'apt3',
    patientId: 'p3',
    patient: patients[2],
    date: today,
    startTime: '11:00',
    endTime: '11:50',
    status: 'completed',
  },
  {
    id: 'apt4',
    patientId: 'p4',
    patient: patients[3],
    date: today,
    startTime: '12:00',
    endTime: '12:50',
    status: 'no-show',
  },
  {
    id: 'apt5',
    patientId: 'p5',
    patient: patients[4],
    date: today,
    startTime: '14:00',
    endTime: '14:50',
    status: 'in-progress',
  },
  {
    id: 'apt6',
    patientId: 'p6',
    patient: patients[5],
    date: today,
    startTime: '15:00',
    endTime: '15:50',
    status: 'upcoming',
  },
  {
    id: 'apt7',
    patientId: 'p7',
    patient: patients[6],
    date: today,
    startTime: '16:00',
    endTime: '16:50',
    status: 'upcoming',
  },
  {
    id: 'apt8',
    patientId: 'p8',
    patient: patients[7],
    date: today,
    startTime: '17:00',
    endTime: '17:50',
    status: 'cancelled',
  },
];

// ---------------------------------------------------------------------------
// Recent invoices (aggregated from all patients + today)
// ---------------------------------------------------------------------------
export const recentInvoices: Invoice[] = [
  // Today
  inv('inv-today-1', 'F2026-0101', today, 70, true, 'cb', 'p1', 'Camille Durand'),
  inv('inv-today-2', 'F2026-0102', today, 80, true, 'cheque', 'p2', 'Thomas Petit'),
  inv('inv-today-3', 'F2026-0103', today, 70, false, undefined, 'p3', 'Manon Garcia'),
  // Last week
  ...patients.flatMap((p) => p.invoices),
];

// ---------------------------------------------------------------------------
// Stats helper
// ---------------------------------------------------------------------------
export function getTodayStats(): DayStats {
  const completed = todayAppointments.filter((a) => a.status === 'completed');
  const todayInv = recentInvoices.filter((i) => i.date === today);
  const paidToday = todayInv.filter((i) => i.paid);
  const unpaidToday = todayInv.filter((i) => !i.paid);

  const notesCompleted = todayAppointments.filter((a) => a.noteId).length;
  const notesPending = completed.length - notesCompleted;

  return {
    totalSessions: todayAppointments.filter((a) => a.status !== 'cancelled').length,
    completedSessions: completed.length,
    totalRevenue: todayInv.reduce((sum, i) => sum + i.amount, 0),
    paidAmount: paidToday.reduce((sum, i) => sum + i.amount, 0),
    unpaidCount: unpaidToday.length,
    notesCompleted,
    notesPending: notesPending < 0 ? 0 : notesPending,
  };
}
