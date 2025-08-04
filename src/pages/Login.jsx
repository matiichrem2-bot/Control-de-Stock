import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Ejemplo de login real
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/userMember/login", {
        email: usuario, // el valor del input de email
        password // el valor del input de contraseña
      });
      localStorage.setItem("usuario", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", background: "#f8f9fa" }}>
      <div className="card shadow-sm p-3 mb-4 rounded-4" style={{ minWidth: 350 }}>
        <h2 className="mb-4 text-center text-success">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              required
              placeholder="ejemplo@correo.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <button type="submit" className="btn btn-success w-100">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;