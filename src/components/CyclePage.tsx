'use client';

import React, { useState, useEffect } from 'react';
import { useCycleManagement } from '@/hooks/useCycleManagement';
import { Company } from '@/types/types';
import { FeuilleTravail, Justificatif, BalanceEntry } from '@/types/CyclePageTypes';

// Créer des composants séparés pour chaque section
const FeuillesTravailSection: React.FC<{
  feuillesTravail: FeuilleTravail[];
  onAddFeuille: (file: File) => Promise<void>;
  onDeleteFeuille: (id: string) => Promise<void>;
}> = ({ feuillesTravail, onAddFeuille, onDeleteFeuille }) => {
  const [newFile, setNewFile] = useState<File | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewFile(file);
      await onAddFeuille(file);
    }
  };

  return (
    <div className="feuilles-travail-section">
      <h2>Feuilles de Travail</h2>
      <input 
        type="file" 
        accept=".xlsx,.xls" 
        onChange={handleFileUpload} 
      />
      <ul>
        {feuillesTravail.map((feuille) => (
          <li key={feuille.id}>
            {feuille.titre}
            <button onClick={() => onDeleteFeuille(feuille.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const JustificatifsSection: React.FC<{
  justificatifs: Justificatif[];
  cycleName: string;
}> = ({ justificatifs, cycleName }) => {
  const [newFile, setNewFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewFile(file);
      // Logique d'ajout de justificatif
    }
  };

  return (
    <div className="justificatifs-section">
      <h2>Justificatifs</h2>
      <input 
        type="file" 
        accept=".pdf,.xlsx,.xls,.jpg,.png" 
        onChange={handleFileUpload} 
      />
      <ul>
        {justificatifs.map((justificatif) => (
          <li key={justificatif.id}>
            {justificatif.titre}
            <button>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SyntheseCycleSection: React.FC<{
  balance: BalanceEntry[];
  cycleName: string;
}> = ({ balance, cycleName }) => {
  // Calculs de synthèse
  const totalSoldeN = balance.reduce((sum, entry) => sum + entry.soldeN, 0);
  const totalVariation = balance.reduce((sum, entry) => sum + entry.variationMontant, 0);

  return (
    <div className="synthese-cycle-section">
      <h2>Synthèse du Cycle {cycleName}</h2>
      <div>
        <p>Total Solde N: {totalSoldeN.toFixed(2)} €</p>
        <p>Variation Totale: {totalVariation.toFixed(2)} €</p>
      </div>
    </div>
  );
};

// Composant principal CyclePage
const CyclePage: React.FC<{ cycleName: string }> = ({ cycleName }) => {
  // État pour l'ID de la société active
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);

  // Utilisation du hook de gestion de cycle
  const { 
    balance, 
    feuillesTravail, 
    justificatifs, 
    loading, 
    error,
    addFeuilleTravail,
    deleteFeuilleTravail 
  } = useCycleManagement(cycleName, activeCompanyId || '');

  // Effet pour récupérer l'ID de la société active
  useEffect(() => {
    const fetchActiveCompany = () => {
      const companiesData = localStorage.getItem('companies');
      if (companiesData) {
        const companies = JSON.parse(companiesData);
        if (companies.length > 0) {
          setActiveCompanyId(companies[0].id);
        }
      }
    };

    fetchActiveCompany();
  }, []);

  // Gestion des états de chargement et d'erreur
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="cycle-page">
      <h1>Cycle : {cycleName}</h1>
      
      {/* Section Balance Comparative */}
      <div className="balance-section">
        <h2>Balance Comparative</h2>
        <table>
          <thead>
            <tr>
              <th>Compte</th>
              <th>Libellé</th>
              <th>Solde N</th>
              <th>Solde N-1</th>
              <th>Variation Montant</th>
              <th>Variation %</th>
            </tr>
          </thead>
          <tbody>
            {balance.map((entry, index) => (
              <tr key={index}>
                <td>{entry.compte}</td>
                <td>{entry.libelle}</td>
                <td>{entry.soldeN.toFixed(2)}</td>
                <td>{entry.soldeNMoins1.toFixed(2)}</td>
                <td>{entry.variationMontant.toFixed(2)}</td>
                <td>{entry.variationPourcentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sections supplémentaires */}
      <FeuillesTravailSection 
        feuillesTravail={feuillesTravail}
        onAddFeuille={addFeuilleTravail}
        onDeleteFeuille={deleteFeuilleTravail}
      />

      <JustificatifsSection 
        justificatifs={justificatifs}
        cycleName={cycleName}
      />

      <SyntheseCycleSection 
        balance={balance} 
        cycleName={cycleName} 
      />
    </div>
  );
};

export default CyclePage;
