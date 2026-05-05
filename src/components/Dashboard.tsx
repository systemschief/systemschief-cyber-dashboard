import { getKev } from '@/lib/fetchers/kev';
import { getNews } from '@/lib/fetchers/news';
import { getRansomware } from '@/lib/fetchers/ransomware';
import { getTrendingCves } from '@/lib/fetchers/cves';
import { getSystemStatus } from '@/lib/status-store';
import { TopBar } from './TopBar';
import { Masthead } from './Masthead';
import { LeadStory } from './LeadStory';
import { NewsGrid } from './NewsGrid';
import { KevStrip } from './KevStrip';
import { CvesCard } from './CvesCard';
import { RansomwareCard } from './RansomwareCard';
import { ThreatMap } from './ThreatMap';
import { LumuPlaceholder } from './LumuPlaceholder';
import { PlaybooksCard } from './PlaybooksCard';
import { Footer } from './Footer';

export default async function Dashboard() {
  const [news, kev, cves, ransomware] = await Promise.all([
    getNews(),
    getKev(),
    getTrendingCves(),
    getRansomware(),
  ]);
  const status = getSystemStatus();
  const lead = news.items?.[0];
  const secondary = news.items?.slice(1, 9) ?? [];

  return (
    <main>
      <TopBar headlines={news.items?.slice(0, 8) ?? []} status={status} />
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        <Masthead news={news} kev={kev} cves={cves} ransomware={ransomware} />
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5"><LeadStory item={lead} /></div>
          <div className="lg:col-span-7"><NewsGrid items={secondary} /></div>
        </section>
        <KevStrip entries={kev.latest?.slice(0, 10) ?? []} />
        <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-4"><CvesCard items={cves.items ?? []} /></div>
          <div className="xl:col-span-3"><RansomwareCard victims={ransomware.victims ?? []} /></div>
          <div className="xl:col-span-3"><ThreatMap byCountry={ransomware.byCountry ?? {}} /></div>
          <div className="xl:col-span-2"><LumuPlaceholder /></div>
        </section>
        <PlaybooksCard />
        <Footer />
      </div>
    </main>
  );
}
