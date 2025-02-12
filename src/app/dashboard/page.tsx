'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Company, Cycles, CycleData, UserData } from '@/types/types';
import DashboardComponent from '@/components/dashboard/DashboardComponent';
import CompanyManager from '@/components/review/CompanyManager';

export default function DashboardPage() {
  const router = useRouter();
  
  // Utilisateur par défaut
  const defaultUser: UserData = {
    email: 'user@example.com',
    role: 'user',
    permissions: {
      canValidate: true,
      canEdit: true,
      canComment: true,
      canExport: false,
      canAssignTasks: true
    }
  };

  // État initial des cycles
  const initialCycles: Cycles = {
    'Régularité': { progress: 40, status: 'en_cours', comments: 8, tasks: 4 },
    'Trésorerie': { progress: 60, status: 'en_cours', comments: 4, tasks: 3 },
    'Fournisseurs et Achats': { progress: 90, status: 'a_valider', comments: 6, tasks: 2 },
    'Charges Externes': { progress: 45, status: 'en_cours', comments: 10, tasks: 5 },
    'Clients et Ventes': { progress: 30, status: 'en_cours', comments: 15, tasks: 8 },
    'Stocks': { progress: 100, status: 'valide', comments: 8, tasks: 0 },
    'Immobilisations': { progress: 75, status: 'en_cours', comments: 12, tasks: 5 },
    'Social': { progress: 55, status: 'en_cours', comments: 9, tasks: 4 },
    'Fiscal': { progress: 70, status: 'a_valider', comments: 7, tasks: 3 },
    'Capitaux': { progress: 100, status: 'valide', comments: 7, tasks: 0 },
    'Autres Comptes': { progress: 25, status: 'en_cours', comments: 5, tasks: 2 }
  };

  // États
  const [company, setCompany] = useState<Company | null>(null);
  const [cycles, setCycles] = useState<Cycles>(initialCycles);
  const [showCompanyManager, setShowCompanyManager] = useState(true);

  // Fonctions de support
  async function fetchUserCompany(userEmail: string): Promise<Company | null> {
    // Simulation de récupération de l'entreprise
    if (userEmail) {
      return {
        id: 'company1',
        name: 'Ma Société',
        siren: '123456789',
        exercice: '2024',
        status: 'active',
        files: {},
        cycles: initialCycles
      };
    }
    return null;
  }

  async function fetchCompanyCycles(companyId: string): Promise<Cycles> {
    // Simulation de récupération des cycles
    return companyId ? initialCycles : {};
  }

  async function updateCycle(
    companyId: string, 
    cycleName: string, 
    updates: Partial<CycleData>
  ): Promise<void> {
    // Simulation de mise à jour de cycle
    console.log(`Mise à jour du cycle ${cycleName} pour l'entreprise ${companyId}`, updates);
  }

  // Gestionnaire de sélection de cycle
  const handleCycleSelect = (cycleName: string) => {
    // Navigation vers le détail du cycle
    router.push(`/dashboard/cycle/${encodeURIComponent(cycleName)}`);
  };

  // Gestionnaire de changement de société
  const handleCompanyChange = () => {
    setShowCompanyManager(true);
  };

  // Gestionnaire de sélection de société
  const handleCompanySelect = async (selectedCompany: Company) => {
    setCompany(selectedCompany);
    
    try {
      // Charger les cycles de la nouvelle entreprise
      const loadedCycles = await fetchCompanyCycles(selectedCompany.id);
      setCycles(loadedCycles);
      
      setShowCompanyManager(false);
    } catch (err) {
      console.error('Erreur lors de la sélection de l\'entreprise', err);
    }
  };

  // Gestionnaire de mise à jour de cycle
  const handleCycleUpdate = async (cycleName: string, updates: Partial<CycleData>) => {
    if (!company) return;

    try {
      // Mise à jour locale
      setCycles(prevCycles => ({
        ...prevCycles,
        [cycleName]: {
          ...prevCycles[cycleName],
          ...updates
        }
      }));

      // Synchronisation avec le backend
      await updateCycle(company.id, cycleName, updates);
    } catch (err) {
      console.error('Erreur de mise à jour du cycle', err);
      
      // Annuler la mise à jour locale en cas d'erreur
      setCycles(prevCycles => ({
        ...prevCycles,
        [cycleName]: prevCycles[cycleName]
      }));
    }
  };

  // Affichage conditionnel
  if (showCompanyManager || !company) {
    return (
      <CompanyManager 
        onCompanySelect={handleCompanySelect} 
      />
    );
  }

  return (
    <DashboardComponent
      company={company}
      cycles={cycles}
      onCycleSelect={handleCycleSelect}
      onCompanyChange={handleCompanyChange}
      onCycleUpdate={handleCycleUpdate}
    />
  );
}
