import React, { useState, useEffect } from "react";
import { getProducts } from "../services/productsService";
import { getMovimientos, createMovimiento } from "../services/movimientosService";
import { useNavigate } from "react-router-dom";

const VentaForm = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    producto: "",
    cantidad: "",
    fecha: new Date().toISOString().slice(0, 10)
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then(data => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setProductos([]));
    cargarVentas();
  }, []);

  const cargarVentas = () => {
    getMovimientos().then(data => {
      const hoy = new Date().toISOString().slice(0, 10);
      setVentas(
        Array.isArray(data)
          ? data.filter(m => m.tipo === "salida" && m.fecha?.slice(0, 10) === hoy)
          : []
      );
    });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.producto || !form.cantidad) {
      setError("Selecciona producto y cantidad.");
      return;
    }
    try {
      await createMovimiento({
        producto: form.producto,
        cantidad: Number(form.cantidad),
        tipo: "salida",
        fecha: form.fecha
      });
      setSuccess("Venta registrada correctamente");
      setForm({ ...form, cantidad: "" });
      cargarVentas();
      setTimeout(() => {
        navigate("/reporte-ventas"); // Cambia la ruta si es diferente
      }, 1000);
    } catch (err) {
      setError("Error al registrar venta");
    }
  };

  const fecha = new Date().toISOString().slice(0, 10);
  const ventasHoy = ventas.filter(v => v.fecha?.slice(0, 10) === fecha);

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4 border-0 rounded-4 mx-auto mb-4" style={{ maxWidth: 500 }}>
        <h3 className="mb-4 text-danger fw-bold text-center">
          <i className="bi bi-cart-check me-2"></i>Registrar Venta
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Producto *</label>
            <select
              className="form-select"
              name="producto"
              value={form.producto}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un producto</option>
              {(Array.isArray(productos) ? productos : [])
                .filter(p => p && p.nombre)
                .map(p => (
                  <option key={p._id} value={p._id}>{p.nombre}</option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Cantidad *</label>
            <input
              type="number"
              className="form-control"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Fecha</label>
            <input
              type="date"
              className="form-control"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn btn-danger rounded-pill px-4">
              <i className="bi bi-check-circle me-2"></i>Registrar
            </button>
          </div>
        </form>
      </div>

      <div className="card shadow-sm p-4 border-0 rounded-4 mx-auto" style={{ maxWidth: 700 }}>
        <h5 className="mb-3 text-center">Ventas del día</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped align-middle mb-0">
            <thead className="table-danger">
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ventasHoy.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-secondary">No hay ventas registradas hoy</td>
                </tr>
              ) : (
                ventasHoy.map((v, i) => (
                  <tr key={i}>
                    <td>
                      {typeof v.producto === "object"
                        ? v.producto?.nombre
                        : (productos.find(p => p && p._id === v.producto)?.nombre || v.producto)}
                    </td>
                    <td>{v.cantidad}</td>
                    <td>{v.fecha?.slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-end">
          <span className="fw-semibold">Total del día: </span>
          <span className="fw-bold text-success">
            ${ventasHoy.reduce((acc, v) => {
              const prod = typeof v.producto === "object"
                ? v.producto
                : productos.find(p => p && p._id === v.producto);
              return acc + ((prod?.precioVenta || 0) * (Number(v.cantidad) || 0));
            }, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VentaForm;