'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Company, Cycles, CycleData, UserData } from '@/src/types';
import DashboardComponent from '@/components/dashboard/DashboardComponent';
import CompanyManager from '@/components/review/CompanyManager';
import { getSession } from '@/lib/auth'; // Supposons une fonction d'authentification

export default function DashboardPage() {
  const router = useRouter();
  
  // États de chargement et d'erreur
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États de l'utilisateur et de l'entreprise
  const [user, setUser] = useState<UserData | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [cycles, setCycles] = useState<Cycles>({});
  const [showCompanyManager, setShowCompanyManager] = useState(true);

  // Effet pour charger la session et les données initiales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Charger la session utilisateur
        const sessionUser = await getSession();
        if (!sessionUser) {
          router.push('/login');
          return;
        }
        setUser(sessionUser);

        // Vérifier les permissions
        if (!sessionUser.permissions.canViewDashboard) {
          setError('Vous n\'avez pas les permissions requises');
          return;
        }

        // Charger les données de l'entreprise (à implémenter)
        const loadedCompany = await fetchUserCompany(sessionUser.email);
        
        if (loadedCompany) {
          setCompany(loadedCompany);
          setShowCompanyManager(false);
          
          // Charger les cycles de l'entreprise
          const loadedCycles = await fetchCompanyCycles(loadedCompany.id);
          setCycles(loadedCycles);
        } else {
          setShowCompanyManager(true);
        }
      } catch (err) {
        setError('Erreur de chargement des données');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Gestionnaire de sélection de cycle avec navigation
  const handleCycleSelect = (cycleName: string) => {
    if (!company) return;

    // Navigation vers la page de détail du cycle
    router.push(`/dashboard/cycle/${encodeURIComponent(cycleName)}?companyId=${company.id}`);
  };

  // Gestionnaire de changement de société
  const handleCompanyChange = () => {
    setShowCompanyManager(true);
  };

  // Gestionnaire de sélection de société
  const handleCompanySelect = async (selectedCompany: Company) => {
    try {
      setIsLoading(true);
      setCompany(selectedCompany);
      
      // Charger les cycles de la nouvelle entreprise
      const loadedCycles = await fetchCompanyCycles(selectedCompany.id);
      setCycles(loadedCycles);
      
      setShowCompanyManager(false);
    } catch (err) {
      setError('Erreur lors de la sélection de l\'entreprise');
      console.error(err);
    } finally {
      setIsLoading(false);
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
      setError('Erreur de mise à jour du cycle');
      console.error(err);
      
      // Annuler la mise à jour locale en cas d'erreur
      setCycles(prevCycles => ({
        ...prevCycles,
        [cycleName]: prevCycles[cycleName]
      }));
    }
  };

  // Gestion des états de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-red-600 p-6 rounded-lg bg-white shadow">
          <h2 className="text-xl font-bold mb-4">Erreur</h2>
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setShowCompanyManager(true);
            }} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

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

// Fonctions de support (à implémenter selon votre backend)
async function fetchUserCompany(userEmail: string): Promise<Company | null> {
  // Logique de récupération de l'entreprise associée à l'utilisateur
  return null;
}

async function fetchCompanyCycles(companyId: string): Promise<Cycles> {
  // Logique de récupération des cycles pour une entreprise
  return {};
}

async function updateCycle(
  companyId: string, 
  cycleName: string, 
  updates: Partial<CycleData>
): Promise<void> {
  // Logique de mise à jour du cycle côté serveur
}
