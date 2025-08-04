import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productsService";
import { getMovimientos, createMovimiento } from "../services/movimientosService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Movimientos = () => {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [form, setForm] = useState({
    producto: "",
    tipo: "entrada",
    cantidad: 0,
    comentario: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filtroProducto, setFiltroProducto] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  useEffect(() => {
    getProducts().then(setProductos);
    cargarMovimientos();
  }, []);

  const cargarMovimientos = () => {
    getMovimientos().then(setMovimientos);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createMovimiento(form);
      setSuccess("Movimiento registrado");
      setForm({ ...form, cantidad: 0, comentario: "" });
      cargarMovimientos();
    } catch (err) {
      setError("Error al registrar movimiento");
    }
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(productos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "productos.xlsx");
  };

  const movimientosFiltrados = movimientos.filter(m =>
    (!filtroProducto || m.producto?._id === filtroProducto) &&
    (!filtroTipo || m.tipo === filtroTipo)
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-success">Movimientos de Stock</h2>
      <div className="card shadow-sm p-4 mb-4">
        <form onSubmit={handleSubmit} className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Producto</label>
            <select className="form-select" name="producto" value={form.producto} onChange={handleChange} required>
              <option value="">Seleccionar...</option>
              {productos.map(p => (
                <option key={p._id} value={p._id}>{p.nombre}</option>
              ))}
            </select>
            {form.producto && (
              <div className="form-text">
                Stock actual: {productos.find(p => p._id === form.producto)?.stock ?? "-"}
              </div>
            )}
          </div>
          <div className="col-md-2">
            <label className="form-label">Tipo</label>
            <select className="form-select" name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Cantidad</label>
            <input type="number" className="form-control" name="cantidad" value={form.cantidad} onChange={handleChange} min={1} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Comentario</label>
            <input type="text" className="form-control" name="comentario" value={form.comentario} onChange={handleChange} />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-success w-100">OK</button>
          </div>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}
      </div>
      <div className="card shadow-sm p-4">
        <h5>Historial de movimientos</h5>
        <div className="mb-3 row">
          <div className="col-md-4">
            <select
              className="form-select"
              value={filtroProducto}
              onChange={e => setFiltroProducto(e.target.value)}
            >
              <option value="">Todos los productos</option>
              {productos.map(p => (
                <option key={p._id} value={p._id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
        </div>
        <button className="btn btn-outline-success mb-3" onClick={exportarExcel}>
          Exportar productos a Excel
        </button>
        <table className="table table-bordered table-hover table-striped shadow-sm rounded">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Comentario</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">Sin movimientos</td>
              </tr>
            ) : (
              movimientosFiltrados.map((m, i) => (
                <tr key={i}>
                  <td>{new Date(m.fecha).toLocaleString()}</td>
                  <td>{m.producto?.nombre || "-"}</td>
                  <td>{m.tipo === "entrada" ? "Entrada" : "Salida"}</td>
                  <td>{m.cantidad}</td>
                  <td>{m.comentario}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Movimientos;