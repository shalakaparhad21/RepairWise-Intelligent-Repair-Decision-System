// Approximate values for a college project. Cite real sources (e.g. Global E-waste Monitor) in the report.
export const CATS = {
  smartphone: { label: 'Smartphone', icon: 'phone-portrait-outline', life: 4, price: 20000, kg: 0.2, co2: 70 },
  laptop: { label: 'Laptop', icon: 'laptop-outline', life: 6, price: 55000, kg: 2.2, co2: 300 },
  tv: { label: 'TV', icon: 'tv-outline', life: 8, price: 35000, kg: 10, co2: 400 },
  fridge: { label: 'Refrigerator', icon: 'cube-outline', life: 12, price: 30000, kg: 60, co2: 500 },
  washer: { label: 'Washing machine', icon: 'water-outline', life: 10, price: 28000, kg: 55, co2: 400 },
  ac: { label: 'Air conditioner', icon: 'snow-outline', life: 10, price: 38000, kg: 45, co2: 600 },
  mixer: { label: 'Mixer grinder', icon: 'nutrition-outline', life: 7, price: 4000, kg: 3, co2: 25 },
  fan: { label: 'Fan', icon: 'sync-outline', life: 8, price: 2500, kg: 4, co2: 20 },
  headphones: { label: 'Headphones', icon: 'headset-outline', life: 3, price: 3000, kg: 0.3, co2: 15 },
  other: { label: 'Other item', icon: 'build-outline', life: 5, price: 5000, kg: 2, co2: 40 },
  bicycle: { label: 'Bicycle', icon: 'bicycle-outline', life: 10, price: 12000, kg: 14, co2: 120 },
};
export const SEV_SHARE = { minor: 0.08, moderate: 0.25, severe: 0.55 };
const clamp = (n) => Math.max(0, Math.min(100, n));

export function decide(i) {
  const c = i.custom ? { ...CATS[i.category], ...i.custom } : CATS[i.category];
  const noun = i.custom ? 'item' : c.label.toLowerCase();
  const repair = i.warranty ? 0 : i.repairCost;
  const ratio = repair / i.newCost;
  const factors = [
    { k: 'Repair cost vs new', v: clamp(100 * (1 - (ratio - 0.2) / 0.5)), w: 35 },
    { k: 'Remaining life', v: clamp(100 * (1 - i.age / c.life)), w: 25 },
    { k: 'Ease of repair', v: clamp((i.partsEasy ? 80 : 40) + { minor: 10, moderate: 0, severe: -20 }[i.severity]), w: 15 },
    { k: 'Warranty', v: i.warranty ? 100 : 30, w: 10 },
    { k: 'Environmental benefit', v: clamp(30 + c.co2 / 8), w: 15 },
  ];
  const score = Math.round(factors.reduce((s, f) => s + (f.v * f.w) / 100, 0));
  const verdict = score >= 58 ? 'REPAIR' : score >= 40 ? 'REFURBISH' : 'REPLACE';
  const left = Math.max(0, c.life - i.age);
  const reasons = [
    i.warranty ? 'Under warranty, so the repair is free.' : `Repair costs about ${Math.round(ratio * 100)}% of a new ${noun}.`,
    left > 0 ? `About ${left} of ${c.life} typical years of life remain.` : 'It is past its typical lifespan.',
    i.partsEasy ? 'Spare parts and technicians are easy to find.' : 'Parts are hard to find, which raises risk.',
  ];
  return {
    score, verdict, factors, reasons,
    confidence: Math.round(Math.min(95, 55 + Math.abs(score - 50) * 0.8)),
    saved: Math.max(0, i.newCost - repair), co2: c.co2, ewaste: c.kg,
    breakEven: repair > 0 ? Math.ceil(repair / (i.newCost / (c.life * 12))) : 0,
  };
}

const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);
export function totals(list) {
  const r = list.filter((x) => x.outcome === 'repaired');
  return { count: r.length, saved: sum(r, (x) => x.result.saved), co2: sum(r, (x) => x.result.co2), ewaste: sum(r, (x) => x.result.ewaste) };
}
const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function monthly(list) {
  const now = new Date(), out = [];
  for (let k = 5; k >= 0; k--) {
    const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
    const value = sum(list.filter((x) => x.outcome === 'repaired' && new Date(x.date).getFullYear() === d.getFullYear() && new Date(x.date).getMonth() === d.getMonth()), (x) => x.result.saved);
    out.push({ label: M[d.getMonth()], value });
  }
  return out;
}

export const HAZARDS = { battery: 'Battery is swollen or bulging', burn: 'Burning smell, sparks or smoke', water: 'Water or liquid got inside', wires: 'Exposed or damaged wires' };
export function safety(i) {
  const h = i.hazards || [];
  if (h.length) return { level: 'pro', reason: `You reported a hazard (${h.map((k) => HAZARDS[k].toLowerCase()).join(', ')}). Do not open or repair it yourself.` };
  if (['tv', 'ac', 'fridge', 'washer'].includes(i.category) && i.severity !== 'minor') return { level: 'pro', reason: 'This appliance has mains electricity, stored charge or gas. Leave it to a technician.' };
  return { level: 'ok', reason: 'Basic checks like cleaning, reseating and tightening are fine. Stop if anything feels hot or smells burnt.' };
}
export function secondLife(i, r) {
  if ((i.hazards || []).length) return [{ t: 'Take it to a technician or authorised recycler', w: 'It has a safety hazard, so do not sell, donate or keep using it.' }];
  const c = i.custom ? { ...CATS[i.category], ...i.custom } : CATS[i.category];
  const old = i.age / c.life, out = [];
  if (r.verdict === 'REPAIR') out.push({ t: 'Repair it and keep using it', w: 'The repair is worth it and extends its life.' }, { t: 'Resell or donate it later', w: 'When you upgrade, a repaired item still has value.' });
  else if (r.verdict === 'REFURBISH') out.push({ t: 'Sell to a refurbisher or donate', w: 'It has some life left, but the full repair is not a great deal.' }, { t: 'Give it to a repair workshop for parts', w: 'Skilled repairers can reuse working parts.' });
  else out.push({ t: 'Recycle at an authorised e-waste centre', w: 'Replacing is the better option, so make sure the old one is recycled properly.' });
  if (i.severity === 'minor' && old > 0.9) out.push({ t: 'Keep using it as it is', w: 'The problem is small and the item is old. Check whether it still does the job.' });
  if (r.verdict !== 'REPAIR' && old < 0.8) out.push({ t: 'Sell it for parts', w: 'Younger items still have working parts that buyers want.' });
  return out;
}
export function outcomeStats(list) {
  const L = list.filter((x) => x.outcomeLog);
  if (!L.length) return { n: 0, rate: 0, avgMonths: 0 };
  return { n: L.length, rate: Math.round((100 * L.filter((x) => x.outcomeLog.worked).length) / L.length), avgMonths: Math.round(sum(L, (x) => x.outcomeLog.months) / L.length) };
}
