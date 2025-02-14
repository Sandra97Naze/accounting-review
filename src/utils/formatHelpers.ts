// Importations de types si nécessaire
import { BalanceEntry } from '@/types/CyclePageTypes';

// Fonctions utilitaires de formatage
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};
