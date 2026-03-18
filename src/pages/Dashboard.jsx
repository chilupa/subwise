import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  IonChip,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useSubscriptions } from '../context/SubscriptionsContext';
import { totalMonthlyCost, sortByNextBillingDate, formatCurrency, formatDate, monthlyEquivalent } from '../utils/subscriptionUtils';
import './Dashboard.css';
import Header from '../components/Header';

export default function Dashboard() {
  const history = useHistory();
  const { subscriptions, loaded, settings } = useSubscriptions();
  const currency = settings.currency || 'USD';
  const sorted = sortByNextBillingDate(subscriptions);
  const total = totalMonthlyCost(subscriptions);

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
        <div className="dashboard-summary">
          <p className="summary-label">Total monthly cost</p>
          <p className="summary-amount">{formatCurrency(total, currency)}</p>
        </div>

        {loaded && (
          <>
            {sorted.length === 0 ? (
              <div className="empty-state">
                <p>No subscriptions yet</p>
                <p className="empty-hint">Tap + to add your first subscription</p>
              </div>
            ) : (
              <IonList lines="full">
                {sorted.map((sub) => (
                  <IonItem
                    key={sub.id}
                    button
                    onClick={() => history.push(`/edit/${sub.id}`)}
                  >
                    <IonLabel>
                      <h2>{sub.name}</h2>
                      <p>
                        {formatCurrency(parseFloat(sub.price) || 0, currency)} / {sub.billingCycle === 'yearly' ? 'year' : 'month'}
                        {sub.billingCycle === 'yearly' && (
                          <span className="monthly-equiv">
                            {' '}({formatCurrency(monthlyEquivalent(sub), currency)}/mo)
                          </span>
                        )}
                      </p>
                      <p>Next: {formatDate(sub.nextBillingDate)}</p>
                    </IonLabel>
                    {sub.category ? (
                      <IonChip slot="end" className={`chip-category chip-${(sub.category || '').toLowerCase()}`}>
                        {sub.category}
                      </IonChip>
                    ) : null}
                  </IonItem>
                ))}
              </IonList>
            )}
          </>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/add')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
