import React from 'react';
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useSubscriptions } from '../context/SubscriptionsContext';
import './Settings.css';
import Header from '../components/Header';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'BRL', name: 'Brazilian Real' },
];

export default function Settings() {
  const { settings, updateSettings } = useSubscriptions();
  const notificationsEnabled = settings.notificationsEnabled !== false;
  const currency = settings.currency || 'USD';

  const handleToggle = async (e) => {
    await updateSettings({ notificationsEnabled: e.detail.checked });
  };

  const handleCurrencyChange = async (e) => {
    await updateSettings({ currency: e.detail.value });
  };

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
        <IonList lines="full">
          <IonItem>
            <IonLabel>
              <h2>Currency</h2>
              <p>Format for prices and totals</p>
            </IonLabel>
            <IonSelect
              slot="end"
              value={currency}
              onIonChange={handleCurrencyChange}
              interface="action-sheet"
            >
              {CURRENCIES.map(({ code, name }) => (
                <IonSelectOption key={code} value={code}>
                  {name} ({code})
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Reminder notifications</h2>
              <p>Get notified 3 days and 1 day before renewal</p>
            </IonLabel>
            <IonToggle
              slot="end"
              checked={notificationsEnabled}
              onIonChange={handleToggle}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
