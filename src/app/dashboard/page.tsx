'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { Company, Cycles, CycleData } from '@/types/types';

export default function Page() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [cycles, setCycles] = useState<Cycles>({});

  // Cycles par défaut complets
  const defaultCycles: Cycles = {
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

  useEffect(() => {
    // Récupération des données de société depuis localStorage
    const storedCompanyData = localStorage.getItem('selectedCompany');
    
    console.log('Données de société stockées:', storedCompanyData);

    if (storedCompanyData) {
      try {
        const parsedCompany = JSON.parse(storedCompanyData);
        
        // Utiliser les cycles de la société ou les cycles par défaut
        const companyCycles = parsedCompany.cycles || defaultCycles;
        
        setCompany(parsedCompany);
        setCycles(companyCycles);

        console.log('Cycles récupérés:', companyCycles);
      } catch (error) {
        console.error('Erreur de parsing des données de société:', error);
        
        // Réinitialiser si les données sont corrompues
        localStorage.removeItem('selectedCompany');
        router.push('/companies');
      }
    } else {
      // Si aucune société n'est stockée, utiliser les cycles par défaut
      setCompany(null);
      setCycles(defaultCycles);
      router.push('/companies');
    }
  }, [router]);

  // Gestionnaires d'événements
  const handleCycleSelect = (cycleName: string) => {
    router.push(`/dashboard/cycle/${encodeURIComponent(cycleName)}`);
  };

  const handleCompanyChange = () => {
    router.push('/companies');
  };

  const handleCycleUpdate = (cycleName: string, updates: Partial<CycleData>) => {
    const updatedCycles = {
      ...cycles,
      [cycleName]: {
        ...cycles[cycleName],
        ...updates
      }
    };

    // Mettre à jour localStorage
    if (company) {
      localStorage.setItem('selectedCompany', JSON.stringify({
        ...company,
        cycles: updatedCycles
      }));
    }

    setCycles(updatedCycles);
  };

  // Si pas de données chargées, afficher un chargement
  if (!company) {
    return <div>Chargement...</div>;
  }

  return (
    <DashboardPage
      company={company}
      cycles={cycles}
      onCycleSelect={handleCycleSelect}
      onCompanyChange={handleCompanyChange}
      onCycleUpdate={handleCycleUpdate}
    />
  );
}
