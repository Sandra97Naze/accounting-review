// src/types/CyclePageTypes.ts
export interface BalanceEntry {
  compte: string;
  libelle: string;
  soldeN: number;
  soldeNMoins1: number;
  variationMontant: number;
  variationPourcentage: number;
  commentaire?: string;
}

export interface FeuilleTravail {
  id: string;
  titre: string;
  type: 'xls' | 'xlsx' | 'pdf';
  dateCreation: Date;
  fichier: File | null;
}

export interface Justificatif {
  id: string;
  titre: string;
  type: 'xls' | 'xlsx' | 'pdf' | 'image';
  dateAjout: Date;
  fichier: File;
}
