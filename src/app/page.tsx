'use client';

import DashboardComponent from '@/components/dashboard/DashboardComponent';
import LoginComponent from '@/components/auth/LoginComponent';
import CompanyManager from '@/components/review/CompanyManager';
import CycleReviewComponent from '@/components/review/CycleReviewComponent';
import React, { useState, useEffect } from 'react';
import { read, utils } from 'xlsx';

interface User {
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

interface Company {
  id: string;
  name: string;
  siren: string;
  exercice: string;
  status: string;
  cycles: {
    [key: string]: {
      status: string;
      progress: number;
    };
  };
}

const AccountingReviewApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'companies' | 'dashboard' | 'cycle'>('login');
  const [accountingData, setAccountingData] = useState({
    currentYear: null,
    previousYear: null
  });

  // Gestion de la connexion
  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView('companies');
  };

  // Sélection d'une société
  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setCurrentView('dashboard');
  };

  // Sélection d'un cycle
  const handleCycleSelect = (cycle: string) => {
    setSelectedCycle(cycle);
    setCurrentView('cycle');
  };

  // Retour au tableau de bord
  const handleBackToDashboard = () => {
    setSelectedCycle(null);
    setCurrentView('dashboard');
  };

  // Changement de société
  const handleCompanyChange = () => {
    setSelectedCompany(null);
    setSelectedCycle(null);
    setCurrentView('companies');
  };

  // Import des fichiers Excel
  const handleFileUpload = async (file: File, isCurrentYear: boolean) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer, {
        type: 'array',
        cellDates: true,
        cellStyles: true
      });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      setAccountingData(prev => ({
        ...prev,
        [isCurrentYear ? 'currentYear' : 'previousYear']: jsonData
      }));
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
    }
  };

  // Rendu conditionnel basé sur la vue courante
  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <LoginComponent onLogin={handleLogin} />;

      case 'companies':
        return <CompanyManager onCompanySelect={handleCompanySelect} />;

      case 'dashboard':
        return selectedCompany ? (
          <DashboardComponent
            company={selectedCompany}
            onCycleSelect={handleCycleSelect}
            onCompanyChange={handleCompanyChange}
          />
        ) : null;

      case 'cycle':
        return selectedCompany && selectedCycle && user ? (
          <CycleReviewComponent
            cycle={selectedCycle}
            company={selectedCompany}
            user={user}
            onBack={handleBackToDashboard}
            onFileUpload={handleFileUpload}
          />
        ) : null;

      default:
        return <div>Vue non trouvée</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de l'application */}
      {user && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Révision Comptable</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.email}</span>
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default AccountingReviewApp;
