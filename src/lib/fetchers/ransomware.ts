/* eslint-disable @typescript-eslint/no-explicit-any */
import { markFeed } from '@/lib/status-store';
import type { ApiError, RansomwareResponse, RansomwareVictim } from '@/lib/types';
import { fetchWithTimeout } from './http';

const URL = 'https://api.ransomware.live/v2/recentvictims';
let lastGood: RansomwareResponse | null = null;

export async function getRansomware(): Promise<RansomwareResponse> {
  try {
    const response = await fetchWithTimeout(URL, { next: { tags: ['feed-ransomware'] } });
    if (!response.ok) throw new Error(`ransomware.live returned HTTP ${response.status}`);
    const data = await response.json();
    const array = Array.isArray(data) ? data : Array.isArray(data?.victims) ? data.victims : [];
    const victims: RansomwareVictim[] = array.slice(0, 15).map((item: any) => ({
      victim: String(item.victim ?? item.post_title ?? item.name ?? 'Unknown victim'),
      group: String(item.group_name ?? item.group ?? item.slug ?? 'Unknown group'),
      country: String(item.country ?? item.country_code ?? item.location ?? 'Unknown'),
      sector: String(item.activity ?? item.sector ?? item.description ?? 'Unknown'),
      date: new Date(item.discovered ?? item.published ?? item.date ?? Date.now()).toISOString(),
      claimUrl: String(item.url ?? item.website ?? item.post_url ?? 'https://www.ransomware.live/'),
    }));
    const byCountry = victims.reduce<Record<string, number>>((acc, item) => {
      const key = item.country || 'Unknown';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    const payload = { victims, byCountry, degraded: false, fetchedAt: new Date().toISOString() };
    lastGood = payload;
    markFeed('ransomware', 'ok');
    return payload;
  } catch (error) {
    const apiError: ApiError = { code: 'UPSTREAM_RANSOMWARE_ERROR', source: 'ransomware.live', message: error instanceof Error ? error.message : String(error) };
    markFeed('ransomware', 'degraded', apiError.message);
    return lastGood ? { ...lastGood, degraded: true, error: apiError, fetchedAt: new Date().toISOString() } : { victims: [], byCountry: {}, degraded: true, fetchedAt: new Date().toISOString(), error: apiError };
  }
}
