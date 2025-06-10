import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const CampanhaEditor = ({ campanha, onClose }) => {
  const [nome, setNome] = useState(campanha.nome);
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(campanha.imagemURL);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [salvando, setSalvando] = useState(false);

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);

    const campanhaRef = doc(db, 'campanhas', campanha.id);
    let novaURL = campanha.imagemURL;

    if (imagem) {
      try {
        if (campanha.imagemURL) {
          const antigaRef = ref(storage, campanha.imagemURL);
          await deleteObject(antigaRef);
        }

        const novaRef = ref(storage, `uploads/${Date.now()}_${imagem.name}`);
        const uploadTask = uploadBytesResumable(novaRef, imagem);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progresso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progresso));
            },
            reject,
            async () => {
              novaURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      } catch (error) {
        console.error('Erro ao atualizar imagem:', error);
        setSalvando(false);
        return;
      }
    }

    await updateDoc(campanhaRef, {
      nome,
      imagemURL: novaURL,
    });

    setSalvando(false);
    onClose();
  };

  return (
    <div style={{ background: '#f9f9f9', padding: 20, borderRadius: 8, marginTop: 20 }}>
      <h4>Editar Campanha</h4>
      <form onSubmit={handleSalvar}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          placeholder="Nome da campanha"
          style={{ width: '100%', marginBottom: 10 }}
        />

        <input type="file" accept="image/*" onChange={handleImagemChange} />

        {preview && (
          <div style={{ marginTop: 10 }}>
            <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
          </div>
        )}

        {uploadProgress > 0 && <p>Upload: {uploadProgress}%</p>}

        <button type="submit" disabled={salvando} style={{ marginTop: 10 }}>
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>

        <button type="button" onClick={onClose} style={{ marginLeft: 10 }}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default CampanhaEditor;