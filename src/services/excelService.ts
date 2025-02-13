import { read, utils } from 'xlsx';
import { Cycles } from '@/types/types';

interface GLEntry {
  compte: string;
  libelle: string;
  debit: number;
  credit: number;
  solde: number;
}

type AccountMappings = { [key: string]: (compte: string) => string };

const mapCompteToCycle = (compte: string): string => {
  const mappings: AccountMappings = {
    '2': () => 'Immobilisations',
    '3': () => 'Stocks',
    '4': (compte) => 
      compte.startsWith('40') ? 'Fournisseurs et Achats' : 
      compte.startsWith('41') ? 'Clients et Ventes' : 'Autres Comptes',
    '5': () => 'Trésorerie',
    '6': (compte) => 
      compte.startsWith('60') ? 'Stocks' :
      compte.startsWith('61') || compte.startsWith('62') ? 'Charges Externes' :
      'Autres Comptes',
    '7': () => 'Clients et Ventes',
    '1': () => 'Capitaux'
  };

  const prefix = compte.charAt(0);
  return mappings[prefix] ? mappings[prefix](compte) : 'Autres Comptes';
};

  const prefix = compte.charAt(0);
  return mappings[prefix] || 'Autres Comptes';
};

export const processGrandLivre = async (file: File): Promise<Record<string, GLEntry[]>> => {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = read(buffer, { type: 'array' });
    
    if (!workbook.SheetNames.length) {
      console.warn('Le fichier Excel ne contient aucun onglet');
      return {};
    }
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json<GLEntry>(worksheet, { defval: '' });
    
    if (!data.length) {
      console.warn('Aucune donnée trouvée dans le fichier');
      return {};
    }

    return data.reduce((acc, entry) => {
      // Vérifier que l'entrée a un compte valide
      if (!entry.compte) return acc;
      
      const cycle = mapCompteToCycle(entry.compte);
      if (!acc[cycle]) acc[cycle] = [];
      acc[cycle].push(entry);
      return acc;
    }, {} as Record<string, GLEntry[]>);
  } catch (error) {
    console.error('Erreur lors du traitement du Grand Livre', error);
    return {};
  }
};

export const updateCycleData = (
  currentData: Record<string, GLEntry[]>,
  previousData: Record<string, GLEntry[]>,
  cycles: Cycles
) => {
  const updatedCycles = { ...cycles };
  
  Object.keys(currentData).forEach(cycle => {
    const currentEntries = currentData[cycle] || [];
    const previousEntries = previousData?.[cycle] || [];
    
    // Calculer les variations
    const currentTotal = currentEntries.reduce((sum, e) => sum + (e.solde || 0), 0);
    const previousTotal = previousEntries.reduce((sum, e) => sum + (e.solde || 0), 0);
    const variation = currentTotal - previousTotal;
    
    // Mettre à jour le cycle
    if (updatedCycles[cycle]) {
      updatedCycles[cycle] = {
        ...updatedCycles[cycle],
        progress: 25, // Initial progress
        details: {
          currentTotal,
          previousTotal,
          variation,
          entries: currentEntries
        }
      };
    }
  });
  
  return updatedCycles;
};
