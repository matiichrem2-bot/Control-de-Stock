import React, { useState } from "react";

const CategoryForm = ({ onAdd }) => {
  const [nombre, setNombre] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre })
    });
    if (res.ok) {
      setMsg("Categoría agregada!");
      setNombre("");
      if (onAdd) onAdd();
    } else {
      setMsg("Error al agregar categoría");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3 d-flex gap-2">
      <input
        className="form-control"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Nueva categoría"
        required
      />
      <button type="submit" className="btn btn-success">Agregar</button>
      {msg && <span className="ms-2">{msg}</span>}
    </form>
  );
};

export default CategoryForm;