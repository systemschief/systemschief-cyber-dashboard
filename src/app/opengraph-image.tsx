import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const alt = 'Systems Chief Cyber Ops';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const ibmPlexSans = await fetch(new URL('./fonts/ibm-plex-sans/IBMPlexSans-Regular.ttf', import.meta.url)).then((res) => res.arrayBuffer());
  const ibmPlexSansSemiBold = await fetch(new URL('./fonts/ibm-plex-sans/IBMPlexSans-SemiBold.ttf', import.meta.url)).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', background: '#0a0d0f', color: '#e6edf3', display: 'flex', flexDirection: 'column', padding: 64, border: '1px solid rgba(255,255,255,.08)', fontFamily: 'IBM Plex Sans' }}>
      <div style={{ color: '#39ff7a', letterSpacing: 4, fontSize: 26 }}>SYSTEMS CHIEF // CYBER OPS</div>
      <div style={{ marginTop: 72, fontSize: 76, lineHeight: .92, fontFamily: 'IBM Plex Sans', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, maxWidth: 980, textShadow: '0 0 22px rgba(57,255,122,.18)' }}>The Threat Landscape, In Real Time.</div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', color: '#8b97a1', fontSize: 22 }}>
        <span>MANAGED CYBERSECURITY</span><span>OPERATIONAL</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'IBM Plex Sans', data: ibmPlexSans, weight: 400, style: 'normal' },
        { name: 'IBM Plex Sans', data: ibmPlexSansSemiBold, weight: 600, style: 'normal' },
      ],
    },
  );
}
