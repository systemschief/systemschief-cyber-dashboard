import { NextResponse } from 'next/server';
import { getSystemStatus } from '@/lib/status-store';
export const runtime = 'nodejs';
export const revalidate = 300;
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json(getSystemStatus()); }
