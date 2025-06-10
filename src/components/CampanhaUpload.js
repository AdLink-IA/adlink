import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const CampanhaUpload = () => {
  const [nomeCampanha, setNomeCampanha] = useState('');
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mensagem, setMensagem] = useState('');

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!nomeCampanha || !imagem) {
      setMensagem('Preencha todos os campos.');
      return;
    }

    const storageRef = ref(storage, `uploads/${Date.now()}_${imagem.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imagem);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progresso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progresso));
      },
      (error) => {
        console.error('Erro no upload:', error);
        setMensagem('Erro ao enviar imagem.');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        await addDoc(collection(db, 'campanhas'), {
          nome: nomeCampanha,
          imagemURL: downloadURL,
          nomeArquivo: imagem.name,
          criadoEm: serverTimestamp(),
        });

        setMensagem('Campanha enviada com sucesso!');
        setNomeCampanha('');
        setImagem(null);
        setPreview('');
        setUploadProgress(0);
      }
    );
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
      <h2>Cadastrar Nova Campanha</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Nome da campanha"
          value={nomeCampanha}
          onChange={(e) => setNomeCampanha(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />

        <input type="file" onChange={handleImagemChange} accept="image/*" />

        {preview && (
          <div style={{ marginTop: 10 }}>
            <strong>Preview:</strong>
            <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 300, marginTop: 10 }} />
          </div>
        )}

        {uploadProgress > 0 && <p>Enviando: {uploadProgress}%</p>}

        <button type="submit" style={{ marginTop: 10 }}>Enviar</button>
      </form>

      {mensagem && <p style={{ marginTop: 15 }}>{mensagem}</p>}
    </div>
  );
};

export default CampanhaUpload;