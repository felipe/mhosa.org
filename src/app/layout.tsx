import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ResultsProvider } from '@/contexts/ResultsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MHOSA - Mile-high HO-scale Slot-car Association',
  description: 'Racing community and competition results',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ResultsProvider>{children}</ResultsProvider>
      </body>
    </html>
  );
}
