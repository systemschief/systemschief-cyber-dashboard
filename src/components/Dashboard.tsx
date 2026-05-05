import { getKev } from '@/lib/fetchers/kev';
import { getNews } from '@/lib/fetchers/news';
import { getRansomware } from '@/lib/fetchers/ransomware';
import { getTrendingCves } from '@/lib/fetchers/cves';
import { getExploits } from '@/lib/fetchers/exploits';
import { getCisaAlerts } from '@/lib/fetchers/alerts';
import { getSystemStatus } from '@/lib/status-store';
import { TopBar } from './TopBar';
import { DashboardShell } from './DashboardShell';

export default async function Dashboard() {
  const [news, kev, cves, ransomware, exploits, alerts] = await Promise.all([
    getNews(),
    getKev(),
    getTrendingCves(),
    getRansomware(),
    getExploits(),
    getCisaAlerts(),
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
        exploits={exploits}
        alerts={alerts}
      />
    </main>
  );
}
