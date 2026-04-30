export function LumuPlaceholder() {
  const rows = ['C2C / blocked / high', 'Phishing / contacts / medium', 'Malware / endpoint / critical', 'DGA / DNS / low'];
  return <section className="panel h-full p-5"><h2 className="mono mb-5 border-b hairline pb-3 text-xs uppercase tracking-[.22em] text-[#39ff7a]">Lumu incidents preview</h2><p className="mb-4 text-sm text-[#8b97a1]">Lumu integration — coming soon. Layout reserved for live Defender incidents.</p><div className="space-y-2">{rows.map((row, i) => <div key={row} className="border hairline p-2"><div className="mono text-[10px] text-[#5a6571]">T-{(i+1)*7}M · {row}</div><div className="mt-2 h-2 w-full bg-[#1c2429]"><span className="block h-2 bg-[#39ff7a]/30" style={{ width: `${88 - i*13}%` }} /></div></div>)}</div></section>;
}
