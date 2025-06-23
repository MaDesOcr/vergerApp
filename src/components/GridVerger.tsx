// src/components/GridVerger.tsx
import { IonGrid, IonRow, IonCol, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import './GridVerger.css';
import React, { useEffect, useState } from 'react';
import { s } from 'vitest/dist/reporters-5f784f42';

interface VergerData {
  lignes: {
    emplacements: {
      maturation: number;
      nbCycles: number;
      arbre : arbre
    }[];
  }[];
}

interface arbre{
  type: string;
  dureeMaturation: number; // en jours
  nbCycles: number; // nombre de cycles avant qu'il ne donne plus de fruits
  nbFruitsParCycle: number; // nombre de fruits produits par cycle
}

const arbres: arbre[] = [
  { type: 'Pommier', dureeMaturation: 10, nbCycles: 3, nbFruitsParCycle: 5 },
  { type: 'Cerisier', dureeMaturation: 15, nbCycles: 2, nbFruitsParCycle: 10 },
  { type: 'Abricotier', dureeMaturation: 20, nbCycles: 4, nbFruitsParCycle: 8 }
];

const GridVerger: React.FC = () => {
  const [verger, setVerger] = useState<VergerData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmplacement, setEmplacementToUpdate] = useState<{ row: number, col: number } | null>(null);

  useEffect(() => {
    const loadVerger = async () => {
      try {
        const res = await fetch('/data/verger.json');
        if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
        const data: VergerData = await res.json();
        setVerger(data);
        console.log(verger)
      } catch (err) {
        console.error('Erreur de chargement :', err);
      }
    };
    loadVerger();
  }, []);

useEffect(() => {
  const id = setInterval(() => {
    setVerger((prev) => {
      if (!prev) return prev;
 
      const updated = {
        ...prev,
        lignes: prev.lignes.map((ligne) => ({
          ...ligne,
          emplacements: ligne.emplacements.map((empl) => {
            if (empl.arbre !== undefined && empl.maturation < 100) {
              return {
                ...empl,
                maturation: empl.maturation + 1,

                ...(empl.maturation >= empl.arbre.dureeMaturation && { maturation: -5 , nbCycles: empl.nbCycles + 1 }), 
                ...(empl.nbCycles>=empl.arbre.nbCycles && { type: '' }), 
              };
            }
            return empl;
          }),
        })),
      };
 
      return updated;
    });
  }, 1000); // toutes les secondes
 
  return () => clearInterval(id);
}, []);
 

  if (!verger) {
    return <p>Chargement…</p>;
  }

  const handleClickEmplacement = (empl: { arbre: arbre }, rowIndex: number, colIndex: number) => {
    console.log(`Emplacement cliqué : Ligne ${rowIndex}, Colonne ${colIndex}, Type ${empl.arbre}`);
    setEmplacementToUpdate({ row: rowIndex, col: colIndex });
    setShowModal(true);

  }

  const setArbre = (arbre: arbre) => {
    console.log(arbre + " planté");
    const updatedVerger = { ...verger };
    verger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].arbre = arbre;
    verger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].maturation = 0;
    verger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].nbCycles = 0;
    setShowModal(false);
    setVerger(updatedVerger);
  };

  const getMaturationClass = (maturation: number, arbre : arbre) => {
  if (arbre === undefined) {
    return 'gris';
  }
  switch (true) {
    case (maturation >= 1 && maturation < arbre.dureeMaturation/2):
      return 'orange';
    case (maturation >= arbre.dureeMaturation/2 && maturation < arbre.dureeMaturation):
      return 'vert';
    case (maturation >= arbre.dureeMaturation/2):
      return 'rouge';
  }
};
 

  const cols = verger.lignes[0].emplacements.length;
  const sizeStr = Math.floor(12 / cols).toString();


  return (
    <><div className="div-verger">
      <IonGrid className="verger-grid">
        {verger.lignes.map((ligne, rowIndex) => (
          <IonRow key={rowIndex}>
            {ligne.emplacements.map((empl, colIndex) => (
              <IonCol key={colIndex} size={sizeStr} sizeLg='3'
                onClick={() => handleClickEmplacement(empl, rowIndex, colIndex)}
              >
                <div className={`cellule-content ${getMaturationClass(empl.maturation, empl.arbre)}`}>
                   {empl.arbre? empl.arbre.type : "vide"}

                </div>
              </IonCol>
            ))}
          </IonRow>
        ))}
      </IonGrid>
    </div>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className='modal-ajout-arbre'>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Choisir un arbre</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {arbres.map((arbre) => (
            <IonButton
              expand="block"
              key={arbre.type}
              onClick={() => setArbre(arbre)}
            >
              {arbre.type}
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
