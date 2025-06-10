import React, { useState } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CampanhaForm = () => {
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [imagem, setImagem] = useState(null);
  const [status, setStatus] = useState("ativo");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleUpload = async () => {
    if (!imagem) return null;

    const imagemRef = ref(storage, `campanhas/${imagem.name}-${Date.now()}`);
    await uploadBytes(imagemRef, imagem);
    const url = await getDownloadURL(imagemRef);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !link || !imagem) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    try {
      setCarregando(true);
      const imagemURL = await handleUpload();

      await addDoc(collection(db, "campanhas"), {
        titulo,
        link,
        imagemURL,
        status,
        criadoEm: serverTimestamp(),
      });

      setTitulo("");
      setLink("");
      setImagem(null);
      setStatus("ativo");
      setMensagem("Campanha cadastrada com sucesso!");
    } catch (error) {
      setMensagem("Erro ao salvar campanha.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h3>Cadastrar Campanha</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Link:</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Imagem:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagem(e.target.files[0])}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        <button type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Cadastrar"}
        </button>
        {mensagem && <p>{mensagem}</p>}
      </form>
    </div>
  );
};

export default CampanhaForm;