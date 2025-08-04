import React, { useState, useEffect } from "react";

const BrandForm = ({ onAdd }) => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategorias(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, categoria })
    });
    if (res.ok) {
      setMsg("Marca agregada!");
      setNombre("");
      setCategoria("");
      if (onAdd) onAdd();
    } else {
      setMsg("Error al agregar marca");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3 d-flex gap-2">
      <select
        className="form-select"
        value={categoria}
        onChange={e => setCategoria(e.target.value)}
        required
      >
        <option value="">Selecciona categoría</option>
        {categorias.map(cat => (
          <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>
        ))}
      </select>
      <input
        className="form-control"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Nueva marca"
        required
      />
      <button type="submit" className="btn btn-success">Agregar</button>
      {msg && <span className="ms-2">{msg}</span>}
    </form>
  );
};

export default BrandForm;