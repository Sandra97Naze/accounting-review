'use client';

import React, { useState } from 'react';
import DashboardComponent from '../components/dashboard/DashboardComponent';
import LoginComponent from '../components/auth/LoginComponent';
import CompanyManager from '../components/review/CompanyManager';
import CycleReviewComponent from '../components/review/CycleReviewComponent';

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

const AccountingReviewApp = () => {
  // Ajoutez cette fonction dans le composant AccountingReviewApp
const handleFileUpload = (file: File, isCurrentYear: boolean) => {
  console.log('File uploaded:', file, 'isCurrentYear:', isCurrentYear);
};
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedCycle, setSelectedCycle] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'companies' | 'dashboard' | 'cycle'>('login');

  // Gestionnaires d'événements
  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setCurrentView('companies');
  };

  const handleCompanySelect = (company: any) => {
    setSelectedCompany(company);
    setCurrentView('dashboard');
  };

  const handleCycleSelect = (cycle: string) => {
    setSelectedCycle(cycle);
    setCurrentView('cycle');
  };

  const handleBackToDashboard = () => {
    setSelectedCycle(null);
    setCurrentView('dashboard');
  };

 const handleCompanyChange = () => {
  setSelectedCompany(null);
  setSelectedCycle(null);
  setCurrentView('companies');  // Ceci devrait afficher le CompanyManager
};

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
            onFileUpload={handleFileUpload}  // Ajout de cette prop
          />
        ) : null;
      default:
        return <div>Vue non trouvée</div>;
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
