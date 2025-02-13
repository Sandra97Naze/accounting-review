import { NextRequest, NextResponse } from 'next/server';
import { calculateBalanceForCycle } from '@/services/balanceService';
import { getCompanyGrandLivreData } from '@/services/companyService'; // À créer

export async function GET(
  request: NextRequest,
  { params }: { params: { cycleName: string } }
) {
  try {
    // Récupérer l'ID de la société active (à définir selon votre logique)
    const companyId = request.nextUrl.searchParams.get('companyId');
    
    if (!companyId) {
      return NextResponse.json({ 
        error: 'Company ID is required' 
      }, { status: 400 });
    }

    // Récupérer les données du Grand Livre pour l'année courante et précédente
    const { currentYearData, previousYearData } = await getCompanyGrandLivreData(companyId);

    // Calculer la balance pour le cycle spécifié
    const balanceEntries = calculateBalanceForCycle(
      decodeURIComponent(params.cycleName), 
      currentYearData, 
      previousYearData
    );

    return NextResponse.json(balanceEntries);
  } catch (error) {
    console.error('Erreur lors de la récupération de la balance:', error);
    return NextResponse.json({ 
      error: 'Impossible de récupérer la balance' 
    }, { status: 500 });
  }
}
