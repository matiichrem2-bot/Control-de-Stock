import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productsService";
import { getMovimientos } from "../services/movimientosService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { Link } from "react-router-dom";
import './DashboardModern.css'; // crea este archivo para estilos extra si quieres

const Dashboard = () => {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    getProducts().then(setProductos);
    getMovimientos().then(setMovimientos);
  }, []);

  const bajoStock = productos.filter(p => p.stock <= 5);

  // Gráfico de torta por categoría
  const categorias = {};
  productos.forEach(p => {
    categorias[p.categoria || "Sin categoría"] = (categorias[p.categoria || "Sin categoría"] || 0) + 1;
  });
  const dataCategorias = Object.entries(categorias).map(([cat, cant]) => ({
    name: cat,
    value: cant
  }));
  const COLORS = ["#198754", "#ffc107", "#0d6efd", "#dc3545", "#6f42c1", "#20c997"];

  // Totales de entradas y salidas
  const totalEntradas = movimientos.filter(m => m.tipo === "entrada").reduce((acc, m) => acc + m.cantidad, 0);
  const totalSalidas = movimientos.filter(m => m.tipo === "salida").reduce((acc, m) => acc + m.cantidad, 0);
  const totalProductos = productos.length;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success fw-bold mb-0">
          <i className="bi bi-graph-up-arrow me-2"></i>Panel de Control
        </h2>
        <div>
          <Link to="/add-product" className="btn btn-success rounded-pill me-2 shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Agregar Producto
          </Link>
          <Link to="/reportes" className="btn btn-outline-success rounded-pill shadow-sm">
            <i className="bi bi-bar-chart me-2"></i>Ver Reportes
          </Link>
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-6 col-md-3">
          <div className="card card-metric text-center p-3 border-0 rounded-4 shadow-sm">
            <div className="icon-metric bg-gradient-green mb-2">
              <i className="bi bi-box-seam"></i>
            </div>
            <div className="metric-label">Total productos</div>
            <div className="metric-value">{totalProductos}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card card-metric text-center p-3 border-0 rounded-4 shadow-sm">
            <div className="icon-metric bg-gradient-blue mb-2">
              <i className="bi bi-archive"></i>
            </div>
            <div className="metric-label">Stock total</div>
            <div className="metric-value">
              {productos.reduce((acc, p) => acc + (p.stock || 0), 0)}
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card card-metric text-center p-3 border-0 rounded-4 shadow-sm">
            <div className="icon-metric bg-gradient-yellow mb-2">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <div className="metric-label">Bajo stock</div>
            <div className="metric-value text-danger">{bajoStock.length}</div>
            {bajoStock.length > 0 && (
              <span className="badge bg-danger mt-2">¡Atención!</span>
            )}
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card card-metric text-center p-3 border-0 rounded-4 shadow-sm">
            <div className="icon-metric bg-gradient-purple mb-2">
              <i className="bi bi-arrow-left-right"></i>
            </div>
            <div className="metric-label">Movimientos</div>
            <div className="metric-value">{movimientos.length}</div>
          </div>
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-4 mb-4 border-0 rounded-4">
            <h5 className="mb-3 fw-semibold">Stock por producto</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#43e97b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-4 mb-4 border-0 rounded-4">
            <h5 className="mb-3 fw-semibold">Productos por categoría</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataCategorias}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#43e97b"
                  label
                >
                  {dataCategorias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card card-metric text-center p-3 border-0 rounded-4 shadow-sm">
            <div className="icon-metric bg-gradient-blue mb-2">
              <i className="bi bi-arrow-down-circle"></i>
            </div>
            <div className="metric-label">Total entradas</div>
            <div className="metric-value">{totalEntradas}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card card-metric text-center p-3 border-0 rounded-4 shadow-sm">
            <div className="icon-metric bg-gradient-red mb-2">
              <i className="bi bi-arrow-up-circle"></i>
            </div>
            <div className="metric-label">Total salidas</div>
            <div className="metric-value">{totalSalidas}</div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm p-4 border-0 rounded-4">
        <h5 className="mb-3 fw-semibold">Últimos movimientos</h5>
        <table className="table table-bordered table-hover table-striped rounded-4 shadow-sm">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.slice(0, 5).map((m, i) => (
              <tr key={i}>
                <td>{new Date(m.fecha).toLocaleString()}</td>
                <td>{m.producto?.nombre || "-"}</td>
                <td>
                  <span className={`badge ${m.tipo === "entrada" ? "bg-primary" : "bg-danger"}`}>
                    {m.tipo === "entrada" ? "Entrada" : "Salida"}
                  </span>
                </td>
                <td>{m.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;