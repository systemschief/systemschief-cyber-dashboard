import type { Severity } from '@/lib/types';

export function compactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}k`;
  return String(value);
}

export function timeAgo(input: string): string {
  const then = new Date(input).getTime();
  if (!Number.isFinite(then)) return 'unknown';
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(input));
}

export function severityClass(severity: Severity | string): string {
  switch (severity) {
    case 'CRITICAL': return 'severity-critical';
    case 'HIGH': return 'severity-high';
    case 'MEDIUM': return 'severity-medium';
    case 'LOW': return 'severity-low';
    default: return 'severity-unknown';
  }
}

export function severityColor(severity: Severity | string): string {
  switch (severity) {
    case 'CRITICAL': return '#ff3b3b';
    case 'HIGH': return '#ff8a3d';
    case 'MEDIUM': return '#ffd23d';
    case 'LOW': return '#39ff7a';
    default: return '#8b97a1';
  }
}

export function stripHtml(value = ''): string {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

export function decodeHtml(value: string): string {
  const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value.replace(/&(#\d+|#x[\da-fA-F]+|[a-zA-Z]+);/g, (_, entity: string) => {
    if (entity.startsWith('#x')) return String.fromCharCode(parseInt(entity.slice(2), 16));
    if (entity.startsWith('#')) return String.fromCharCode(parseInt(entity.slice(1), 10));
    return entities[entity] ?? `&${entity};`;
  });
}

export function shortId(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  return Math.abs(hash).toString(36);
}
