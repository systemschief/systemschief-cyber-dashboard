import type { NewsItem } from '@/lib/types';
import { timeAgo } from '@/lib/format';
export function LeadStory({ item }: { item?: NewsItem }) {
  if (!item) return <article className="panel min-h-[380px] p-6"><p className="mono phosphor text-xs">WIRE ACQUIRING</p></article>;
  return <article className="panel flex min-h-[420px] flex-col p-6"><div className="mono mb-8 flex items-center justify-between text-[11px] uppercase tracking-[.18em] text-[#8b97a1]"><span>{item.source}</span><span>{timeAgo(item.publishedAt)}</span></div><a href={item.url} target="_blank" rel="noreferrer"><h2 className="display text-5xl leading-[.94] tracking-[-.03em] hover:text-[#39ff7a]">{item.title}</h2></a><p className="mt-6 text-base leading-7 text-[#8b97a1]">{item.summary || 'A newly published cyber item is being tracked by the live Systems Chief operations feed.'}</p><div className="mt-auto border-t hairline pt-5 mono text-[11px] uppercase tracking-[.2em] text-[#5a6571]">Lead threat story</div></article>;
}
