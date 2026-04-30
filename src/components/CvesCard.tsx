import type { CveItem } from '@/lib/types';
import { severityClass } from '@/lib/format';
export function CvesCard({ items }: { items: CveItem[] }) {
  return <section className="panel h-full p-5"><h2 className="mono mb-5 border-b hairline pb-3 text-xs uppercase tracking-[.22em] text-[#39ff7a]">Top trending CVEs / 7d</h2><div className="space-y-3">{items.slice(0, 8).map((item) => <a href={`https://nvd.nist.gov/vuln/detail/${item.id}`} target="_blank" rel="noreferrer" key={item.id} className="block border-b hairline pb-3"><div className="flex items-center justify-between gap-3"><span className="mono text-sm text-[#e6edf3]">{item.id}</span><span className={`mono border px-2 py-1 text-[10px] ${severityClass(item.severity)}`}>{item.severity} {item.cvssScore ?? '—'}</span></div><p className="mt-2 line-clamp-2 text-sm text-[#8b97a1]">{item.vendor} / {item.product}: {item.summary}</p></a>)}</div></section>;
}
