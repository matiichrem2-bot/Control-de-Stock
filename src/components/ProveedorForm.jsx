import React, { useState } from "react";

const ProveedorForm = ({ onSave, onCancel, initial = {} }) => {
  const [nombre, setNombre] = useState(initial.nombre || "");
  const [contacto, setContacto] = useState(initial.contacto || "");

  const handleSubmit = e => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onSave({ nombre, contacto });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row g-2 align-items-end">
        <div className="col-md-5">
          <label className="form-label fw-semibold">Nombre</label>
          <input className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>
        <div className="col-md-5">
          <label className="form-label fw-semibold">Contacto</label>
          <input className="form-control" value={contacto} onChange={e => setContacto(e.target.value)} />
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button type="submit" className="btn btn-success rounded-pill w-100">Guardar</button>
          {onCancel && (
            <button type="button" className="btn btn-outline-secondary rounded-pill w-100" onClick={onCancel}>Cancelar</button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProveedorForm;