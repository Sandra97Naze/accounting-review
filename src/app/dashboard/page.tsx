'use client';

import React, { useState } from 'react';
import DashboardPage from '@/components/dashboard/DashboardComponent';
import { Company, Cycles } from '@/types/types';

// Valeurs par défaut pour les props
const initialCycles: Cycles = {
  'Régularité': { progress: 40, status: 'en_cours', comments: 8, tasks: 4 },
  'Trésorerie': { progress: 60, status: 'en_cours', comments: 4, tasks: 3 },
  // ... (le reste de vos cycles initiaux)
};

const defaultCompany: Company = {
  id: 'company1',
  name: 'Ma Société',
  siren: '123456789',
  exercice: '2024',
  status: 'active',
  files: {},
  cycles: initialCycles
};

export default function Page() {
  // Simuler les états et gestionnaires
  const handleCycleSelect = (cycleName: string) => {
    // Logique de navigation vers le détail du cycle
  };

  const handleCompanyChange = () => {
    // Logique de changement de société
  };

  const handleCycleUpdate = () => {
    // Logique de mise à jour de cycle
  };

  return (
    <DashboardPage
      company={defaultCompany}
      cycles={initialCycles}
      onCycleSelect={handleCycleSelect}
      onCompanyChange={handleCompanyChange}
      onCycleUpdate={handleCycleUpdate}
    />
  );
}
