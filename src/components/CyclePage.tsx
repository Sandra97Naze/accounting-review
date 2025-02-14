'use client';

import React, { useState } from 'react';
import { useCycleManagement } from '@/hooks/useCycleManagement';
import { Company } from '@/types/types';

interface CyclePageProps {
  cycleName: string;
}

const CyclePage: React.FC<{ cycleName: string }> = ({ cycleName }) => {
  const [balanceEntries, setBalanceEntries] = useState<BalanceEntry[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);

  const { 
    balance, 
    feuillesTravail, 
    justificatifs, 
    loading, 
    error,
    addFeuilleTravail,
    deleteFeuilleTravail 
  } = useCycleManagement(cycleName, activeCompanyId);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur : {error}</div>;


  return (
    <div className="cycle-page">
    <h1>Cycle : {cycleName}</h1>
      
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
                <td>{entry.soldeN}</td>
                <td>{entry.soldeNMoins1}</td>
                <td>{entry.variationMontant}</td>
                <td>{entry.variationPourcentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feuilles de Travail */}
      <FeuillesTravailSection 
        feuillesTravail={feuillesTravail}
        onAddFeuille={addFeuilleTravail}
        onDeleteFeuille={deleteFeuilleTravail}
      />

      {/* Justificatifs */}
      <JustificatifsSection 
        justificatifs={justificatifs}
        cycleName={cycleName}
      />

      {/* Synthèse du Cycle */}
      <SyntheseCycleSection 
        balance={balance} 
        cycleName={cycleName} 
      />
    </div>
  );
};

  // Gestionnaires pour les feuilles de travail
  const handleAjouterFeuille = async (file: File) => {
    try {
      const nouvelleFeuille: FeuilleTravail = {
        id: Date.now().toString(),
        titre: `Feuille ${cycleName} - ${feuillesTravail.length + 1}`,
        type: file.name.endsWith('.xlsx') ? 'xlsx' : 'xls',
        dateCreation: new Date(),
        fichier: file
      };

      // Logique d'upload côté serveur
      await uploadFeuilleService(nouvelleFeuille);

      setFeuillesTravail(prev => [...prev, nouvelleFeuille]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout', error);
    }
  };

  const handleSupprimerFeuille = async (id: string) => {
    try {
      // Logique de suppression côté serveur
      await deleteFeuilleService(id);

      setFeuillesTravail(prev => 
        prev.filter(feuille => feuille.id !== id)
      );
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
    }
  };

  // Gestionnaires similaires pour les justificatifs
  const handleAjouterJustificatif = async (file: File) => {
    // Logique similaire à handleAjouterFeuille
  };

  const handleSupprimerJustificatif = async (id: string) => {
    // Logique similaire à handleSupprimerFeuille
  };

  // Reste du composant (rendu)
  return (
    // Composants précédents
  );
};
export default CyclePage;
