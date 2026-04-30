import { NextResponse } from 'next/server';
import { getTrendingCves } from '@/lib/fetchers/cves';
export const runtime = 'nodejs';
export const revalidate = 300;
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json(await getTrendingCves()); }
