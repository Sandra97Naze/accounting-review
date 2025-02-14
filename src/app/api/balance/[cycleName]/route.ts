import { NextRequest, NextResponse } from 'next/server';
import { getCompanyGrandLivreData } from '@/services/companyService';
import { calculateBalanceForCycle } from '@/services/balanceService';
import { BalanceEntry } from '@/types/CyclePageTypes';

export async function GET(
  request: NextRequest,
  { params }: { params: { cycleName: string } }
) {
  try {
    // Récupérer l'ID de la société à partir des paramètres de requête
    const companyId = request.nextUrl.searchParams.get('companyId');
    
    // Vérifier que l'ID de la société est présent
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' }, 
        { status: 400 }
      );
    }

    // Récupérer les données du Grand Livre pour l'année courante et précédente
    const { currentYearData, previousYearData } = getCompanyGrandLivreData(companyId);

    // Calculer la balance pour le cycle spécifique
    const balanceEntries: BalanceEntry[] = calculateBalanceForCycle(
      params.cycleName,  // Nom du cycle
      currentYearData,   // Données de l'année courante
      previousYearData   // Données de l'année précédente
    );

    // Retourner les entrées de balance au format JSON
    return NextResponse.json(balanceEntries);

  } catch (error) {
    // Gestion centralisée des erreurs
    console.error('Erreur lors de la récupération de la balance:', error);

    return NextResponse.json(
      { 
        error: 'Impossible de récupérer la balance',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }, 
      { status: 500 }
    );
  }
}
