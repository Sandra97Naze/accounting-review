import { GrandLivreEntry } from '@/types/types';
import { GLDisplayEntry } from '@/components/review/GLDetails';

export const transformGrandLivreToDisplay = (
  currentYearData: Record<string, GrandLivreEntry[]> | GrandLivreEntry[],
  previousYearData?: Record<string, GrandLivreEntry[]> | GrandLivreEntry[]
): GLDisplayEntry[] => {
  // Convertir les données en tableau si nécessaire
  const currentEntries = Array.isArray(currentYearData) 
    ? currentYearData 
    : Object.values(currentYearData).flat();
  
  const previousEntries = previousYearData
    ? Array.isArray(previousYearData)
      ? previousYearData
      : Object.values(previousYearData).flat()
    : [];

  // Traiter les données
  const displayEntries: Record<string, GLDisplayEntry> = {};

  currentEntries.forEach(entry => {
    const solde = entry.montantDebit - entry.montantCredit;
    if (!displayEntries[entry.compte]) {
      displayEntries[entry.compte] = {
        compte: entry.compte,
        libelle: entry.libelle,
        solde: solde,
        variation: 0
      };
    } else {
      displayEntries[entry.compte].solde += solde;
    }
  });

  // Calculer les variations
  if (previousEntries.length > 0) {
    previousEntries.forEach(entry => {
      const previousSolde = entry.montantDebit - entry.montantCredit;
      if (displayEntries[entry.compte]) {
        displayEntries[entry.compte].variation = 
          displayEntries[entry.compte].solde - previousSolde;
      }
    });
  }

  return Object.values(displayEntries);
};
