import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import CampanhaUpload from '../components/CampanhaUpload';
import CampanhasLista from '../components/CampanhasLista';

const Dashboard = () => {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Painel de Campanhas</h2>
      <button onClick={handleLogout}>Sair</button>
      <CampanhaUpload />
      <CampanhasLista />
    </div>
  );
};

export default Dashboard;