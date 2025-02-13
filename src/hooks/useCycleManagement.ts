// hooks/useCycleManagement.ts
export const useCycleManagement = (cycleName: string, companyId: string) => {
  const [balance, setBalance] = useState<BalanceEntry[]>([]);
  const [feuillesTravail, setFeuillesTravail] = useState<FeuilleTravail[]>([]);
  const [justificatifs, setJustificatifs] = useState<Justificatif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCycleData = async () => {
      try {
        setLoading(true);
        const [balanceData, feuilles, docs] = await Promise.all([
          cycleService.getBalance(cycleName, companyId),
          cycleService.getFeuilesTravail(cycleName, companyId),
          cycleService.getJustificatifs(cycleName, companyId)
        ]);

        setBalance(balanceData);
        setFeuillesTravail(feuilles);
        setJustificatifs(docs);
      } catch (err) {
        setError('Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchCycleData();
  }, [cycleName, companyId]);

  const addFeuilleTravail = async (file: File) => {
    try {
      const newFeuille: FeuilleTravail = {
        id: generateUniqueId(),
        titre: `Feuille ${cycleName}`,
        type: getFileType(file),
        dateCreation: new Date(),
        fichier: file
      };

      await cycleService.addFeuilleTravail(newFeuille);
      setFeuillesTravail(prev => [...prev, newFeuille]);
    } catch (error) {
      setError('Erreur lors de l\'ajout de la feuille');
    }
  };

  const deleteFeuilleTravail = async (id: string) => {
    try {
      await cycleService.deleteFeuilleTravail(id);
      setFeuillesTravail(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      setError('Erreur lors de la suppression de la feuille');
    }
  };

  return {
    balance,
    feuillesTravail,
    justificatifs,
    loading,
    error,
    addFeuilleTravail,
    deleteFeuilleTravail
  };
};
