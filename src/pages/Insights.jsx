import React from 'react';
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useSubscriptions } from '../context/SubscriptionsContext';
import {
  totalMonthlyCost,
  spendingByCategory,
  formatCurrency,
} from '../utils/subscriptionUtils';
import './Insights.css';
import Header from '../components/Header';

export default function Insights() {
  const { subscriptions, loaded } = useSubscriptions();
  const total = totalMonthlyCost(subscriptions);
  const byCategory = spendingByCategory(subscriptions);

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
        {loaded && (
          <>
            <div className="insights-summary">
              <p className="summary-label">Total monthly</p>
              <p className="summary-amount">{formatCurrency(total)}</p>
              {total > 0 && (
                <p className="summary-yearly">
                  ~{formatCurrency(total * 12)} / year
                </p>
              )}
            </div>

            {byCategory.length === 0 ? (
              <div className="empty-state">
                <p>No subscriptions yet</p>
                <p className="empty-hint">Add subscriptions to see spending by category</p>
              </div>
            ) : (
              <div className="insights-section">
                <h2 className="section-title">By category</h2>
                <IonList lines="full">
                  {byCategory.map(({ category, amount, count }) => {
                    const pct = total > 0 ? (amount / total) * 100 : 0;
                    return (
                      <IonItem key={category} className="insight-item">
                        <IonLabel>
                          <div className="insight-row">
                            <span className={`insight-category chip-${category.toLowerCase()}`}>
                              {category}
                            </span>
                            <span className="insight-amount">
                              {formatCurrency(amount)}
                              {count > 1 && (
                                <span className="insight-count"> · {count} subs</span>
                              )}
                            </span>
                          </div>
                          <div className="insight-bar-wrap">
                            <div
                              className="insight-bar"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="insight-pct">{pct.toFixed(0)}% of total</p>
                        </IonLabel>
                      </IonItem>
                    );
                  })}
                </IonList>
              </div>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
