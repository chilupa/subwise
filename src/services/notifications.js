import { LocalNotifications } from '@capacitor/local-notifications';

const DAY_MS = 24 * 60 * 60 * 1000;

const MINUTE_MS = 60 * 1000;
// Set to true to schedule reminders in 1–2 minutes for testing on emulator
const TEST_NOTIFICATIONS = true;

export async function requestNotificationPermissions() {
  try {
    const perm = await LocalNotifications.requestPermissions();
    return perm.display === 'granted';
  } catch (e) {
    return false;
  }
}

export async function scheduleReminders(subscription, notificationId3Day, notificationId1Day) {
  const nextDate = new Date(subscription.nextBillingDate);
  const now = Date.now();

  let at3Days, at1Day;
  if (TEST_NOTIFICATIONS) {
    at3Days = new Date(now + 1 * MINUTE_MS);  // 1 minute from now
    at1Day = new Date(now + 2 * MINUTE_MS);  // 2 minutes from now
  } else {
    at3Days = new Date(nextDate.getTime() - 3 * DAY_MS);
    at1Day = new Date(nextDate.getTime() - 1 * DAY_MS);
  }

  const toSchedule = [];

  if (at3Days.getTime() > now) {
    toSchedule.push({
      id: notificationId3Day,
      title: 'SubTrack: Renewal in 3 days',
      body: `${subscription.name} renews on ${formatDate(nextDate)}`,
      schedule: { at: at3Days },
    });
  }
  if (at1Day.getTime() > now) {
    toSchedule.push({
      id: notificationId1Day,
      title: 'SubTrack: Renewal tomorrow',
      body: `${subscription.name} renews on ${formatDate(nextDate)}`,
      schedule: { at: at1Day },
    });
  }

  if (toSchedule.length > 0) {
    await LocalNotifications.schedule({ notifications: toSchedule });
  }
}

export async function cancelReminders(notificationId3Day, notificationId1Day) {
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: notificationId3Day }, { id: notificationId1Day }],
    });
  } catch (e) {
    // Ignore if notifications already fired or don't exist
  }
}

function formatDate(d) {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
