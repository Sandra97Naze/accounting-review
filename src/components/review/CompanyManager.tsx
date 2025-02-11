import React, { useState } from 'react';
import { Building2, Plus, FileSpreadsheet } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  siren: string;
  exercice: string;
  status: string;
  cycles: Record<string, { status: string; progress: number }>;
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

  // Supprimer defaultCycles s'il n'est pas utilisé
  const addCompany = () => {
    if (newCompany.name && newCompany.siren) {
      const company: Company = {
        id: Date.now().toString(),
        ...newCompany,
        status: 'active',
        cycles: {
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
        }
      };
      
      setCompanies([...companies, company]);
      setNewCompany({ name: '', siren: '', exercice: '' });
      setShowNewCompanyForm(false);
    }
  };

  return (
    <div className="p-6">
      {/* ... Rest of your JSX ... */}
    </div>
  );
};

export default CompanyManager;
