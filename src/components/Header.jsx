import { IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import './Header.css'

const Header = () => {
  return (
    <IonHeader>
    <IonToolbar>
      <IonTitle className="ion-text-center">Subwise</IonTitle>
    </IonToolbar>
  </IonHeader>
  )
}

export default Header