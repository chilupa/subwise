import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const TEST_NOTIFICATIONS = import.meta.env.VITE_TEST_NOTIFICATIONS === 'true';

/** Parse YYYY-MM-DD as local date (avoids UTC midnight timezone shift). */
function parseLocalDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [y, m, d] = parts;
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return null;
  return date;
}

export async function requestNotificationPermissions() {
  try {
    const perm = await LocalNotifications.requestPermissions();
    return perm.display === 'granted';
  } catch (e) {
    return false;
  }
}

export async function scheduleReminders(subscription, notificationId3Day, notificationId1Day) {
  const nextDate = TEST_NOTIFICATIONS ? new Date() : parseLocalDate(subscription.nextBillingDate);
  if (!nextDate || isNaN(nextDate.getTime())) return;

  const now = Date.now();
  let at3Days, at1Day;
  if (TEST_NOTIFICATIONS) {
    at3Days = new Date(now + 1 * MINUTE_MS);
    at1Day = new Date(now + 2 * MINUTE_MS);
  } else {
    at3Days = new Date(nextDate.getTime() - 3 * DAY_MS);
    at1Day = new Date(nextDate.getTime() - 1 * DAY_MS);
  }

  const toSchedule = [];
  if (at3Days.getTime() > now) {
    toSchedule.push({
      id: notificationId3Day,
      title: 'Subwise: Renewal in 3 days',
      body: `${subscription.name} renews on ${formatDate(nextDate)}`,
      schedule: { at: at3Days },
    });
  }
  if (at1Day.getTime() > now) {
    toSchedule.push({
      id: notificationId1Day,
      title: 'Subwise: Renewal tomorrow',
      body: `${subscription.name} renews on ${formatDate(nextDate)}`,
      schedule: { at: at1Day },
    });
  }

  if (toSchedule.length === 0) return;

  if (!Capacitor.isNativePlatform()) return;

  try {
    await LocalNotifications.schedule({ notifications: toSchedule });
  } catch (e) {
    // Notifications not available (e.g. in browser) or permission denied
  }
}

export async function cancelReminders(notificationId3Day, notificationId1Day) {
  const ids = [notificationId3Day, notificationId1Day].filter(
    (id) => id !== undefined && id !== null && typeof id === 'number'
  );
  if (ids.length === 0) return;

  try {
    await LocalNotifications.cancel({
      notifications: ids.map((id) => ({ id })),
    });
  } catch (e) {
    // Ignore if notifications already fired or don't exist
  }
}

function formatDate(d) {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
