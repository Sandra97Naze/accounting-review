export interface UserData {
  email: string;
  role: string;
  permissions: {
    canValidate: boolean;
    canEdit: boolean;
    canComment: boolean;
    canExport: boolean;
    canAssignTasks: boolean;
  };
}

export interface CycleData {
  progress: number;
  status: 'en_cours' | 'a_valider' | 'valide';
  comments: number;
  tasks: number;
}

export interface Cycles {
  [key: string]: CycleData;
}

// Nouvelle interface pour les entrées du Grand Livre
export interface GrandLivreEntry {
  societe: string;
  centralisateur: string;
  auxiliaire: string;
  compte: string;
  libelle: string;
  journal: string;
  date: Date;
  libelleEcriture: string;
  montantDebit: number;
  montantCredit: number;
  dateEcheance: Date | null;
  reference: string;
  numeroPiece: string;
  dateOrigine: Date | null;
  numeroInformationOrigine: string;
  etablissement: string;
  codeGrd: string;
  natureAnalytique: string;
  codeAnalytique: string;
  mtDebit: number;
  mtCredit: number;
  soldeAnalytique: number;
}

// Interface pour les données du Grand Livre
export interface GLData {
  currentYear: Record<string, GrandLivreEntry[]>;
  previousYear: Record<string, GrandLivreEntry[]>;
  lastUpdate?: Date;
}

export interface Company {
  id: string;
  name: string;
  siren: string;
  exercice: string;
  status: string;
  files?: {
    currentYearLedger?: File;
    previousYearLedger?: File;
    lastUpdate?: Date;
  };
  cycles: Cycles;
  grandLivre?: GLData;
}
