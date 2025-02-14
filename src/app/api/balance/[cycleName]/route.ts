import { type NextRequest, NextResponse } from 'next/server';
import { getCompanyGrandLivre } from '@/services/companyService';
import { calculateBalanceForCycle } from '@/services/balanceService';
import { BalanceEntry } from '@/types/CyclePageTypes';

// Type pour la réponse
type ApiResponse<T> = {
  data?: T;
  error?: string;
  details?: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { cycleName: string } }
): Promise<NextResponse<ApiResponse<BalanceEntry[]>>> {
  try {
    const companyId = request.nextUrl.searchParams.get('companyId');
    
    if (!companyId) {
      return NextResponse.json({
        error: 'Company ID is required'
      }, { status: 400 });
    }

    const { currentYearData, previousYearData } = await getCompanyGrandLivre(companyId);

    const balanceEntries = calculateBalanceForCycle(
      params.cycleName,
      currentYearData,
      previousYearData
    );

    return NextResponse.json({ data: balanceEntries });

  } catch (error) {
    console.error('Erreur lors de la récupération de la balance:', error);
    
    return NextResponse.json({
      error: 'Impossible de récupérer la balance',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
