import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  const auth = request.headers.get('authorization');
  const expected = process.env.REVALIDATE_TOKEN;
  if (!expected) return NextResponse.json({ revalidated: false, error: 'REVALIDATE_TOKEN not configured' }, { status: 501 });
  if (auth !== `Bearer ${expected}`) return NextResponse.json({ revalidated: false, error: 'Unauthorized' }, { status: 401 });
  if (!tag?.startsWith('feed-')) return NextResponse.json({ revalidated: false, error: 'Missing or invalid tag' }, { status: 400 });
  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, tag, now: new Date().toISOString() });
}
