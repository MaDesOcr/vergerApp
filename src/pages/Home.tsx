import { IonContent, IonHeader, IonPage, IonRouterLink, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
       
      </IonHeader>
      <IonContent fullscreen>
        <IonRouterLink routerLink="/verger" className="ion-text-center">
        <img src="/assets/icon/baniere.jpg" alt="Verger Icon" className="home-icon" />
        </IonRouterLink>
      </IonContent>
    </IonPage>
  );
};

export default Home;
