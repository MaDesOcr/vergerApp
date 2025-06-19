import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './GridVerger.css';
import React, { useEffect, useState } from 'react';
import Verger from '../pages/Verger';


interface Verger {
  lignes: {
    emplacements: {
      type: string;
    }[];
  }[];
}
 

const GridVerger: React.FC = () => {
    const [verger, setVerger] = useState<Verger | null>(null);

    useEffect(() => {
        const loadVerger = async () => {
            try {
                const res = await fetch('/data/verger.json');
                if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
                const data: Verger = await res.json();
                setVerger(data);
                console.log(data)
                console.log(verger)
            } catch (err) {
                console.error('Erreur de chargement :', err);
            }
        };
        loadVerger();
    }, []);

    return (
        <div>
            {verger ? (
                <div className="verger-grid">
                    {verger.lignes.map((ligne, rowIndex) => (
                        <div key={rowIndex} className="ligne">
                            {ligne.emplacements.map((emplacement, colIndex) => (
                                <div key={colIndex} className="cellule">
                                    {emplacement.type}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
};

export default GridVerger;
