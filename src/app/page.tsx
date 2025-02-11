'use client';
import React, { useState } from 'react';
import DashboardComponent from '../components/dashboard/DashboardComponent';
import LoginComponent from '../components/auth/LoginComponent';
import CompanyManager from '../components/review/CompanyManager';
import CycleReviewComponent from '../components/review/CycleReviewComponent';

// Interfaces
interface UserData {
  email: string;
  role: string;
  permissions: {
    canValidate: boolean;
    canEdit: boolean;
    canComment: boolean;
    canExport: boolean;
    canAssignTasks: boolean;
  };
}

interface CycleData {
  progress: number;
  status: 'en_cours' | 'a_valider' | 'valide';
  comments: number;
  tasks: number;
}

interface Cycles {
  [key: string]: CycleData;
}

const AccountingReviewApp = () => {
  // États utilisateur et navigation
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedCycle, setSelectedCycle] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'companies' | 'dashboard' | 'cycle'>('login');

  // État des cycles
  const [cycles, setCycles] = useState<Cycles>({
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
  });

  // Gestionnaires d'événements
  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setCurrentView('companies');
  };

  const handleCompanySelect = (company: any) => {
    setSelectedCompany(company);
    setCurrentView('dashboard');
  };

  const handleCompanyChange = () => {
    setCurrentView('companies');
  };

 const handleCycleSelect = (cycle: string) => {
  console.log('1. handleCycleSelect appelé avec cycle:', cycle);
  setSelectedCycle(cycle);
  console.log('2. selectedCycle mis à jour:', cycle);
  setCurrentView('cycle');
  console.log('3. currentView mis à jour à: cycle');
};


  const handleBackToDashboard = () => {
    setSelectedCycle(null);
    setCurrentView('dashboard');
  };

  // Gestionnaire de mise à jour des cycles
  const handleCycleUpdate = (cycleName: string, updates: Partial<CycleData>) => {
    setCycles(prevCycles => ({
      ...prevCycles,
      [cycleName]: {
        ...prevCycles[cycleName],
        ...updates
      }
    }));
  };

  const renderCurrentView = () => {
    if (!user) {
      return <LoginComponent onLogin={handleLogin} />;
    }

    switch (currentView) {
      case 'companies':
        return <CompanyManager onCompanySelect={handleCompanySelect} />;
      case 'dashboard':
        return selectedCompany ? (
          <DashboardComponent
            company={selectedCompany}
            onCycleSelect={handleCycleSelect}
            onCompanyChange={handleCompanyChange}
            cycles={cycles}
            onCycleUpdate={handleCycleUpdate}
          />
        ) : null;
      case 'cycle':
        return selectedCompany && selectedCycle ? (
          <CycleReviewComponent
            cycle={selectedCycle}
            cycleData={cycles[selectedCycle]}
            company={selectedCompany}
            user={user}
            onBack={handleBackToDashboard}
            onUpdate={(updates) => handleCycleUpdate(selectedCycle, updates)}
            onFileUpload={(file, isCurrentYear) => console.log(file, isCurrentYear)}
          />
        ) : null;
      default:
        return <CompanyManager onCompanySelect={handleCompanySelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Révision Comptable</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span>{user.email}</span>
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default AccountingReviewApp;
