import React from "react";

const usuarioObj = JSON.parse(localStorage.getItem("usuario") || "{}");
const nombre = usuarioObj?.nombre || "Usuario";
const rol = usuarioObj?.rol === "admin" ? "Administrador" : "Cliente";

const Header = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
    <span className="navbar-brand fw-bold text-success d-flex align-items-center" style={{ fontSize: 24 }}>
      <i className="bi bi-box-seam me-2"></i>
      StockControl
    </span>
    <div className="ms-auto d-flex align-items-center">
      <span className="me-3 text-secondary fw-semibold">
        {nombre} <span className="badge bg-success ms-2">{rol}</span>
      </span>
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=55e89b&color=fff`}
        alt="avatar"
        width={38}
        height={38}
        className="rounded-circle border border-success shadow-sm"
        style={{ objectFit: "cover" }}
      />
      <button
        className="btn btn-outline-danger ms-3 d-flex align-items-center"
        style={{ fontWeight: 500 }}
        onClick={() => {
          localStorage.removeItem("usuario");
          window.location.href = "/login";
        }}
      >
        <i className="bi bi-box-arrow-right me-2"></i>
        Cerrar sesión
      </button>
    </div>
  </nav>
);

export default Header;