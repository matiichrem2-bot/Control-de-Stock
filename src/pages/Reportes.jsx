import React, { useEffect, useState } from "react";
import { getMovimientos } from "../services/movimientosService";
import { getProducts } from "../services/productsService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Reportes = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    producto: "",
    tipo: "",
    desde: "",
    hasta: "",
  });

  useEffect(() => {
    getMovimientos().then(setMovimientos);
    getProducts().then(setProductos);
  }, []);

  const movimientosFiltrados = movimientos.filter((mov) => {
    const cumpleProducto =
      !filtros.producto || mov.producto?._id === filtros.producto;
    const cumpleTipo = !filtros.tipo || mov.tipo === filtros.tipo;
    const fecha = new Date(mov.fecha);
    const cumpleDesde = !filtros.desde || fecha >= new Date(filtros.desde);
    const cumpleHasta = !filtros.hasta || fecha <= new Date(filtros.hasta);
    return cumpleProducto && cumpleTipo && cumpleDesde && cumpleHasta;
  });

  // Totales
  const totalEntradas = movimientosFiltrados
    .filter((m) => m.tipo === "entrada")
    .reduce((acc, m) => acc + Number(m.cantidad), 0);
  const totalSalidas = movimientosFiltrados
    .filter((m) => m.tipo === "salida")
    .reduce((acc, m) => acc + Number(m.cantidad), 0);

  const exportarExcel = () => {
    const datos = movimientosFiltrados.map((m) => ({
      Fecha: new Date(m.fecha).toLocaleString(),
      Producto: m.producto?.nombre || "-",
      Tipo: m.tipo,
      Cantidad: m.cantidad,
      Comentario: m.comentario,
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movimientos");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "reporte_movimientos.xlsx"
    );
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary">Reportes de Movimientos</h2>
      <div className="card shadow-sm p-4 mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <select
              className="form-select"
              value={filtros.producto}
              onChange={(e) =>
                setFiltros((f) => ({ ...f, producto: e.target.value }))
              }
            >
              <option value="">Todos los productos</option>
              {productos.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={filtros.tipo}
              onChange={(e) => setFiltros((f) => ({ ...f, tipo: e.target.value }))}
            >
              <option value="">Todos los tipos</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={filtros.desde}
              onChange={(e) => setFiltros((f) => ({ ...f, desde: e.target.value }))}
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={filtros.hasta}
              onChange={(e) => setFiltros((f) => ({ ...f, hasta: e.target.value }))}
            />
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <button
              className="btn btn-outline-success ms-2"
              onClick={exportarExcel}
            >
              <i className="bi bi-file-earmark-excel me-1"></i>Exportar Excel
            </button>
          </div>
        </div>
      </div>
      <div className="card shadow-sm p-4">
        <div className="mb-3">
          <span className="me-4">
            <strong>Total entradas:</strong>{" "}
            <span className="text-success">{totalEntradas}</span>
          </span>
          <span>
            <strong>Total salidas:</strong>{" "}
            <span className="text-danger">{totalSalidas}</span>
          </span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
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
                  <td colSpan={5} className="text-center text-secondary">
                    Sin movimientos para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                movimientosFiltrados.map((mov, i) => (
                  <tr key={i}>
                    <td>{new Date(mov.fecha).toLocaleString()}</td>
                    <td>{mov.producto?.nombre || "-"}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          mov.tipo === "entrada" ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {mov.tipo}
                      </span>
                    </td>
                    <td>{mov.cantidad}</td>
                    <td>{mov.comentario}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;