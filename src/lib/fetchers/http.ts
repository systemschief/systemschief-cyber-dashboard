export const USER_AGENT = 'Systems-Chief-Cyber-Dashboard/1.0 (+https://systemschief-cyber.vercel.app)';

export async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 10_000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json, application/rss+xml, application/xml, text/xml, */*',
        ...(init.headers ?? {}),
      },
      signal: controller.signal,
      next: { revalidate: 300, ...(init.next ?? {}) },
    });
  } finally {
    clearTimeout(timeout);
  }
}
