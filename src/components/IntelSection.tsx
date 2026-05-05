import type { KevEntry, CveItem, RansomwareVictim } from '@/lib/types';
import { severityClass, timeAgo } from '@/lib/format';
import { CvesCard } from './CvesCard';
import { RansomwareCard } from './RansomwareCard';
import { ThreatMap } from './ThreatMap';
import { KevStrip } from './KevStrip';

export function IntelSection({
  cves,
  kev,
  ransomware,
}: {
  cves: CveItem[];
  kev: KevEntry[];
  ransomware: { victims: RansomwareVictim[]; byCountry: Record<string, number> };
}) {
  return (
    <div className="intel-section">
      <div className="intel-section__header">
        <h2 className="mono text-xs uppercase tracking-[.3em] text-[#39ff7a] mb-1">Threat Intel</h2>
        <p className="text-[#5a6571] mono text-[10px] uppercase tracking-[.16em]">CVE Watchlist · CISA KEV · Ransomware Activity</p>
      </div>

      {/* KEV strip */}
      <div className="mt-6">
        <KevStrip entries={kev.slice(0, 10)} />
      </div>

      {/* Three-column grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4"><CvesCard items={cves} /></div>
        <div className="xl:col-span-4"><RansomwareCard victims={ransomware.victims} /></div>
        <div className="xl:col-span-4"><ThreatMap byCountry={ransomware.byCountry} /></div>
      </div>

      {/* KEV Detail table */}
      <div className="mt-5 panel p-5">
        <h3 className="mono mb-4 text-xs uppercase tracking-[.22em] text-[#39ff7a] border-b hairline pb-3">
          CISA KEV — Latest Additions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="mono text-[9px] uppercase tracking-[.2em] text-[#5a6571] border-b hairline">
                <th className="text-left pb-2 pr-4">CVE ID</th>
                <th className="text-left pb-2 pr-4">Vendor / Product</th>
                <th className="text-left pb-2 pr-4">Date Added</th>
                <th className="text-left pb-2 pr-4">Due Date</th>
                <th className="text-left pb-2">Ransomware Use</th>
              </tr>
            </thead>
            <tbody>
              {kev.slice(0, 15).map((k) => (
                <tr key={k.cveId} className="border-b hairline text-sm hover:bg-white/[.03] transition-colors">
                  <td className="py-2 pr-4">
                    <a href={`https://nvd.nist.gov/vuln/detail/${k.cveId}`} target="_blank" rel="noreferrer" className="mono text-[#e04cff] hover:text-[#39ff7a] text-xs">
                      {k.cveId}
                    </a>
                  </td>
                  <td className="py-2 pr-4 text-xs text-[#8b97a1]">{k.vendorProject} / {k.product}</td>
                  <td className="py-2 pr-4 mono text-[11px] text-[#5a6571]">{k.dateAdded}</td>
                  <td className="py-2 pr-4 mono text-[11px] text-[#ffd23d]">{k.dueDate}</td>
                  <td className="py-2">
                    <span className={`mono text-[9px] border px-2 py-0.5 uppercase ${
                      k.knownRansomwareCampaignUse === 'Known'
                        ? 'severity-critical'
                        : 'text-[#5a6571] border-[#5a6571]/40'
                    }`}>
                      {k.knownRansomwareCampaignUse}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
