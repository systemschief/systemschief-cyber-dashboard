'use client';
import { useState } from 'react';
import { SectionNav, type SectionId } from './SectionNav';
import { CyberNewsSection } from './CyberNewsSection';
import { IntelSection } from './IntelSection';
import { PlaybooksCard } from './PlaybooksCard';
import { SourcesSection } from './SourcesSection';
import { Masthead } from './Masthead';
import { LeadStory } from './LeadStory';
import { NewsGrid } from './NewsGrid';
import { Footer } from './Footer';
import type { NewsResponse, KevResponse, CvesResponse, RansomwareResponse, StatusResponse } from '@/lib/types';

export function DashboardShell({
  news,
  kev,
  cves,
  ransomware,
  status,
}: {
  news: NewsResponse;
  kev: KevResponse;
  cves: CvesResponse;
  ransomware: RansomwareResponse;
  status: StatusResponse | null;
}) {
  const [section, setSection] = useState<SectionId>('home');
  const lead = news.items?.[0];
  const secondary = news.items?.slice(1, 9) ?? [];

  return (
    <div className="dashboard-shell">
      <SectionNav active={section} onChange={setSection} />

      <div className="dashboard-shell__content mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        {section === 'home' && (
          <div>
            <Masthead news={news} kev={kev} cves={cves} ransomware={ransomware} />
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="lg:col-span-5"><LeadStory item={lead} /></div>
              <div className="lg:col-span-7"><NewsGrid items={secondary} /></div>
            </section>
          </div>
        )}

        {section === 'news' && (
          <CyberNewsSection
            news={news.items ?? []}
            cves={cves.items ?? []}
            kev={kev.latest ?? []}
          />
        )}

        {section === 'intel' && (
          <IntelSection
            cves={cves.items ?? []}
            kev={kev.latest ?? []}
            ransomware={{ victims: ransomware.victims ?? [], byCountry: ransomware.byCountry ?? {} }}
          />
        )}

        {section === 'playbooks' && (
          <div>
            <PlaybooksCard />
          </div>
        )}

        {section === 'sources' && (
          <SourcesSection
            feeds={status?.feeds ?? { news: 'ok', kev: 'ok', cves: 'ok', ransomware: 'ok' }}
            lastSync={status?.lastSync ?? new Date().toISOString()}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}
