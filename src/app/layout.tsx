import { Inter } from 'next/font/google'
 
const inter = Inter({ subsets: ['latin'] })
 
export const metadata = {
  title: 'Application de Révision Comptable',
  description: 'Application de révision des comptes annuels'
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
