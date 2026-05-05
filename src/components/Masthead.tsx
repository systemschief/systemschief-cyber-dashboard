import Image from 'next/image';
import type { CvesResponse, KevResponse, NewsResponse, RansomwareResponse } from '@/lib/types';
import { compactNumber } from '@/lib/format';

export function Masthead({ news, kev, cves, ransomware }: { news: NewsResponse | null; kev: KevResponse | null; cves: CvesResponse | null; ransomware: RansomwareResponse | null }) {
  const active24h = news?.items?.filter((item) => Date.now() - +new Date(item.publishedAt) < 86_400_000).length ?? 0;
  const kpis = [
    ['Active CVEs (24h)', compactNumber(cves?.items?.filter((cve) => Date.now() - +new Date(cve.publishedAt) < 86_400_000).length ?? active24h)],
    ['CISA KEV entries (total)', compactNumber(kev?.total)],
    ['Tracked ransomware groups', compactNumber(new Set((ransomware?.victims ?? []).map((i) => i.group)).size)],
    ['Lumu Incidents', '—'],
  ];
  return (
    <section className="mb-5 border-b hairline pb-7">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_560px]">
        <div>
          {/* Systems Chief Logo */}
          <div className="mb-5">
            <Image
              src="/sc-logo.png"
              alt="Systems Chief"
              width={170}
              height={52}
              priority
              style={{ filter: 'brightness(0) invert(1) opacity(0.9)' }}
            />
          </div>
          <p className="mono mb-3 text-xs uppercase tracking-[.32em] text-[#39ff7a]">Public threat desk / v1</p>
          <h1 className="display text-6xl leading-[.92] sm:text-8xl lg:text-9xl">The Threat Landscape, In Real Time.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-7 text-[#8b97a1]">Systems Chief operates this live board as a public front door into managed detection, threat intelligence, and cyber operations discipline.</p>
        </div>
        <div className="grid grid-cols-2 border hairline bg-[#11161a]">
          {kpis.map(([label, value], i) => <div key={label} className={`p-5 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b' : ''} hairline`}><div className="mono text-[10px] uppercase tracking-[.2em] text-[#5a6571]">{label}{label === 'Lumu Incidents' && <span className="ml-2 border border-[#39ff7a]/35 px-1 text-[#39ff7a]">soon</span>}</div><div className="mono scramble mt-3 text-4xl text-[#e6edf3]">{value}</div></div>)}
        </div>
      </div>
    </section>
  );
}
