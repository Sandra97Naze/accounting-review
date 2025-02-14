// src/services/companyService.ts
import { Company, GrandLivreEntry } from '@/types/types';

export const getCompanyGrandLivreData = (companyId: string): { 
  currentYearData: GrandLivreEntry[], 
  previousYearData: GrandLivreEntry[] 
} => {
  // Vérification côté serveur pour éviter les erreurs de localStorage
  if (typeof window === 'undefined') {
    return {
      currentYearData: [],
      previousYearData: []
    };
  }

  const companiesData = localStorage.getItem('companies');
  
  if (!companiesData) {
    throw new Error('Aucune société trouvée');
  }

  const companies: Company[] = JSON.parse(companiesData);
  
  const company = companies.find(c => c.id === companyId);
  
  if (!company) {
    throw new Error(`Société avec l'ID ${companyId} non trouvée`);
  }

  if (!company.grandLivre) {
    throw new Error('Données de Grand Livre non disponibles');
  }

  const currentYearData = company.grandLivre.currentYear || [];
  const previousYearData = company.grandLivre.previousYear || [];

  const currentYearEntries = Array.isArray(currentYearData) 
    ? currentYearData 
    : Object.values(currentYearData).flat();
  
  const previousYearEntries = Array.isArray(previousYearData) 
    ? previousYearData 
    : Object.values(previousYearData).flat();

  return {
    currentYearData: currentYearEntries,
    previousYearData: previousYearEntries
  };
};
