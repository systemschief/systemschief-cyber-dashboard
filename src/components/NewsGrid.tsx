import type { NewsItem } from '@/lib/types';
import { timeAgo } from '@/lib/format';

export function NewsGrid({ items }: { items: NewsItem[] }) {
  const featured = items[0];
  const rest = items.slice(1);

  return (
    <section className="grid min-h-[420px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      {/* Featured item spans full column height on md+ */}
      {featured && (
        <article className="panel flex flex-col p-5 md:row-span-2">
          <div className="mono mb-4 flex justify-between text-[10px] uppercase tracking-[.18em] text-[#5a6571]">
            <span className="border hairline px-2 py-1 text-[#8b97a1]">{featured.source}</span>
            <span>{timeAgo(featured.publishedAt)}</span>
          </div>
          <a href={featured.url} target="_blank" rel="noreferrer">
            <h3 className="text-xl font-semibold leading-6 hover:text-[#39ff7a]">{featured.title}</h3>
          </a>
          <p className="mt-3 text-sm leading-6 text-[#8b97a1] line-clamp-4">{featured.summary || 'No summary provided by upstream feed.'}</p>
        </article>
      )}
      {/* Remaining items — compact cards that stack in the second column */}
      {rest.map((item) => (
        <article key={item.id} className="panel flex flex-col p-4">
          <div className="mono mb-2 flex justify-between text-[10px] uppercase tracking-[.18em] text-[#5a6571]">
            <span className="border hairline px-2 py-[2px] text-[#8b97a1] truncate max-w-[60%]">{item.source}</span>
            <span className="shrink-0">{timeAgo(item.publishedAt)}</span>
          </div>
          <a href={item.url} target="_blank" rel="noreferrer">
            <h3 className="text-sm font-semibold leading-5 hover:text-[#39ff7a] line-clamp-2">{item.title}</h3>
          </a>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8b97a1]">{item.summary || 'No summary provided by upstream feed.'}</p>
        </article>
      ))}
    </section>
  );
}
