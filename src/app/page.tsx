'use client';

import React from 'react';
import AccountingReviewApp from '@/components/AccountingReviewApp';

export default function Page() {
  return <AccountingReviewApp />;
}
  const handleLogout = () => {
    setUser(null);
    setSelectedCompany(null);
    setSelectedCycle(null);
    setCurrentView('login');
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
                {/* Ajouter le bouton de déconnexion */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:text-red-800"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
     )
