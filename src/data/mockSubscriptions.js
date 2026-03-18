/**
 * Mock subscriptions shown when the app loads with no saved data.
 * Uses future dates so the list and reminders make sense.
 */
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildMockSubscriptions() {
  const base = new Date();
  return [
    {
      id: 'mock-1',
      name: 'Netflix',
      price: 15.99,
      billingCycle: 'monthly',
      nextBillingDate: addDays(base, 12),
      category: 'Streaming',
      createdAt: new Date().toISOString(),
      notificationId3Day: 0,
      notificationId1Day: 1,
    },
    {
      id: 'mock-2',
      name: 'Spotify',
      price: 9.99,
      billingCycle: 'monthly',
      nextBillingDate: addDays(base, 5),
      category: 'Music',
      createdAt: new Date().toISOString(),
      notificationId3Day: 2,
      notificationId1Day: 3,
    },
    {
      id: 'mock-3',
      name: 'GitHub Pro',
      price: 4,
      billingCycle: 'monthly',
      nextBillingDate: addDays(base, 22),
      category: 'Software',
      createdAt: new Date().toISOString(),
      notificationId3Day: 4,
      notificationId1Day: 5,
    },
    {
      id: 'mock-4',
      name: 'Google One',
      price: 99,
      billingCycle: 'yearly',
      nextBillingDate: addDays(base, 90),
      category: 'Cloud',
      createdAt: new Date().toISOString(),
      notificationId3Day: 6,
      notificationId1Day: 7,
    },
    {
      id: 'mock-5',
      name: 'Xbox Game Pass',
      price: 14.99,
      billingCycle: 'monthly',
      nextBillingDate: addDays(base, 2),
      category: 'Gaming',
      createdAt: new Date().toISOString(),
      notificationId3Day: 8,
      notificationId1Day: 9,
    },
  ];
}

export const MOCK_SUBSCRIPTIONS = buildMockSubscriptions();
export const MOCK_COUNT = MOCK_SUBSCRIPTIONS.length;
