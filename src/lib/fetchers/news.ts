import Parser from 'rss-parser';
import { stripHtml, shortId } from '@/lib/format';
import { markFeed } from '@/lib/status-store';
import type { ApiError, NewsItem, NewsResponse } from '@/lib/types';
import { fetchWithTimeout } from './http';

const parser = new Parser({ timeout: 10_000 });
const SOURCES = [
  ['BleepingComputer', 'https://www.bleepingcomputer.com/feed/'],
  ['The Hacker News', 'https://feeds.feedburner.com/TheHackersNews'],
  ['Krebs on Security', 'https://krebsonsecurity.com/feed/'],
  ['Dark Reading', 'https://www.darkreading.com/rss.xml'],
  ['CISA Advisories', 'https://www.cisa.gov/cybersecurity-advisories/all.xml'],
] as const;

let lastGood: NewsItem[] = [];

async function fetchSource(source: string, url: string): Promise<NewsItem[]> {
  const response = await fetchWithTimeout(url, { next: { tags: ['feed-news'] } });
  if (!response.ok) throw new Error(`${source} returned HTTP ${response.status}`);
  const xml = await response.text();
  const feed = await parser.parseString(xml);
  return feed.items.map((item) => {
    const link = item.link ?? item.guid ?? url;
    const published = item.isoDate ?? item.pubDate ?? new Date().toISOString();
    const summary = stripHtml(item.contentSnippet ?? item.content ?? item.summary ?? item['content:encoded'] ?? '');
    return {
      id: `${source.toLowerCase().replace(/\W+/g, '-')}-${shortId(link)}`,
      title: stripHtml(item.title ?? 'Untitled advisory'),
      source,
      url: link,
      publishedAt: new Date(published).toISOString(),
      summary,
    } satisfies NewsItem;
  });
}

export async function getNews(): Promise<NewsResponse> {
  const settled = await Promise.allSettled(SOURCES.map(([source, url]) => fetchSource(source, url)));
  const errors: ApiError[] = [];
  const items: NewsItem[] = [];
  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') items.push(...result.value);
    else errors.push({ code: 'UPSTREAM_NEWS_ERROR', source: SOURCES[index][0], message: result.reason instanceof Error ? result.reason.message : String(result.reason) });
  });
  const sorted = items.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)).slice(0, 30);
  if (sorted.length) lastGood = sorted;
  const degraded = errors.length > 0 || sorted.length === 0;
  markFeed('news', degraded ? 'degraded' : 'ok', errors[0]?.message);
  return { items: sorted.length ? sorted : lastGood, degraded, errors, fetchedAt: new Date().toISOString() };
}
