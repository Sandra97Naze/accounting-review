// Dans votre composant CyclePage
import { getCompanyGrandLivreData } from '@/services/companyGrandLivreService';
import { calculateBalanceForCycle } from '@/services/balanceService'; // Votre service de calcul de balance

const CyclePage: React.FC<{ cycleName: string }> = ({ cycleName }) => {
  const [balanceEntries, setBalanceEntries] = useState<BalanceEntry[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);

  // components/CyclePage.tsx
const CyclePage: React.FC<{ cycleName: string }> = ({ cycleName }) => {
  const { 
    balance, 
    feuillesTravail, 
    justificatifs, 
    loading, 
    error,
    addFeuilleTravail,
    deleteFeuilleTravail 
  } = useCycleManagement(cycleName, activeCompanyId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="cycle-page">
      {/* Balance Comparative */}
      <BalanceComparativeSection 
        entries={balance} 
        cycleName={cycleName} 
      />

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
