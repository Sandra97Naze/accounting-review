import React, { useState } from 'react';
import { Building2, Plus, FileSpreadsheet, Upload } from 'lucide-react';

interface CompanyFiles {
  currentYearLedger?: File;
  previousYearLedger?: File;
  lastUpdate?: Date;
}

interface Company {
  id: string;
  name: string;
  siren: string;
  exercice: string;
  status: string;
  files?: CompanyFiles;
  cycles: {
    [key: string]: {
      status: string;
      progress: number;
    };
  };
}

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

  const defaultCycles = {
    'Régularité': { status: 'en_cours', progress: 0 },
    'Trésorerie': { status: 'en_cours', progress: 0 },
    'Fournisseurs et Achats': { status: 'en_cours', progress: 0 },
    'Charges Externes': { status: 'en_cours', progress: 0 },
    'Clients et Ventes': { status: 'en_cours', progress: 0 },
    'Stocks': { status: 'en_cours', progress: 0 },
    'Immobilisations': { status: 'en_cours', progress: 0 },
    'Social': { status: 'en_cours', progress: 0 },
    'Fiscal': { status: 'en_cours', progress: 0 },
    'Capitaux': { status: 'en_cours', progress: 0 },
    'Autres Comptes': { status: 'en_cours', progress: 0 }
  };

  const handleFileUpload = async (file: File, isCurrentYear: boolean, companyId: string) => {
    const updatedCompanies = companies.map(company => {
      if (company.id === companyId) {
        if (isCurrentYear) {
          if (company.files?.currentYearLedger) {
            const confirmReplace = window.confirm("Un grand livre N existe déjà. Voulez-vous le remplacer ?");
            if (!confirmReplace) return company;
          }
          return {
            ...company,
            files: {
              ...company.files,
              currentYearLedger: file,
              lastUpdate: new Date()
            }
          };
        } else {
          if (company.files?.previousYearLedger) {
            const confirmReplace = window.confirm("Un grand livre N-1 existe déjà. Voulez-vous le remplacer ?");
            if (!confirmReplace) return company;
          }
          return {
            ...company,
            files: {
              ...company.files,
              previousYearLedger: file,
              lastUpdate: new Date()
            }
          };
        }
      }
      return company;
    });
    setCompanies(updatedCompanies);
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
      
      setCompanies([...companies, company]);
      setNewCompany({ name: '', siren: '', exercice: '' });
      setShowNewCompanyForm(false);
    }
  };

  const calculateGlobalProgress = (company: Company) => {
    const cycleCount = Object.keys(company.cycles).length;
    const totalProgress = Object.values(company.cycles)
      .reduce((sum, cycle) => sum + cycle.progress, 0);
    return Math.round(totalProgress / cycleCount);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">Gestion des Sociétés</h2>
          <button
            onClick={() => setShowNewCompanyForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une société
          </button>
        </div>

        {showNewCompanyForm && (
          <div className="p-4 border-b bg-gray-50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la société
                </label>
                <input
                  type="text"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Nom de la société"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SIREN
                </label>
                <input
                  type="text"
                  value={newCompany.siren}
                  onChange={(e) => setNewCompany({...newCompany, siren: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Numéro SIREN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exercice
                </label>
                <input
                  type="text"
                  value={newCompany.exercice}
                  onChange={(e) => setNewCompany({...newCompany, exercice: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="2024"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={addCompany}
                  className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => setShowNewCompanyForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(company => (
            <div key={company.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium">{company.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">SIREN: {company.siren}</p>
                  <p className="text-sm text-gray-500">Exercice: {company.exercice}</p>
                </div>
                <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  {company.status}
                </div>
              </div>

              {/* Section des Grands Livres */}
              <div className="mt-4 space-y-3 border-t pt-4">
                <h4 className="font-medium">Grands Livres</h4>
                <div className="space-y-2">
                  <div>
                    <input
                      type="file"
                      id={`current-year-${company.id}`}
                      className="hidden"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, true, company.id);
                      }}
                    />
                    <label
                      htmlFor={`current-year-${company.id}`}
                      className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        Grand Livre N {company.files?.currentYearLedger ? "(Existant)" : ""}
                      </span>
                    </label>
                  </div>

                  <div>
                    <input
                      type="file"
                      id={`previous-year-${company.id}`}
                      className="hidden"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, false, company.id);
                      }}
                    />
                    <label
                      htmlFor={`previous-year-${company.id}`}
                      className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        Grand Livre N-1 {company.files?.previousYearLedger ? "(Existant)" : ""}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => onCompanySelect(company)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  Sélectionner
                </button>
                {company.files?.lastUpdate && (
                  <span className="text-xs text-gray-500">
                    Dernière mise à jour: {new Date(company.files.lastUpdate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyManager;
