import React from 'react';
import { View, Text as RNText, Pressable, ScrollView } from 'react-native';
import { useStore } from './store';
import { tr } from './i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, VERDICT } from './theme';
import { CATS } from './engine';

export function Text({ children, ...p }) {
  useStore();
  let c = children;
  if (Array.isArray(c) && c.every((x) => typeof x === 'string' || typeof x === 'number')) { const j = c.join(''); const t = tr(j); if (t !== j) c = t; }
  else if (typeof c === 'string') c = tr(c);
  return <RNText {...p}>{c}</RNText>;
}
export function Screen({ children, header }) {
  const i = useSafeAreaInsets();
  return <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: header ? 16 : i.top + 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}
export const H1 = ({ children }) => <Text style={{ fontSize: 28, fontWeight: '800', color: C.ink }}>{children}</Text>;
export const H2 = ({ children }) => <Text style={{ fontSize: 17, fontWeight: '700', color: C.ink, marginTop: 24 }}>{children}</Text>;
export const Sub = ({ children, style }) => <Text style={[{ fontSize: 15, color: C.sub, lineHeight: 21, marginTop: 4 }, style]}>{children}</Text>;
export const Card = ({ children, style }) => <View style={[{ backgroundColor: C.card, borderRadius: 18, padding: 16, marginTop: 12, borderWidth: 1, borderColor: C.line }, style]}>{children}</View>;
export function Btn({ title, onPress, color = C.green, outline, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ paddingVertical: 15, borderRadius: 14, alignItems: 'center', backgroundColor: outline ? 'transparent' : color, borderWidth: outline ? 1.5 : 0, borderColor: color, opacity: pressed ? 0.8 : 1 }, style]}>
      <Text style={{ color: outline ? color : '#fff', fontSize: 16, fontWeight: '700' }}>{title}</Text>
    </Pressable>
  );
}
export const Chip = ({ label, on, onPress }) => (
  <Pressable onPress={onPress} style={{ paddingVertical: 9, paddingHorizontal: 14, borderRadius: 20, marginRight: 8, marginBottom: 8, backgroundColor: on ? C.green : C.mint }}>
    <Text style={{ color: on ? '#fff' : C.ink, fontWeight: '600' }}>{label}</Text>
  </Pressable>
);
export const Stat = ({ value, label, color = C.ink }) => (
  <View style={{ flex: 1 }}><Text style={{ fontSize: 21, fontWeight: '800', color }}>{value}</Text><Text style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{label}</Text></View>
);
export const Bar = ({ label, value, color }) => (
  <View style={{ marginTop: 12 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: C.ink, fontSize: 14 }}>{label}</Text><Text style={{ color: C.sub, fontSize: 14 }}>{Math.round(value)} of 100</Text></View>
    <View style={{ height: 8, borderRadius: 4, backgroundColor: C.mint, marginTop: 6 }}><View style={{ height: 8, borderRadius: 4, width: `${value}%`, backgroundColor: color }} /></View>
  </View>
);
export function Row({ d, onPress }) {
  const v = VERDICT[d.result.verdict];
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
      <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' }}><Ionicons name={CATS[d.category].icon} size={21} color={C.green} /></View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: C.ink }}>{d.name}</Text>
        <Text style={{ fontSize: 13, color: v.color, fontWeight: '600', marginTop: 2 }}>{v.label}</Text>
        <Text style={{ fontSize: 12, color: C.sub, marginTop: 1 }}>{d.outcome === 'pending' ? 'Outcome not marked yet' : d.outcome === 'repaired' ? 'You repaired it' : 'You replaced it'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={C.sub} />
    </Pressable>
  );
}
