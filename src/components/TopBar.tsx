import type { NewsItem, StatusResponse } from '@/lib/types';
import { Ticker } from './Ticker';
import { Clock } from './Clock';

function ActivityGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="phosphor" aria-hidden="true">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function TopBar({ headlines, status }: { headlines: NewsItem[]; status: StatusResponse | null }) {
  const state = status?.status ?? 'OPERATIONAL';
  return (
    <header className="sticky top-0 z-40 border-b hairline bg-[#0a0d0f]/95 backdrop-blur-sm">
      <div className="grid h-14 grid-cols-[1fr] items-center gap-3 px-4 sm:grid-cols-[330px_1fr_330px] sm:px-6">
        <div className="mono flex items-center gap-3 text-xs tracking-[.18em]">
          <span className={`status-dot ${state === 'DEGRADED' ? 'degraded' : state === 'INCIDENT' ? 'incident' : ''}`} />
          <span>SYSTEMS CHIEF // CYBER OPS</span>
          <span className="dim hidden md:inline">{state}</span>
        </div>
        <Ticker headlines={headlines} />
        <div className="mono hidden items-center justify-end gap-4 text-[11px] text-[#8b97a1] sm:flex">
          <ActivityGlyph />
          <Clock lastSync={status?.lastSync} />
        </div>
      </div>
    </header>
  );
}
