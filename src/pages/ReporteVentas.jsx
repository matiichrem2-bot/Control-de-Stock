import React, { useEffect, useState } from "react";
import { getMovimientos } from "../services/movimientosService";
import { getProducts } from "../services/productsService";

const ReporteVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [totalDiaVisual, setTotalDiaVisual] = useState(null);
  const [totalMesAcumulado, setTotalMesAcumulado] = useState(0);
  const [cortes, setCortes] = useState([]);

  // Cargar productos, ventas y cortes
  useEffect(() => {
    getProducts().then(setProductos);
    getMovimientos().then(data => {
      setVentas(data.filter(m => m.tipo === "salida"));
    });
    fetch("/api/cortes")
      .then(res => res.json())
      .then(data => setCortes(data));
    setTotalDiaVisual(null); // Reset visual del día al cambiar fecha
  }, [fecha]);

  // Ventas del día y del mes
  const ventasHoy = ventas.filter(v => v.fecha?.slice(0, 10) === fecha);
  const ventasMes = ventas.filter(v => {
    const f = new Date(v.fecha);
    const hoy = new Date(fecha);
    return f.getFullYear() === hoy.getFullYear() && f.getMonth() === hoy.getMonth();
  });

  // Total del día (real)
  const totalDia = ventasHoy.reduce((acc, v) => {
    const prod = productos.find(
      p => p && String(p._id) === String(v.producto._id || v.producto)
    );
    return acc + ((prod?.precioVenta || 0) * (Number(v.cantidad) || 0));
  }, 0);

  // Total del mes acumulado (persistente)
  const mesActual = fecha.slice(0, 7);
  const cortesMes = cortes.filter(c => c.mes === mesActual);
  const totalMesAcumuladoPersistente = cortesMes.reduce((acc, c) => acc + (c.totalDia || 0), 0);

  // ¿Ya existe un corte para el día?
  const yaCortado = cortes.some(c => c.fecha === fecha);

  // Visuales
  const totalDiaMostrar = yaCortado ? 0 : (totalDiaVisual !== null ? totalDiaVisual : totalDia);
  const totalMesMostrar = totalMesAcumuladoPersistente + (yaCortado ? 0 : (totalDiaVisual !== null ? 0 : totalDia));

  // Botón de corte del día
  const handleCorteDia = async () => {
    if (totalDia === 0) {
      alert("No hay ventas para cortar hoy.");
      return;
    }
    // Verificar si ya existe un corte para la fecha actual
    const yaCortado = cortes.some(c => c.fecha === fecha);
    if (yaCortado) {
      alert("Ya existe un corte para este día. No puedes hacer más de uno.");
      return;
    }
    if (window.confirm("¿Seguro que quieres hacer el corte del día? Esta acción no se puede deshacer.")) {
      await fetch("/api/cortes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha,
          totalDia,
          mes: mesActual,
          totalMesAcumulado: totalMesAcumuladoPersistente + totalDia
        })
      });
      // Recargar cortes y resetear visual
      fetch("/api/cortes")
        .then(res => res.json())
        .then(data => setCortes(data));
      setTotalDiaVisual(0);
      alert("¡Corte del día realizado!");
    }
  };

  if (!productos.length) {
    return <div className="container py-4 text-center">Cargando productos...</div>;
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <div className="bg-light rounded-3 p-4 text-center border shadow-sm">
            <div className="fw-semibold fs-5 mb-2">Total del día</div>
            <div className="fw-bold fs-3 text-success">${totalDiaMostrar.toLocaleString()}</div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="bg-light rounded-3 p-4 text-center border shadow-sm">
            <div className="fw-semibold fs-5 mb-2">Total del mes</div>
            <div className="fw-bold fs-3 text-primary">${totalMesMostrar.toLocaleString()}</div>
          </div>
        </div>
        <div className="col-md-4 mb-2 d-flex align-items-center justify-content-center">
          <button className="btn btn-warning btn-lg rounded-pill px-4" onClick={handleCorteDia}>
            Corte del día
          </button>
        </div>
      </div>
      <div className="card shadow-sm p-4 border-0 rounded-4">
        <h3 className="mb-4 text-success fw-bold">
          <i className="bi bi-receipt me-2"></i>Ventas del día ({fecha})
        </h3>
        <div className="mb-3">
          <label className="form-label fw-semibold">Fecha</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            style={{ maxWidth: 200 }}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped align-middle mb-0">
            <thead className="table-success">
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Venta</th>
                <th>Total</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {ventasHoy.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-secondary">No hay ventas registradas hoy</td>
                </tr>
              ) : (
                ventasHoy.map((v, i) => {
                  const prod = productos.find(
                    p => p && String(p._id) === String(v.producto._id || v.producto)
                  );
                  const precioVenta = prod && prod.precioVenta ? Number(prod.precioVenta) : 0;
                  const cantidad = Number(v.cantidad) || 0;
                  const total = precioVenta * cantidad;
                  return (
                    <tr key={i}>
                      <td>{prod?.nombre || <span className="text-danger">Producto eliminado</span>}</td>
                      <td>{cantidad}</td>
                      <td>{precioVenta ? `$${precioVenta}` : "-"}</td>
                      <td>{precioVenta && cantidad ? `$${total}` : "-"}</td>
                      <td>{v.fecha ? new Date(v.fecha).toLocaleTimeString() : "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <h5 className="mt-4">Historial de cortes del mes</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Total del día</th>
              <th>Total acumulado</th>
            </tr>
          </thead>
          <tbody>
            {cortesMes.map((c, i) => (
              <tr key={i}>
                <td>{c.fecha}</td>
                <td>${c.totalDia.toLocaleString()}</td>
                <td>${c.totalMesAcumulado.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReporteVentas;