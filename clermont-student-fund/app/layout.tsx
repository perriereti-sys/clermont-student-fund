import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'CSF — Clermont Student Fund',
  description: 'Tableau de bord du portefeuille — Clermont Student Fund',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-bg text-slate-200 antialiased">
        <Navigation />
        <main className="relative z-10 max-w-8xl mx-auto px-4 sm:px-8 py-6 sm:py-10 pb-24 sm:pb-10">
          {children}
        </main>
      </body>
    </html>
  );
}
