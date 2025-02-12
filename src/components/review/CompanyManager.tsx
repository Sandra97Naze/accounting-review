'use client';

import React, { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { Company, Cycles } from '@/types/types';

interface CompanyManagerProps {
  onCompanySelect: (company: Company) => void;
}

const CompanyManager: React.FC<CompanyManagerProps> = ({ onCompanySelect }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    siren: '',
    exercice: ''
  });

  // Cycles par défaut
  const defaultCycles: Cycles = {
    'Régularité': { progress: 0, status: 'en_cours', comments: 0, tasks: 0 },
    'Trésorerie': { progress: 0, status: 'en_cours', comments: 0, tasks: 0 },
    'Fournisseurs et Achats': { progress: 0, status: 'en_cours', comments: 0, tasks: 0 },
    'Charges Externes': { progress: 0, status: 'en_cours', comments: 0, tasks: 0 },
    'Clients et Ventes': { progress: 0, status: 'en_cours', comments: 0, tasks: 0 },
    'Stocks': { progress: 0, status: 'en_cours', comments: 0, tasks: 0 },
    'Immobilisations': { progress: 0, status: 'en_cours', comments: 0, tasks: 0 },
    'Social': { progress: 0, status: 'en_cours', comments: 0, tasks: 0 },
    'Fiscal': { progress: 0, status: 'en_cours', comments: 0, tasks: 0 },
    'Capitaux': { progress: 0, status: 'en_cours', comments: 0, tasks: 0 },
    'Autres Comptes': { progress: 0, status: 'en_cours', comments: 0, tasks: 0 }
  };

  const addCompany = () => {
    if (newCompany.name && newCompany.siren) {
      const company: Company = {
        id: Date.now().toString(),
        ...newCompany,
        status: 'active',
        files: {},
        cycles: defaultCycles
      };
      
      // Stocker dans localStorage
      localStorage.setItem('selectedCompany', JSON.stringify(company));
      
      // Mettre à jour la liste des sociétés
      setCompanies([...companies, company]);
      
      // Sélectionner la société
      onCompanySelect(company);
      
      // Réinitialiser le formulaire
      setNewCompany({ name: '', siren: '', exercice: '' });
      setShowNewCompanyForm(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold mb-4">Gestion des Sociétés</h1>
        
        {/* Liste des sociétés existantes */}
        {companies.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Sociétés existantes</h2>
            {companies.map((company) => (
              <div 
                key={company.id} 
                className="flex justify-between items-center p-2 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  // Stocker dans localStorage
                  localStorage.setItem('selectedCompany', JSON.stringify(company));
                  onCompanySelect(company);
                }}
              >
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-gray-500">SIREN: {company.siren}</p>
                </div>
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            ))}
          </div>
        )}

        {/* Bouton pour ajouter une nouvelle société */}
        <button 
          onClick={() => setShowNewCompanyForm(!showNewCompanyForm)}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une nouvelle société
        </button>

        {/* Formulaire de nouvelle société */}
        {showNewCompanyForm && (
          <div className="mt-4 space-y-4">
            <input 
              type="text"
              placeholder="Nom de la société"
              value={newCompany.name}
              onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
            <input 
              type="text"
              placeholder="SIREN"
              value={newCompany.siren}
              onChange={(e) => setNewCompany({...newCompany, siren: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
            <input 
              type="text"
              placeholder="Exercice"
              value={newCompany.exercice}
              onChange={(e) => setNewCompany({...newCompany, exercice: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
            <button 
              onClick={addCompany}
              className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
            >
              Créer la société
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyManager;
