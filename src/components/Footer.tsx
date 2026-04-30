export function Footer() {
  return <footer className="mono mt-8 flex flex-col gap-2 border-t hairline py-6 text-[11px] uppercase tracking-[.16em] text-[#5a6571] sm:flex-row sm:justify-between"><span>Systems Chief — Managed Cybersecurity</span><span>SHA {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? 'local'} · deploy {process.env.NEXT_PUBLIC_DEPLOY_TIME ?? 'build'} · systemschief-cyber.vercel.app</span></footer>;
}
