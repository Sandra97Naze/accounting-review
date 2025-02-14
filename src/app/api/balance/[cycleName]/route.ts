import { NextRequest, NextResponse } from 'next/server';
import { getCompanyGrandLivreData } from '@/services/companyService';
import { calculateBalanceForCycle } from '@/services/balanceService';
import { BalanceEntry } from '@/types/CyclePageTypes';

// Next.js s'attend à cette structure exacte pour les paramètres de route
type PageProps = {
  params: { cycleName: string };
};

export async function GET(
  request: NextRequest,
  { params }: PageProps
): Promise<NextResponse> {
  try {
    const companyId = request.nextUrl.searchParams.get('companyId');
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    const { currentYearData, previousYearData } = await getCompanyGrandLivreData(companyId);

    const balanceEntries = calculateBalanceForCycle(
      params.cycleName,
      currentYearData,
      previousYearData
    );

    return NextResponse.json(balanceEntries);

  } catch (error) {
    console.error('Erreur lors de la récupération de la balance:', error);
    return NextResponse.json({
      error: 'Impossible de récupérer la balance',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
