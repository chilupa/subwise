import React from 'react';
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
} from '@ionic/react';
import { useSubscriptions } from '../context/SubscriptionsContext';
import './Settings.css';
import Header from '../components/Header';

export default function Settings() {
  const { settings, updateSettings } = useSubscriptions();
  const notificationsEnabled = settings.notificationsEnabled !== false;

  const handleToggle = async (e) => {
    await updateSettings({ notificationsEnabled: e.detail.checked });
  };

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
        <IonList lines="full">
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
