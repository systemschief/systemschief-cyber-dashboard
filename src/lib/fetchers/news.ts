import Parser from 'rss-parser';
import { stripHtml, shortId } from '@/lib/format';
import { markFeed } from '@/lib/status-store';
import type { ApiError, NewsItem, NewsResponse, NewsCategory } from '@/lib/types';
import { fetchWithTimeout } from './http';

const parser = new Parser({ timeout: 10_000 });

// Each source tuple: [display name, feed URL, category]
const SOURCES: [string, string, NewsCategory][] = [
  // ── Security News ──────────────────────────────
  ['BleepingComputer',    'https://www.bleepingcomputer.com/feed/',                         'security'],
  ['The Hacker News',     'https://feeds.feedburner.com/TheHackersNews',                   'security'],
  ['Krebs on Security',   'https://krebsonsecurity.com/feed/',                             'security'],
  ['Dark Reading',        'https://www.darkreading.com/rss.xml',                           'security'],
  // ── Privacy News ───────────────────────────────
  ['EFF Deeplinks',       'https://www.eff.org/rss/updates.xml',                           'privacy'],
  ['The Record',          'https://therecord.media/feed',                                  'privacy'],
  ['Mozilla Privacy',     'https://blog.mozilla.org/en/category/privacy-security/feed/',   'privacy'],
  // ── Compliance News ────────────────────────────
  ['Infosecurity Mag',    'https://www.infosecurity-magazine.com/rss/compliance/',          'compliance'],
  ['NIST Cybersecurity',  'https://www.nist.gov/blogs/cybersecurity-insights/rss.xml',     'compliance'],
  ['SC World',            'https://www.scworld.com/rss/topic/compliance-management',        'compliance'],
  // ── CISA Advisories (kept as advisory category) ─
  ['CISA Advisories',     'https://www.cisa.gov/cybersecurity-advisories/all.xml',          'advisory'],
];

let lastGood: NewsItem[] = [];

async function fetchSource(source: string, url: string, category: NewsCategory): Promise<NewsItem[]> {
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
      title: stripHtml(item.title ?? 'Untitled'),
      source,
      url: link,
      publishedAt: new Date(published).toISOString(),
      summary,
      category,
    } satisfies NewsItem;
  });
}

export async function getNews(): Promise<NewsResponse> {
  const settled = await Promise.allSettled(
    SOURCES.map(([source, url, category]) => fetchSource(source, url, category))
  );
  const errors: ApiError[] = [];
  const items: NewsItem[] = [];
  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') items.push(...result.value);
    else errors.push({
      code: 'UPSTREAM_NEWS_ERROR',
      source: SOURCES[index][0],
      message: result.reason instanceof Error ? result.reason.message : String(result.reason),
    });
  });
  const sorted = items
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 60); // more items to support 3 categories
  if (sorted.length) lastGood = sorted;
  const degraded = errors.length > 0 || sorted.length === 0;
  markFeed('news', degraded ? 'degraded' : 'ok', errors[0]?.message);
  return { items: sorted.length ? sorted : lastGood, degraded, errors, fetchedAt: new Date().toISOString() };
}

// Export source list for SourcesSection to consume
export const NEWS_SOURCES = SOURCES;
