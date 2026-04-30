'use client';
import { useEffect, useState } from 'react';

export function Clock({ lastSync }: { lastSync?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const current = now ?? new Date();
  return (
    <>
      <span>UTC {current.toISOString().slice(11, 19)}</span>
      <span>LOCAL {current.toLocaleTimeString([], { hour12: false })}</span>
      <span>SYNC {lastSync ? new Date(lastSync).toISOString().slice(11, 19) : '—'}</span>
    </>
  );
}
