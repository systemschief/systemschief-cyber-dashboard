'use client';
import { useState } from 'react';
import type { CveItem, KevEntry, CisaAlertItem, ExploitItem, RansomwareVictim } from '@/lib/types';
import { timeAgo, severityClass } from '@/lib/format';

type AdvisoryTab = 'cves' | 'kev' | 'alerts' | 'exploits' | 'ransomware';

const TABS: { id: AdvisoryTab; label: string; glyph: string; desc: string }[] = [
  { id: 'cves',       label: 'CVE Watchlist',    glyph: '⬡', desc: 'NVD Critical & High' },
  { id: 'kev',        label: 'CISA KEV',         glyph: '◈', desc: 'Known Exploited Vulns' },
  { id: 'alerts',     label: 'CISA Alerts',      glyph: '◎', desc: 'ICS & Cyber Alerts' },
  { id: 'exploits',   label: 'Exploits',         glyph: '▣', desc: 'Exploit-DB Feed' },
  { id: 'ransomware', label: 'Hacking Groups',   glyph: '◉', desc: 'Ransomware Activity' },
];

// ── CVE Tab ─────────────────────────────────────────────────────────────────
function CveTab({ items }: { items: CveItem[] }) {
  const [filter, setFilter] = useState<'all' | 'patch' | 'exploit' | 'ransomware'>('all');

  const filtered = items.filter((c) => {
    if (filter === 'patch')      return c.patchAvailable;
    if (filter === 'exploit')    return c.exploitAvailable;
    if (filter === 'ransomware') return !!c.ransomwareGroup;
    return true;
  });

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {([
          ['all',        'All CVEs',           items.length],
          ['patch',      '✓ Patch Available',  items.filter((c) => c.patchAvailable).length],
          ['exploit',    '⚡ Exploit Known',   items.filter((c) => c.exploitAvailable).length],
          ['ransomware', '☠ Ransomware Group', items.filter((c) => !!c.ransomwareGroup).length],
        ] as [typeof filter, string, number][]).map(([id, label, count]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`mono text-[10px] uppercase tracking-[.14em] border px-3 py-1 flex items-center gap-1.5 transition-all ${
              filter === id
                ? 'border-[#39ff7a]/60 text-[#39ff7a] bg-[#39ff7a]/06'
                : 'border-[rgba(255,255,255,.08)] text-[#5a6571] hover:text-[#8b97a1]'
            }`}
          >
            {label}
            <span className="text-[9px] opacity-70">{count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="panel py-10 text-center mono text-[#5a6571] text-xs uppercase tracking-[.2em]">No CVEs match filter</div>
        )}
        {filtered.map((cve) => (
          <div key={cve.id} className="panel p-4">
            {/* Header row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <a
                href={`https://nvd.nist.gov/vuln/detail/${cve.id}`}
                target="_blank"
                rel="noreferrer"
                className="mono text-sm font-semibold text-[#e04cff] hover:text-[#39ff7a] transition-colors"
              >
                {cve.id}
              </a>
              <span className={`mono text-[9px] border px-2 py-[2px] uppercase ${severityClass(cve.severity)}`}>
                {cve.severity} {cve.cvssScore !== null ? `· ${cve.cvssScore}` : ''}
              </span>
              {/* Patch badge */}
              {cve.patchAvailable && (
                <span className="mono text-[9px] border border-[#39ff7a]/50 text-[#39ff7a] px-2 py-[2px] uppercase">✓ Patch Available</span>
              )}
              {/* Exploit badge */}
              {cve.exploitAvailable && (
                <span className="mono text-[9px] border border-[#ff3b3b]/50 text-[#ff3b3b] px-2 py-[2px] uppercase">⚡ Exploit Known</span>
              )}
              <span className="mono text-[10px] text-[#5a6571] ml-auto">{timeAgo(cve.publishedAt)}</span>
            </div>

            {/* Product */}
            <div className="mono text-[10px] text-[#8b97a1] uppercase tracking-[.1em] mb-1.5">
              {cve.vendor} / {cve.product}
            </div>

            {/* Summary */}
            <p className="text-xs text-[#8b97a1] leading-[1.6] line-clamp-2">{cve.summary}</p>

            {/* Ransomware group */}
            {cve.ransomwareGroup && (
              <div className="mt-2 flex items-center gap-2">
                <span className="mono text-[9px] uppercase tracking-[.14em] text-[#5a6571]">Known by:</span>
                <span className="mono text-[9px] border border-[#ff8a3d]/50 text-[#ff8a3d] px-2 py-[2px] uppercase">☠ {cve.ransomwareGroup}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── KEV Tab ──────────────────────────────────────────────────────────────────
function KevTab({ entries }: { entries: KevEntry[] }) {
  return (
    <div>
      <div className="mono text-[10px] text-[#5a6571] uppercase tracking-[.18em] mb-4">
        {entries.length} entries · Binding Operational Directive 22-01 compliance required
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="mono text-[9px] uppercase tracking-[.18em] text-[#5a6571] border-b hairline">
              {['CVE ID', 'Vendor / Product', 'Vulnerability', 'Date Added', 'Due Date', 'Ransomware'].map((h) => (
                <th key={h} className="text-left pb-2 pr-4 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((k) => (
              <tr key={k.cveId} className="border-b hairline hover:bg-white/[.02] transition-colors">
                <td className="py-2.5 pr-4">
                  <a
                    href={`https://nvd.nist.gov/vuln/detail/${k.cveId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mono text-[11px] text-[#e04cff] hover:text-[#39ff7a]"
                  >
                    {k.cveId}
                  </a>
                </td>
                <td className="py-2.5 pr-4 text-xs text-[#8b97a1]">{k.vendorProject} / {k.product}</td>
                <td className="py-2.5 pr-4 text-xs text-[#e6edf3] max-w-[220px]">
                  <span className="line-clamp-2">{k.vulnerabilityName}</span>
                </td>
                <td className="py-2.5 pr-4 mono text-[10px] text-[#5a6571]">{k.dateAdded}</td>
                <td className="py-2.5 pr-4 mono text-[10px] text-[#ffd23d]">{k.dueDate}</td>
                <td className="py-2.5">
                  <span className={`mono text-[9px] border px-2 py-0.5 uppercase ${
                    k.knownRansomwareCampaignUse === 'Known'
                      ? 'border-[#ff3b3b]/50 text-[#ff3b3b]'
                      : 'border-[rgba(255,255,255,.08)] text-[#5a6571]'
                  }`}>
                    {k.knownRansomwareCampaignUse === 'Known' ? '☠ Known' : k.knownRansomwareCampaignUse}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── CISA Alerts Tab ──────────────────────────────────────────────────────────
function AlertsTab({ items }: { items: CisaAlertItem[] }) {
  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <div className="panel py-10 text-center mono text-[#5a6571] text-xs uppercase tracking-[.2em]">No alerts loaded</div>
      )}
      {items.map((alert) => (
        <div key={alert.id} className="flex overflow-hidden border border-[rgba(255,255,255,.07)] bg-[#11161a] hover:border-[rgba(255,255,255,.15)] transition-all">
          {/* Severity accent */}
          <div className={`w-[3px] shrink-0 ${
            alert.severity === 'CRITICAL' ? 'bg-[#ff3b3b]' :
            alert.severity === 'HIGH'     ? 'bg-[#ff8a3d]' :
                                            'bg-[#ffd23d]'
          }`} />
          <div className="flex-1 p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="mono text-[9px] border border-[#39ff7a]/40 text-[#39ff7a] px-2 py-[2px] uppercase">CISA Alert</span>
              {alert.severity && (
                <span className={`mono text-[9px] border px-2 py-[2px] uppercase ${
                  alert.severity === 'CRITICAL' ? 'severity-critical' :
                  alert.severity === 'HIGH'     ? 'severity-high'     : 'severity-medium'
                }`}>{alert.severity}</span>
              )}
              <span className="mono text-[10px] text-[#5a6571] ml-auto">{timeAgo(alert.publishedAt)}</span>
            </div>
            <a href={alert.url} target="_blank" rel="noreferrer"
               className="block text-sm font-medium text-[#e6edf3] hover:text-[#39ff7a] transition-colors leading-[1.45]">
              {alert.title}
            </a>
            {alert.summary && (
              <p className="mt-1.5 text-xs text-[#8b97a1] line-clamp-2 leading-[1.6]">{alert.summary}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Exploits Tab ─────────────────────────────────────────────────────────────
function ExploitsTab({ items }: { items: ExploitItem[] }) {
  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <div className="panel py-10 text-center mono text-[#5a6571] text-xs uppercase tracking-[.2em]">No exploits loaded</div>
      )}
      {items.map((ex) => (
        <div key={ex.id} className="flex overflow-hidden border border-[rgba(255,255,255,.07)] bg-[#11161a] hover:border-[rgba(255,255,255,.15)] transition-all">
          <div className="w-[3px] shrink-0 bg-[#ff3b3b] opacity-80" />
          <div className="flex-1 p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="mono text-[9px] border border-[#ff3b3b]/40 text-[#ff3b3b] px-2 py-[2px] uppercase">Exploit-DB</span>
              <span className="mono text-[9px] border border-[rgba(255,255,255,.12)] text-[#8b97a1] px-2 py-[2px] uppercase">{ex.type}</span>
              <span className="mono text-[9px] border border-[rgba(255,255,255,.08)] text-[#5a6571] px-2 py-[2px] uppercase">{ex.platform}</span>
              {ex.cveId && (
                <a
                  href={`https://nvd.nist.gov/vuln/detail/${ex.cveId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mono text-[9px] border border-[#e04cff]/40 text-[#e04cff] px-2 py-[2px] uppercase hover:text-[#39ff7a]"
                >
                  {ex.cveId}
                </a>
              )}
              <span className="mono text-[10px] text-[#5a6571] ml-auto">{timeAgo(ex.publishedAt)}</span>
            </div>
            <a href={ex.url} target="_blank" rel="noreferrer"
               className="block text-sm font-medium text-[#e6edf3] hover:text-[#39ff7a] transition-colors leading-[1.45]">
              {ex.title}
            </a>
            {ex.author && ex.author !== 'Unknown' && (
              <div className="mt-1 mono text-[10px] text-[#5a6571]">by {ex.author}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Ransomware / Hacking Groups Tab ─────────────────────────────────────────
function RansomwareTab({ victims }: { victims: RansomwareVictim[] }) {
  // Group victims by threat actor
  const byGroup = victims.reduce<Record<string, RansomwareVictim[]>>((acc, v) => {
    const g = v.group || 'Unknown';
    (acc[g] ??= []).push(v);
    return acc;
  }, {});

  const groups = Object.entries(byGroup).sort((a, b) => b[1].length - a[1].length);

  return (
    <div>
      {/* Summary by group */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-5">
        {groups.map(([group, gvictims]) => (
          <div key={group} className="panel p-3">
            <div className="mono text-[10px] font-semibold uppercase tracking-[.1em] text-[#ff8a3d] mb-1 truncate">{group}</div>
            <div className="mono text-2xl text-[#e6edf3]">{gvictims.length}</div>
            <div className="mono text-[9px] text-[#5a6571] uppercase tracking-[.12em] mt-0.5">
              {gvictims.length === 1 ? 'victim' : 'victims'}
            </div>
          </div>
        ))}
      </div>

      {/* Victim list */}
      <div className="mono text-[10px] text-[#5a6571] uppercase tracking-[.18em] mb-3 border-b hairline pb-2">
        Recent victims — {victims.length} tracked
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="mono text-[9px] uppercase tracking-[.18em] text-[#5a6571] border-b hairline">
              {['Group', 'Victim', 'Sector', 'Country', 'Date', 'Claim'].map((h) => (
                <th key={h} className="text-left pb-2 pr-4 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {victims.map((v, i) => (
              <tr key={`${v.group}-${v.victim}-${i}`} className="border-b hairline hover:bg-white/[.02] transition-colors">
                <td className="py-2 pr-4 mono text-[11px] text-[#ff8a3d] font-semibold">{v.group}</td>
                <td className="py-2 pr-4 text-xs font-medium text-[#e6edf3]">{v.victim}</td>
                <td className="py-2 pr-4 mono text-[10px] text-[#8b97a1]">{v.sector}</td>
                <td className="py-2 pr-4 mono text-[10px] text-[#5a6571]">{v.country}</td>
                <td className="py-2 pr-4 mono text-[10px] text-[#5a6571]">{timeAgo(v.date)}</td>
                <td className="py-2">
                  <a
                    href={v.claimUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mono text-[9px] border border-[rgba(255,255,255,.1)] px-2 py-0.5 text-[#5a6571] hover:text-[#39ff7a] hover:border-[#39ff7a]/30 transition-colors"
                  >
                    View ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main AdvisoriesSection ────────────────────────────────────────────────────
export function AdvisoriesSection({
  cves,
  kev,
  alerts,
  exploits,
  ransomware,
}: {
  cves: CveItem[];
  kev: KevEntry[];
  alerts: CisaAlertItem[];
  exploits: ExploitItem[];
  ransomware: RansomwareVictim[];
}) {
  const [tab, setTab] = useState<AdvisoryTab>('cves');

  const tabCounts: Record<AdvisoryTab, number> = {
    cves:       cves.length,
    kev:        kev.length,
    alerts:     alerts.length,
    exploits:   exploits.length,
    ransomware: ransomware.length,
  };

  return (
    <div>
      {/* ── Section header ── */}
      <div className="mb-5">
        <h2 className="mono text-xs uppercase tracking-[.3em] text-[#39ff7a] mb-1">Advisories</h2>
        <p className="mono text-[10px] text-[#5a6571] uppercase tracking-[.16em]">
          CVEs · CISA KEV · Alerts · Exploits · Ransomware & Hacking Groups
        </p>
      </div>

      {/* ── Tab bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2.5 p-3 border text-left transition-all ${
              tab === t.id
                ? 'border-[#39ff7a]/50 bg-[#39ff7a]/05'
                : 'border-[rgba(255,255,255,.07)] bg-[#11161a] hover:border-[rgba(255,255,255,.14)]'
            }`}
          >
            <span className={`text-lg leading-none shrink-0 ${tab === t.id ? 'text-[#39ff7a]' : 'text-[#5a6571]'}`} aria-hidden>{t.glyph}</span>
            <div className="min-w-0">
              <div className={`mono text-[10px] uppercase tracking-[.14em] font-semibold truncate ${tab === t.id ? 'text-[#e6edf3]' : 'text-[#8b97a1]'}`}>
                {t.label}
              </div>
              <div className="mono text-[9px] text-[#5a6571] mt-0.5">
                {tabCounts[t.id]} items
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      {tab === 'cves'       && <CveTab        items={cves}              />}
      {tab === 'kev'        && <KevTab        entries={kev}             />}
      {tab === 'alerts'     && <AlertsTab     items={alerts}            />}
      {tab === 'exploits'   && <ExploitsTab   items={exploits}          />}
      {tab === 'ransomware' && <RansomwareTab victims={ransomware}      />}
    </div>
  );
}
