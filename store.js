import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decide } from './engine';

const Ctx = createContext(null);
const KEY = 'rw_decisions_v1';
// [category, name, age, newCost, repairCost, severity, warranty, partsEasy, monthsAgo, outcome]
const DEMO = [
  ['smartphone', 'Redmi Note 11', 3, 18000, 3500, 'moderate', false, true, 5, 'repaired'],
  ['laptop', 'Dell Inspiron', 4, 52000, 7000, 'moderate', false, true, 4, 'repaired'],
  ['mixer', 'Mixer grinder', 5, 3500, 600, 'minor', false, true, 3, 'repaired'],
  ['tv', 'Sony 43 inch TV', 9, 32000, 19000, 'severe', false, false, 2, 'replaced'],
  ['headphones', 'boAt Rockerz', 2, 2500, 500, 'minor', true, true, 1, 'repaired'],
  ['fan', 'Ceiling fan', 6, 2800, 450, 'minor', false, true, 0, 'pending'],
];
function makeDemo() {
  return DEMO.map((r, n) => {
    const input = { category: r[0], name: r[1], age: r[2], newCost: r[3], repairCost: r[4], severity: r[5], warranty: r[6], partsEasy: r[7] };
    return { ...input, result: decide(input), id: 'demo' + n, outcome: r[9], ...(r[9] === 'repaired' && n < 3 ? { outcomeLog: { worked: n !== 2, cost: Math.round(r[4] * (0.9 + n * 0.15)), months: [9, 6, 2][n], date: new Date().toISOString() } } : {}), date: new Date(Date.now() - r[8] * 30 * 86400000).toISOString() };
  }).reverse();
}

export function Provider({ children }) {
  const [list, setList] = useState([]);
  const [dark, setDarkState] = useState(false);
  const [lang, setLangState] = useState('en');
  const [triage, setTriage] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => v && setList(JSON.parse(v))).catch(() => {});
    AsyncStorage.getItem('rw_lang').then((v) => v && setLangState(v)).catch(() => {});
    AsyncStorage.getItem('rw_dark').then((v) => setDarkState(v === '1')).catch(() => {});
  }, []);
  const save = (next) => { setList(next); AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {}); };
  const add = (d) => {
    const rec = { ...d, id: String(Date.now()), date: new Date().toISOString(), outcome: 'pending' };
    save([rec, ...list]);
    return rec.id;
  };
  const setOutcome = (id, o) => save(list.map((x) => (x.id === id ? { ...x, outcome: o } : x)));
  const setDark = (v) => { setDarkState(v); AsyncStorage.setItem('rw_dark', v ? '1' : '0').catch(() => {}); };
  const logOutcome = (id, log) => save(list.map((x) => (x.id === id ? { ...x, outcomeLog: log } : x)));
  const changeLang = (v) => { setLangState(v); AsyncStorage.setItem('rw_lang', v).catch(() => {}); };
  return <Ctx.Provider value={{ triage, setTriage, clearTriage: () => setTriage(null), logOutcome, lang, changeLang, dark, setDark, list, add, setOutcome, reset: () => save([]), demo: () => save(makeDemo()) }}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx);
