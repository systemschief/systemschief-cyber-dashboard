# Systems Chief Cyber Dashboard

Live production URL: `https://systemschief-cyber.vercel.app`

Public SOC-facing dashboard for Systems Chief managed cybersecurity operations. The dashboard is built as a dark-only editorial operations console: cyber news wire, CISA KEV strip, recent high-severity NVD CVEs, ransomware.live victim telemetry, and a reserved Lumu Defender incident panel for the next phase.

```text
+-----------------------------+       +--------------------------+
| Browser / public visitors   | ----> | Next.js 15 App Router    |
+-----------------------------+       | Vercel project           |
                                      | systemschief-cyber       |
                                      +------------+-------------+
                                                   |
                                                   v
+------------------+  +----------------+  +----------------------+  +--------------------+
| RSS news feeds   |  | CISA KEV JSON  |  | NVD CVE API 2.0      |  | ransomware.live    |
| /api/news        |  | /api/cisa-kev  |  | /api/cves/trending   |  | /api/ransomware    |
+------------------+  +----------------+  +----------------------+  +--------------------+
                                                   |
                                                   v
                                      +--------------------------+
                                      | /api/status + revalidate |
                                      | Lumu placeholder route   |
                                      +--------------------------+
```

## Data sources

| Internal route | Upstream source | Refresh | Notes |
| --- | --- | --- | --- |
| `/api/news` | BleepingComputer, The Hacker News, Krebs, Dark Reading, CISA Advisories RSS | 5 min | Parallel RSS aggregation with HTML stripping and graceful per-feed degradation |
| `/api/cisa-kev` | CISA Known Exploited Vulnerabilities JSON | 5 min | Returns latest 20 by `dateAdded` plus catalog metadata |
| `/api/cves/trending` | NVD API 2.0 | 5 min | Parallel HIGH and CRITICAL queries over the last 7 days |
| `/api/ransomware` | ransomware.live v2 recent victims | 5 min | Returns normalized victims plus country aggregates for map dots |
| `/api/lumu/incidents` | none in v1 | 5 min | Placeholder only: returns `not_configured` |
| `/api/status` | in-memory feed health | 5 min | `DEGRADED` if one feed degraded, `INCIDENT` if 3+ degraded |
| `/api/revalidate` | Next.js `revalidateTag` | manual | Requires `REVALIDATE_TOKEN` if configured |

## Environment variables

| Variable | Required | Scope | Purpose |
| --- | --- | --- | --- |
| `NVD_API_KEY` | No | Server only | Optional higher NVD API rate limit |
| `REVALIDATE_TOKEN` | No | Server only | Optional bearer token for `POST /api/revalidate?tag=feed-news` |

No client-side secrets are required or used.

## Local development

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Deployment

The production Vercel project is `systemschief-cyber`; the GitHub repository is `systemschief/systemschief-cyber-dashboard`.

```bash
vercel link --yes --project systemschief-cyber --scope systemschief
vercel --prod
```

## Lumu hand-off for phase 2

Single swap-in point: `src/app/api/lumu/incidents/route.ts`.

Next phase requirements:

1. Lumu Defender API key or approved MCP-backed credential path.
2. Company UUID / collector context needed by the Lumu endpoint.
3. Field mapping from Lumu incident records to the dashboard table shape: time, type, affected contacts/endpoints, severity, status.
4. Feed-health integration: mark `lumu` as ok/degraded once the route becomes a real upstream feed.
5. Optional dashboard KPI replacement: swap the `—` Lumu placeholder count for open incident totals.

The v1 route intentionally does not call Lumu.
