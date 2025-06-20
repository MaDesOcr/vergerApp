import { IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import './verger.css';
import GridVerger from '../components/GridVerger';

const Verger: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Verger</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                
                <GridVerger></GridVerger>
            </IonContent>
        </IonPage>
    );
};

export default Verger;
