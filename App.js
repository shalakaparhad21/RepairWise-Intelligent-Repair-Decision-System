import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Provider, useStore } from './src/store';
import { C, applyTheme } from './src/theme';
import { tr, setLanguage } from './src/i18n';
import Home from './src/screens/Home';
import Diagnose from './src/screens/Diagnose';
import Result from './src/screens/Result';
import History from './src/screens/History';
import Impact from './src/screens/Impact';
import More from './src/screens/More';
import DIY from './src/screens/DIY';
import Shops from './src/screens/Shops';
import Recycle from './src/screens/Recycle';
import About from './src/screens/About';
import Triage from './src/screens/Triage';
import Reminders from './src/screens/Reminders';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ICONS = { Home: 'home', Check: 'add-circle', History: 'time', Impact: 'leaf', More: 'grid' };
const head = (title) => ({ title: tr(title), headerTintColor: C.ink, headerStyle: { backgroundColor: C.bg }, headerShadowVisible: false });

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: tr(route.name === 'Check' ? 'Check item' : route.name),
        tabBarActiveTintColor: C.green,
        tabBarInactiveTintColor: C.sub,
        tabBarStyle: { backgroundColor: C.card, borderTopColor: C.line },
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Check" component={Diagnose} options={{ title: 'Check item' }} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Impact" component={Impact} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}

function Root() {
  const { dark, lang } = useStore();
  applyTheme(dark);
  setLanguage(lang);
  const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: C.bg, card: C.card, text: C.ink, border: C.line, primary: C.green } };
  return (
    <NavigationContainer key={`${dark}-${lang}`} theme={theme}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Result" component={Result} options={head('Decision')} />
        <Stack.Screen name="DIY" component={DIY} options={head('DIY repair guides')} />
        <Stack.Screen name="Shops" component={Shops} options={head('Repair shops')} />
        <Stack.Screen name="Reminders" component={Reminders} options={head('Reminders')} />
        <Stack.Screen name="Triage" component={Triage} options={head('Damage photo triage')} />
        <Stack.Screen name="Recycle" component={Recycle} options={head('E-waste recycling')} />
        <Stack.Screen name="About" component={About} options={head('About and SDGs')} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider>
        <Root />
      </Provider>
    </SafeAreaProvider>
  );
}
