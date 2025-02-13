// src/types/types.ts

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

export interface Company {
  grandLivre: {
    lastUpdate: Date;
    currentYear: Record<string, GrandLivreEntry[]>;
    previousYear: Record<string, GrandLivreEntry[]>;  // Non optionnel car obligatoire
  };
  files?: {
    currentYearLedger?: File;
    previousYearLedger?: File;
    lastUpdate?: Date;
  };
}
