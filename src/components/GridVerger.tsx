// src/components/GridVerger.tsx
import { IonGrid, IonRow, IonCol, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import './GridVerger.css';
import React, { useEffect, useState } from 'react';

interface VergerData {
  lignes: {
    emplacements: {
      type: string;
    }[];
  }[];
}

const GridVerger: React.FC = () => {
  const [verger, setVerger] = useState<VergerData | null>(null);
  const [showModal, setShowModal] = useState(false);
  //const [emplToUpdate, setEmplToUpdate] = useState(null);
  const [selectedEmplacement, setEmplacementToUpdate] = useState<{ row : number, col : number } | null>(null);
 const arbres = ['Pommier','Cerisier','Abricotier'];

  useEffect(() => {
    const loadVerger = async () => {
      try {
        const res = await fetch('/data/verger.json');
        if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
        const data: VergerData = await res.json();
        setVerger(data);
      } catch (err) {
        console.error('Erreur de chargement :', err);
      }
    };
    loadVerger();
  }, []);

  if (!verger) {
    return <p>Chargement…</p>;
  }

  const handleClickEmplacement = (empl: { type: string }, rowIndex: number, colIndex: number) => {
    console.log(`Emplacement cliqué : Ligne ${rowIndex}, Colonne ${colIndex}, Type ${empl.type}`);
    setEmplacementToUpdate({ row: rowIndex, col: colIndex });
    setShowModal(true);

  }

  const setArbre = (arbre:string) => {
    console.log(arbre +" planté");
    verger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].type = arbre;
    setShowModal(false);
  };


  const cols = verger.lignes[0].emplacements.length;
  const sizeStr = Math.floor(12 / cols).toString();


  return (
    <>
      <IonGrid className="verger-grid">
        {verger.lignes.map((ligne, rowIndex) => (
          <IonRow key={rowIndex}>
            {ligne.emplacements.map((empl, colIndex) => (
              <IonCol key={colIndex} size={sizeStr} sizeLg='1'
                onClick={() => handleClickEmplacement(empl, rowIndex, colIndex)}
              >
                <div className="cellule-content">
                  {empl.type}
                </div>
              </IonCol>
            ))}
          </IonRow>
        ))}
      </IonGrid>


      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Choisir un arbre</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
           {arbres.map((arbre) => (
              <IonButton
                key={arbre}
                onClick={() => setArbre(arbre)}
              >
                {arbre}
              </IonButton>
            ))}
          <IonButton expand="block" color="medium" onClick={() => setShowModal(false)}>
            Annuler
          </IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default GridVerger;
