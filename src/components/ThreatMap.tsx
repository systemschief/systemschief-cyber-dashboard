const coords: Record<string, [number, number]> = {
  US: [-98, 39], USA: [-98, 39], UnitedStates: [-98, 39], Canada: [-106, 56], CA: [-106, 56],
  UnitedKingdom: [-2, 54], UK: [-2, 54], GB: [-2, 54], Germany: [10, 51], DE: [10, 51],
  France: [2, 46], FR: [2, 46], Italy: [12, 43], IT: [12, 43], Spain: [-4, 40], ES: [-4, 40],
  India: [78, 21], IN: [78, 21], Australia: [133, -25], AU: [133, -25], Brazil: [-51, -10], BR: [-51, -10],
  Japan: [138, 37], JP: [138, 37], China: [104, 35], CN: [104, 35], Mexico: [-102, 23], MX: [-102, 23],
  Netherlands: [5, 52], NL: [5, 52], Belgium: [4, 50], BE: [4, 50], Switzerland: [8, 47], CH: [8, 47],
};

function key(s: string) { return s.replace(/[^a-zA-Z]/g, ''); }
function project([lon, lat]: [number, number]) {
  return [((lon + 180) / 360) * 640, ((90 - lat) / 180) * 300] as const;
}

const continents = [
  'M94 100 C145 54 220 62 265 102 C246 144 188 152 163 197 C121 181 82 153 94 100Z',
  'M300 82 C347 52 438 52 480 91 C463 123 410 117 397 154 C363 154 317 135 300 82Z',
  'M334 150 C371 137 420 164 422 213 C388 252 331 238 319 193 C315 174 320 160 334 150Z',
  'M462 130 C512 103 586 118 608 165 C565 196 509 184 462 130Z',
  'M475 220 C509 206 560 217 574 252 C535 280 489 265 475 220Z',
  'M192 204 C232 214 249 250 221 288 C184 277 166 239 192 204Z',
];

export function ThreatMap({ byCountry }: { byCountry: Record<string, number> }) {
  const markers = Object.entries(byCountry)
    .map(([country, count]) => ({ country, count, xy: coords[country] ?? coords[key(country)] }))
    .filter((m): m is { country: string; count: number; xy: [number, number] } => Boolean(m.xy));
  return (
    <section className="panel h-full p-5">
      <h2 className="mono mb-5 border-b hairline pb-3 text-xs uppercase tracking-[.22em] text-[#39ff7a]">Geographic threat origin</h2>
      <svg viewBox="0 0 640 300" className="h-[265px] w-full" role="img" aria-label="Minimal world map of ransomware victim concentration">
        <rect width="640" height="300" fill="#0c1013" />
        {continents.map((d, i) => <path key={i} d={d} fill="#151b20" stroke="rgba(255,255,255,.08)" strokeWidth="1" />)}
        <g opacity=".35" stroke="rgba(255,255,255,.08)" strokeWidth=".6">
          {[80,160,240,320,400,480,560].map(x => <line key={`x${x}`} x1={x} y1="0" x2={x} y2="300" />)}
          {[60,120,180,240].map(y => <line key={`y${y}`} x1="0" y1={y} x2="640" y2={y} />)}
        </g>
        {markers.map((m) => {
          const [x, y] = project(m.xy);
          const r = Math.min(10, 3 + m.count * 2);
          return <g key={m.country}><circle cx={x} cy={y} r={r} fill="#39ff7a" opacity="0.7" /><circle cx={x} cy={y} r={Math.min(18, 7 + m.count * 3)} fill="none" stroke="#39ff7a" opacity="0.2" /></g>;
        })}
      </svg>
      <div className="mono mt-3 grid grid-cols-2 gap-2 text-[10px] uppercase text-[#5a6571]">
        {markers.slice(0, 4).map(m => <span key={m.country}>{m.country}: <b className="text-[#e6edf3]">{m.count}</b></span>)}
      </div>
    </section>
  );
}
