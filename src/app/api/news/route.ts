import { NextResponse } from 'next/server';
import { getNews } from '@/lib/fetchers/news';
export const runtime = 'nodejs';
export const revalidate = 300;
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json(await getNews()); }
