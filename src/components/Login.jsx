import React, { useState } from "react";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const emailCorreto = "admin@adlink.com";
    const senhaCorreta = "123456";

    if (email === emailCorreto && senha === senhaCorreta) {
      onLoginSuccess();
    } else {
      alert("Email ou senha incorretos.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login AdLink</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type={mostrarSenha ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <div>
            <input
              type="checkbox"
              checked={mostrarSenha}
              onChange={(e) => setMostrarSenha(e.target.checked)}
            />{" "}
            Mostrar senha
          </div>
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;