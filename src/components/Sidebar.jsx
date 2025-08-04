import React from "react";
import { Link, useLocation, NavLink } from "react-router-dom";

const Sidebar = ({ user }) => {
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Inicio", icon: "bi-house-door" },
    { to: "/products", label: "Productos", icon: "bi-box-seam" },
    { to: "/add-product", label: "Agregar Producto", icon: "bi-plus-circle" },
    { to: "/movimientos", label: "Movimientos", icon: "bi-arrow-left-right" },
    { to: "/reportes", label: "Reportes", icon: "bi-bar-chart" },
    { to: "/categorias", label: "Categorías", icon: "bi-tags" },
    { to: "/ventas", label: "Ventas", icon: "bi-cart-check" },
    { to: "/reponer-stock", label: "Reponer Stock", icon: "bi-box-arrow-in-down" },
  ];

  return (
    <div className="bg-white border-end vh-100 p-3 shadow-sm" style={{ minWidth: 230 }}>
      <h4 className="mb-4 text-success text-center">
        <i className="bi bi-graph-up-arrow me-2"></i>
        Panel de Control
      </h4>
      <ul className="nav flex-column">
        {links.map(link => (
          <li className="nav-item mb-2" key={link.to}>
            <Link
              to={link.to}
              className={`nav-link d-flex align-items-center rounded-pill px-3 py-2 ${
                pathname === link.to ? "active bg-success text-white fw-bold" : "text-dark"
              }`}
              style={{ fontSize: 16 }}
            >
              <i className={`bi ${link.icon} me-2`}></i>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      {user?.rol === "admin" && (
        <NavLink to="/admin/usuarios" className="nav-link d-flex align-items-center rounded-pill px-3 py-2">
          <i className="bi bi-people me-2"></i>
          Administrar usuarios
        </NavLink>
      )}
      {user?.membresia === "premium" && (
        <NavLink to="/contabilidad">
          <i className="bi bi-cash-coin me-2"></i>Contabilidad
        </NavLink>
      )}
      {["avanzado", "premium"].includes(user?.membresia) && (
        <NavLink to="/reporte-ventas">
          <i className="bi bi-bar-chart me-2"></i>Reporte Ventas
        </NavLink>
      )}
      <table className="table table-bordered table-hover table-striped shadow-sm rounded">
        {/* ... */}
      </table>
    </div>
  );
};

export default Sidebar;