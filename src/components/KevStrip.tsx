import type { KevEntry } from '@/lib/types';
export function KevStrip({ entries }: { entries: KevEntry[] }) {
  const doubled = [...entries, ...entries];
  return <section className="panel marquee mt-5 p-4"><div className="mono mb-3 text-[10px] uppercase tracking-[.24em] text-[#39ff7a]">CISA KEV exploitation catalog</div><div className="marquee-track gap-5">{doubled.map((entry, i) => <a key={`${entry.cveId}-${i}`} className="min-w-[330px] border-l border-[#39ff7a]/45 pl-4 text-xs" href={`https://nvd.nist.gov/vuln/detail/${entry.cveId}`} target="_blank" rel="noreferrer"><span className="text-[#e6edf3]">{entry.cveId}</span><span className="mx-2 text-[#5a6571]">/</span><span className="text-[#8b97a1]">{entry.vendorProject} {entry.product}</span><br/><span className="text-[#5a6571]">added {entry.dateAdded} · due {entry.dueDate} · ransomware {entry.knownRansomwareCampaignUse}</span></a>)}</div></section>;
}
