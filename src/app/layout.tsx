import type { Metadata } from 'next';
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const instrument = Instrument_Serif({ subsets: ['latin'], weight: ['400'], style: ['normal', 'italic'], variable: '--font-display' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://systemschief-cyber.vercel.app'),
  title: 'Systems Chief // Cyber Ops',
  description: 'A live public operations view of the global threat landscape, maintained by Systems Chief managed cybersecurity operators.',
  openGraph: {
    title: 'Systems Chief // Cyber Ops',
    description: 'The Threat Landscape, In Real Time.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${instrument.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
