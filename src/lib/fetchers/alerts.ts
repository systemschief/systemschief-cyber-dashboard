import Parser from 'rss-parser';
import { stripHtml, shortId } from '@/lib/format';
import { markFeed } from '@/lib/status-store';
import type { ApiError, CisaAlertItem, CisaAlertsResponse } from '@/lib/types';
import { fetchWithTimeout } from './http';

const parser = new Parser({ timeout: 10_000 });

// CISA high-priority alerts + ICS advisories
const ALERT_FEEDS: [string, string][] = [
  ['CISA Alerts',   'https://www.cisa.gov/cybersecurity-advisories/alerts.xml'],
  ['CISA ICS',      'https://www.cisa.gov/cybersecurity-advisories/ics-advisories.xml'],
];

let lastGood: CisaAlertItem[] = [];

function inferSeverity(title: string, summary: string): string {
  const text = (title + ' ' + summary).toLowerCase();
  if (text.includes('critical') || text.includes('actively exploited') || text.includes('zero-day')) return 'CRITICAL';
  if (text.includes('high') || text.includes('exploit') || text.includes('remote code')) return 'HIGH';
  if (text.includes('medium') || text.includes('patch') || text.includes('update')) return 'MEDIUM';
  return 'HIGH'; // CISA alerts are generally high severity by nature
}

async function fetchAlertFeed(name: string, url: string): Promise<CisaAlertItem[]> {
  const response = await fetchWithTimeout(url, { next: { tags: ['feed-alerts'] } });
  if (!response.ok) throw new Error(`${name} returned HTTP ${response.status}`);
  const xml = await response.text();
  const feed = await parser.parseString(xml);
  return feed.items.map((item) => {
    const link = item.link ?? item.guid ?? url;
    const published = item.isoDate ?? item.pubDate ?? new Date().toISOString();
    const title = stripHtml(item.title ?? 'Untitled advisory');
    const summary = stripHtml(item.contentSnippet ?? item.content ?? item.summary ?? item['content:encoded'] ?? '');
    return {
      id: `${name.toLowerCase().replace(/\W+/g, '-')}-${shortId(link)}`,
      title,
      url: link,
      publishedAt: new Date(published).toISOString(),
      summary,
      severity: inferSeverity(title, summary),
    } satisfies CisaAlertItem;
  });
}

export async function getCisaAlerts(): Promise<CisaAlertsResponse> {
  const settled = await Promise.allSettled(
    ALERT_FEEDS.map(([name, url]) => fetchAlertFeed(name, url))
  );
  const items: CisaAlertItem[] = [];
  let hasError = false;
  let firstError: ApiError | undefined;
  settled.forEach((result, i) => {
    if (result.status === 'fulfilled') items.push(...result.value);
    else {
      hasError = true;
      firstError ??= {
        code: 'UPSTREAM_CISA_ALERT_ERROR',
        source: ALERT_FEEDS[i][0],
        message: result.reason instanceof Error ? result.reason.message : String(result.reason),
      };
    }
  });
  const sorted = items.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)).slice(0, 30);
  if (sorted.length) lastGood = sorted;
  const degraded = hasError && sorted.length === 0;
  markFeed('alerts', degraded ? 'degraded' : 'ok', firstError?.message);
  return {
    items: sorted.length ? sorted : lastGood,
    degraded,
    fetchedAt: new Date().toISOString(),
    error: firstError,
  };
}

export const CISA_ALERT_FEEDS = ALERT_FEEDS;
