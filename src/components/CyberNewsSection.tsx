'use client';
import { useState, useMemo } from 'react';
import type { NewsItem, CveItem, KevEntry } from '@/lib/types';
import { timeAgo, severityClass } from '@/lib/format';

type NewsTab = 'all' | 'news' | 'cve' | 'kev';
type SeverityFilter = 'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

/* Enrich news items with a rough severity signal */
function inferSeverity(title: string): SeverityFilter {
  const t = title.toLowerCase();
  if (t.includes('critical') || t.includes('zero-day') || t.includes('0-day') || t.includes('rce') || t.includes('ransomware') || t.includes('actively exploited')) return 'CRITICAL';
  if (t.includes('high') || t.includes('exploit') || t.includes('breach') || t.includes('attack') || t.includes('remote code')) return 'HIGH';
  if (t.includes('medium') || t.includes('phishing') || t.includes('patch') || t.includes('update')) return 'MEDIUM';
  return 'LOW';
}

const SOURCE_COLORS: Record<string, string> = {
  'BleepingComputer':   '#ff8a3d',
  'The Hacker News':    '#e04cff',
  'Krebs on Security':  '#39c2ff',
  'Dark Reading':       '#ffd23d',
  'CISA Advisories':    '#39ff7a',
};

function sourceColor(source: string) {
  return SOURCE_COLORS[source] ?? '#8b97a1';
}

export function CyberNewsSection({
  news,
  cves,
  kev,
}: {
  news: NewsItem[];
  cves: CveItem[];
  kev: KevEntry[];
}) {
  const [tab, setTab] = useState<NewsTab>('all');
  const [severity, setSeverity] = useState<SeverityFilter>('all');
  const [search, setSearch] = useState('');

  const allNewsItems = useMemo(() =>
    news.map((n) => ({ ...n, kind: 'news' as const, severity: inferSeverity(n.title) })),
    [news]
  );

  const allCveItems = useMemo(() =>
    cves.map((c) => ({
      id: c.id,
      title: `${c.id} — ${c.vendor}/${c.product}`,
      source: 'NVD',
      url: `https://nvd.nist.gov/vuln/detail/${c.id}`,
      publishedAt: c.publishedAt,
      summary: c.summary,
      kind: 'cve' as const,
      severity: c.severity as SeverityFilter,
    })),
    [cves]
  );

  const allKevItems = useMemo(() =>
    kev.map((k) => ({
      id: `kev-${k.cveId}`,
      title: `${k.cveId} — ${k.vulnerabilityName}`,
      source: 'CISA KEV',
      url: `https://nvd.nist.gov/vuln/detail/${k.cveId}`,
      publishedAt: k.dateAdded,
      summary: `${k.vendorProject} / ${k.product} · Due: ${k.dueDate} · ${k.requiredAction}`,
      kind: 'kev' as const,
      severity: 'CRITICAL' as SeverityFilter,
    })),
    [kev]
  );

  const poolByTab = useMemo(() => {
    if (tab === 'news') return allNewsItems;
    if (tab === 'cve')  return allCveItems;
    if (tab === 'kev')  return allKevItems;
    return [...allNewsItems, ...allCveItems, ...allKevItems].sort(
      (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
    );
  }, [tab, allNewsItems, allCveItems, allKevItems]);

  const filtered = useMemo(() => {
    let pool = poolByTab;
    if (severity !== 'all') pool = pool.filter((i) => i.severity === severity);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      pool = pool.filter((i) => i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q) || i.source.toLowerCase().includes(q));
    }
    return pool;
  }, [poolByTab, severity, search]);

  const counts = useMemo(() => ({
    all:  allNewsItems.length + allCveItems.length + allKevItems.length,
    news: allNewsItems.length,
    cve:  allCveItems.length,
    kev:  allKevItems.length,
  }), [allNewsItems, allCveItems, allKevItems]);

  const severityCounts = useMemo(() => {
    const pool = [...allNewsItems, ...allCveItems, ...allKevItems];
    return {
      CRITICAL: pool.filter((i) => i.severity === 'CRITICAL').length,
      HIGH:     pool.filter((i) => i.severity === 'HIGH').length,
      MEDIUM:   pool.filter((i) => i.severity === 'MEDIUM').length,
      LOW:      pool.filter((i) => i.severity === 'LOW').length,
    };
  }, [allNewsItems, allCveItems, allKevItems]);

  return (
    <div className="cyber-news">
      {/* ── Header ── */}
      <div className="cyber-news__header">
        <div>
          <h2 className="mono text-xs uppercase tracking-[.3em] text-[#39ff7a] mb-1">Cyber News</h2>
          <p className="text-[#5a6571] mono text-[10px] uppercase tracking-[.16em]">Live intel from {counts.all} signals across 7 sources</p>
        </div>
        {/* Search */}
        <div className="cyber-news__search">
          <span className="mono text-[#5a6571] text-xs" aria-hidden="true">⌕</span>
          <input
            type="text"
            placeholder="Search threats, CVEs, vendors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cyber-news__search-input"
          />
          {search && (
            <button onClick={() => setSearch('')} className="mono text-[#5a6571] hover:text-[#39ff7a] text-xs">✕</button>
          )}
        </div>
      </div>

      {/* ── Severity bar ── */}
      <div className="cyber-news__severity-bar">
        {(['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSeverity(s)}
            className={`cyber-news__sev-btn ${severity === s ? 'cyber-news__sev-btn--active' : ''} ${s !== 'all' ? `sev-${s.toLowerCase()}` : ''}`}
          >
            <span>{s === 'all' ? 'All Severity' : s}</span>
            {s !== 'all' && <span className="cyber-news__sev-count">{severityCounts[s]}</span>}
          </button>
        ))}
        <div className="ml-auto mono text-[10px] text-[#5a6571]">{filtered.length} items</div>
      </div>

      {/* ── Type tabs ── */}
      <div className="cyber-news__tabs">
        {([
          ['all',  `All (${counts.all})`],
          ['news', `Security News (${counts.news})`],
          ['cve',  `CVEs (${counts.cve})`],
          ['kev',  `CISA KEV (${counts.kev})`],
        ] as [NewsTab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`cyber-news__tab ${tab === id ? 'cyber-news__tab--active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Feed ── */}
      <div className="cyber-news__feed">
        {filtered.length === 0 && (
          <div className="mono py-16 text-center text-[#5a6571] text-xs uppercase tracking-[.2em]">
            No signals match current filters
          </div>
        )}
        {filtered.map((item) => {
          const color = item.kind === 'kev' ? '#39ff7a' : item.kind === 'cve' ? '#e04cff' : sourceColor(item.source);
          return (
            <article key={item.id} className={`cyber-news__card cyber-news__card--${item.severity.toLowerCase()}`}>
              <div className="cyber-news__card-accent" style={{ background: color }} />
              <div className="cyber-news__card-body">
                {/* Meta row */}
                <div className="cyber-news__card-meta">
                  <span
                    className="cyber-news__card-source mono"
                    style={{ color, borderColor: `${color}44` }}
                  >
                    {item.source}
                  </span>
                  <span className={`cyber-news__card-sev mono severity-${item.severity.toLowerCase()}`}>
                    {item.severity}
                  </span>
                  <span className="mono text-[#5a6571] text-[10px] ml-auto">{timeAgo(item.publishedAt)}</span>
                </div>
                {/* Title */}
                <a href={item.url} target="_blank" rel="noreferrer" className="cyber-news__card-title hover:text-[#39ff7a]">
                  {item.title}
                </a>
                {/* Summary */}
                {item.summary && (
                  <p className="cyber-news__card-summary">{item.summary}</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
