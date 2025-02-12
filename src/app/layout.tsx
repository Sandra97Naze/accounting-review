// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { updateCycleData } from '@/utils/cycleUtils';

// Utilisez const au lieu de var
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Application de Révision Comptable',
    description: 'Application de révision des comptes annuels'
};

export default function RootLayout({ children }) {
    // Votre implementation de layout
}
