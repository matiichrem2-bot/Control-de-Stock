import React, { useEffect, useState } from "react";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [marcaNombre, setMarcaNombre] = useState("");
  const [marcaCategoria, setMarcaCategoria] = useState("");
  const [marcaMsg, setMarcaMsg] = useState("");

  // Cargar categorías del backend
  const cargarCategorias = () => {
    fetch("/api/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data));
  };

  // Cargar marcas del backend
  const cargarMarcas = () => {
    fetch("/api/marcas")
      .then(res => res.json())
      .then(data => setMarcas(data));
  };

  useEffect(() => {
    cargarCategorias();
    cargarMarcas();
  }, []);

  // Agregar o actualizar categoría
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!nombre.trim()) return;
    if (editId) {
      // Actualizar
      const res = await fetch(`/api/categorias/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre })
      });
      if (res.ok) {
        setMsg("Categoría actualizada");
        setEditId(null);
        setNombre("");
        cargarCategorias();
      } else {
        setMsg("Error al actualizar");
      }
    } else {
      // Agregar
      const res = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre })
      });
      if (res.ok) {
        setMsg("Categoría agregada");
        setNombre("");
        cargarCategorias();
      } else {
        setMsg("Error al agregar");
      }
    }
  };

  // Eliminar categoría
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar categoría?")) return;
    await fetch(`/api/categorias/${id}`, { method: "DELETE" });
    cargarCategorias();
  };

  // Editar categoría
  const handleEdit = (cat) => {
    setEditId(cat._id);
    setNombre(cat.nombre);
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditId(null);
    setNombre("");
  };

  // Agregar marca
  const handleAddMarca = async (e) => {
    e.preventDefault();
    setMarcaMsg("");
    if (!marcaNombre.trim() || !marcaCategoria) return;
    const res = await fetch("/api/marcas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: marcaNombre, categoria: marcaCategoria })
    });
    if (res.ok) {
      setMarcaMsg("Marca agregada");
      setMarcaNombre("");
      setMarcaCategoria("");
      cargarMarcas();
    } else {
      setMarcaMsg("Error al agregar marca");
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-3 mb-4 rounded-4">
        <h2 className="mb-4 text-success">Categorías</h2>
        {/* Formulario de Categoría */}
        <form onSubmit={handleAddOrUpdate} className="mb-4 d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de la categoría"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <button className="btn btn-success" type="submit">
            {editId ? "Actualizar" : "Agregar"}
          </button>
          {editId && (
            <button className="btn btn-secondary" type="button" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </form>
        {msg && <div className={`alert ${msg.includes("Error") ? "alert-danger" : "alert-success"} mb-2`}>{msg}</div>}
        <ul className="list-group mb-4">
          {categorias.map((cat) => (
            <li key={cat._id} className="list-group-item d-flex justify-content-between align-items-center">
              {cat.nombre}
              <span>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(cat)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat._id)}>Eliminar</button>
              </span>
            </li>
          ))}
          {categorias.length === 0 && <li className="list-group-item text-center">Sin categorías</li>}
        </ul>

        <hr className="my-4" />

        <h4 className="mb-3 text-primary">Agregar Marca</h4>
        {/* Formulario de Marca */}
        <form onSubmit={handleAddMarca} className="mb-3 d-flex gap-2">
          <select
            className="form-select"
            value={marcaCategoria}
            onChange={e => setMarcaCategoria(e.target.value)}
            required
          >
            <option value="">Selecciona categoría</option>
            {categorias.map(cat => (
              <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>
            ))}
          </select>
          <input
            className="form-control"
            value={marcaNombre}
            onChange={e => setMarcaNombre(e.target.value)}
            placeholder="Nueva marca"
            required
          />
          <button type="submit" className="btn btn-success">Agregar</button>
        </form>
        {marcaMsg && <div className={`alert ${marcaMsg.includes("Error") ? "alert-danger" : "alert-success"} mb-2`}>{marcaMsg}</div>}

        <h5 className="mt-4">Marcas</h5>
        <ul className="list-group">
          {marcas.map(marca => (
            <li key={marca._id} className="list-group-item">
              {marca.nombre} <span className="text-muted">({marca.categoria})</span>
            </li>
          ))}
          {marcas.length === 0 && <li className="list-group-item text-center">Sin marcas</li>}
        </ul>
      </div>
    </div>
  );
};

export default Categorias;