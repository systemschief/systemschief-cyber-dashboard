import type { FeedState } from '@/lib/types';

type FeedDef = {
  key: string;
  name: string;
  description: string;
  url: string;
  type: 'RSS' | 'REST JSON';
  cadence: string;
  category: 'security' | 'privacy' | 'compliance' | 'advisory' | 'intel';
};

const FEED_DEFINITIONS: FeedDef[] = [
  // ── Security News ───────────────────────────────────────────────────────────
  { key: 'news-bleeping',  name: 'BleepingComputer',   category: 'security',    description: 'Cybersecurity news, malware reports, and data breach coverage.',            url: 'https://www.bleepingcomputer.com/feed/',                                    type: 'RSS',       cadence: '5 min' },
  { key: 'news-thn',       name: 'The Hacker News',    category: 'security',    description: 'Breaking cybersecurity news and in-depth technical analysis.',              url: 'https://feeds.feedburner.com/TheHackersNews',                               type: 'RSS',       cadence: '5 min' },
  { key: 'news-krebs',     name: 'Krebs on Security',  category: 'security',    description: 'Investigative security journalism by Brian Krebs.',                         url: 'https://krebsonsecurity.com/feed/',                                         type: 'RSS',       cadence: '5 min' },
  { key: 'news-dr',        name: 'Dark Reading',       category: 'security',    description: 'Enterprise security news and threat research.',                             url: 'https://www.darkreading.com/rss.xml',                                       type: 'RSS',       cadence: '5 min' },
  // ── Privacy News ────────────────────────────────────────────────────────────
  { key: 'news-eff',       name: 'EFF Deeplinks',      category: 'privacy',     description: 'Digital rights, privacy, and civil liberties from the EFF.',                url: 'https://www.eff.org/rss/updates.xml',                                       type: 'RSS',       cadence: '5 min' },
  { key: 'news-record',    name: 'The Record',         category: 'privacy',     description: 'Privacy and cybersecurity coverage by Recorded Future.',                    url: 'https://therecord.media/feed',                                              type: 'RSS',       cadence: '5 min' },
  { key: 'news-mozilla',   name: 'Mozilla Privacy',    category: 'privacy',     description: 'Privacy and security insights from Mozilla Foundation.',                    url: 'https://blog.mozilla.org/en/category/privacy-security/feed/',               type: 'RSS',       cadence: '5 min' },
  // ── Compliance News ─────────────────────────────────────────────────────────
  { key: 'news-infosec',   name: 'Infosecurity Mag',   category: 'compliance',  description: 'Compliance and governance coverage from Infosecurity Magazine.',            url: 'https://www.infosecurity-magazine.com/rss/compliance/',                     type: 'RSS',       cadence: '5 min' },
  { key: 'news-nist',      name: 'NIST Cybersecurity', category: 'compliance',  description: 'NIST cybersecurity frameworks, standards, and guidance.',                   url: 'https://www.nist.gov/blogs/cybersecurity-insights/rss.xml',                 type: 'RSS',       cadence: '5 min' },
  { key: 'news-scworld',   name: 'SC World',           category: 'compliance',  description: 'Compliance management and regulatory news from SC World.',                  url: 'https://www.scworld.com/rss/topic/compliance-management',                   type: 'RSS',       cadence: '5 min' },
  // ── Advisory / Intel ────────────────────────────────────────────────────────
  { key: 'news-cisa-adv',  name: 'CISA Advisories',   category: 'advisory',    description: 'US CISA all-category cybersecurity advisories.',                            url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',                     type: 'RSS',       cadence: '5 min' },
  { key: 'alerts-cisa',    name: 'CISA Alerts',        category: 'advisory',    description: 'CISA high-priority cybersecurity alerts and emergency directives.',         url: 'https://www.cisa.gov/cybersecurity-advisories/alerts.xml',                  type: 'RSS',       cadence: '5 min' },
  { key: 'alerts-ics',     name: 'CISA ICS',           category: 'advisory',    description: 'Industrial Control Systems (ICS/SCADA) security advisories from CISA.',     url: 'https://www.cisa.gov/cybersecurity-advisories/ics-advisories.xml',          type: 'RSS',       cadence: '5 min' },
  { key: 'exploits',       name: 'Exploit-DB',         category: 'advisory',    description: 'Public exploit code and proof-of-concept from the Exploit Database.',       url: 'https://www.exploit-db.com/rss.xml',                                        type: 'RSS',       cadence: '5 min' },
  { key: 'kev',            name: 'CISA KEV Catalog',   category: 'intel',       description: 'Known Exploited Vulnerabilities catalog — binding operational directive.',   url: 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json', type: 'REST JSON', cadence: '5 min' },
  { key: 'nvd-critical',   name: 'NVD — Critical CVEs',category: 'intel',       description: 'National Vulnerability Database CVSS v3 CRITICAL severity, last 7 days.',  url: 'https://services.nvd.nist.gov/rest/json/cves/2.0',                          type: 'REST JSON', cadence: '5 min' },
  { key: 'nvd-high',       name: 'NVD — High CVEs',    category: 'intel',       description: 'National Vulnerability Database CVSS v3 HIGH severity, last 7 days.',      url: 'https://services.nvd.nist.gov/rest/json/cves/2.0',                          type: 'REST JSON', cadence: '5 min' },
  { key: 'ransomware',     name: 'Ransomware.live',    category: 'intel',       description: 'Real-time ransomware group victim tracking and claim monitoring.',          url: 'https://api.ransomware.live/v2/recentvictims',                              type: 'REST JSON', cadence: '5 min' },
];

const CATEGORY_LABELS: Record<string, string> = {
  security:   'Security News',
  privacy:    'Privacy News',
  compliance: 'Compliance News',
  advisory:   'Advisories',
  intel:      'Threat Intel',
};

const CATEGORY_COLORS: Record<string, string> = {
  security:   '#ff8a3d',
  privacy:    '#e04cff',
  compliance: '#39c2ff',
  advisory:   '#ff3b3b',
  intel:      '#39ff7a',
};

type FeedHealthMap = Record<string, FeedState>;

function mapStateToFeeds(
  feeds: Record<'news' | 'kev' | 'cves' | 'ransomware' | 'exploits' | 'alerts', FeedState>
): FeedHealthMap {
  return {
    'news-bleeping':  feeds.news,
    'news-thn':       feeds.news,
    'news-krebs':     feeds.news,
    'news-dr':        feeds.news,
    'news-eff':       feeds.news,
    'news-record':    feeds.news,
    'news-mozilla':   feeds.news,
    'news-infosec':   feeds.news,
    'news-nist':      feeds.news,
    'news-scworld':   feeds.news,
    'news-cisa-adv':  feeds.news,
    'alerts-cisa':    feeds.alerts,
    'alerts-ics':     feeds.alerts,
    'exploits':       feeds.exploits,
    'kev':            feeds.kev,
    'nvd-critical':   feeds.cves,
    'nvd-high':       feeds.cves,
    'ransomware':     feeds.ransomware,
  };
}

export function SourcesSection({
  feeds,
  lastSync,
}: {
  feeds: Record<'news' | 'kev' | 'cves' | 'ransomware' | 'exploits' | 'alerts', FeedState>;
  lastSync: string;
}) {
  const stateMap = mapStateToFeeds(feeds);
  const healthy = Object.values(stateMap).filter((s) => s === 'ok').length;
  const total = Object.values(stateMap).length;
  const categories = [...new Set(FEED_DEFINITIONS.map((f) => f.category))];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <div>
          <h2 className="mono text-xs uppercase tracking-[.3em] text-[#39ff7a] mb-1">Data Sources</h2>
          <p className="mono text-[10px] text-[#5a6571] uppercase tracking-[.16em]">Feed health &amp; integration status</p>
        </div>
        {/* Summary stats */}
        <div className="flex items-center gap-0 border hairline bg-[#11161a]">
          {[
            { label: 'Healthy',  value: healthy,         color: '#39ff7a' },
            { label: 'Degraded', value: total - healthy,  color: '#ff3b3b' },
            { label: 'Total',    value: total,            color: '#e6edf3' },
          ].map((s, i) => (
            <div key={s.label} className={`px-5 py-3 ${i < 2 ? 'border-r hairline' : ''}`}>
              <div className="mono text-2xl" style={{ color: s.color }}>{s.value}</div>
              <div className="mono text-[9px] uppercase tracking-[.18em] text-[#5a6571] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Last sync */}
      <div className="mono text-[10px] text-[#5a6571] uppercase tracking-[.16em] mb-6">
        Last sync: <span className="text-[#8b97a1]">{new Date(lastSync).toUTCString()}</span>
      </div>

      {/* Feeds by category */}
      {categories.map((cat) => {
        const catFeeds = FEED_DEFINITIONS.filter((f) => f.category === cat);
        const color = CATEGORY_COLORS[cat] ?? '#8b97a1';
        return (
          <div key={cat} className="mb-8">
            <div className="mono text-[10px] uppercase tracking-[.22em] mb-3 flex items-center gap-3" style={{ color }}>
              <span className="border px-2 py-0.5" style={{ borderColor: `${color}44` }}>{CATEGORY_LABELS[cat]}</span>
              <span className="text-[#5a6571]">{catFeeds.length} sources</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {catFeeds.map((feed) => {
                const state = stateMap[feed.key] ?? 'ok';
                const isOk = state === 'ok';
                return (
                  <div
                    key={feed.key}
                    className={`bg-[#11161a] border p-4 flex flex-col gap-2 transition-colors hover:border-[rgba(255,255,255,.16)] ${
                      isOk ? 'border-[rgba(255,255,255,.07)]' : 'border-[#ff3b3b]/25'
                    }`}
                  >
                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <span className={`status-dot ${isOk ? '' : 'incident'}`} />
                      <span className={`mono text-[9px] uppercase tracking-[.2em] ${isOk ? 'text-[#39ff7a]' : 'text-[#ff3b3b]'}`}>
                        {isOk ? 'Live' : 'Degraded'}
                      </span>
                      <span className="mono text-[9px] border hairline px-1.5 py-[1px] text-[#5a6571] uppercase ml-auto">{feed.type}</span>
                    </div>
                    {/* Name */}
                    <div>
                      <div className="mono text-xs font-semibold text-[#e6edf3]">{feed.name}</div>
                      <p className="mt-1 text-xs text-[#8b97a1] leading-[1.5]">{feed.description}</p>
                    </div>
                    {/* Footer */}
                    <div className="mt-auto pt-2 border-t hairline flex items-center justify-between">
                      <span className="mono text-[9px] text-[#5a6571]">⟳ {feed.cadence}</span>
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
            </div>
          </div>
        );
      })}

      {/* Lumu pending card */}
      <div className="mb-8">
        <div className="mono text-[10px] uppercase tracking-[.22em] mb-3 flex items-center gap-3 text-[#ffd23d]">
          <span className="border px-2 py-0.5 border-[#ffd23d]/30">Managed Detection</span>
          <span className="text-[#5a6571]">1 source · integration pending</span>
        </div>
        <div className="bg-[#11161a] border border-[#ffd23d]/20 p-4 flex flex-col gap-2 max-w-sm">
          <div className="flex items-center gap-2">
            <span className="status-dot degraded" />
            <span className="mono text-[9px] uppercase tracking-[.2em] text-[#ffd23d]">Pending Integration</span>
          </div>
          <div>
            <div className="mono text-xs font-semibold text-[#e6edf3]">Lumu Defender</div>
            <p className="mt-1 text-xs text-[#8b97a1] leading-[1.5]">
              Internal incident feed — real-time compromises, C2 detections, and network anomalies across managed client infrastructure.
            </p>
          </div>
          <div className="mt-auto pt-2 border-t hairline flex items-center justify-between">
            <span className="mono text-[9px] text-[#5a6571]">⟳ Real-time stream</span>
            <span className="mono text-[9px] border border-[#ffd23d]/30 text-[#ffd23d] px-2 py-[1px]">Phase 2</span>
          </div>
        </div>
      </div>

      {/* Architecture note */}
      <div className="border hairline p-5 bg-[#11161a]">
        <div className="mono text-[9px] uppercase tracking-[.24em] text-[#39ff7a] mb-3">Architecture Notes</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#8b97a1] leading-6">
          <div>
            <div className="mono text-[10px] text-[#5a6571] uppercase mb-1">Data Pipeline</div>
            All feeds fetch server-side on every page request with a 5-minute ISR revalidation window. RSS feeds are parsed with rss-parser. JSON APIs use native fetch with a 10s timeout. Each feed category is tagged independently for on-demand cache invalidation.
          </div>
          <div>
            <div className="mono text-[10px] text-[#5a6571] uppercase mb-1">Graceful Degradation</div>
            Each feed maintains an in-memory last-good cache. When a source is unreachable, stale data is served automatically and the feed is marked degraded. The system status reflects aggregate feed health — DEGRADED if any feed fails, INCIDENT if 3 or more fail simultaneously.
          </div>
        </div>
      </div>
    </div>
  );
}
