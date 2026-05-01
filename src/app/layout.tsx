import type { Metadata } from 'next';
import { Inter_Tight, JetBrains_Mono, Share_Tech_Mono } from 'next/font/google';
import './globals.css';

const cyber = Share_Tech_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-cyber', display: 'swap' });
const interTight = Inter_Tight({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-mono', display: 'swap' });

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
    <html lang="en" className={`${cyber.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
