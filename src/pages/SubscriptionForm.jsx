import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonAlert,
} from '@ionic/react';
import { useSubscriptions } from '../context/SubscriptionsContext';
import './SubscriptionForm.css';

const CATEGORIES = ['Streaming', 'Software', 'Cloud', 'Gaming', 'Music', 'Other'];

function defaultDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

export default function SubscriptionForm() {
  const { id } = useParams();
  const history = useHistory();
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const sub = id ? subscriptions.find((s) => s.id === id) : null;
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [nextBillingDate, setNextBillingDate] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sub) {
      setName(sub.name);
      setPrice(String(sub.price));
      setBillingCycle(sub.billingCycle || 'monthly');
      setNextBillingDate(sub.nextBillingDate ? sub.nextBillingDate.slice(0, 10) : '');
      setCategory(sub.category || '');
    }
  }, [sub]);

  const handleSave = async () => {
    setError('');
    if (!name.trim()) {
      setError('Service name is required');
      return;
    }
    const p = parseFloat(price);
    if (isNaN(p) || p < 0) {
      setError('Please enter a valid price');
      return;
    }
    const date = nextBillingDate || defaultDate();
    if (isEditMode && !nextBillingDate) {
      setError('Next billing date is required');
      return;
    }
    setSaving(true);
    try {
      if (isEditMode) {
        await updateSubscription(id, {
          name: name.trim(),
          price: p,
          billingCycle,
          nextBillingDate: date,
          category: category || undefined,
        });
      } else {
        await addSubscription({
          name: name.trim(),
          price: p,
          billingCycle,
          nextBillingDate: date,
          category: category || undefined,
        });
      }
      history.replace('/dashboard');
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteAlert(false);
    try {
      await deleteSubscription(id);
      history.replace('/dashboard');
    } catch (e) {
      setError(e.message || 'Failed to delete');
    }
  };

  if (isEditMode && id && !sub) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/dashboard" />
            </IonButtons>
            <IonTitle slot="start">Edit Subscription</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p style={{ padding: '1rem' }}>Subscription not found.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle slot="start">{isEditMode ? 'Edit' : 'Add'} Subscription</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="subscription-form-container">
          <IonItem>
            <IonLabel position="stacked">Service Name *</IonLabel>
            <IonInput
              value={name}
              onIonInput={(e) => setName(e.detail.value || '')}
              placeholder="e.g. Netflix"
              clearOnEdit
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Price *</IonLabel>
            <IonInput
              type="number"
              value={price}
              onIonInput={(e) => setPrice(e.detail.value || '')}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </IonItem>

          <div className="billing-cycle-field">
            <IonLabel className="billing-cycle-label">Billing Cycle</IonLabel>
            <IonRadioGroup value={billingCycle} onIonChange={(e) => setBillingCycle(e.detail.value)}>
              <IonItem lines="none" className="radio-option">
                <IonLabel>Monthly</IonLabel>
                <IonRadio slot="end" value="monthly" />
              </IonItem>
              <IonItem lines="none" className="radio-option">
                <IonLabel>Yearly</IonLabel>
                <IonRadio slot="end" value="yearly" />
              </IonItem>
            </IonRadioGroup>
          </div>

          <IonItem>
            <IonLabel position="stacked">Next Billing Date *</IonLabel>
            <IonInput
              value={nextBillingDate}
              onIonInput={(e) => setNextBillingDate(e.detail.value || '')}
              placeholder={defaultDate()}
              type="date"
            />
          </IonItem>

          <IonItem>
            <IonSelect
              label="Category (optional)" labelPlacement="stacked"
              value={category}
              placeholder="Select category"
              onIonChange={(e) => setCategory(e.detail.value)}
              interface="action-sheet"
            >
              {CATEGORIES.map((c) => (
                <IonSelectOption key={c} value={c}>
                  {c}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {error ? <p className="form-error">{error}</p> : null}

          <IonButton
            expand="block"
            className="save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : isEditMode ? 'Update Subscription' : 'Save Subscription'}
          </IonButton>

          {isEditMode && sub && (
            <>
              <IonButton
                expand="block"
                fill="outline"
                color="danger"
                className="delete-button"
                onClick={() => setShowDeleteAlert(true)}
              >
                Delete Subscription
              </IonButton>
              <IonAlert
                isOpen={showDeleteAlert}
                onDidDismiss={() => setShowDeleteAlert(false)}
                header="Delete Subscription"
                message={`Are you sure you want to delete "${sub.name}"?`}
                buttons={[
                  { text: 'Cancel', role: 'cancel' },
                  { text: 'Delete', role: 'destructive', handler: handleDelete },
                ]}
              />
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
