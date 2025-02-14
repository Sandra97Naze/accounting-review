'use client';

import { Company } from '@/types/types';
import { useCycleManagement } from '@/hooks/useCycleManagement';
import { getCompanyGrandLivreData } from '@/services/companyService';
import { formatCurrency } from '@/utils/formatHelpers';
import CycleProgressBar from '@/components/CycleProgressBar';

const AccountingReviewApp: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'companies' | 'dashboard'>('login');

  // Cycles par défaut
  const defaultCycles: Cycles = {
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
  };

  // Vérification de l'authentification au chargement
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const storedCompanyData = localStorage.getItem('selectedCompany');

    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUser(userData);
      
      if (storedCompanyData) {
        const companyData = JSON.parse(storedCompanyData);
        setSelectedCompany(companyData);
        setCurrentView('dashboard');
      } else {
        setCurrentView('companies');
      }
    } else {
      setCurrentView('login');
    }
  }, []);

  // Gestionnaire de connexion
  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setCurrentView('companies');
  };

  // Gestionnaire de sélection de société
  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setCurrentView('dashboard');
  };

  // Gestionnaire de changement de société
  const handleCompanyChange = () => {
    setCurrentView('companies');
  };

  const handleCycleUpdate = (cycleName: string, updates: Partial<CycleData>) => {
  if (selectedCompany && selectedCompany.cycles) {
    const updatedCompany: Company = {
      ...selectedCompany,
      cycles: {
        ...selectedCompany.cycles,
        [cycleName]: {
          ...selectedCompany.cycles[cycleName],
          ...updates
        }
      }
    };

    // Mettre à jour localStorage et l'état
    localStorage.setItem('selectedCompany', JSON.stringify(updatedCompany));
    setSelectedCompany(updatedCompany);
  }
};

  // Gestion de la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedCompany');
    setUser(null);
    setSelectedCompany(null);
    setCurrentView('login');
  };

  // Rendu conditionnel
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginComponent onLogin={handleLogin} />;
      case 'companies':
        return <CompanyManager onCompanySelect={handleCompanySelect} />;
    case 'dashboard':
  return selectedCompany ? (
    <DashboardComponent
      company={selectedCompany}
      cycles={selectedCompany.cycles ?? defaultCycles}
      onCycleSelect={(cycleName) => {/* Logique de navigation vers le détail du cycle */}}
      onCompanyChange={handleCompanyChange}
      onCycleUpdate={handleCycleUpdate}
    />
  ) : null;
      default:
        return <LoginComponent onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-xl font-bold">Révision Comptable</h1>
              <div className="flex items-center space-x-4">
                <span>{user.email}</span>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
};

export default AccountingReviewApp;
