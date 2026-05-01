import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const nebula = localFont({
  src: [
    { path: './fonts/nebula/Nebula-Regular.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--font-nebula',
  display: 'swap',
});
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
    <html lang="en" className={`${nebula.variable} ${jetbrains.variable}`}>
      <body>
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
