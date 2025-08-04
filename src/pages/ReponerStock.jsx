import React, { useState, useEffect } from "react";
import { getProducts } from "../services/productsService";

const ReponerStock = ({ onReponer }) => {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioCosto, setPrecioCosto] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    getProducts().then(setProductos);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productoId || !cantidad) return;
    const res = await fetch(`/api/products/reponer/${productoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad, precioCosto }),
    });
    if (res.ok) {
      setMensaje("Stock repuesto correctamente");
      setCantidad("");
      setPrecioCosto("");
      if (onReponer) onReponer();
    } else {
      setMensaje("Error al reponer stock");
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h5 className="mb-3">Reponer stock</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <select
            className="form-select"
            value={productoId}
            onChange={e => setProductoId(e.target.value)}
            required
          >
            <option value="">Selecciona un producto</option>
            {productos.map(p => (
              <option key={p._id} value={p._id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Cantidad a reponer"
            value={cantidad}
            min={1}
            onChange={e => setCantidad(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Nuevo precio de costo (opcional)"
            value={precioCosto}
            min={0}
            onChange={e => setPrecioCosto(e.target.value)}
          />
        </div>
        <button className="btn btn-success" type="submit">Reponer</button>
      </form>
      {mensaje && <div className="mt-2">{mensaje}</div>}
    </div>
  );
};

export default ReponerStock;