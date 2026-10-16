import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { CATS, totals } from './engine';
import { VERDICT, inr } from './theme';

const COL = { REPAIR: '#1F6F54', REFURBISH: '#D98E04', REPLACE: '#D1483B' };
const td = 'style="padding:8px;border-bottom:1px solid #DDE8E1"';
const wrap = (sub, body) => `<html><body style="font-family:Helvetica,Arial,sans-serif;padding:28px;color:#0E2A23"><h1 style="color:#1F6F54;margin:0">RepairWise</h1><p style="color:#5B7268;margin:4px 0 18px">${sub}</p>${body}<p style="color:#5B7268;font-size:11px;margin-top:28px">Figures are approximate estimates. Created on ${new Date().toLocaleDateString()}.</p></body></html>`;

async function out(html) {
  try {
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
    else Alert.alert('PDF saved', uri);
  } catch (e) {
    Alert.alert('Could not create the PDF', 'Please try again.');
  }
}

export function shareDecision(d) {
  const r = d.result;
  const rows = r.factors.map((f) => `<tr><td ${td}>${f.k} (${f.w}%)</td><td ${td}>${Math.round(f.v)} of 100</td></tr>`).join('');
  out(wrap('Repair decision report', `
    <h2 style="margin:0">${d.name} <span style="color:#5B7268;font-size:14px">(${CATS[d.category].label}, ${d.age} years old)</span></h2>
    <h2 style="color:${COL[r.verdict]}">${VERDICT[r.verdict].label}</h2>
    <p>Repair score ${r.score} of 100, confidence ${r.confidence}%.</p>
    <p>Repair cost: ${inr(d.warranty ? 0 : d.repairCost)}. New price: ${inr(d.newCost)}.</p>
    <ul>${r.reasons.map((t) => `<li>${t}</li>`).join('')}</ul>
    <table style="width:100%;border-collapse:collapse">${rows}</table>
    <p><b>If repaired:</b> saves ${inr(r.saved)}, avoids ${r.co2} kg CO2 and ${r.ewaste} kg e-waste.</p>`));
}

export function shareImpact(list) {
  const t = totals(list);
  const rows = list.filter((x) => x.outcome === 'repaired').map((x) => `<tr><td ${td}>${x.name}</td><td ${td}>${inr(x.result.saved)}</td><td ${td}>${x.result.co2} kg</td></tr>`).join('');
  out(wrap('Impact report', `
    <p><b>${t.count}</b> items repaired. <b>${inr(t.saved)}</b> saved. <b>${Math.round(t.co2)} kg</b> CO2 avoided. <b>${t.ewaste.toFixed(1)} kg</b> e-waste kept out.</p>
    <table style="width:100%;border-collapse:collapse"><tr><th align="left">Item</th><th align="left">Saved</th><th align="left">CO2</th></tr>${rows}</table>`));
}
