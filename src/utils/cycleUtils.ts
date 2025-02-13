import { Cycles, GrandLivreEntry } from '@/types/types';

// Définition du type pour les catégories de cycles
type CycleCategories = {
  'Trésorerie': string[];
  'Fournisseurs et Achats': string[];
  'Charges Externes': string[];
  'Clients et Ventes': string[];
  'Stocks': string[];
  'Immobilisations': string[];
  'Social': string[];
  'Fiscal': string[];
  'Capitaux': string[];
  'Autres Comptes': string[];
};

export const updateCycleData = (
  currentYearData: GrandLivreEntry[], 
  previousYearData: GrandLivreEntry[] | null, 
  currentCycles: Cycles
): Cycles => {
  // Copie des cycles actuels pour éviter la mutation directe
  const updatedCycles = { ...currentCycles };

  // Définition des catégories de cycles avec typage précis
  const cycleCategories: CycleCategories = {
    'Trésorerie': ['51', '53', '54', '58', '627', '66', '76', '16'],
    'Fournisseurs et Achats': ['40', '601', '602', '604', '605', '606', '607', '608', '609'],
    'Charges Externes': ['61', '62'],
    'Clients et Ventes': ['41', '70'],
    'Stocks': ['31', '32', '37', '603', '71'],
    'Immobilisations': ['20', '21', '22', '23', '24', '25', '26','27','28','681','675','775'],
    'Social': ['64', '42', '43'],
    'Fiscal': ['63', '44'],
    'Capitaux': ['10', '11', '12','13','14','15','74'],
    'Autres Comptes': ['46', '47', '48','49','65','67','75','77']
  };

  // Fonction pour calculer le progrès d'un cycle
  const calculateCycleProgress = (entries: GrandLivreEntry[], categoryAccounts: string[]) => {
    // Filtrer les entrées pertinentes pour ce cycle
    const relevantEntries = entries.filter(entry => 
      categoryAccounts.some(account => entry.compte.startsWith(account))
    );

    // Calcul des métriques
    const totalTransactions = relevantEntries.length;
    const totalDebit = relevantEntries.reduce((sum, entry) => sum + entry.montantDebit, 0);
    const totalCredit = relevantEntries.reduce((sum, entry) => sum + entry.montantCredit, 0);
    const totalAmount = totalDebit + totalCredit;

    // Calcul du progrès avec pondération
    const transactionProgress = Math.min(50, (totalTransactions / 50) * 50);
    const amountProgress = Math.min(50, (totalAmount / 100000) * 50);
    const progress = Math.round(transactionProgress + amountProgress);

    return {
      progress: progress,
      status: progress < 30 ? 'en_retard' : 
              progress < 70 ? 'en_cours' : 
              'termine',
      comments: 0, 
      tasks: totalTransactions
    };
  };

  // Mise à jour de chaque cycle
  Object.keys(cycleCategories).forEach(cycleName => {
    if (updatedCycles[cycleName]) {
      // Utiliser uniquement les données de l'année en cours
      updatedCycles[cycleName] = calculateCycleProgress(
        currentYearData, 
        cycleCategories[cycleName]
      );
    }
  });

  return updatedCycles;
};

// Fonction pour analyser et extraire des informations supplémentaires
export const analyzeGrandLivre = (entries: GrandLivreEntry[]) => {
  return {
    totalEntries: entries.length,
    totalDebit: entries.reduce((sum, entry) => sum + entry.montantDebit, 0),
    totalCredit: entries.reduce((sum, entry) => sum + entry.montantCredit, 0),
    dateRange: {
      earliest: entries.reduce((earliest, entry) => 
        (!earliest || entry.date < earliest) ? entry.date : earliest, 
        null as Date | null
      ),
      latest: entries.reduce((latest, entry) => 
        (!latest || entry.date > latest) ? entry.date : latest, 
        null as Date | null
      )
    },
    uniqueAccounts: [...new Set(entries.map(entry => entry.compte))],
    uniqueJournaux: [...new Set(entries.map(entry => entry.journal))],
    etablissements: [...new Set(entries.map(entry => entry.etablissement))]
  };
};

// Fonction pour extraire des statistiques par compte
export const extractAccountStatistics = (entries: GrandLivreEntry[]) => {
  const accountStatistics = entries.reduce((stats, entry) => {
    if (!stats[entry.compte]) {
      stats[entry.compte] = {
        totalDebit: 0,
        totalCredit: 0,
        transactions: 0,
        lastTransaction: null
      };
    }
    
    stats[entry.compte].totalDebit += entry.montantDebit;
    stats[entry.compte].totalCredit += entry.montantCredit;
    stats[entry.compte].transactions++;
    stats[entry.compte].lastTransaction = entry.date;
    
    return stats;
  }, {} as Record<string, {
    totalDebit: number,
    totalCredit: number,
    transactions: number,
    lastTransaction: Date | null
  }>);

  return accountStatistics;
};
