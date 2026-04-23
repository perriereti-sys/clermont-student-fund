import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CSF — Clermont Student Fund',
  description: 'Tableau de bord du portefeuille — Clermont Student Fund',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh bg-bg text-slate-200 antialiased">
        <Navigation />
        <main className="relative z-10 max-w-8xl mx-auto px-4 sm:px-8 py-6 sm:py-10 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
