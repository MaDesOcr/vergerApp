import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './GridVerger.css';
import React, { useEffect, useState } from 'react';

const GridVerger: React.FC = () => {

    const [verger, setVerger] = useState<{id: number; ligne : []}>();

    useEffect(() => {
    fetch('/data/verger.json')
      .then((res) => res.json())
      .then((data) => setVerger(data))
      .then(console.log(verger));
  }, []);


    return (
        <div className="grid-verger">
            <IonGrid>
                <IonRow>
                    <IonCol>1</IonCol>
                    <IonCol>2</IonCol>
                    <IonCol>3</IonCol>
                </IonRow>
            </IonGrid>

            <IonGrid>
                <IonRow>
                    <IonCol>1</IonCol>
                    <IonCol>2</IonCol>
                    <IonCol>3</IonCol>
                    <IonCol>4</IonCol>
                    <IonCol>5</IonCol>
                    <IonCol>6</IonCol>
                </IonRow>
            </IonGrid>

            <IonGrid>
                <IonRow>
                    <IonCol>1</IonCol>
                    <IonCol>2</IonCol>
                    <IonCol>3</IonCol>
                    <IonCol>4</IonCol>
                    <IonCol>5</IonCol>
                    <IonCol>6</IonCol>
                    <IonCol>7</IonCol>
                    <IonCol>8</IonCol>
                    <IonCol>9</IonCol>
                    <IonCol>10</IonCol>
                    <IonCol>11</IonCol>
                    <IonCol>12</IonCol>
                </IonRow>
            </IonGrid>
        </div>
    )
}

export default GridVerger;