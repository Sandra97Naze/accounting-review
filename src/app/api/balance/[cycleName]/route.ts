import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCompanyGrandLivre } from '@/services/companyService';
import { calculateBalanceForCycle } from '@/services/balanceService';
import { BalanceEntry } from '@/types/CyclePageTypes';

// Le type des paramètres est exactement ce que Next.js attend
export async function GET(
  request: NextRequest,
  // Cette structure est cruciale pour Next.js
  { params }: {
    params: {
      cycleName: string;
    };
  }
) {
  try {
    // Récupération du companyId depuis l'URL
    const companyId = request.nextUrl.searchParams.get('companyId');
    
    if (!companyId) {
      // Réponse d'erreur en cas d'absence d'ID
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Récupération des données
    const { currentYearData, previousYearData } = await getCompanyGrandLivre(companyId);

    // Calcul de la balance
    const balanceEntries: BalanceEntry[] = calculateBalanceForCycle(
      params.cycleName,
      currentYearData,
      previousYearData
    );

    // Réponse avec les données
    return NextResponse.json(balanceEntries);

  } catch (error) {
    console.error('Erreur lors de la récupération de la balance:', error);
    
    // Gestion standardisée des erreurs
    return NextResponse.json(
      {
        error: 'Impossible de récupérer la balance',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}import { NextRequest, NextResponse } from 'next/server';
import { getCompanyGrandLivre } from '@/services/companyService';
import { calculateBalanceForCycle } from '@/services/balanceService';
import { BalanceEntry } from '@/types/CyclePageTypes';

// Le type des paramètres est exactement ce que Next.js attend
export async function GET(
  request: NextRequest,
  // Cette structure est cruciale pour Next.js
  { params }: {
    params: {
      cycleName: string;
    };
  }
) {
  try {
    // Récupération du companyId depuis l'URL
    const companyId = request.nextUrl.searchParams.get('companyId');
    
    if (!companyId) {
      // Réponse d'erreur en cas d'absence d'ID
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Récupération des données
    const { currentYearData, previousYearData } = await getCompanyGrandLivre(companyId);

    // Calcul de la balance
    const balanceEntries: BalanceEntry[] = calculateBalanceForCycle(
      params.cycleName,
      currentYearData,
      previousYearData
    );

    // Réponse avec les données
    return NextResponse.json(balanceEntries);

  } catch (error) {
    console.error('Erreur lors de la récupération de la balance:', error);
    
    // Gestion standardisée des erreurs
    return NextResponse.json(
      {
        error: 'Impossible de récupérer la balance',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
