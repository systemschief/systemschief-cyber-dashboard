import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const alt = 'Systems Chief Cyber Ops';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', background: '#0a0d0f', color: '#e6edf3', display: 'flex', flexDirection: 'column', padding: 64, border: '1px solid rgba(255,255,255,.08)' }}>
      <div style={{ fontFamily: 'monospace', color: '#39ff7a', letterSpacing: 4, fontSize: 26 }}>SYSTEMS CHIEF // CYBER OPS</div>
      <div style={{ marginTop: 72, fontSize: 82, lineHeight: .95, fontStyle: 'italic', fontFamily: 'serif', maxWidth: 900 }}>The Threat Landscape, In Real Time.</div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', color: '#8b97a1', fontSize: 22 }}>
        <span>MANAGED CYBERSECURITY</span><span>OPERATIONAL</span>
      </div>
    </div>,
    { ...size },
  );
}
