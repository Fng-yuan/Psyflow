# PsyFlow — Logiciel métier pour psychologues libéraux

## Vision produit

PsyFlow est un assistant IA centralisateur de données pour psychologues libéraux. Le psy ne fait que deux choses : voir ses patients et valider ce que l'IA a préparé. Tout le reste est automatisé.

L'interface est organisée autour de la **journée du psy** — pas des menus ou des features isolées, mais un flux naturel où le praticien avance étape par étape et valide en 1-2 taps maximum à chaque action.

**Positionnement marché** : les concurrents (Doctolib, Docorga, Scriboupsy, Mon Cabinet Libéral) sont des outils où le psy fait lui-même les tâches admin dans un logiciel. PsyFlow inverse la logique : l'IA fait, le psy valide.

**Cible** : psychologues libéraux en France (~30 000+), qui utilisent aujourd'hui un mélange de Google Agenda + Word + cahier papier + Excel, principalement parce que les logiciels existants sont trop chers (Doctolib ~139€/mois) ou trop génériques.

**Modèle économique** : freemium. Gratuit jusqu'à X patients, puis abonnement bas (~9-15€/mois). Argument clé : 2x moins cher que Scriboupsy (27€), 4x moins cher que Docorga, 10x moins cher que Doctolib.

**Contrainte réglementaire majeure** : la facturation électronique devient obligatoire en France à partir du 1er septembre 2026 (réception) et septembre 2027 (émission pour TPE/micro-entreprises). Les psys qui facturent sur Word seront hors-la-loi. PsyFlow doit être conforme dès le lancement — c'est un argument de vente massif.

---

## Architecture de l'interface

L'app fonctionne comme une **roadmap de journée interactive**. Le psy ouvre l'app le matin et voit sa timeline de la journée. Chaque créneau patient est un point d'entrée vers tout : dossier, notes, facture. L'interface change de contenu selon le moment :

- **Le matin** : vue planning avec les patients du jour
- **Entre deux patients** : mode transition — note du précédent à valider + briefing du suivant
- **Après la dernière séance** : récap de journée — notes à finaliser, paiements, stats
- **En fin de mois** : export comptable

Il n'y a pas de navigation par menus. Tout est contextuel.

---

## Features — Tier 1 (le cœur, indispensable au MVP)

### Feature 1 : Notes cliniques assistées par IA

**Objectif** : réduire le temps de prise de notes de 10 min à 1 min par patient.

**Fonctionnement** :

Le psy a 3 modes de saisie au choix :

1. **Vocal** (le plus rapide) — il appuie sur un bouton micro et dicte en langage naturel pendant 30 secondes. Exemple : "Marie était plus détendue, on a parlé de sa relation avec sa mère, travail sur l'affirmation de soi, elle va essayer le journal des pensées cette semaine."

2. **Texte rapide** — il tape quelques mots-clés en vrac dans un champ libre.

3. **Sélection guidée** — il coche dans une interface rapide : humeur du patient (échelle), thèmes abordés (liste personnalisable), techniques utilisées.

L'IA prend cette saisie brute et génère instantanément une note clinique structurée avec les sections suivantes :

- **État du patient** : humeur, posture, éléments notables
- **Thèmes abordés** : ce qui a été discuté pendant la séance
- **Interventions** : techniques ou approches utilisées par le psy
- **Progression** : par rapport aux séances précédentes (l'IA a accès à l'historique complet)
- **Plan** : exercices donnés, points à reprendre la prochaine fois

Le psy relit la note générée, modifie s'il le souhaite (un mot, une nuance), et valide. La note est enregistrée, horodatée, et rattachée automatiquement au patient et à la séance.

**Personnalisation** : chaque psy travaille différemment. L'app propose des templates de structuration selon l'orientation (TCC, psychodynamique, systémique, humaniste) et s'adapte au style du praticien au fil du temps.

**Contextualisation** : l'IA ne rédige pas dans le vide. Elle connaît tout l'historique du patient. Si le psy dit "elle va mieux avec sa mère", l'IA sait que c'est un sujet récurrent et note "Progression : amélioration du lien maternel, thème travaillé depuis la séance 3."

**Technique** : speech-to-text (type Whisper ou solution européenne RGPD) puis LLM pour structuration. Traitement sur serveur HDS certifié, jamais sur serveur non sécurisé.

**Règle absolue** : l'IA ne fait JAMAIS d'interprétation clinique. Elle structure et reformule, elle ne diagnostique pas. Wording dans l'app : "note générée à partir de vos observations", jamais "analyse IA du patient."

**Impact** : 8 patients × 10 min = 80 min/jour → 8 patients × 1 min = 8 min/jour. **+1h récupérée chaque jour.**

**Feature future (V2+)** : enregistrement audio live de la séance (avec consentement patient) puis transcription et structuration automatique de la note après la séance. Modèle inspiré de Nabla/Abridge aux US. Nécessite un niveau de confiance et de conformité RGPD/HDS encore plus élevé. Ne pas implémenter au lancement.

---

### Feature 2 : Facturation automatique

**Objectif** : le psy ne "fait" jamais une facture. La facture est une conséquence automatique de la séance terminée.

**Fonctionnement** :

1. Le psy termine sa séance. Dans l'agenda, le créneau passe à "terminé" (automatique ou via un tap).

2. L'app génère instantanément le reçu/facture avec toutes les infos déjà connues :
   - Nom du patient (depuis le dossier)
   - Date et heure (depuis l'agenda)
   - Tarif (défini dans les paramètres, personnalisable par patient)
   - Numéro ADELI du psy
   - Mentions légales obligatoires
   - Numéro de facture séquentiel

3. L'app demande juste : "Payé ?" avec les options espèces / chèque / virement / CB. Un tap.

4. Si "pas encore payé" → le montant passe en impayé avec relance automatique configurable.

5. Le reçu PDF part par email au patient (si activé) ou reste disponible dans le dossier.

**En fin de journée** : récap automatique — "Aujourd'hui : 7 séances, 420€ facturés, 6 payés, 1 impayé (Paul D.)."

**En fin de mois** : export automatique du livre de recettes.

**Cas spécial MonPsy** : les patients conventionnés MonPsy ont des tarifs imposés (40€ première séance, 30€ les suivantes, max 8). L'app gère ça automatiquement quand le patient est tagué "MonPsy."

**Conformité facturation électronique 2026** : les factures doivent être au format structuré (Factur-X, UBL ou CII) et transiter par une plateforme agréée. L'app doit intégrer cette chaîne dès le lancement ou très rapidement après. C'est un argument de vente décisif : "Vous devez passer à la facture électronique, avec PsyFlow c'est déjà fait."

**Impact** : 30-40 min/jour de facturation → 0 min. Tout est automatique.

---

### Feature 3 : Agenda intelligent contextuel

**Objectif** : l'agenda n'est pas un calendrier — c'est l'interface principale de l'app. Chaque créneau est une porte d'entrée vers tout.

**Fonctionnement** :

**Vue journée (écran principal)** : timeline verticale avec les patients du jour. Chaque bloc-patient affiche : prénom, numéro de séance, indicateur couleur (payé/impayé, note faite/à faire).

**Tap sur un patient à venir** : le bloc s'ouvre et affiche le briefing IA (résumé dernière séance, points à aborder). Le psy est prêt en 10 secondes.

**Tap sur un patient passé** : le bloc propose "Écrire une note" + "Marquer comme terminé." La facture se génère automatiquement.

**Entre deux patients** : l'app affiche une micro-vue de transition — note du précédent (à valider) + résumé du prochain. C'est le moment "5 minutes entre deux patients" — l'écran le plus important à designer.

**Fin de journée** : récap — patients vus, notes à compléter, factures, paiements. Validation en 2 minutes.

**Fonctionnalités agenda spécifiques psy** :

- **Récurrence intelligente** : le psy voit souvent les mêmes patients au même créneau chaque semaine. L'app propose automatiquement la prochaine séance au même horaire. Un tap pour confirmer.
- **Buffer inter-séance** : les psys ont besoin de 5-15 min entre patients. L'agenda intègre ce buffer nativement et l'applique automatiquement.
- **Gestion no-shows** : patient absent → swipe "absent" → l'app propose : facturer quand même ? relancer pour replanifier ? Un geste.
- **Liste d'attente** : quand un créneau se libère, l'app propose automatiquement ce créneau aux patients en attente.

---

## Features — Tier 2 (rend l'outil indispensable)

### Feature 4 : Préparation de séance automatique

**Objectif** : le psy arrive devant chaque patient avec un briefing complet, sans avoir rien cherché.

**Fonctionnement** :

5 minutes avant le RDV, notification push avec un résumé IA du patient :

- **Identité rapide** : Marie D., 34 ans, 12ème séance, suivi depuis mars 2026
- **Motif initial** : anxiété généralisée + difficultés relationnelles
- **Dernière séance** (résumé en 3-4 lignes) : thèmes, techniques, exercices donnés
- **Fil rouge thérapeutique** : thèmes récurrents détectés par l'IA sur l'ensemble des séances (ex : "relation maternelle — présent dans 8 séances sur 12")
- **Point d'attention** : exercice donné → à demander si le patient l'a fait
- **Évolution** : tendance simple (anxiété ↓, sommeil ↗)

L'IA ne recopie pas la dernière note. Elle synthétise l'historique complet et fait remonter ce qui est pertinent MAINTENANT.

---

### Feature 5 : Centralisation des données patient

**Objectif** : un dossier unique par patient qui se construit tout seul au fil des séances. Le psy ne "remplit" jamais un dossier.

**Le dossier se structure en 5 couches de données** :

#### Couche 1 — Identité et contexte de vie
Données admin (nom, âge, situation familiale, profession), situation de vie, réseau médical (médecin traitant, psychiatre). Saisie une fois, mise à jour rarement.

#### Couche 2 — Anamnèse (l'histoire du patient)
Le "roman" du patient : histoire personnelle, antécédents psy et familiaux, traitements en cours, motif de consultation, demande explicite vs implicite. L'IA aide à structurer ce texte riche (extraire événements clés, personnes, dates) et peut en faire une timeline de vie.

#### Couche 3 — Métriques cliniques (les scores standardisés)
Intégration des questionnaires validés :
- **PHQ-9** : 9 questions mesurant la dépression (scores 5/10/15/20 = léger/modéré/sévère)
- **GAD-7** : 7 questions mesurant l'anxiété
- **PHQ-4** : version ultra-courte (4 questions, drapeau jaune >6, rouge >9)
- **PCL-5** : évaluation du stress post-traumatique
- Autres selon la spécialité

Le patient peut remplir ces questionnaires directement dans l'app (en salle d'attente, sur son tel). Les scores alimentent le dossier et créent des **courbes d'évolution** au fil des séances.

Note : le dispositif MonPsy de l'Assurance Maladie exige l'utilisation du PHQ-9 et du GAD-7. L'intégration native dans l'app est un argument pour les psys conventionnés.

#### Couche 4 — Suivi séance par séance
Les notes structurées par l'IA (feature 1) viennent alimenter cette couche automatiquement. Chaque séance = état du patient, thèmes, interventions, observations cliniques, exercices, prochains pas.

#### Couche 5 — Vision globale IA (la "carte" du patient)
Synthèse auto-générée qui évolue au fil des séances :
- Problématiques centrales (les vrais enjeux de fond)
- Patterns/schémas récurrents détectés dans les notes
- Ressources du patient (internes : volonté, courage ; externes : réseau familial, amical)
- Croyances et valeurs profondes
- Objectifs thérapeutiques et progression globale

#### Carte relationnelle du patient

Composant visuel central du dossier. Affichage en constellation avec le patient au centre et ses relations autour. Chaque lien affiche visuellement :

- **Le type de relation** : famille (mère, père, conjoint, enfant), travail (manager, collègue), amis, ex, médical
- **L'état de la relation** encodé par couleur : vert (positif/stable), orange (tension), rouge (conflit/douleur)
- **L'intensité** : épaisseur du trait selon l'importance dans le suivi
- **La fréquence de mention** : badge "8/12" indiquant dans combien de séances la personne a été mentionnée
- **Traits pointillés** pour les relations difficiles ou rompues, pleins pour les stables

L'IA construit cette carte automatiquement en détectant les prénoms et rôles mentionnés dans les notes. Le psy peut corriger/compléter manuellement.

#### Vue pré-séance du dossier patient

Quand le psy ouvre le dossier avant une séance, l'écran est structuré pour répondre à 4 questions en 30 secondes :

1. **"C'est qui ?"** → En haut : prénom, âge, situation, numéro de séance, badges colorés des thématiques principales
2. **"Ça avance ?"** → 3 mini-cartes avec micro-courbes : anxiété (GAD-7), humeur (PHQ-9), assiduité. Direction de la courbe visible d'un coup d'œil.
3. **"Où on en était ?"** → Résumé IA de la dernière séance avec mots-clés mis en évidence + personnes mentionnées
4. **"Qu'est-ce que je dois aborder ?"** → Points générés par l'IA : exercice à suivre, thème récurrent, continuité de travail

Le dossier complet et l'historique sont accessibles en scrollant, mais le psy n'en a presque jamais besoin entre deux patients.

---

### Feature 6 : Rappels et communication automatique

**Objectif** : le psy ne décroche plus son téléphone pour de l'administratif.

**Fonctionnement** :

- **Rappel de RDV** : SMS ou email 24h et/ou 2h avant. Le patient confirme ou annule en un tap. Réduit les no-shows de 30-40%.
- **Confirmation post-séance** : le patient reçoit son reçu + date du prochain RDV automatiquement.
- **Relance absent** : si no-show sans prévenir → message configurable + proposition de replanifier.
- **Relance "perdus"** : patient sans RDV depuis X semaines → signalé au psy qui choisit d'envoyer (ou non) un message pré-rédigé par l'IA.
- **Relance impayés** : message automatique poli après X jours configurable.

**Règle absolue** : le psy garde toujours le contrôle. Aucun message ne part sans son accord ou sa pré-configuration. Les templates sont personnalisables.

---

## Features — Tier 3 (les features "wow" qui fidélisent)

### Feature 7 : Suivi de progression visuel

**Objectif** : objectiver la progression du patient avec des données visuelles. Utilisable par le psy et montrable au patient.

**Contenu** :

- **Courbes d'évolution** des scores PHQ-9, GAD-7, etc. Chaque point = une séance, cliquable pour voir la note.
- **Fréquence des thèmes** : l'IA montre l'évolution des sujets abordés au fil du temps. Ex : "relation maternelle" baisse, "confiance en soi" monte.
- **Analyse de sentiment** des notes : le vocabulaire du psy évolue ("en détresse" → "plus apaisée" → "en progression"), ça se traduit en courbe de tonalité.
- **Objectifs atteints** : le psy fixe des objectifs en début de suivi. L'IA signale dans les notes quand ils semblent atteints. Le psy valide, l'objectif passe en "atteint."

**Double usage** :
- Le psy montre au patient pendant la séance : "Quand tu es arrivée ton anxiété était à 14, aujourd'hui tu es à 8." Outil thérapeutique en soi.
- Export PDF pour médecin traitant ou dossier de prise en charge — un clic.

---

### Feature 8 : Export comptable automatique

**Objectif** : la compta mensuelle en 2 minutes au lieu de 2-3 heures.

**Contenu généré automatiquement en fin de mois** :

- **Livre de recettes** : chaque séance facturée avec date, patient (anonymisable), montant, moyen de paiement. Format conforme.
- **Récapitulatif par moyen de paiement** : espèces, chèque, virement, CB.
- **Suivi des impayés** : factures non réglées avec date et patient.
- **Statistiques d'activité** : nombre de séances, revenus bruts, taux de remplissage, taux de no-show, revenu moyen par jour.

Export en PDF ou tableur, compatible facturation électronique (Factur-X).

---

### Feature 9 : Suggestions IA entre séances

**Objectif** : le psy gère 30-50 patients actifs. L'IA l'aide à ne rien laisser passer.

**Types de suggestions** :

- **Alerte de suivi** : "Paul n'a pas de RDV depuis 3 semaines, habituellement il vient chaque semaine. Relancer ?"
- **Alerte de stagnation** : "Le GAD-7 de Marie n'a pas bougé depuis 4 séances, mêmes thèmes récurrents. Envisager un ajustement ?"
- **Alerte de risque** : "Vocabulaire des notes sur Lucas a changé : 3 mentions de 'désespoir' sur les 2 dernières séances, absent avant." Drapeau d'attention.
- **Suggestion pratique** : "Créneau libre jeudi 14h, 3 patients en liste d'attente correspondent."

**Règle absolue** : l'IA ne prescrit JAMAIS une action clinique. Elle signale des patterns. La décision reste 100% humaine. Wording neutre : "nous avons remarqué", "souhaitez-vous", "à votre appréciation."

Pas de pop-ups — un badge discret sur le dashboard du matin : "3 suggestions aujourd'hui."

---

## Conformité et sécurité

- **Hébergement HDS** (Hébergeur de Données de Santé) certifié obligatoire
- **RGPD** strict — consentement, droit d'accès, droit à l'effacement
- **Chiffrement** de bout en bout pour toutes les données patient
- **Pas de stockage audio** après transcription (pour les notes vocales)
- **L'IA ne sort jamais les données du périmètre sécurisé**
- **Facturation électronique** conforme aux formats Factur-X/UBL/CII via plateforme agréée

---

## Stack technique (recommandations)

- **Web app responsive** (React ou équivalent) : accessible sur ordi au cabinet ET sur mobile entre deux patients
- **API backend** avec authentification forte
- **Base de données** avec chiffrement au repos
- **Intégration IA** : API LLM pour structuration des notes + speech-to-text pour le vocal
- **Hébergement France** sur infra HDS (ex : AZ Network, OVH Health, Scaleway)
- **Progressive Web App** pour l'accès mobile sans téléchargement d'app

---

## Métriques de succès

- Temps admin quotidien du psy : objectif < 15 min/jour (vs 2h+ actuellement)
- Taux de notes complétées le jour même : objectif > 95%
- Taux de no-show avec rappels activés : objectif < 5%
- Impayés : objectif < 2% avec relances automatiques
- NPS (satisfaction) : objectif > 60
