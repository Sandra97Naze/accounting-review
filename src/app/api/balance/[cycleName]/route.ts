import { NextRequest, NextResponse } from 'next/server';
import { getCompanyGrandLivreData } from '@/services/companyService';
import { calculateBalanceForCycle } from '@/services/balanceService';
import { BalanceEntry } from '@/types/CyclePageTypes';

// Définir l'interface pour les paramètres de route
interface RouteParams {
  params: {
    cycleName: string;
  };
  searchParams?: {
    companyId?: string;
  };
}

// Définir l'interface pour la réponse d'erreur
interface ErrorResponse {
  error: string;
  details?: string;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<BalanceEntry[] | ErrorResponse>> {
  try {
    // Récupérer l'ID de la société avec typage sûr
    const companyId = request.nextUrl.searchParams.get('companyId');
    
    if (!companyId) {
      return NextResponse.json({
        error: 'Company ID is required'
      }, { 
        status: 400 
      });
    }

    // Récupérer les données avec un typage explicite
    const { currentYearData, previousYearData } = await getCompanyGrandLivreData(companyId);

    // Calculer la balance avec les types bien définis
    const balanceEntries: BalanceEntry[] = calculateBalanceForCycle(
      params.cycleName,
      currentYearData,
      previousYearData
    );

    return NextResponse.json(balanceEntries);

  } catch (error) {
    console.error('Erreur lors de la récupération de la balance:', error);
    
    const errorResponse: ErrorResponse = {
      error: 'Impossible de récupérer la balance',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
