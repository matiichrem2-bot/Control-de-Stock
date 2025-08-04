import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productsService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [productosPorPagina] = useState(10);

  useEffect(() => {
    getProducts().then(setProductos);
  }, []);

  // Filtro de búsqueda por nombre, categoría o marca
  const productosFiltrados = productos.filter((p) =>
    [p.nombre, p.categoria, p.marca]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // Paginación
  const indexOfLastProduct = pagina * productosPorPagina;
  const indexOfFirstProduct = indexOfLastProduct - productosPorPagina;
  const productosPagina = productosFiltrados.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const handleSiguiente = () => {
    if (pagina < totalPaginas) {
      setPagina(pagina + 1);
    }
  };

  const handleAnterior = () => {
    if (pagina > 1) {
      setPagina(pagina - 1);
    }
  };

  const exportarExcel = () => {
    const datos = productosFiltrados.map(p => ({
      Nombre: p.nombre,
      Categoría: p.categoria,
      Marca: p.marca,
      Stock: p.stock,
      "Precio Costo": p.precioCosto,
      "Precio Venta": p.precioVenta,
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "productos.xlsx");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success fw-bold mb-0">
          <i className="bi bi-box-seam me-2"></i>Productos
        </h2>
        <Link to="/add-product" className="btn btn-success rounded-pill shadow-sm">
          <i className="bi bi-plus-circle me-2"></i>Agregar Producto
        </Link>
      </div>
      <div className="card shadow-sm p-4 border-0 rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold mb-0">Lista de productos</h5>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control ms-3"
              style={{ maxWidth: 250 }}
              placeholder="Buscar por nombre, categoría o marca"
              value={busqueda}
              onChange={e => {
                setBusqueda(e.target.value);
                setPagina(1); // resetear a la primera página al buscar
              }}
            />
            <button className="btn btn-outline-success btn-sm ms-2" onClick={exportarExcel}>
              <i className="bi bi-file-earmark-excel me-1"></i>Exportar Excel
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Stock</th>
                <th>Precio Costo</th>
                <th>Precio Venta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosPagina.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-secondary">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                productosPagina.map((p) => (
                  <tr key={p._id}>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>{p.marca}</td>
                    <td>
                      <span className={`badge rounded-pill ${p.stock > 0 ? "bg-success" : "bg-danger"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>${Number(p.precioCosto).toLocaleString()}</td>
                    <td>${Number(p.precioVenta).toLocaleString()}</td>
                    <td>
                      <Link
                        to={`/edit-product/${p._id}`}
                        className="btn btn-outline-success btn-sm me-2"
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <Link
                        to={`/product/${p._id}`}
                        className="btn btn-outline-primary btn-sm"
                        title="Ver detalle"
                      >
                        <i className="bi bi-eye"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={handleAnterior} disabled={pagina === 1}>
                Anterior
              </button>
              <span>Página {pagina} de {totalPaginas}</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={handleSiguiente} disabled={pagina === totalPaginas}>
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;