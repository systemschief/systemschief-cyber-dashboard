'use client';
import { useEffect, useMemo, useState } from 'react';
import type { CvesResponse, KevResponse, NewsResponse, RansomwareResponse, StatusResponse } from '@/lib/types';
import { TopBar } from './TopBar';
import { Masthead } from './Masthead';
import { LeadStory } from './LeadStory';
import { NewsGrid } from './NewsGrid';
import { KevStrip } from './KevStrip';
import { CvesCard } from './CvesCard';
import { RansomwareCard } from './RansomwareCard';
import { ThreatMap } from './ThreatMap';
import { LumuPlaceholder } from './LumuPlaceholder';
import { Footer } from './Footer';

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error(`${url} ${response.status}`);
    return await response.json();
  } catch { return null; }
}

export default function Dashboard() {
  const [news, setNews] = useState<NewsResponse | null>(null);
  const [kev, setKev] = useState<KevResponse | null>(null);
  const [cves, setCves] = useState<CvesResponse | null>(null);
  const [ransomware, setRansomware] = useState<RansomwareResponse | null>(null);
  const [status, setStatus] = useState<StatusResponse | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const [n, k, c, r, s] = await Promise.all([
        getJson<NewsResponse>('/api/news'), getJson<KevResponse>('/api/cisa-kev'), getJson<CvesResponse>('/api/cves/trending'), getJson<RansomwareResponse>('/api/ransomware'), getJson<StatusResponse>('/api/status'),
      ]);
      if (!active) return;
      setNews(n); setKev(k); setCves(c); setRansomware(r); setStatus(s);
    }
    load();
    const timer = setInterval(load, 300_000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  const lead = news?.items?.[0];
  const secondary = useMemo(() => news?.items?.slice(1, 9) ?? [], [news]);
  return (
    <main>
      <TopBar headlines={news?.items?.slice(0, 8) ?? []} status={status} />
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <Masthead news={news} kev={kev} cves={cves} ransomware={ransomware} />
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5"><LeadStory item={lead} /></div>
          <div className="lg:col-span-7"><NewsGrid items={secondary} /></div>
        </section>
        <KevStrip entries={kev?.latest?.slice(0, 10) ?? []} />
        <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-4"><CvesCard items={cves?.items ?? []} /></div>
          <div className="xl:col-span-3"><RansomwareCard victims={ransomware?.victims ?? []} /></div>
          <div className="xl:col-span-3"><ThreatMap byCountry={ransomware?.byCountry ?? {}} /></div>
          <div className="xl:col-span-2"><LumuPlaceholder /></div>
        </section>
        <Footer />
      </div>
    </main>
  );
}
