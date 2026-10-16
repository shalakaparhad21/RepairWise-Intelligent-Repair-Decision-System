const LIGHT = { bg: '#F2F8F4', card: '#FFFFFF', ink: '#0E2A23', sub: '#5B7268', green: '#1F6F54', mint: '#DCEFE4', amber: '#D98E04', red: '#D1483B', line: '#DDE8E1' };
const DARK = { bg: '#0F1A16', card: '#17251F', ink: '#E8F3EC', sub: '#9DB5AA', green: '#2E9E78', mint: '#1F3329', amber: '#F0A81A', red: '#E5645A', line: '#26382F' };
export const C = { ...LIGHT };
export const applyTheme = (dark) => Object.assign(C, dark ? DARK : LIGHT);
export const VERDICT = {
  REPAIR: { label: 'Repair it', icon: 'construct', get color() { return C.green; } },
  REFURBISH: { label: 'Refurbish or donate', icon: 'refresh', get color() { return C.amber; } },
  REPLACE: { label: 'Replace it', icon: 'swap-horizontal', get color() { return C.red; } },
};
export function inr(n) {
  const s = String(Math.round(n));
  if (s.length <= 3) return '₹' + s;
  return '₹' + s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + s.slice(-3);
}
