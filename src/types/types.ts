export interface GLEntry {
  compte: string;
  libelle: string;
  debit: number;
  credit: number;
  solde: number;
}

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
  status?: string;
  comments?: number;
  tasks?: number;
  details?: {
    currentTotal: number;
    previousTotal: number;
    variation: number;
    entries: GLEntry[];
  };
}

export type Cycles = Record<string, CycleData>;

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
  id: string;
  name: string;
  siren: string;
  exercice: string;
  status: string;
  grandLivre: {
    lastUpdate: Date;
    currentYear: Record<string, GrandLivreEntry[]>;
    previousYear: Record<string, GrandLivreEntry[]>;
  };
  cycles: Cycles; 
  files?: {
    currentYearLedger?: File;
    previousYearLedger?: File;
    lastUpdate?: Date;
  };
}
