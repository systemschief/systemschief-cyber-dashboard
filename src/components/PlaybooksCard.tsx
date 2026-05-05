'use client';
import { useState } from 'react';

type TTPEntry = { tactic: string; technique: string };
type Playbook = {
  group: string;
  aka: string[];
  origin: string;
  motivation: string;
  sectors: string[];
  ttps: TTPEntry[];
  iocs: string[];
  mitigations: string[];
  mitre: string;
  severity: 'critical' | 'high';
};

const PLAYBOOKS: Playbook[] = [
  {
    group: 'Scattered Spider',
    aka: ['UNC3944', 'Octo Tempest'],
    origin: 'Western (English-speaking)',
    motivation: 'Financial',
    sectors: ['Telecom', 'BPO', 'Finance', 'Hospitality'],
    ttps: [
      { tactic: 'Initial Access', technique: 'SIM Swapping / SMS Phishing (Smishing)' },
      { tactic: 'Credential Access', technique: 'MFA Fatigue Bombing & Helpdesk Social Engineering' },
      { tactic: 'Persistence', technique: 'Legitimate RMM Tools (Anydesk, TeamViewer)' },
      { tactic: 'Exfiltration', technique: 'MEGA / ShareFile cloud upload' },
      { tactic: 'Impact', technique: 'BlackCat/ALPHV ransomware deployment' },
    ],
    iocs: ['Domains mimicking IT helpdesk portals', 'Azure AD OAuth app abuse', 'okta-sso[.]com lookalikes'],
    mitigations: [
      'Enforce phishing-resistant MFA (FIDO2/YubiKey)',
      'Strict helpdesk identity verification policy',
      'Block unapproved RMM tools via application control',
      'Monitor for new OAuth app consent grants in Entra ID',
    ],
    mitre: 'https://attack.mitre.org/groups/G1015/',
    severity: 'critical',
  },
  {
    group: 'LockBit',
    aka: ['ABCD', 'LockBit 3.0'],
    origin: 'Russia-affiliated',
    motivation: 'Financial (RaaS)',
    sectors: ['Healthcare', 'Manufacturing', 'Government', 'Finance'],
    ttps: [
      { tactic: 'Initial Access', technique: 'Phishing, Exposed RDP, VPN credential stuffing' },
      { tactic: 'Lateral Movement', technique: 'PsExec, WMI, Cobalt Strike' },
      { tactic: 'Defense Evasion', technique: 'Process injection, Timestomping, Log wiping' },
      { tactic: 'Exfiltration', technique: 'StealBit exfiltration tool' },
      { tactic: 'Impact', technique: 'Double-extortion ransomware + leak site' },
    ],
    iocs: ['StealBit binary hashes', 'LockBit ransom note "Restore-My-Files.txt"', 'Lateral movement via port 445/135'],
    mitigations: [
      'Patch exposed RDP — disable if not needed',
      'Enable EDR behavioral detection for Cobalt Strike',
      'Immutable backups with offline copy',
      'Segment AD from workstation tier',
    ],
    mitre: 'https://attack.mitre.org/groups/G0032/',
    severity: 'critical',
  },
  {
    group: 'APT29 / Cozy Bear',
    aka: ['Midnight Blizzard', 'The Dukes', 'NOBELIUM'],
    origin: 'Russia (SVR)',
    motivation: 'Espionage',
    sectors: ['Government', 'Defense', 'Technology', 'NGO'],
    ttps: [
      { tactic: 'Initial Access', technique: 'Spearphishing with zero-day attachments' },
      { tactic: 'Persistence', technique: 'OAuth token theft, Service principal abuse' },
      { tactic: 'C2', technique: 'SUNBURST/TEARDROP via legitimate cloud services (Dropbox, OneDrive)' },
      { tactic: 'Credential Access', technique: 'Password spray against Azure AD/M365' },
      { tactic: 'Exfiltration', technique: 'Slow, low-volume exfiltration to evade DLP' },
    ],
    iocs: ['SUNBURST/SUNSPOT SolarWinds DLLs', 'Anomalous OAuth app activity in Entra', 'ADFS token forgery (Golden SAML)'],
    mitigations: [
      'Enforce Conditional Access with IP/device compliance',
      'Monitor service principal activity and OAuth consent',
      'Deploy Microsoft Defender for Identity',
      'Enable ADFS sign-in logging and alerting',
    ],
    mitre: 'https://attack.mitre.org/groups/G0016/',
    severity: 'critical',
  },
  {
    group: 'APT41 / Double Dragon',
    aka: ['Winnti', 'Barium', 'Bronze Atlas'],
    origin: 'China (MSS-affiliated)',
    motivation: 'Espionage + Financial',
    sectors: ['Healthcare', 'Pharma', 'Tech', 'Telecom', 'Gaming'],
    ttps: [
      { tactic: 'Initial Access', technique: 'Supply chain compromise, ProxyLogon exploitation' },
      { tactic: 'Persistence', technique: 'Rootkits, Bootkit, Modified VBR' },
      { tactic: 'C2', technique: 'SHADOWPAD, PlugX, Winnti malware' },
      { tactic: 'Lateral Movement', technique: 'Pass-the-Hash, Kerberoasting, WMI' },
      { tactic: 'Collection', technique: 'Targeted IP theft and financial fraud' },
    ],
    iocs: ['PlugX/SHADOWPAD DLL sideloads', 'Modified CLFS log files', 'Unusual WMI subscription creation'],
    mitigations: [
      'Audit and harden software supply chain',
      'Block DLL sideloading via AppLocker/WDAC',
      'Threat hunt for PlugX network IOCs',
      'Privileged access workstations for sensitive roles',
    ],
    mitre: 'https://attack.mitre.org/groups/G0096/',
    severity: 'critical',
  },
  {
    group: 'Cl0p',
    aka: ['TA505', 'FIN11'],
    origin: 'Russia/Eastern Europe',
    motivation: 'Financial (RaaS)',
    sectors: ['Healthcare', 'Finance', 'Higher Education', 'Energy'],
    ttps: [
      { tactic: 'Initial Access', technique: 'Zero-day exploitation (MOVEit, GoAnywhere, Accellion)' },
      { tactic: 'Persistence', technique: 'Web shells on file transfer appliances' },
      { tactic: 'Exfiltration', technique: 'Mass bulk data exfil before encryption' },
      { tactic: 'Impact', technique: 'Data-leak extortion without always encrypting' },
    ],
    iocs: ['Webshells on MOVEit/GoAnywhere instances', 'LEMURLOOT web shell artifacts', 'Cl0p ransom note patterns'],
    mitigations: [
      'Immediately patch all managed file transfer appliances',
      'Restrict internet-facing MFT services to VPN only',
      'Enable file integrity monitoring on MFT directories',
      'Hunt for LEMURLOOT indicators in IIS logs',
    ],
    mitre: 'https://attack.mitre.org/groups/G0154/',
    severity: 'critical',
  },
  {
    group: 'Lazarus Group',
    aka: ['HIDDEN COBRA', 'APT38', 'Zinc'],
    origin: 'North Korea (RGB)',
    motivation: 'Financial + Espionage',
    sectors: ['Crypto/DeFi', 'Defense', 'Finance', 'Media'],
    ttps: [
      { tactic: 'Initial Access', technique: 'LinkedIn fake recruiter spearphishing' },
      { tactic: 'C2', technique: 'BLINDINGCAN, COPPERHEDGE, MATA framework' },
      { tactic: 'Credential Access', technique: 'Browser credential theft, keyloggers' },
      { tactic: 'Collection', technique: 'Crypto wallet draining via trojanized apps' },
      { tactic: 'Impact', technique: 'Destructive wiper (WhisperGate-style)' },
    ],
    iocs: ['Trojanized crypto trading apps', 'MATA C2 domain patterns', 'ZIP archives delivered via fake job offers'],
    mitigations: [
      'Security awareness: verify recruiter identities out-of-band',
      'Block unsigned macros in Office documents',
      'Harden crypto wallet infrastructure with HSMs',
      'Monitor for DNS queries to newly registered domains',
    ],
    mitre: 'https://attack.mitre.org/groups/G0032/',
    severity: 'high',
  },
];

export function PlaybooksCard() {
  const [selected, setSelected] = useState<Playbook>(PLAYBOOKS[0]);
  const [activeTab, setActiveTab] = useState<'ttps' | 'mitigations'>('ttps');

  return (
    <section className="mt-5">
      <div className="mono mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[.28em] text-[#5a6571]">
        <span className="border hairline px-2 py-1 text-[#39ff7a]">Threat Actor Playbooks</span>
        <span>{'// Response Reference'}</span>
      </div>

      <div className="panel grid grid-cols-1 gap-0 lg:grid-cols-[240px_1fr]">
        {/* Group selector sidebar */}
        <div className="border-b lg:border-b-0 lg:border-r hairline">
          <div className="mono p-3 text-[9px] uppercase tracking-[.24em] text-[#5a6571] border-b hairline">
            Active Groups
          </div>
          {PLAYBOOKS.map((pb) => (
            <button
              key={pb.group}
              onClick={() => { setSelected(pb); setActiveTab('ttps'); }}
              className={`w-full text-left px-4 py-3 border-b hairline last:border-b-0 transition-colors ${
                selected.group === pb.group
                  ? 'bg-[#39ff7a]/8 text-[#39ff7a]'
                  : 'text-[#8b97a1] hover:text-[#e6edf3] hover:bg-white/4'
              }`}
            >
              <div className="mono text-[10px] uppercase tracking-[.14em] font-semibold">{pb.group}</div>
              <div className="mono text-[9px] text-[#5a6571] mt-0.5">{pb.origin}</div>
            </button>
          ))}
        </div>

        {/* Playbook detail panel */}
        <div className="p-5">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`mono text-[9px] uppercase border px-2 py-0.5 ${
                  selected.severity === 'critical' ? 'severity-critical' : 'severity-high'
                }`}>{selected.severity}</span>
                <h3 className="mono text-sm font-semibold uppercase tracking-[.1em] text-[#e6edf3]">{selected.group}</h3>
              </div>
              <div className="mono mt-1 text-[10px] text-[#5a6571]">
                AKA: {selected.aka.join(' · ')}
              </div>
            </div>
            <a
              href={selected.mitre}
              target="_blank"
              rel="noreferrer"
              className="mono text-[9px] uppercase tracking-[.14em] border hairline px-2 py-1 text-[#5a6571] hover:text-[#39ff7a] hover:border-[#39ff7a]/40"
            >
              MITRE ATT&amp;CK ↗
            </a>
          </div>

          {/* Metadata row */}
          <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
            {[
              ['Motivation', selected.motivation],
              ['Origin', selected.origin],
              ['Sectors', selected.sectors.slice(0, 2).join(', ') + (selected.sectors.length > 2 ? '…' : '')],
            ].map(([label, value]) => (
              <div key={label} className="border hairline p-2">
                <div className="mono text-[9px] uppercase tracking-[.18em] text-[#5a6571]">{label}</div>
                <div className="mono text-[10px] text-[#8b97a1] mt-1">{value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mono flex gap-0 border-b hairline mb-3 text-[10px] uppercase tracking-[.16em]">
            {(['ttps', 'mitigations'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#39ff7a] text-[#39ff7a]'
                    : 'border-transparent text-[#5a6571] hover:text-[#8b97a1]'
                }`}
              >
                {tab === 'ttps' ? 'TTPs' : 'Mitigations'}
              </button>
            ))}
          </div>

          {/* TTP list */}
          {activeTab === 'ttps' && (
            <div className="space-y-2">
              {selected.ttps.map((t) => (
                <div key={t.tactic} className="flex gap-3 text-sm">
                  <span className="mono shrink-0 w-32 text-[10px] uppercase tracking-[.1em] text-[#39ff7a] pt-0.5">{t.tactic}</span>
                  <span className="text-[#8b97a1] text-xs leading-5">{t.technique}</span>
                </div>
              ))}
              {/* IOCs */}
              <div className="mt-4 border-t hairline pt-3">
                <div className="mono text-[9px] uppercase tracking-[.2em] text-[#5a6571] mb-2">Key IOC Signatures</div>
                <ul className="space-y-1">
                  {selected.iocs.map((ioc) => (
                    <li key={ioc} className="mono text-[11px] text-[#8b97a1] flex gap-2">
                      <span className="text-[#39ff7a]">›</span>{ioc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Mitigations list */}
          {activeTab === 'mitigations' && (
            <ul className="space-y-2">
              {selected.mitigations.map((m, i) => (
                <li key={m} className="flex gap-3">
                  <span className="mono shrink-0 text-[10px] text-[#39ff7a] pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-[#8b97a1] leading-6">{m}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
