// src/components/GridVerger.tsx
import { IonGrid, IonRow, IonCol } from '@ionic/react';
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

  const cols = verger.lignes[0].emplacements.length;
  const sizeStr = Math.floor(12 / cols).toString();

  return (
    <IonGrid className="verger-grid">
      {verger.lignes.map((ligne, rowIndex) => (
        <IonRow key={rowIndex}>
          {ligne.emplacements.map((empl, colIndex) => (
            <IonCol key={colIndex} size={sizeStr}>
              <div className="cellule-content">
                {empl.type}
              </div>
            </IonCol>
          ))}
        </IonRow>
      ))}
    </IonGrid>
  );
};

export default GridVerger;
