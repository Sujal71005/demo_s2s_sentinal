import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from '@/components/layout/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'S2S Sentinels — Satellite-to-Street Intelligence',
  description:
    'Convert satellite observations into practical, location-specific disaster-response intelligence. Flood monitoring prototype for Smart India Hackathon 2026.',
  openGraph: {
    title: 'S2S Sentinels — Satellite-to-Street Intelligence',
    description:
      'Satellite-derived flood intelligence for faster ground-level disaster response.',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
