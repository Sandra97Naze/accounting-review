'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Upload } from 'lucide-react';
import { Company, Cycles, GrandLivreEntry } from '@/types/types';
import { processGrandLivre } from '@/utils/processGrandLivre';
import { updateCycleData, analyzeGrandLivre } from '@/utils/cycleUtils';

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

  // Cycles par défaut (votre implémentation actuelle)
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

  useEffect(() => {
    // Charger les sociétés depuis le localStorage
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
  }, []);

const addCompany = () => {
  if (newCompany.name && newCompany.siren) {
    try {
      const company: Company = {
        id: Date.now().toString(),
        ...newCompany,
        status: 'active',
        files: {},
        cycles: defaultCycles,
        grandLivre: {
          lastUpdate: new Date(),
          currentYear: {},
          previousYear: {}, // Requis même vide initialement
        }
      };
      
      const updatedCompanies = [...companies, company];
      localStorage.setItem('companies', JSON.stringify(updatedCompanies));
      setCompanies(updatedCompanies);
      onCompanySelect(company);
      setNewCompany({ name: '', siren: '', exercice: '' });
      setShowNewCompanyForm(false);
    } catch (error) {
      console.error("Erreur lors de la création de la société:", error);
      // Ajouter un message d'erreur pour l'utilisateur si nécessaire
    }
  }
};

const handleFileUpload = async (
  file: File, 
  companyId: string, 
  yearType: 'currentYear' | 'previousYear'
) => {
  try {
    const processedData: GrandLivreEntry[] = await processGrandLivre(file);

    const updatedCompanies = companies.map(company => {
      if (company.id === companyId) {
        const updatedGrandLivre = {
          ...company.grandLivre,
          [yearType]: processedData
        };

        // Analyser les données
        const analysis = analyzeGrandLivre(processedData);
        console.log('Analyse du Grand Livre:', analysis);

        const currentYearData = yearType === 'currentYear' 
          ? processedData 
          : company.grandLivre?.currentYear || [];

        const previousYearData = yearType === 'previousYear' 
          ? processedData 
          : company.grandLivre?.previousYear || [];

        const currentYearEntries = Array.isArray(currentYearData) 
          ? currentYearData 
          : Object.values(currentYearData).flat();
        
        const previousYearEntries = Array.isArray(previousYearData) 
          ? previousYearData 
          : Object.values(previousYearData).flat();

        const updatedCycles = updateCycleData(
          currentYearEntries,
          previousYearData ? previousYearEntries : null,
          company.cycles
        );

        return {
          ...company,
          grandLivre: updatedGrandLivre,
          cycles: updatedCycles
        };
      }
      return company;
    });

    // Mettre à jour l'état et le localStorage
    setCompanies(updatedCompanies);
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));

  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
  }
};

const validateCompanyData = (company: Company): boolean => {
  if (!company.grandLivre) return false;
  if (!company.grandLivre.previousYear) return false;
  if (Object.keys(company.grandLivre.previousYear).length === 0) return false;
  return true;
};
  // Composant pour le téléchargement de fichiers
  const FileUploadButton = ({ companyId }: { companyId: string }) => {
    const handleFileChange = async (
      event: React.ChangeEvent<HTMLInputElement>, 
      yearType: 'currentYear' | 'previousYear'
    ) => {
      const file = event.target.files?.[0];
      if (file) {
        await handleFileUpload(file, companyId, yearType);
      }
    };

    return (
      <div className="flex space-x-2">
        <label className="cursor-pointer">
          <input 
            type="file" 
            accept=".xlsx,.xls" 
            onChange={(e) => handleFileChange(e, 'currentYear')}
            className="hidden" 
          />
          <span className="bg-blue-500 text-white p-2 rounded inline-flex items-center">
            <Upload className="mr-2 h-4 w-4" /> 
            Grand Livre Année Courante
          </span>
        </label>
        <label className="cursor-pointer">
          <input 
            type="file" 
            accept=".xlsx,.xls" 
            onChange={(e) => handleFileChange(e, 'previousYear')}
            className="hidden" 
          />
          <span className="bg-green-500 text-white p-2 rounded inline-flex items-center">
            <Upload className="mr-2 h-4 w-4" /> 
            Grand Livre Année Précédente
          </span>
        </label>
      </div>
    );
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
                className="flex justify-between items-center p-2 border-b hover:bg-gray-100"
              >
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-gray-500">SIREN: {company.siren}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Boutons de téléchargement de fichiers */}
                  <FileUploadButton companyId={company.id} />
                  
                  {/* Icône de sélection de société */}
                  <Building2 
                    className="h-5 w-5 text-blue-600 cursor-pointer" 
                    onClick={() => onCompanySelect(company)} 
                  />
                </div>
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
