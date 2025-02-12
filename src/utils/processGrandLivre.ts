import * as XLSX from 'xlsx';

// Interface pour représenter une ligne du Grand Livre
export interface GrandLivreEntry {
  societe: string;
  centralisateur: string;
  auxiliaire: string;
  compte: string;
  libelle: string;
  journal: string;
  date: Date;
  libelleEcriture: string;
  montantDebit: number;
  montantCredit: number;
  dateEcheance: Date | null;
  reference: string;
  numeroPiece: string;
  dateOrigine: Date | null;
  numeroInformationOrigine: string;
  etablissement: string;
  codeGrd: string;
  natureAnalytique: string;
  codeAnalytique: string;
  mtDebit: number;
  mtCredit: number;
  soldeAnalytique: number;
}

export const processGrandLivre = async (file: File): Promise<GrandLivreEntry[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Lire le classeur Excel
        const workbook = XLSX.read(e.target?.result, { 
          type: 'binary',
          cellDates: true  // Convertir les dates correctement
        });
        
        // Sélectionner la première feuille de calcul
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convertir la feuille de calcul en tableau JSON
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,
          defval: null,
          dateNF: 'yyyy-mm-dd'  // Format de date personnalisable
        });

        // Fonction de validation et transformation des données
        const processedData: GrandLivreEntry[] = rawData.map((row: any) => {
          // Conversion sécurisée des dates
          const parseDate = (dateStr: string | Date | null): Date | null => {
            if (!dateStr) return null;
            return dateStr instanceof Date ? dateStr : new Date(dateStr);
          };

          // Conversion sécurisée des nombres
          const parseNumber = (value: any): number => {
            const num = parseFloat(value);
            return isNaN(num) ? 0 : num;
          };

          return {
            societe: String(row['SOCIETE'] || ''),
            centralisateur: String(row['CENTRALISATEUR'] || ''),
            auxiliaire: String(row['AUXILIAIRE'] || ''),
            compte: String(row['COMPTE'] || ''),
            libelle: String(row['LIBELLE'] || ''),
            journal: String(row['JOURNAL'] || ''),
            date: parseDate(row['DATE']),
            libelleEcriture: String(row['LIBELLE ECRITURE'] || ''),
            montantDebit: parseNumber(row['MONTANT DEBIT']),
            montantCredit: parseNumber(row['MONTANT CREDIT']),
            dateEcheance: parseDate(row['DATE ECHEANCE']),
            reference: String(row['REFERENCE'] || ''),
            numeroPiece: String(row['N° PIECE'] || ''),
            dateOrigine: parseDate(row['DATE ORIGINE']),
            numeroInformationOrigine: String(row['N° INFORMATION ORIGINE'] || ''),
            etablissement: String(row['ETABLISSEMENT'] || ''),
            codeGrd: String(row['CODE GRD'] || ''),
            natureAnalytique: String(row['NATURE ANALYTIQUE'] || ''),
            codeAnalytique: String(row['CODE ANALYTIQUE'] || ''),
            mtDebit: parseNumber(row['MT DEBIT']),
            mtCredit: parseNumber(row['MT CREDIT']),
            soldeAnalytique: parseNumber(row['SOLDE ANALYTIQUE'])
          };
        }).filter((entry: GrandLivreEntry) => 
          // Filtrer les entrées pertinentes
          entry.date && (entry.montantDebit > 0 || entry.montantCredit > 0)
        );

        resolve(processedData);
      } catch (error) {
        reject(new Error(`Erreur de traitement du Grand Livre: ${error}`));
      }
    };
    
    reader.onerror = (error) => {
      reject(new Error(`Erreur de lecture du fichier: ${error}`));
    };
    
    // Lire le fichier comme un binaire
    reader.readAsBinaryString(file);
  });
};

// Fonction utilitaire pour déboguer le contenu du fichier
export const debugXLSXFile = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Lire le classeur Excel
        const workbook = XLSX.read(e.target?.result, { 
          type: 'binary',
          cellDates: true
        });
        
        // Sélectionner la première feuille de calcul
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Obtenir les en-têtes
        const headers = Object.keys(worksheet)
          .filter(key => key.match(/^[A]1$/))
          .map(key => worksheet[key].v);
        
        // Convertir la feuille de calcul en tableau JSON
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,
          defval: null
        });

        resolve({
          sheetNames: workbook.SheetNames,
          headers: headers,
          firstRows: rawData.slice(0, 5)  // Premiers enregistrements pour vérification
        });
      } catch (error) {
        reject(new Error(`Erreur de débogage du fichier: ${error}`));
      }
    };
    
    reader.onerror = (error) => {
      reject(new Error(`Erreur de lecture du fichier: ${error}`));
    };
    
    // Lire le fichier comme un binaire
    reader.readAsBinaryString(file);
  });
};
