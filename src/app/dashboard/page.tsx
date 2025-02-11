'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardComponent from '@/components/dashboard/DashboardComponent';

export default function DashboardPage() {
  const router = useRouter();
  const [company, setCompany] = useState({
    id: 'default-company-id',
    name: 'Ma Société'
  });

  useEffect(() => {
    // Vérification de l'authentification
    const checkAuth = () => {
      // Utiliser userData au lieu de authToken
      const userData = localStorage.getItem('userData');
      
      if (!userData) {
        router.push('/login');
        return;
      }

      // Optionnel : Récupérer la société de l'utilisateur
      const parsedUserData = JSON.parse(userData);
      setCompany({
        id: parsedUserData.companyId || 'default-company-id',
        name: parsedUserData.companyName || 'Ma Société'
      });
    };

    checkAuth();
  }, [router]);

  const handleCycleSelect = (cycle: string) => {
    console.log(`Cycle sélectionné : ${cycle}`);
    router.push(`/review/${company.id}/${cycle}`);
  };

  const handleCompanyChange = () => {
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
