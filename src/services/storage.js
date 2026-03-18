import { Storage } from '@ionic/storage';

const SUBSCRIPTIONS_KEY = 'subscriptions';
const SETTINGS_KEY = 'settings';
const NOTIFICATION_ID_COUNTER_KEY = 'notificationIdCounter';

let storageInstance = null;

export async function getStorage() {
  if (!storageInstance) {
    storageInstance = new Storage();
    await storageInstance.create();
  }
  return storageInstance;
}

export async function getSubscriptions() {
  const storage = await getStorage();
  const data = await storage.get(SUBSCRIPTIONS_KEY);
  return Array.isArray(data) ? data : [];
}

export async function setSubscriptions(subscriptions) {
  const storage = await getStorage();
  await storage.set(SUBSCRIPTIONS_KEY, subscriptions);
}

export async function getSettings() {
  const storage = await getStorage();
  const data = await storage.get(SETTINGS_KEY);
  const defaults = { notificationsEnabled: true, currency: 'USD' };
  return data ? { ...defaults, ...data } : defaults;
}

export async function setSettings(settings) {
  const storage = await getStorage();
  await storage.set(SETTINGS_KEY, settings);
}

export async function getNextNotificationIds() {
  const storage = await getStorage();
  let counter = await storage.get(NOTIFICATION_ID_COUNTER_KEY);
  if (counter == null) counter = 0;
  const id3Day = counter;
  const id1Day = counter + 1;
  await storage.set(NOTIFICATION_ID_COUNTER_KEY, counter + 2);
  return { id3Day, id1Day };
}

export async function setNotificationIdCounter(value) {
  const storage = await getStorage();
  await storage.set(NOTIFICATION_ID_COUNTER_KEY, value);
}
