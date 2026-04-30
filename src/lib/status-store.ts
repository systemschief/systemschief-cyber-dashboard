import type { FeedState, SystemStatus } from '@/lib/types';

type FeedName = 'news' | 'kev' | 'cves' | 'ransomware';
type RecordState = { state: FeedState; at: string; error?: string };

const globalStore = globalThis as typeof globalThis & {
  __systemsChiefFeedHealth?: Record<FeedName, RecordState>;
};

const now = () => new Date().toISOString();

export const feedHealth = globalStore.__systemsChiefFeedHealth ??= {
  news: { state: 'ok', at: now() },
  kev: { state: 'ok', at: now() },
  cves: { state: 'ok', at: now() },
  ransomware: { state: 'ok', at: now() },
};

export function markFeed(name: FeedName, state: FeedState, error?: string) {
  feedHealth[name] = { state, at: now(), error };
}

export function getSystemStatus(): { status: SystemStatus; lastSync: string; feeds: Record<FeedName, FeedState> } {
  const states = Object.entries(feedHealth) as [FeedName, RecordState][];
  const degraded = states.filter(([, value]) => value.state === 'degraded').length;
  return {
    status: degraded >= 3 ? 'INCIDENT' : degraded >= 1 ? 'DEGRADED' : 'OPERATIONAL',
    lastSync: states.map(([, value]) => value.at).sort().at(-1) ?? now(),
    feeds: {
      news: feedHealth.news.state,
      kev: feedHealth.kev.state,
      cves: feedHealth.cves.state,
      ransomware: feedHealth.ransomware.state,
    },
  };
}
