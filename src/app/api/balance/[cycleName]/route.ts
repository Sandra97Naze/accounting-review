import { NextRequest, NextResponse } from 'next/server';
import { getCompanyGrandLivreData } from '@/services/companyService';
import { calculateBalanceForCycle } from '@/services/balanceService';
import { BalanceEntry } from '@/types/CyclePageTypes';

// Définir l'interface pour les paramètres de route
interface RouteContext {
  params: {
    cycleName: string;
  };
  searchParams?: {
    companyId?: string;
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<BalanceEntry[] | ErrorResponse>> {
  try {
    const companyId = request.nextUrl.searchParams.get('companyId');
    
    if (!companyId) {
      return NextResponse.json({
        error: 'Company ID is required'
      }, { 
        status: 400 
      });
    }

    const { currentYearData, previousYearData } = await getCompanyGrandLivreData(companyId);

    const balanceEntries: BalanceEntry[] = calculateBalanceForCycle(
      context.params.cycleName,
      currentYearData,
      previousYearData
    );

    return NextResponse.json(balanceEntries);

  } catch (error) {
    console.error('Erreur lors de la récupération de la balance:', error);
    
   return NextResponse.json({
      error: 'Impossible de récupérer la balance',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { 
      status: 500 
  }
}
