import React from 'react';
import { Building2, CheckCircle2, AlertCircle, Clock, MessageSquare, CheckSquare } from 'lucide-react';

interface DashboardProps {
  company: {
    id: string;
    name: string;
  };
  onCycleSelect: (cycle: string) => void;
  onCompanyChange: () => void;
}

const DashboardComponent: React.FC<DashboardProps> = ({ company, onCycleSelect, onCompanyChange }) => {
  // Liste complète des cycles de révision
  const cycles = {
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

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'valide': return 'text-green-600 bg-green-100';
      case 'a_valider': return 'text-yellow-600 bg-yellow-100';
      case 'en_cours': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'valide': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'a_valider': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'en_cours': return <Clock className="h-5 w-5 text-blue-600" />;
      default: return null;
    }
  };

  const calculateGlobalProgress = () => {
    const total = Object.values(cycles).length;
    const completed = Object.values(cycles).filter(c => c.status === 'valide').length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête avec sélecteur de société */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tableau de Bord Révision</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCompanyChange}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Building2 className="h-5 w-5" />
              <span>Gérer les sociétés</span>
            </button>
          </div>
        </div>
      </div>

      {/* Avancement global */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Avancement Global</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>{calculateGlobalProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${calculateGlobalProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Grille des cycles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(cycles).map(([cycleName, cycleData]) => (
          <div
            key={cycleName}
            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onCycleSelect(cycleName)}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{cycleName}</h3>
              {getStatusIcon(cycleData.status)}
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Avancement</span>
                  <span>{cycleData.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${cycleData.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <span>{cycleData.comments} commentaires</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4 text-gray-400" />
                  <span>{cycleData.tasks} tâches</span>
                </div>
              </div>

              <div className={`text-center px-2 py-1 rounded-full text-sm ${getStatusColor(cycleData.status)}`}>
                {cycleData.status === 'valide' ? 'Validé' : 
                 cycleData.status === 'a_valider' ? 'À valider' : 
                 'En cours'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardComponent;
