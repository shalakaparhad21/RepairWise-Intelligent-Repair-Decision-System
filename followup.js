import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function scheduleFollowUp(name) {
  try {
    const p = await Notifications.requestPermissionsAsync();
    if (!p.granted) return;
    if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('default', { name: 'Reminders', importance: Notifications.AndroidImportance.DEFAULT });
    await Notifications.scheduleNotificationAsync({
      content: { title: 'RepairWise check-in', body: `Is your ${name} still working fine? Tell us how the repair went.` },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(Date.now() + 182 * 86400000) },
    });
  } catch (e) {}
}
