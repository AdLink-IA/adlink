import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const SmartAdLayer = () => {
  const [campanhas, setCampanhas] = useState([]);

  const carregarCampanhas = async () => {
    const querySnapshot = await getDocs(collection(db, "campanhas"));
    const lista = [];
    querySnapshot.forEach((docItem) => {
      lista.push({ id: docItem.id, ...docItem.data() });
    });
    setCampanhas(lista);
  };

  const excluirCampanha = async (id) => {
    await deleteDoc(doc(db, "campanhas", id));
    carregarCampanhas();
  };

  useEffect(() => {
    carregarCampanhas();
  }, []);

  return (
    <div>
      <h2>Campanhas Cadastradas</h2>
      {campanhas.map((campanha) => (
        <div
          key={campanha.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>{campanha.titulo}</h3>
          <a href={campanha.link} target="_blank" rel="noopener noreferrer">
            {campanha.titulo}
          </a>
          {campanha.imagemURL && (
            <div>
              <img
                src={campanha.imagemURL}
                alt="Imagem da campanha"
                style={{ width: 300, marginTop: 10 }}
              />
            </div>
          )}
          <div style={{ marginTop: 10 }}>
            <button onClick={() => excluirCampanha(campanha.id)}>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartAdLayer;