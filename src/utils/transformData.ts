import { GrandLivreEntry } from '@/types/types';
import { GLDisplayEntry } from '@/components/review/GLDetails';

export const transformGrandLivreToDisplay = (
  currentYearEntries: GrandLivreEntry[],
  previousYearEntries?: GrandLivreEntry[]
): GLDisplayEntry[] => {
  // Grouper par compte
  const groupedEntries = currentYearEntries.reduce<Record<string, GLDisplayEntry>>((acc, entry) => {
    const solde = entry.montantDebit - entry.montantCredit;
    
    if (!acc[entry.compte]) {
      acc[entry.compte] = {
        compte: entry.compte,
        libelle: entry.libelle,
        solde: solde,
        variation: 0
      };
    } else {
      acc[entry.compte].solde += solde;
    }
    
    return acc;
  }, {});

  // Calculer les variations si les données de l'année précédente sont disponibles
  if (previousYearEntries) {
    previousYearEntries.forEach(entry => {
      const previousSolde = entry.montantDebit - entry.montantCredit;
      if (groupedEntries[entry.compte]) {
        groupedEntries[entry.compte].variation = 
          groupedEntries[entry.compte].solde - previousSolde;
      }
    });
  }

  return Object.values(groupedEntries);
};
