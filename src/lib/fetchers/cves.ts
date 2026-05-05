/* eslint-disable @typescript-eslint/no-explicit-any */
import { markFeed } from '@/lib/status-store';
import type { ApiError, CveItem, CvesResponse, Severity } from '@/lib/types';
import { fetchWithTimeout } from './http';

let lastGood: CveItem[] = [];

function nvdDate(date: Date): string {
  return date.toISOString().replace('Z', '');
}

function pickMetric(cve: any): { severity: Severity; score: number | null; vector: string } {
  const metrics = cve.metrics ?? {};
  const metric = metrics.cvssMetricV31?.[0] ?? metrics.cvssMetricV30?.[0] ?? metrics.cvssMetricV40?.[0] ?? metrics.cvssMetricV2?.[0];
  const cvss = metric?.cvssData ?? {};
  return {
    severity: String(cvss.baseSeverity ?? metric?.baseSeverity ?? 'UNKNOWN') as Severity,
    score: typeof cvss.baseScore === 'number' ? cvss.baseScore : null,
    vector: String(cvss.vectorString ?? ''),
  };
}

function extractProduct(cve: any): { vendor: string; product: string } {
  const matches: string[] = [];
  for (const config of cve.configurations ?? []) {
    for (const node of config.nodes ?? []) {
      for (const match of node.cpeMatch ?? []) {
        if (match.criteria) matches.push(String(match.criteria));
      }
    }
  }
  const first = matches[0]?.split(':') ?? [];
  return {
    vendor: first[3] ? first[3].replace(/_/g, ' ') : 'Unknown',
    product: first[4] ? first[4].replace(/_/g, ' ') : 'Unknown',
  };
}

// Detect if a patch reference exists in NVD references
function hasPatchRef(cve: any): boolean {
  return (cve.references ?? []).some((r: any) =>
    (r.tags ?? []).some((t: string) => ['Patch', 'Vendor Advisory', 'Mitigation'].includes(t))
  );
}

// Detect if an exploit reference exists in NVD references
function hasExploitRef(cve: any): boolean {
  return (cve.references ?? []).some((r: any) => {
    const tags: string[] = r.tags ?? [];
    const url: string = r.url ?? '';
    return (
      tags.some((t: string) => ['Exploit', 'Exploit DB', 'Exploit Code'].includes(t)) ||
      url.includes('exploit-db.com') ||
      url.includes('packetstormsecurity.com')
    );
  });
}

// Known CVE → ransomware group mapping (best-effort; supplement with live KEV join)
const RANSOMWARE_CVE_MAP: Record<string, string> = {
  'CVE-2021-44228': 'Multiple Groups (Log4Shell)',
  'CVE-2023-4966':  'LockBit',
  'CVE-2024-3400':  'UNC5290 / State Actors',
  'CVE-2021-34527': 'Magniber, Conti',
  'CVE-2020-1472':  'Ryuk, WastedLocker',
  'CVE-2019-11510': 'REvil, BlackMatter',
  'CVE-2021-26855': 'HAFNIUM, BlackKingdom',
  'CVE-2022-41040': 'HAFNIUM',
  'CVE-2023-34362': 'Cl0p',
  'CVE-2023-0669':  'Cl0p',
  'CVE-2024-21762': 'Volt Typhoon',
  'CVE-2024-27198': 'BianLian, RansomHub',
  'CVE-2023-46805': 'Volt Typhoon, UNC5325',
  'CVE-2024-6387':  'Multiple Groups (regreSSHion)',
};

async function fetchSeverity(severity: 'HIGH' | 'CRITICAL'): Promise<CveItem[]> {
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    lastModStartDate: nvdDate(start),
    lastModEndDate: nvdDate(end),
    cvssV3Severity: severity,
    resultsPerPage: '20',
  });
  const headers: HeadersInit = process.env.NVD_API_KEY ? { apiKey: process.env.NVD_API_KEY } : {};
  const response = await fetchWithTimeout(
    `https://services.nvd.nist.gov/rest/json/cves/2.0?${params.toString()}`,
    { headers, next: { tags: ['feed-cves'] } }
  );
  if (!response.ok) throw new Error(`NVD ${severity} returned HTTP ${response.status}`);
  const data = await response.json();
  return (data.vulnerabilities ?? []).map(({ cve }: any) => {
    const metric = pickMetric(cve);
    const product = extractProduct(cve);
    return {
      id: cve.id,
      severity: metric.severity,
      cvssScore: metric.score,
      vector: metric.vector,
      vendor: product.vendor,
      product: product.product,
      summary: String(cve.descriptions?.find((d: any) => d.lang === 'en')?.value ?? cve.descriptions?.[0]?.value ?? ''),
      publishedAt: new Date(cve.published ?? cve.lastModified ?? Date.now()).toISOString(),
      patchAvailable: hasPatchRef(cve),
      exploitAvailable: hasExploitRef(cve),
      ransomwareGroup: RANSOMWARE_CVE_MAP[cve.id],
    } satisfies CveItem;
  });
}

export async function getTrendingCves(): Promise<CvesResponse> {
  const settled = await Promise.allSettled([fetchSeverity('CRITICAL'), fetchSeverity('HIGH')]);
  const errors: ApiError[] = [];
  const map = new Map<string, CveItem>();
  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') result.value.forEach((item) => map.set(item.id, item));
    else errors.push({
      code: 'UPSTREAM_NVD_ERROR',
      source: index === 0 ? 'NVD CRITICAL' : 'NVD HIGH',
      message: result.reason instanceof Error ? result.reason.message : String(result.reason),
    });
  });
  const items = [...map.values()]
    .sort((a, b) => (b.cvssScore ?? 0) - (a.cvssScore ?? 0) || +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 20);
  if (items.length) lastGood = items;
  const degraded = errors.length > 0 || items.length === 0;
  markFeed('cves', degraded ? 'degraded' : 'ok', errors[0]?.message);
  return { items: items.length ? items : lastGood, degraded, errors, fetchedAt: new Date().toISOString() };
}
