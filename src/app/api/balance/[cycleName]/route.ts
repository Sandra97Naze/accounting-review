import { NextRequest, NextResponse } from 'next/server';
import { getCompanyGrandLivreData } from '@/services/companyService';
import { calculateBalanceForCycle } from '@/services/balanceService';
import { BalanceEntry } from '@/types/CyclePageTypes';
import { NextApiRequest } from 'next';

// Type pour la réponse API
type ApiResponse = {
  data?: BalanceEntry[];
  error?: string;
  details?: string;
};

// Type pour les paramètres de la route
type Params = {
  params: {
    cycleName: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: { cycleName: string } }  // Utilisation du type correct
) {
  try {
    const companyId = request.nextUrl.searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const { currentYearData, previousYearData } = await getCompanyGrandLivreData(companyId);

    const balanceEntries = calculateBalanceForCycle(
      params.cycleName,  // Utilisation correcte de params.cycleName
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
