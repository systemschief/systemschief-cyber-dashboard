import type { RansomwareVictim } from '@/lib/types';
import { timeAgo } from '@/lib/format';
export function RansomwareCard({ victims }: { victims: RansomwareVictim[] }) {
  return <section className="panel h-full p-5"><h2 className="mono mb-5 border-b hairline pb-3 text-xs uppercase tracking-[.22em] text-[#39ff7a]">Recent ransomware activity</h2><div className="space-y-3">{victims.slice(0, 10).map((v, i) => <a href={v.claimUrl} target="_blank" rel="noreferrer" key={`${v.group}-${v.victim}-${i}`} className="grid grid-cols-[92px_1fr] gap-3 border-b hairline pb-3"><span className="mono text-[11px] uppercase text-[#ff8a3d]">{v.group}</span><span><b className="block text-sm font-medium">{v.victim}</b><small className="mono text-[10px] uppercase text-[#5a6571]">{v.country} · {timeAgo(v.date)}</small></span></a>)}</div></section>;
}
