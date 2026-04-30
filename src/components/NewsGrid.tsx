import type { NewsItem } from '@/lib/types';
import { timeAgo } from '@/lib/format';
export function NewsGrid({ items }: { items: NewsItem[] }) {
  return <section className="grid min-h-[420px] grid-cols-1 gap-4 md:grid-cols-2">{items.map((item, i) => <article key={item.id} className={`panel p-5 ${i === 0 ? 'md:row-span-2' : ''}`}><div className="mono mb-4 flex justify-between text-[10px] uppercase tracking-[.18em] text-[#5a6571]"><span className="border hairline px-2 py-1 text-[#8b97a1]">{item.source}</span><span>{timeAgo(item.publishedAt)}</span></div><a href={item.url} target="_blank" rel="noreferrer"><h3 className="text-xl font-semibold leading-6 hover:text-[#39ff7a]">{item.title}</h3></a><p className="mt-3 line-clamp-2 text-sm leading-6 text-[#8b97a1]">{item.summary || 'No summary provided by upstream feed.'}</p></article>)}</section>;
}
