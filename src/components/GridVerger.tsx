// src/components/GridVerger.tsx
import { IonGrid, IonRow, IonCol, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import './GridVerger.css';
import React, { useEffect, useState } from 'react';
import { s } from 'vitest/dist/reporters-5f784f42';

interface VergerData {
  lignes: {
    emplacements: {
      type: string;
      maturation: number;
    }[];
  }[];
}

const GridVerger: React.FC = () => {
  const [verger, setVerger] = useState<VergerData | null>(null);
  const [showModal, setShowModal] = useState(false);
  //const [emplToUpdate, setEmplToUpdate] = useState(null);
  const [selectedEmplacement, setEmplacementToUpdate] = useState<{ row: number, col: number } | null>(null);
  const arbres = ['Pommier', 'Cerisier', 'Abricotier'];

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
            if (empl.type !== '' && empl.maturation < 100) {
              return {
                ...empl,
                maturation: empl.maturation + 1,
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
 


/*
  useEffect(() => {
    const id = setInterval(() => {
      console.log('Maturation des arbres');
      //etape 1
      //ajout champ maturation: number au emplacement
      //maturation de tous les arbres présents dans le verger
      console.log(verger)
      verger?.lignes.forEach(ligne => {
        ligne.emplacements.forEach(empl => {
          if(empl.type!== ""){
            empl.maturation += 1;
            console.log(`Maturation de l'arbre ${empl.type} : ${empl.maturation}`);
          }
        })
      })
      //check de l'état d'avancement la maturation de chaque arbre
      //mise à jour de la couleur (vert) de l'emplacement lorsque maturation suppérieur à 15

      //etape 2
      //entre zero et 10, le fruit pousse -> jaune
      //tant que la maturation est inférieur à 10, le fruit n'est pas mûr, on ne peut pas récolter -> orange
      //si la maturation est bonne (entre 10 et 15), on peut recolter -> vert
      //si la maturation est trop haute (supérieur à 15), on la remet à -5 -> gris

      //etape 3
      //au bout de 5 cycles, l'arbre est mort, on le supprime du verger

    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);
*/

  if (!verger) {
    return <p>Chargement…</p>;
  }

  const handleClickEmplacement = (empl: { type: string }, rowIndex: number, colIndex: number) => {
    console.log(`Emplacement cliqué : Ligne ${rowIndex}, Colonne ${colIndex}, Type ${empl.type}`);
    setEmplacementToUpdate({ row: rowIndex, col: colIndex });
    setShowModal(true);

  }

  const setArbre = (arbre: string) => {
    console.log(arbre + " planté");
    const updatedVerger = { ...verger };
    verger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].type = arbre;
    verger.lignes[selectedEmplacement!.row].emplacements[selectedEmplacement!.col].maturation = 0;
    setShowModal(false);
    setVerger(updatedVerger);
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
                <div className={`cellule-content maturation${empl.maturation >= 5 ? 5 : empl.maturation}`}>
                  {empl.type}
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
