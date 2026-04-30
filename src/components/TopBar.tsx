'use client';
import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { NewsItem, StatusResponse } from '@/lib/types';
import { Ticker } from './Ticker';

export function TopBar({ headlines, status }: { headlines: NewsItem[]; status: StatusResponse | null }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
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
          <Activity size={13} className="phosphor" />
          <span>UTC {now.toISOString().slice(11, 19)}</span>
          <span>LOCAL {now.toLocaleTimeString([], { hour12: false })}</span>
          <span>SYNC {status?.lastSync ? new Date(status.lastSync).toISOString().slice(11, 19) : '—'}</span>
        </div>
      </div>
    </header>
  );
}
