// src/app/api/balance/[cycleName]/route.ts
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCompanyGrandLivre } from '@/services/companyService';
import { calculateBalanceForCycle } from '@/services/balanceService';
import { BalanceEntry } from '@/types/CyclePageTypes';

// Type pour le context de la route selon la spec Next.js 15
type Context = {
  params: {
    cycleName: string;
  };
};

// Type pour la réponse API
type ApiResponse = {
  data?: BalanceEntry[];
  error?: string;
  details?: string;
};

// Gestionnaire GET avec le typage correct
export async function GET(
  request: NextRequest,
  context: Context // Utilisation du type Context
) {
  try {
    const companyId = request.nextUrl.searchParams.get('companyId');
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const { currentYearData, previousYearData } = await getCompanyGrandLivre(companyId);

    const balanceEntries = calculateBalanceForCycle(
      context.params.cycleName,
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
