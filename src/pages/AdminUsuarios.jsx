import React, { useEffect, useState } from "react";
import axios from "axios";

const membresias = ["basico", "avanzado", "premium"];
const roles = ["admin", "cliente"];

const AdminUsuarios = ({ user }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    membresia: "basico",
    password: "123456", // Contraseña por defecto
    rol: "cliente"
  });
  const [filtroMembresia, setFiltroMembresia] = useState("todas");

  useEffect(() => {
    cargarUsuarios();
    // eslint-disable-next-line
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get("/api/userMember/", {
        headers: {
          "x-admin": "true"
        }
      });
      setUsuarios(res.data);
    } catch (err) {
      setError("No se pudieron cargar los usuarios");
    }
  };

  const handleChange = async (id, membresia, rol) => {
    setError("");
    setSuccess("");
    try {
      await axios.put(
        `/api/userMember/${id}`,
        { membresia, rol },
        {
          headers: {
            "x-admin": user?.rol === "admin" ? "true" : "false"
          }
        }
      );
      setSuccess("Usuario actualizado");
      cargarUsuarios();
    } catch (err) {
      setError("Error al actualizar usuario");
    }
  };

  const handleNuevoUsuario = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post("/api/userMember/register", nuevoUsuario, {
        headers: { "x-admin": "true" }
      });
      setSuccess("Usuario creado correctamente");
      setNuevoUsuario({
        nombre: "",
        email: "",
        membresia: "basico",
        password: "123456",
        rol: "cliente"
      });
      cargarUsuarios();
    } catch (err) {
      setError("Error al crear usuario");
    }
  };

  const usuariosFiltrados = filtroMembresia === "todas"
    ? usuarios
    : usuarios.filter(u => u.membresia === filtroMembresia);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary">
        <i className="bi bi-people me-2"></i>Administrar Usuarios
      </h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="mb-3">
        <label className="form-label me-2">Filtrar por membresía:</label>
        <select
          className="form-select d-inline-block w-auto"
          value={filtroMembresia}
          onChange={e => setFiltroMembresia(e.target.value)}
        >
          <option value="todas">Todas</option>
          {membresias.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="table-responsive">
        <table className="table table-hover table-striped align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Membresía</th>
              <th>Rol</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u._id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.membresia}
                    onChange={e => handleChange(u._id, e.target.value, u.rol)}
                    className="form-select"
                  >
                    {membresias.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={u.rol}
                    onChange={e => handleChange(u._id, u.membresia, e.target.value)}
                    className="form-select"
                  >
                    {roles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleChange(u._id, u.membresia, u.rol)}
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="mt-5 mb-4 text-primary">
        <i className="bi bi-person-plus me-2"></i>Agregar Usuario
      </h3>
      <form onSubmit={handleNuevoUsuario} className="row g-2 mb-4 align-items-end">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={nuevoUsuario.nombre}
            onChange={e => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={nuevoUsuario.email}
            onChange={e => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={nuevoUsuario.membresia}
            onChange={e => setNuevoUsuario({ ...nuevoUsuario, membresia: e.target.value })}
          >
            {membresias.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={nuevoUsuario.rol}
            onChange={e => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
          >
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100">
            Crear usuario
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUsuarios;