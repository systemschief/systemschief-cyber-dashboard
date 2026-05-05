'use client';
import { useState, useMemo } from 'react';
import type { NewsItem } from '@/lib/types';
import { timeAgo } from '@/lib/format';

type NewsSubTab = 'security' | 'privacy' | 'compliance';
type SeverityFilter = 'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

function inferSeverity(title: string): SeverityFilter {
  const t = title.toLowerCase();
  if (t.includes('critical') || t.includes('zero-day') || t.includes('0-day') || t.includes('rce') || t.includes('ransomware') || t.includes('actively exploited')) return 'CRITICAL';
  if (t.includes('high') || t.includes('exploit') || t.includes('breach') || t.includes('attack') || t.includes('remote code') || t.includes('backdoor')) return 'HIGH';
  if (t.includes('patch') || t.includes('update') || t.includes('phishing') || t.includes('regulation') || t.includes('compliance')) return 'MEDIUM';
  return 'LOW';
}

// Source metadata for credits panel
const SOURCE_META: Record<string, { color: string; category: NewsSubTab; desc: string; url: string }> = {
  'BleepingComputer':   { color: '#ff8a3d', category: 'security',   desc: 'Breaking cybersecurity news & malware reports',          url: 'https://www.bleepingcomputer.com'        },
  'The Hacker News':    { color: '#e04cff', category: 'security',   desc: 'Hacking news and in-depth vulnerability analysis',       url: 'https://thehackernews.com'               },
  'Krebs on Security':  { color: '#39c2ff', category: 'security',   desc: 'Investigative security journalism by Brian Krebs',       url: 'https://krebsonsecurity.com'             },
  'Dark Reading':       { color: '#ffd23d', category: 'security',   desc: 'Enterprise cybersecurity news and threat research',      url: 'https://www.darkreading.com'             },
  'EFF Deeplinks':      { color: '#a8ff3e', category: 'privacy',    desc: 'Digital rights and privacy from the EFF',                url: 'https://www.eff.org'                     },
  'The Record':         { color: '#ff6b9d', category: 'privacy',    desc: 'Cybersecurity & privacy by Recorded Future',            url: 'https://therecord.media'                 },
  'Mozilla Privacy':    { color: '#ff9500', category: 'privacy',    desc: 'Privacy & security from Mozilla Foundation',            url: 'https://blog.mozilla.org'                },
  'Infosecurity Mag':   { color: '#39ff7a', category: 'compliance', desc: 'Compliance & governance from Infosecurity Magazine',     url: 'https://www.infosecurity-magazine.com'   },
  'NIST Cybersecurity': { color: '#4dc9ff', category: 'compliance', desc: 'NIST cybersecurity frameworks and guidance',            url: 'https://www.nist.gov'                    },
  'SC World':           { color: '#b39dff', category: 'compliance', desc: 'Compliance management news from SC World',              url: 'https://www.scworld.com'                 },
  'CISA Advisories':    { color: '#39ff7a', category: 'security',   desc: 'US CISA cybersecurity advisories (all categories)',     url: 'https://www.cisa.gov'                    },
};

const TAB_CONFIG: { id: NewsSubTab; label: string; sub: string; glyph: string }[] = [
  { id: 'security',   label: 'Security News',   sub: '4 sources', glyph: '◈' },
  { id: 'privacy',    label: 'Privacy News',    sub: '3 sources', glyph: '◎' },
  { id: 'compliance', label: 'Compliance News', sub: '3 sources', glyph: '▣' },
];

export function CyberNewsSection({ news }: { news: NewsItem[] }) {
  const [tab, setTab] = useState<NewsSubTab>('security');
  const [severity, setSeverity] = useState<SeverityFilter>('all');
  const [search, setSearch] = useState('');
  const [showSources, setShowSources] = useState(false);

  // Enrich with inferred severity
  const enriched = useMemo(() =>
    news.map((n) => ({ ...n, inferred: inferSeverity(n.title) })),
    [news]
  );

  // Category counts
  const counts = useMemo(() => ({
    security:   enriched.filter((n) => n.category === 'security').length,
    privacy:    enriched.filter((n) => n.category === 'privacy').length,
    compliance: enriched.filter((n) => n.category === 'compliance').length,
  }), [enriched]);

  // Severity counts for the active tab
  const severityCounts = useMemo(() => {
    const pool = enriched.filter((n) => n.category === tab);
    return {
      CRITICAL: pool.filter((n) => n.inferred === 'CRITICAL').length,
      HIGH:     pool.filter((n) => n.inferred === 'HIGH').length,
      MEDIUM:   pool.filter((n) => n.inferred === 'MEDIUM').length,
      LOW:      pool.filter((n) => n.inferred === 'LOW').length,
    };
  }, [enriched, tab]);

  // Filtered feed
  const filtered = useMemo(() => {
    let pool = enriched.filter((n) => n.category === tab);
    if (severity !== 'all') pool = pool.filter((n) => n.inferred === severity);
    if (search.trim()) {
      const q = search.toLowerCase();
      pool = pool.filter((n) =>
        n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.source.toLowerCase().includes(q)
      );
    }
    return pool;
  }, [enriched, tab, severity, search]);

  // Sources for current tab
  const tabSources = Object.entries(SOURCE_META).filter(([, v]) => v.category === tab);

  return (
    <div>
      {/* ── Section header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="mono text-xs uppercase tracking-[.3em] text-[#39ff7a] mb-1">Cyber News</h2>
          <p className="mono text-[10px] text-[#5a6571] uppercase tracking-[.16em]">
            {news.length} signals across {Object.keys(SOURCE_META).length} live sources
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSources(!showSources)}
            className={`mono text-[10px] uppercase tracking-[.18em] border px-3 py-1.5 transition-colors ${
              showSources
                ? 'border-[#39ff7a]/60 text-[#39ff7a] bg-[#39ff7a]/06'
                : 'border-[rgba(255,255,255,.1)] text-[#5a6571] hover:text-[#8b97a1]'
            }`}
          >
            {showSources ? '◉ Hide Sources' : '◉ View Sources'}
          </button>
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#11161a] border border-[rgba(255,255,255,.08)] px-3 py-1.5 min-w-[220px]">
            <span className="mono text-[#5a6571] text-xs">⌕</span>
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none mono text-[.75rem] text-[#e6edf3] placeholder:text-[#5a6571]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="mono text-[#5a6571] hover:text-[#39ff7a] text-xs">✕</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Sources panel ── */}
      {showSources && (
        <div className="mb-5 panel p-4">
          <div className="mono text-[9px] uppercase tracking-[.24em] text-[#39ff7a] mb-3 border-b hairline pb-2">
            Active Sources — {tab.charAt(0).toUpperCase() + tab.slice(1)} News
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tabSources.map(([name, meta]) => (
              <a
                key={name}
                href={meta.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 p-3 border hairline hover:border-[rgba(255,255,255,.18)] transition-colors"
              >
                <span className="status-dot mt-1 shrink-0" />
                <div>
                  <div className="mono text-[10px] font-semibold uppercase tracking-[.12em]" style={{ color: meta.color }}>
                    {name}
                  </div>
                  <div className="text-xs text-[#5a6571] mt-0.5">{meta.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Category tabs ── */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {TAB_CONFIG.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSeverity('all'); }}
            className={`flex items-center gap-3 p-3 border transition-all text-left ${
              tab === t.id
                ? 'border-[#39ff7a]/50 bg-[#39ff7a]/05'
                : 'border-[rgba(255,255,255,.07)] hover:border-[rgba(255,255,255,.14)] bg-[#11161a]'
            }`}
          >
            <span className={`text-lg leading-none ${tab === t.id ? 'text-[#39ff7a]' : 'text-[#5a6571]'}`} aria-hidden>{t.glyph}</span>
            <div>
              <div className={`mono text-[10px] uppercase tracking-[.16em] font-semibold ${tab === t.id ? 'text-[#e6edf3]' : 'text-[#8b97a1]'}`}>{t.label}</div>
              <div className="mono text-[9px] text-[#5a6571] mt-0.5">
                {counts[t.id]} items · {t.sub}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Severity filter bar ── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSeverity(s)}
            className={`mono text-[10px] uppercase tracking-[.16em] flex items-center gap-1.5 px-3 py-1 border transition-all ${
              severity === s
                ? s === 'all' ? 'border-[#39ff7a] text-[#39ff7a] bg-[#39ff7a]/06'
                  : s === 'CRITICAL' ? 'border-[#ff3b3b] text-[#ff3b3b] bg-[#ff3b3b]/06'
                  : s === 'HIGH'     ? 'border-[#ff8a3d] text-[#ff8a3d] bg-[#ff8a3d]/06'
                  : s === 'MEDIUM'   ? 'border-[#ffd23d] text-[#ffd23d] bg-[#ffd23d]/06'
                  :                    'border-[#39ff7a] text-[#39ff7a] bg-[#39ff7a]/06'
                : 'border-[rgba(255,255,255,.08)] text-[#5a6571] hover:text-[#8b97a1]'
            }`}
          >
            {s === 'all' ? 'All Severity' : s}
            {s !== 'all' && (
              <span className="text-[9px] opacity-70">{severityCounts[s]}</span>
            )}
          </button>
        ))}
        <div className="ml-auto mono text-[10px] text-[#5a6571]">{filtered.length} results</div>
      </div>

      {/* ── Feed ── */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="panel py-16 text-center mono text-[#5a6571] text-xs uppercase tracking-[.2em]">
            No signals match current filters
          </div>
        )}
        {filtered.map((item) => {
          const meta = SOURCE_META[item.source];
          const accentColor = meta?.color ?? '#8b97a1';
          return (
            <article
              key={item.id}
              className="flex overflow-hidden border border-[rgba(255,255,255,.07)] bg-[#11161a] hover:border-[rgba(255,255,255,.15)] transition-all group"
            >
              {/* Color accent bar */}
              <div className="w-[3px] shrink-0 opacity-80" style={{ background: accentColor }} />

              <div className="flex-1 min-w-0 p-4">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="mono text-[9px] uppercase tracking-[.16em] border px-2 py-[2px]"
                    style={{ color: accentColor, borderColor: `${accentColor}44` }}
                  >
                    {item.source}
                  </span>
                  {/* Severity badge */}
                  <span className={`mono text-[9px] uppercase tracking-[.14em] border px-2 py-[2px] ${
                    item.inferred === 'CRITICAL' ? 'severity-critical' :
                    item.inferred === 'HIGH'     ? 'severity-high'     :
                    item.inferred === 'MEDIUM'   ? 'severity-medium'   :
                                                   'severity-low'
                  }`}>
                    {item.inferred}
                  </span>
                  <span className="mono text-[10px] text-[#5a6571] ml-auto">{timeAgo(item.publishedAt)}</span>
                </div>

                {/* Title */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm font-medium text-[#e6edf3] leading-[1.45] group-hover:text-[#39ff7a] transition-colors"
                >
                  {item.title}
                </a>

                {/* Summary */}
                {item.summary && (
                  <p className="mt-1.5 text-xs text-[#8b97a1] leading-[1.6] line-clamp-2">{item.summary}</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
