import { NextResponse } from 'next/server';
import type { LumuIncidentPlaceholder } from '@/lib/types';
export const runtime = 'nodejs';
export const revalidate = 300;
export const dynamic = 'force-dynamic';
export async function GET() {
  const payload: LumuIncidentPlaceholder = { status: 'not_configured', incidents: [], message: 'Lumu integration coming in next phase' };
  return NextResponse.json(payload);
}
