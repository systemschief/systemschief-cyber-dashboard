'use client';

export type SectionId = 'home' | 'news' | 'advisories' | 'playbooks' | 'sources';

const SECTIONS: { id: SectionId; glyph: string; label: string; sub: string }[] = [
  { id: 'home',        glyph: '⬡', label: 'Overview',    sub: 'Threat Landscape'     },
  { id: 'news',        glyph: '◈', label: 'Cyber News',  sub: 'Security · Privacy · Compliance' },
  { id: 'advisories',  glyph: '◎', label: 'Advisories',  sub: 'CVE · KEV · Alerts · Exploits' },
  { id: 'playbooks',   glyph: '▣', label: 'Playbooks',   sub: 'Threat Actor TTPs'    },
  { id: 'sources',     glyph: '◉', label: 'Sources',     sub: 'Feed Health'          },
];

export function SectionNav({ active, onChange }: { active: SectionId; onChange: (s: SectionId) => void }) {
  return (
    <nav className="section-nav" aria-label="Dashboard sections">
      <div className="section-nav__spine" aria-hidden="true" />
      {SECTIONS.map((s) => {
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`section-nav__item ${isActive ? 'section-nav__item--active' : ''}`}
          >
            <span className="section-nav__glyph" aria-hidden="true">{s.glyph}</span>
            <span className="section-nav__text">
              <span className="section-nav__label">{s.label}</span>
              <span className="section-nav__sub">{s.sub}</span>
            </span>
            {isActive && <span className="section-nav__bar" aria-hidden="true" />}
          </button>
        );
      })}
    </nav>
  );
}
