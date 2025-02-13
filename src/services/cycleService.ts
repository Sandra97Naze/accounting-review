import { GrandLivreEntry } from '@/types/types';
import { BalanceEntry, FeuilleTravail, Justificatif } from '@/types/CyclePageTypes';

export const fetchBalanceForCycle = async (
  cycleName: string, 
  currentYearData: GrandLivreEntry[], 
  previousYearData: GrandLivreEntry[]
): Promise<BalanceEntry[]> => {
  // Mapping des catégories de comptes par cycle
  const cycleCategories = {
    'Trésorerie': ['51', '53', '54', '58'],
    'Fournisseurs et Achats': ['40', '401', '403'],
    // Autres mappings...
  };

  // Filtrer les entrées pour le cycle spécifique
  const filterEntriesForCycle = (entries: GrandLivreEntry[], categoryAccounts: string[]) => {
    return entries.filter(entry => 
      categoryAccounts.some(account => entry.compte.startsWith(account))
    );
  };

  const currentCycleEntries = filterEntriesForCycle(
    currentYearData, 
    cycleCategories[cycleName] || []
  );

  const previousCycleEntries = filterEntriesForCycle(
    previousYearData, 
    cycleCategories[cycleName] || []
  );

  // Regrouper par compte
  const balanceEntries: BalanceEntry[] = Object.entries(
    currentCycleEntries.reduce((acc, entry) => {
      if (!acc[entry.compte]) {
        const previousEntry = previousCycleEntries.find(prev => prev.compte === entry.compte);
        
        const soldeN = entry.montantDebit - entry.montantCredit;
        const soldeNMoins1 = previousEntry 
          ? previousEntry.montantDebit - previousEntry.montantCredit 
          : 0;
        
        const variationMontant = soldeN - soldeNMoins1;
        const variationPourcentage = soldeNMoins1 !== 0 
          ? (variationMontant / Math.abs(soldeNMoins1)) * 100 
          : 0;

        acc[entry.compte] = {
          compte: entry.compte,
          libelle: entry.libelle,
          soldeN,
          soldeNMoins1,
          variationMontant,
          variationPourcentage,
          commentaire: ''
        };
      }
      return acc;
    }, {} as Record<string, BalanceEntry>)
  ).map(([_, entry]) => entry);

  return balanceEntries;
};

// services/feuillesTravailService.ts
export const fetchFeuillesTravail = async (cycleName: string): Promise<FeuilleTravail[]> => {
  // Logique de récupération depuis votre backend
  // Exemple mock
  return [
    {
      id: '1',
      titre: `Feuille ${cycleName} - 1`,
      type: 'xlsx',
      dateCreation: new Date(),
      fichier: null
    }
  ];
};

// services/justificatifsService.ts
export const fetchJustificatifs = async (cycleName: string): Promise<Justificatif[]> => {
  // Logique de récupération depuis votre backend
  // Exemple mock
  return [
    {
      id: '1',
      titre: `Justificatif ${cycleName} - 1`,
      type: 'pdf',
      dateAjout: new Date(),
      fichier: null as any
    }
  ];
};
