import React, { useEffect, useState } from "react";
import { getMovimientos } from "../services/movimientosService";
import { getProducts } from "../services/productsService";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#28a745", "#dc3545", "#007bff", "#ffc107"];

const Contabilidad = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    desde: "",
    hasta: "",
  });

  useEffect(() => {
    getMovimientos().then(setMovimientos);
    getProducts().then(setProductos);
  }, []);

  // Relacionar cada movimiento con el precio de costo y venta del producto
  const movimientosFiltrados = movimientos
    .filter((mov) => {
      const fecha = new Date(mov.fecha);
      const cumpleDesde = !filtros.desde || fecha >= new Date(filtros.desde);
      const cumpleHasta = !filtros.hasta || fecha <= new Date(filtros.hasta);
      return cumpleDesde && cumpleHasta;
    })
    .map((mov) => {
      const prod = productos.find((p) => p._id === (mov.producto?._id || mov.producto));
      return {
        ...mov,
        precioCosto: prod?.precioCosto || 0,
        precioVenta: prod?.precioVenta || 0,
        nombreProducto: prod?.nombre || "-",
      };
    });

  // Calcular ingresos y egresos
  const totalEgresos = movimientosFiltrados
    .filter((m) => m.tipo === "entrada")
    .reduce((acc, m) => acc + m.cantidad * m.precioCosto, 0);

  const totalIngresos = movimientosFiltrados
    .filter((m) => m.tipo === "salida")
    .reduce((acc, m) => acc + m.cantidad * m.precioVenta, 0);

  const balance = totalIngresos - totalEgresos;

  // Datos para gráficos
  const pieData = [
    { name: "Ingresos (ventas)", value: totalIngresos },
    { name: "Egresos (compras)", value: totalEgresos },
    { name: "Balance", value: Math.abs(balance) },
  ];

  // Total por producto vendido/comprado
  const productosTotales = productos.map((prod) => {
    const entradas = movimientosFiltrados
      .filter((m) => m.tipo === "entrada" && m.nombreProducto === prod.nombre)
      .reduce((acc, m) => acc + m.cantidad * m.precioCosto, 0);
    const salidas = movimientosFiltrados
      .filter((m) => m.tipo === "salida" && m.nombreProducto === prod.nombre)
      .reduce((acc, m) => acc + m.cantidad * m.precioVenta, 0);
    return {
      nombre: prod.nombre,
      Compras: entradas,
      Ventas: salidas,
    };
  }).filter(p => p.Compras > 0 || p.Ventas > 0);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary">
        <i className="bi bi-cash-coin me-2"></i>Contabilidad
      </h2>
      <div className="card shadow-sm p-4 mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <label className="form-label">Desde</label>
            <input
              type="date"
              className="form-control"
              value={filtros.desde}
              onChange={(e) => setFiltros((f) => ({ ...f, desde: e.target.value }))}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Hasta</label>
            <input
              type="date"
              className="form-control"
              value={filtros.hasta}
              onChange={(e) => setFiltros((f) => ({ ...f, hasta: e.target.value }))}
            />
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="mb-3">Resumen general</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3">
              <span className="me-4">
                <strong>Total ingresos (ventas):</strong>{" "}
                <span className="text-success">${totalIngresos.toLocaleString()}</span>
              </span>
              <span className="me-4">
                <strong>Total egresos (compras):</strong>{" "}
                <span className="text-danger">${totalEgresos.toLocaleString()}</span>
              </span>
              <span>
                <strong>Balance:</strong>{" "}
                <span className={balance >= 0 ? "text-success" : "text-danger"}>
                  ${balance.toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h5 className="mb-3">Compras y ventas por producto</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={productosTotales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Compras" fill="#dc3545" />
                <Bar dataKey="Ventas" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="card shadow-sm p-4 mb-4">
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Precio costo</th>
                <th>Precio venta</th>
                <th>Total movimiento</th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-secondary">
                    Sin movimientos para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                movimientosFiltrados.map((mov, i) => (
                  <tr key={i}>
                    <td>{new Date(mov.fecha).toLocaleString()}</td>
                    <td>{mov.nombreProducto}</td>
                    <td>
                      <span className={`badge rounded-pill ${mov.tipo === "entrada" ? "bg-danger" : "bg-success"}`}>
                        {mov.tipo === "entrada" ? "Compra" : "Venta"}
                      </span>
                    </td>
                    <td>{mov.cantidad}</td>
                    <td>${Number(mov.precioCosto).toLocaleString()}</td>
                    <td>${Number(mov.precioVenta).toLocaleString()}</td>
                    <td>
                      {mov.tipo === "entrada"
                        ? `-$${(mov.cantidad * mov.precioCosto).toLocaleString()}`
                        : `+$${(mov.cantidad * mov.precioVenta).toLocaleString()}`}
                    </td>
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

export default Contabilidad;