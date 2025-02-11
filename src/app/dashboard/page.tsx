'use client'; // Important pour les composants avec hooks côté client

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardComponent from '@/components/dashboard/DashboardComponent'; // Ajustez le chemin d'import

export default function DashboardPage() {
  const router = useRouter();
  const [company, setCompany] = useState({
    id: 'default-company-id',
    name: 'Ma Société'
  });

  useEffect(() => {
    // Vérification de l'authentification
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleCycleSelect = (cycle: string) => {
    console.log(`Cycle sélectionné : ${cycle}`);
    // Logique de navigation vers le cycle spécifique
    router.push(`/review/${company.id}/${cycle}`);
  };

  const handleCompanyChange = () => {
    // Logique de changement de société
    router.push('/companies');
  };

  return (
    <DashboardComponent 
      company={company}
      onCycleSelect={handleCycleSelect}
      onCompanyChange={handleCompanyChange}
    />
  );
}
