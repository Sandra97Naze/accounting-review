// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Utilisez const au lieu de var
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Application de Révision Comptable',
    description: 'Application de révision des comptes annuels'
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
