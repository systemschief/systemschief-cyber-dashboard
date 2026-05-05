import type { FeedState } from '@/lib/types';

type FeedDef = {
  key: string;
  name: string;
  description: string;
  url: string;
  type: 'RSS' | 'REST JSON' | 'GraphQL';
  cadence: string;
  state: FeedState;
  lastSync?: string;
};

const FEED_DEFINITIONS: Omit<FeedDef, 'state' | 'lastSync'>[] = [
  {
    key: 'news-bleeping',
    name: 'BleepingComputer',
    description: 'Cybersecurity news, malware reports, and data breach coverage.',
    url: 'https://www.bleepingcomputer.com/feed/',
    type: 'RSS',
    cadence: '5 min',
  },
  {
    key: 'news-thn',
    name: 'The Hacker News',
    description: 'Breaking cybersecurity news and in-depth technical analysis.',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    type: 'RSS',
    cadence: '5 min',
  },
  {
    key: 'news-krebs',
    name: 'Krebs on Security',
    description: 'Investigative cybersecurity journalism by Brian Krebs.',
    url: 'https://krebsonsecurity.com/feed/',
    type: 'RSS',
    cadence: '5 min',
  },
  {
    key: 'news-dr',
    name: 'Dark Reading',
    description: 'Enterprise security news and threat research.',
    url: 'https://www.darkreading.com/rss.xml',
    type: 'RSS',
    cadence: '5 min',
  },
  {
    key: 'news-cisa',
    name: 'CISA Advisories',
    description: 'US Cybersecurity & Infrastructure Security Agency alerts and advisories.',
    url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',
    type: 'RSS',
    cadence: '5 min',
  },
  {
    key: 'kev',
    name: 'CISA KEV Catalog',
    description: 'Known Exploited Vulnerabilities catalog — binding operational directive.',
    url: 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
    type: 'REST JSON',
    cadence: '5 min',
  },
  {
    key: 'nvd-critical',
    name: 'NVD — Critical CVEs',
    description: 'National Vulnerability Database CVSS v3 CRITICAL severity, last 7 days.',
    url: 'https://services.nvd.nist.gov/rest/json/cves/2.0',
    type: 'REST JSON',
    cadence: '5 min',
  },
  {
    key: 'nvd-high',
    name: 'NVD — High CVEs',
    description: 'National Vulnerability Database CVSS v3 HIGH severity, last 7 days.',
    url: 'https://services.nvd.nist.gov/rest/json/cves/2.0',
    type: 'REST JSON',
    cadence: '5 min',
  },
  {
    key: 'ransomware',
    name: 'Ransomware.live',
    description: 'Real-time tracking of ransomware group victims and claims.',
    url: 'https://api.ransomware.live/v2/recentvictims',
    type: 'REST JSON',
    cadence: '5 min',
  },
];

type FeedHealthMap = Record<string, FeedState>;

function mapStateToFeeds(
  feeds: Record<'news' | 'kev' | 'cves' | 'ransomware', FeedState>
): FeedHealthMap {
  return {
    'news-bleeping': feeds.news,
    'news-thn':      feeds.news,
    'news-krebs':    feeds.news,
    'news-dr':       feeds.news,
    'news-cisa':     feeds.news,
    'kev':           feeds.kev,
    'nvd-critical':  feeds.cves,
    'nvd-high':      feeds.cves,
    'ransomware':    feeds.ransomware,
  };
}

export function SourcesSection({
  feeds,
  lastSync,
}: {
  feeds: Record<'news' | 'kev' | 'cves' | 'ransomware', FeedState>;
  lastSync: string;
}) {
  const stateMap = mapStateToFeeds(feeds);
  const healthy = Object.values(stateMap).filter((s) => s === 'ok').length;
  const total = Object.values(stateMap).length;

  return (
    <div className="sources-section">
      {/* Header */}
      <div className="sources-section__header">
        <div>
          <h2 className="mono text-xs uppercase tracking-[.3em] text-[#39ff7a] mb-1">Data Sources</h2>
          <p className="text-[#5a6571] mono text-[10px] uppercase tracking-[.16em]">
            Feed health &amp; integration status
          </p>
        </div>
        <div className="sources-section__summary">
          <div className="sources-section__summary-stat">
            <span className="mono text-3xl text-[#e6edf3]">{healthy}</span>
            <span className="mono text-[9px] uppercase tracking-[.18em] text-[#5a6571]">Healthy</span>
          </div>
          <div className="sources-section__summary-divider" />
          <div className="sources-section__summary-stat">
            <span className="mono text-3xl text-[#e6edf3]">{total - healthy}</span>
            <span className="mono text-[9px] uppercase tracking-[.18em] text-[#5a6571]">Degraded</span>
          </div>
          <div className="sources-section__summary-divider" />
          <div className="sources-section__summary-stat">
            <span className="mono text-3xl text-[#e6edf3]">{total}</span>
            <span className="mono text-[9px] uppercase tracking-[.18em] text-[#5a6571]">Total Feeds</span>
          </div>
        </div>
      </div>

      {/* Last sync */}
      <div className="mono text-[10px] text-[#5a6571] uppercase tracking-[.16em] mb-6">
        Last sync: <span className="text-[#8b97a1]">{new Date(lastSync).toUTCString()}</span>
      </div>

      {/* Feed cards grid */}
      <div className="sources-section__grid">
        {FEED_DEFINITIONS.map((feed) => {
          const state = stateMap[feed.key] ?? 'ok';
          const isOk = state === 'ok';
          return (
            <div key={feed.key} className={`sources-section__card ${isOk ? '' : 'sources-section__card--degraded'}`}>
              {/* Status indicator */}
              <div className="sources-section__card-status">
                <span className={`status-dot ${isOk ? '' : 'incident'}`} />
                <span className={`mono text-[9px] uppercase tracking-[.2em] ${isOk ? 'text-[#39ff7a]' : 'text-[#ff3b3b]'}`}>
                  {isOk ? 'Operational' : 'Degraded'}
                </span>
              </div>
              {/* Name & type */}
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <h3 className="mono text-sm font-semibold text-[#e6edf3]">{feed.name}</h3>
                  <span className="mono text-[9px] border hairline px-2 py-0.5 text-[#5a6571] uppercase tracking-[.12em]">{feed.type}</span>
                </div>
                <p className="mt-2 text-xs text-[#8b97a1] leading-5">{feed.description}</p>
              </div>
              {/* Footer */}
              <div className="sources-section__card-footer">
                <span className="mono text-[9px] text-[#5a6571]">
                  ⟳ {feed.cadence} cadence
                </span>
                <a
                  href={feed.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mono text-[9px] text-[#5a6571] hover:text-[#39ff7a] transition-colors"
                >
                  Endpoint ↗
                </a>
              </div>
            </div>
          );
        })}

        {/* Lumu placeholder card */}
        <div className="sources-section__card sources-section__card--pending">
          <div className="sources-section__card-status">
            <span className="status-dot degraded" />
            <span className="mono text-[9px] uppercase tracking-[.2em] text-[#ffd23d]">Coming Soon</span>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h3 className="mono text-sm font-semibold text-[#e6edf3]">Lumu Defender</h3>
              <span className="mono text-[9px] border hairline px-2 py-0.5 text-[#5a6571] uppercase tracking-[.12em]">REST JSON</span>
            </div>
            <p className="mt-2 text-xs text-[#8b97a1] leading-5">
              Systems Chief internal incident feed. Real-time compromises, C2 detections, and network anomalies across managed client infrastructure.
            </p>
          </div>
          <div className="sources-section__card-footer">
            <span className="mono text-[9px] text-[#5a6571]">⟳ Real-time stream</span>
            <span className="mono text-[9px] border border-[#ffd23d]/30 px-2 py-0.5 text-[#ffd23d]">Integration Pending</span>
          </div>
        </div>
      </div>

      {/* Architecture note */}
      <div className="mt-8 border hairline p-5 bg-[#11161a]">
        <div className="mono text-[9px] uppercase tracking-[.24em] text-[#39ff7a] mb-3">Architecture Notes</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#8b97a1] leading-6">
          <div>
            <div className="mono text-[10px] text-[#5a6571] uppercase mb-1">Data Pipeline</div>
            All feeds are fetched server-side on every page request with a 5-minute revalidation window. RSS feeds are parsed with rss-parser. JSON APIs use native fetch with a 10-second timeout.
          </div>
          <div>
            <div className="mono text-[10px] text-[#5a6571] uppercase mb-1">Caching Strategy</div>
            Next.js ISR with <code className="mono text-[#39ff7a] text-[10px]">next: {'{ revalidate: 300 }'}</code>. Each feed maintains a last-good cache in process memory — degraded feeds fall back to stale data rather than showing errors.
          </div>
        </div>
      </div>
    </div>
  );
}
