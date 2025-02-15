// src/app/api/balance/[cycleName]/route.ts
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
// Correction du nom de la fonction importée
import { getCompanyGrandLivreData } from '@/services/companyService';
import { calculateBalanceForCycle } from '@/services/balanceService';
import { BalanceEntry } from '@/types/CyclePageTypes';

export async function GET(
  request: NextRequest,
  // Correction du type des paramètres selon la spécification Next.js 15
  params: { params: { cycleName: string } }
): Promise<NextResponse> {
  try {
    const companyId = request.nextUrl.searchParams.get('companyId');
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Utilisation du nom correct de la fonction
    const { currentYearData, previousYearData } = await getCompanyGrandLivreData(companyId);

    const balanceEntries = calculateBalanceForCycle(
      params.params.cycleName,
      currentYearData,
      previousYearData
    );

    return NextResponse.json({ data: balanceEntries });

  } catch (error) {
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
