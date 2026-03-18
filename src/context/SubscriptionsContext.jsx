import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSubscriptions, setSubscriptions as saveSubscriptions, getSettings, setSettings as saveSettings, getNextNotificationIds, setNotificationIdCounter } from '../services/storage';
import { MOCK_SUBSCRIPTIONS, MOCK_COUNT } from '../data/mockSubscriptions';
import { scheduleReminders, cancelReminders, requestNotificationPermissions } from '../services/notifications';

const USE_MOCK_WHEN_EMPTY = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const SubscriptionsContext = createContext(null);

export function SubscriptionsProvider({ children }) {
  const [subscriptions, setSubscriptionsState] = useState([]);
  const [settings, setSettingsState] = useState({ notificationsEnabled: true, currency: 'USD' });
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const [subs, sets] = await Promise.all([getSubscriptions(), getSettings()]);
    let subscriptionsToShow = subs;
    if (subs.length === 0 && USE_MOCK_WHEN_EMPTY) {
      await saveSubscriptions(MOCK_SUBSCRIPTIONS);
      await setNotificationIdCounter(MOCK_COUNT * 2);
      subscriptionsToShow = MOCK_SUBSCRIPTIONS;
    }
    setSubscriptionsState(subscriptionsToShow);
    setSettingsState(sets);
    setLoaded(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addSubscription = useCallback(
    async (sub) => {
      const id = Date.now().toString();
      const { id3Day, id1Day } = await getNextNotificationIds();
      const newSub = {
        id,
        name: sub.name,
        price: parseFloat(sub.price) || 0,
        billingCycle: sub.billingCycle || 'monthly',
        nextBillingDate: sub.nextBillingDate,
        category: sub.category || '',
        createdAt: new Date().toISOString(),
        notificationId3Day: id3Day,
        notificationId1Day: id1Day,
      };
      const updated = [...subscriptions, newSub];
      await saveSubscriptions(updated);
      setSubscriptionsState(updated);
      if (settings.notificationsEnabled) {
        await requestNotificationPermissions();
        await scheduleReminders(newSub, id3Day, id1Day);
      }
      return newSub;
    },
    [subscriptions, settings.notificationsEnabled]
  );

  const updateSubscription = useCallback(
    async (id, updates) => {
      const sub = subscriptions.find((s) => s.id === id);
      if (!sub) return;
      const updatedSub = {
        ...sub,
        name: updates.name ?? sub.name,
        price: parseFloat(updates.price) ?? sub.price,
        billingCycle: updates.billingCycle ?? sub.billingCycle,
        nextBillingDate: updates.nextBillingDate ?? sub.nextBillingDate,
        category: updates.category ?? sub.category,
      };
      const updated = subscriptions.map((s) => (s.id === id ? updatedSub : s));
      await saveSubscriptions(updated);
      setSubscriptionsState(updated);
      if (settings.notificationsEnabled) {
        await cancelReminders(sub.notificationId3Day, sub.notificationId1Day);
        await scheduleReminders(updatedSub, sub.notificationId3Day, sub.notificationId1Day);
      }
    },
    [subscriptions, settings.notificationsEnabled]
  );

  const deleteSubscription = useCallback(async (id) => {
    const sub = subscriptions.find((s) => s.id === id);
    const updated = subscriptions.filter((s) => s.id !== id);
    await saveSubscriptions(updated);
    setSubscriptionsState(updated);
    if (sub) {
      await cancelReminders(sub.notificationId3Day, sub.notificationId1Day);
    }
  }, [subscriptions]);

  const updateSettings = useCallback(async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    await saveSettings(merged);
    setSettingsState(merged);
  }, [settings]);

  const value = {
    subscriptions,
    settings,
    loaded,
    load,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    updateSettings,
  };

  return (
    <SubscriptionsContext.Provider value={value}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionsContext);
  if (!ctx) throw new Error('useSubscriptions must be used within SubscriptionsProvider');
  return ctx;
}
