import type { NewsItem } from '@/lib/types';
export function Ticker({ headlines }: { headlines: NewsItem[] }) {
  const items = headlines.length ? headlines : [{ title: 'Loading live cyber headline wire', url: '#', source: 'SYSTEM' } as NewsItem];
  const doubled = [...items, ...items];
  return <div className="marquee mono hidden text-[11px] uppercase tracking-[.16em] text-[#8b97a1] sm:block"><div className="marquee-track gap-8">{doubled.map((h, i) => <a key={`${h.url}-${i}`} href={h.url} target="_blank" rel="noreferrer" className="whitespace-nowrap"><span className="phosphor">{'//'}</span> {h.source}: {h.title}</a>)}</div></div>;
}
