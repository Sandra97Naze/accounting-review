// src/services/balanceService.ts
import { GrandLivreEntry } from '@/types/types';
import { BalanceEntry } from '@/types/CyclePageTypes';

export const calculateBalanceForCycle = (
  cycleName: string, 
  currentYearData: GrandLivreEntry[], 
  previousYearData: GrandLivreEntry[]
): BalanceEntry[] => {
  // Mapping des catégories de comptes par cycle
  const cycleCategories = {
    'Trésorerie': ['51', '53', '54', '58', '627', '66', '76', '16'],
    'Fournisseurs et Achats': ['40', '401', '403', '404', '405', '408', '409'],
    'Charges Externes': ['61', '62'],
    'Clients et Ventes': ['41', '70'],
    'Stocks': ['31', '32', '37', '603', '71'],
    'Immobilisations': ['20', '21', '22', '23', '24', '25', '26', '27', '28', '681', '675', '775'],
    'Social': ['64', '42', '43'],
    'Fiscal': ['63', '44'],
    'Capitaux': ['10', '11', '12', '13', '14', '15', '74'],
    'Autres Comptes': ['46', '47', '48', '49', '65', '67', '75', '77']
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
