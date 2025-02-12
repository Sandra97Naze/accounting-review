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
}
interface GLData {
  currentYear: Record<string, GLEntry[]>;
  previousYear: Record<string, GLEntry[]>;
  lastUpdate?: Date;
}

export interface Company {
  // ... autres propriétés existantes
  grandLivre?: GLData;
}
