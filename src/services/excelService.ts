import { read, utils } from 'xlsx';
import { Cycles } from '@/types/types';

interface GLEntry {
  compte: string;
  libelle: string;
  debit: number;
  credit: number;
  solde: number;
}

const mapCompteToCycle = (compte: string): string => {
  const mappings = {
    '2': 'Immobilisations',
    '3': 'Stocks',
    '4': compte.startsWith('40') ? 'Fournisseurs et Achats' : 
         compte.startsWith('41') ? 'Clients et Ventes' : 'Autres Comptes',
    '5': 'Trésorerie',
    '6': compte.startsWith('60') ? 'Stocks' :
         compte.startsWith('61') || compte.startsWith('62') ? 'Charges Externes' :
         'Autres Comptes',
    '7': 'Clients et Ventes',
    '1': 'Capitaux'
  };

  const prefix = compte.charAt(0);
  return mappings[prefix] || 'Autres Comptes';
};

export const processGrandLivre = async (file: File): Promise<Record<string, GLEntry[]>> => {
  const buffer = await file.arrayBuffer();
  const workbook = read(buffer, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = utils.sheet_to_json<GLEntry>(worksheet);

  return data.reduce((acc, entry) => {
    const cycle = mapCompteToCycle(entry.compte);
    if (!acc[cycle]) acc[cycle] = [];
    acc[cycle].push(entry);
    return acc;
  }, {});
};

export const updateCycleData = (
  currentData: Record<string, GLEntry[]>,
  previousData: Record<string, GLEntry[]>,
  cycles: Cycles
) => {
  const updatedCycles = { ...cycles };

  Object.keys(currentData).forEach(cycle => {
    const currentEntries = currentData[cycle];
    const previousEntries = previousData?.[cycle] || [];

    // Calculer les variations
    const currentTotal = currentEntries.reduce((sum, e) => sum + e.solde, 0);
    const previousTotal = previousEntries.reduce((sum, e) => sum + e.solde, 0);
    const variation = currentTotal - previousTotal;

    // Mettre à jour le cycle
    if (updatedCycles[cycle]) {
      updatedCycles[cycle].progress = 25; // Initial progress
      updatedCycles[cycle].details = {
        currentTotal,
        previousTotal,
        variation,
        entries: currentEntries
      };
    }
  });

  return updatedCycles;
};
