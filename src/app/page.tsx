'use client';

import React from 'react';
import { useState } from 'react';
import DashboardComponent from '@/components/dashboard/DashboardComponent';
import LoginComponent from '@/components/auth/LoginComponent';
import CompanyManager from '@/components/review/CompanyManager';
import CycleReviewComponent from '@/components/review/CycleReviewComponent';

const AccountingReviewApp = () => {
  const [user, setUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [currentView, setCurrentView] = useState('login');

  // Enlever l'état accountingData s'il n'est pas utilisé
  // const [accountingData, setAccountingData] = useState({
  //   currentYear: null,
  //   previousYear: null
  // });

  // Gestionnaires d'événements
  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('companies');
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setCurrentView('dashboard');
  };

  const handleCycleSelect = (cycle) => {
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
    setCurrentView('companies');
  };

  // Rendu conditionnel
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
