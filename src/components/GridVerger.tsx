// src/components/GridVerger.tsx
import { IonGrid, IonRow, IonCol, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import './GridVerger.css';
import React, { useEffect, useState } from 'react';

interface VergerData {
  lignes: {
    emplacements: {
      maturation: number;
      nbCycles: number;
      arbre: arbre | undefined;
    }[];
  }[];
}

interface arbre {
  type: string;
  dureeMaturation: number;
  nbCycles: number;
  nbFruitsParCycle: number;
  nomDuFruit: string;
  quantiteFruitRecolte: number;
  quantiteFruitPourPousser: number
}



const GridVerger: React.FC = () => {
  const [arbres, setArbres] = useState<arbre[] | null>(null);

  const [verger, setVerger] = useState<VergerData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [showModalCouper, setShowModalCouper] = useState(false);
  const [arbreACouper, setArbreACouper] = useState<arbre | null>(null);

  const [selectedEmplacement, setEmplacementToUpdate] = useState<{ row: number, col: number } | null>(null);

  const [nbFruitsRecoltes, setNbFruitsRecoltes] = useState(0);

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
    const loadArbres = async () => {
      try {
        const res = await fetch('/data/arbres.json');
        if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
        const data: arbre[] = await res.json();
        setArbres(data);
      } catch (err) {
        console.error('Erreur de chargement des arbres :', err);
      }
    };
    loadArbres();
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
                 
                  ...(empl.maturation >= empl.arbre.dureeMaturation &&
                     { maturation: -5, nbCycles: empl.nbCycles + 1 }),
                  ...(empl.nbCycles >= empl.arbre.nbCycles &&
                     {arbre: undefined }),
                };
              }
              return empl;
            }),
          })),
        };
        console.log("nb de fruits récoltés : " + nbFruitsRecoltes);
        return updated;
      });
    }, 1000); // toutes les secondes

    return () => clearInterval(id);
  }, []);


  if (!verger) {
    return <p>Chargement…</p>;
  }

  const handleClickEmplacement = (empl: { arbre: arbre | undefined, maturation: number, nbCycles: number }, rowIndex: number, colIndex: number) => {
    console.log(`Emplacement cliqué : Ligne ${rowIndex}, Colonne ${colIndex}, Type ${empl.arbre}`);

    if (empl.arbre !== undefined) {
      if (empl.maturation >= empl.arbre.dureeMaturation / 2 && empl.maturation < empl.arbre.dureeMaturation) {
        empl.maturation = - 5;
        empl.nbCycles += 1;
        empl.arbre.quantiteFruitRecolte += empl.arbre.nbFruitsParCycle;
        if (empl.arbre.nbCycles <= empl.nbCycles) {
          empl.arbre = undefined;
        }
      }
      else {
        setArbreACouper(empl.arbre);
        setShowModalCouper(true);
      }
    }
    else {
      setShowModal(true);
    }

    setEmplacementToUpdate({ row: rowIndex, col: colIndex });


  }

  const setArbre = (arbre: arbre) => {
    console.log(arbre + " planté");
    const updatedVerger = { ...verger };
    verger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].arbre = arbre;
    verger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].maturation = 0;
    verger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].nbCycles = 0;
    arbre.quantiteFruitRecolte -= arbre.quantiteFruitPourPousser;
    setShowModal(false);
    setVerger(updatedVerger);
  };


  const couperArbre = (arbre: arbre | null) => {
    if (arbre) {
      console.log(`Arbre ${arbre.type} coupé`);
      const updatedVerger = { ...verger };
      updatedVerger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].arbre = undefined;
      updatedVerger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].maturation = 0;
      updatedVerger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].nbCycles = 0;
      setShowModalCouper(false);
      setVerger(updatedVerger);
    }
  }

  const getMaturationClass = (maturation: number, arbre: arbre | undefined) => {
    if (arbre === undefined) {
      return 'gris';
    }
    switch (true) {
      case (maturation >= 1 && maturation < arbre.dureeMaturation / 2):
        return 'orange';
      case (maturation >= arbre.dureeMaturation / 2 && maturation < arbre.dureeMaturation):
        return 'vert';
      case (maturation >= arbre.dureeMaturation):
        return 'rouge';
      default:
        return 'gris';
    }
  };


  const cols = verger.lignes[0].emplacements.length;
  const sizeStr = Math.floor(12 / cols).toString();


  return (
    <>
      <div className="stats-container">
        {...arbres.map((arbre) => (
          <div className='fruit-card'>
            {arbre.nomDuFruit} <br></br>
            {arbre.quantiteFruitRecolte}</div>
        ))}
      </div>

      <div className="div-verger">
        <IonGrid className="verger-grid">
          {verger.lignes.map((ligne, rowIndex) => (
            <IonRow key={rowIndex}>
              {ligne.emplacements.map((empl, colIndex) => (
                <IonCol key={colIndex} size={sizeStr} sizeLg='3'
                  onClick={() => handleClickEmplacement(empl, rowIndex, colIndex)}
                >
                  <div className={`cellule-content ${getMaturationClass(empl.maturation, empl.arbre)}`}>
                    {empl.arbre ? empl.arbre.type : "vide"}

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
          {arbres.map((arbre) => {
            const buttonColor = (arbre.quantiteFruitRecolte >= arbre.quantiteFruitPourPousser) ? "success" : "danger";

            return (<IonButton
              expand="block"
              key={arbre.type}
              color={buttonColor}
              disabled={arbre.quantiteFruitRecolte < arbre.quantiteFruitPourPousser}
              onClick={() => setArbre(arbre)}
            >
              {arbre.type}
            </IonButton>);
          })}
          <IonButton expand="block" color="medium" onClick={() => setShowModal(false)}>
            Annuler
          </IonButton>
        </IonContent>
      </IonModal>

      <IonModal isOpen={showModalCouper} onDidDismiss={() => setShowModalCouper(false)} className='modal-ajout-arbre'>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Couper arbre ?</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonButton
            expand="block"
            onClick={() => couperArbre(arbreACouper)}
          >
            Couper
          </IonButton>
          <IonButton expand="block" color="medium" onClick={() => setShowModalCouper(false)}>
            Annuler
          </IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default GridVerger;
