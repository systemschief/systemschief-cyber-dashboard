import { getKev } from '@/lib/fetchers/kev';
import { getNews } from '@/lib/fetchers/news';
import { getRansomware } from '@/lib/fetchers/ransomware';
import { getTrendingCves } from '@/lib/fetchers/cves';
import { getSystemStatus } from '@/lib/status-store';
import { TopBar } from './TopBar';
import { DashboardShell } from './DashboardShell';

export default async function Dashboard() {
  const [news, kev, cves, ransomware] = await Promise.all([
    getNews(),
    getKev(),
    getTrendingCves(),
    getRansomware(),
  ]);
  const status = getSystemStatus();

  return (
    <main>
      <TopBar headlines={news.items?.slice(0, 8) ?? []} status={status} />
      <DashboardShell
        news={news}
        kev={kev}
        cves={cves}
        ransomware={ransomware}
        status={status}
      />
    </main>
  );
}
