'use client';

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  ArrowLeft, 
  Save, 
  MessageSquare, 
  CheckSquare 
} from 'lucide-react';
import { UserData, CycleData, Company } from '@/types/types';
import { transformGrandLivreToDisplay } from '@/utils/transformData';
import GLDetails from './GLDetails';

interface CycleReviewProps {
  cycle: string;
  cycleData: CycleData;
  company: Company;
  user: UserData;
  onBack: () => void;
  onUpdate: (updates: Partial<CycleData>) => void;
  onFileUpload: (file: File, isCurrentYear: boolean) => void;
}

const CycleReviewComponent: React.FC<CycleReviewProps> = ({
  cycle,
  cycleData,
  company,
  user,
  onBack,
  onUpdate,
  onFileUpload
}) => {
  // État local pour les modifications
  const [localCycleData, setLocalCycleData] = useState<CycleData>(cycleData);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCurrentYear, setIsCurrentYear] = useState(true);

  // Gestionnaire de mise à jour des données du cycle
  const handleUpdateCycle = () => {
    onUpdate(localCycleData);
  };

  // Gestionnaire de téléchargement de fichier
  const handleFileUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile, isCurrentYear);
      setShowFileUpload(false);
      setSelectedFile(null);
    }
  };

  // Calcul des autorisations
  const canEdit = user.permissions.canEdit;
  const canValidate = user.permissions.canValidate;

  return (
    <div className="space-y-6 p-6">
      {/* En-tête avec bouton retour */}
      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={onBack} 
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">{cycle}</h1>
      </div>

      {/* Informations de la société */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">{company.name}</h2>
            <p className="text-gray-500">SIREN: {company.siren}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            cycleData.status === 'valide' ? 'bg-green-100 text-green-800' :
            cycleData.status === 'a_valider' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {cycleData.status === 'valide' ? 'Validé' : 
             cycleData.status === 'a_valider' ? 'À valider' : 
             'En cours'}
          </span>
        </div>
      </div>

      {/* Détails du cycle */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Progression
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${localCycleData.progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{localCycleData.progress}%</span>
          </div>
        </div>

        {/* Commentaires et tâches */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-gray-400" />
            <span>{localCycleData.comments} commentaires</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-gray-400" />
            <span>{localCycleData.tasks} tâches</span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex space-x-4">
          {canEdit && (
            <button 
              onClick={() => setShowFileUpload(!showFileUpload)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    
    {company.grandLivre.currentYear && (
      <GLDetails 
        data={transformGrandLivreToDisplay(
          company.grandLivre.currentYear,
          company.grandLivre.previousYear
        )} 
      />
    )}
    
    {/* ... reste du rendu ... */}
  </div>
            >
              <FileSpreadsheet className="h-5 w-5" />
              <span>Télécharger un fichier</span>
            </button>
          )}
          {canValidate && (
            <button 
              onClick={handleUpdateCycle}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Save className="h-5 w-5" />
              <span>Enregistrer les modifications</span>
            </button>
          )}
        </div>

        {/* Formulaire de téléchargement de fichier */}
        {showFileUpload && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de fichier
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={isCurrentYear}
                    onChange={() => setIsCurrentYear(true)}
                    className="form-radio"
                  />
                  <span className="ml-2">Grand livre N</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={!isCurrentYear}
                    onChange={() => setIsCurrentYear(false)}
                    className="form-radio"
                  />
                  <span className="ml-2">Grand livre N-1</span>
                </label>
              </div>
            </div>
            <div>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>
            <button 
              onClick={handleFileUpload}
              disabled={!selectedFile}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload className="h-5 w-5 inline mr-2" />
              Télécharger
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CycleReviewComponent;
