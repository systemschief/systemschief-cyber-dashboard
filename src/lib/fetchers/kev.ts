/* eslint-disable @typescript-eslint/no-explicit-any */
import { markFeed } from '@/lib/status-store';
import type { ApiError, KevEntry, KevResponse } from '@/lib/types';
import { fetchWithTimeout } from './http';

const URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
let lastGood: KevResponse | null = null;

export async function getKev(): Promise<KevResponse> {
  try {
    const response = await fetchWithTimeout(URL, { next: { tags: ['feed-kev'] } });
    if (!response.ok) throw new Error(`CISA KEV returned HTTP ${response.status}`);
    const data = await response.json();
    const vulnerabilities = Array.isArray(data.vulnerabilities) ? data.vulnerabilities : [];
    const latest: KevEntry[] = vulnerabilities
      .map((item: any) => ({
        cveId: String(item.cveID ?? item.cveId ?? ''),
        vendorProject: String(item.vendorProject ?? ''),
        product: String(item.product ?? ''),
        vulnerabilityName: String(item.vulnerabilityName ?? ''),
        dateAdded: String(item.dateAdded ?? ''),
        dueDate: String(item.dueDate ?? ''),
        knownRansomwareCampaignUse: String(item.knownRansomwareCampaignUse ?? 'Unknown'),
        requiredAction: String(item.requiredAction ?? ''),
        notes: item.notes ? String(item.notes) : undefined,
      }))
      .sort((a: KevEntry, b: KevEntry) => +new Date(b.dateAdded) - +new Date(a.dateAdded))
      .slice(0, 20);
    const payload = { total: vulnerabilities.length, latest, catalogVersion: data.catalogVersion, dateReleased: data.dateReleased, degraded: false, fetchedAt: new Date().toISOString() };
    lastGood = payload;
    markFeed('kev', 'ok');
    return payload;
  } catch (error) {
    const apiError: ApiError = { code: 'UPSTREAM_KEV_ERROR', message: error instanceof Error ? error.message : String(error), source: 'CISA KEV' };
    markFeed('kev', 'degraded', apiError.message);
    return lastGood ? { ...lastGood, degraded: true, error: apiError, fetchedAt: new Date().toISOString() } : { total: 0, latest: [], degraded: true, fetchedAt: new Date().toISOString(), error: apiError };
  }
}
