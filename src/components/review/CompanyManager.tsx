import React, { useState } from 'react';
import { Building2, Plus, FileSpreadsheet, Upload } from 'lucide-react';
import { UserData, CycleData, Cycles, Company } from '@/types/types';

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

  const defaultCycles: Cycles = {
    'Régularité': { 
      status: 'en_cours', 
      progress: 0, 
      comments: 0,
      tasks: 0 
    },
    'Trésorerie': { 
      status: 'en_cours', 
      progress: 0, 
      comments: 0,
      tasks: 0 
    },
    'Fournisseurs et Achats': { 
      status: 'en_cours', 
      progress: 0, 
      comments: 0,
      tasks: 0 
    },
    'Charges Externes': { 
      status: 'en_cours', 
      progress: 0, 
      comments: 0,
      tasks: 0 
    },
    'Clients et Ventes': { 
      status: 'en_cours', 
      progress: 0, 
      comments: 0,
      tasks: 0 
    },
    'Stocks': { 
      status: 'en_cours', 
      progress: 0, 
      comments: 0,
      tasks: 0 
    },
    'Immobilisations': { 
      status: 'en_cours', 
      progress: 0, 
      comments: 0,
      tasks: 0 
    },
    'Social': { 
      status: 'en_cours', 
      progress: 0, 
      comments: 0,
      tasks: 0 
    },
    'Fiscal': { 
      status: 'en_cours', 
      progress: 0, 
      comments: 0,
      tasks: 0 
    },
    'Capitaux': { 
      status: 'en_cours', 
      progress: 0, 
      comments: 0,
      tasks: 0 
    },
    'Autres Comptes': { 
      status: 'en_cours', 
      progress: 0, 
      comments: 0,
      tasks: 0 
    }
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
        {/* Le reste du code reste identique à votre version précédente */}
      </div>
    </div>
  );
};

export default CompanyManager;
