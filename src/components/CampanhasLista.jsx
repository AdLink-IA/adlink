import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase.js'; // Caminho corrigido
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import CampanhaEditor from './CampanhaEditor';

const CampanhasLista = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'campanhas'), orderBy('criadoEm', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCampanhas(dados);
    });

    return () => unsubscribe();
  }, []);

  const excluirCampanha = async (id, imagemURL) => {
    try {
      await deleteDoc(doc(db, 'campanhas', id));
      if (imagemURL) {
        const storageRef = ref(storage, imagemURL);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error('Erro ao excluir campanha:', error);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <h2>Campanhas Cadastradas</h2>
      {campanhas.length === 0 ? (
        <p>Nenhuma campanha cadastrada ainda.</p>
      ) : (
        campanhas.map((campanha) => (
          <div
            key={campanha.id}
            style={{
              border: '1px solid #ccc',
              marginBottom: 20,
              padding: 10,
              borderRadius: 8,
              background: '#fff',
            }}
          >
            <h3>{campanha.nome}</h3>
            {campanha.imagemURL && (
              <img
                src={campanha.imagemURL}
                alt={campanha.nome}
                style={{
                  width: '100%',
                  maxHeight: 300,
                  objectFit: 'cover',
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              />
            )}
            {campanha.criadoEm?.toDate && (
              <p style={{ fontSize: 12, color: '#666' }}>
                Enviado em: {campanha.criadoEm.toDate().toLocaleString()}
              </p>
            )}
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => excluirCampanha(campanha.id, campanha.imagemURL)}
                style={{
                  background: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Excluir
              </button>
              <button
                onClick={() => setCampanhaSelecionada(campanha)}
                style={{
                  marginLeft: 10,
                  background: '#3498db',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Editar
              </button>
            </div>

            {campanhaSelecionada?.id === campanha.id && (
              <CampanhaEditor
                campanha={campanhaSelecionada}
                onClose={() => setCampanhaSelecionada(null)}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CampanhasLista;