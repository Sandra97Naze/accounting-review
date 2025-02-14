import { Company, GrandLivreEntry } from '@/types/types';

export const getCompanyGrandLivreData = (companyId: string): { 
  currentYearData: GrandLivreEntry[], 
  previousYearData: GrandLivreEntry[] 
} => {
  // Récupérer les sociétés depuis le localStorage
  const companiesData = localStorage.getItem('companies');
  
  if (!companiesData) {
    throw new Error('Aucune société trouvée');
  }

  const companies: Company[] = JSON.parse(companiesData);
  
  // Trouver la société correspondante
  const company = companies.find(c => c.id === companyId);
  
  if (!company) {
    throw new Error(`Société avec l'ID ${companyId} non trouvée`);
  }

  // Vérifier que les données de Grand Livre existent
  if (!company.grandLivre) {
    throw new Error('Données de Grand Livre non disponibles');
  }

  // Récupérer les données de l'année courante et précédente
  const currentYearData = company.grandLivre.currentYear || [];
  const previousYearData = company.grandLivre.previousYear || [];

  // Convertir en tableau plat si nécessaire
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
