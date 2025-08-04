import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productsService";

const ProductForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    marca: "",
    stock: "",
    precioCosto: "",
    precioVenta: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/categorias")
      .then((response) => response.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error("Error fetching categorias:", error));

    fetch("/api/marcas")
      .then((response) => response.json())
      .then((data) => setMarcas(data))
      .catch((error) => console.error("Error fetching marcas:", error));
  }, []);

  // Opcional: filtrar marcas por categoría seleccionada
  const marcasFiltradas = form.categoria
    ? marcas.filter((m) => m.categoria === form.categoria)
    : marcas;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.nombre || !form.categoria || !form.marca || !form.stock || !form.precioCosto || !form.precioVenta) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    try {
      await createProduct(form);
      setSuccess("Producto agregado correctamente");
      setTimeout(() => navigate("/products"), 1200);
    } catch (err) {
      setError("Error al agregar producto");
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4 border-0 rounded-4 mx-auto" style={{ maxWidth: 500 }}>
        <h3 className="mb-4 text-success fw-bold text-center">
          <i className="bi bi-plus-circle me-2"></i>Agregar Producto
        </h3>
        <form onSubmit={handleSubmit} className="p-2">
          <div className="mb-3">
            <label className="form-label">Nombre *</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Categoría *</label>
            <select
              className="form-select"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat.nombre}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Marca *</label>
            <select
              className="form-select"
              name="marca"
              value={form.marca}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una marca</option>
              {marcasFiltradas.map((marca) => (
                <option key={marca._id} value={marca.nombre}>{marca.nombre}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Stock inicial *</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min={0}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Precio costo *</label>
            <input
              type="number"
              className="form-control"
              name="precioCosto"
              value={form.precioCosto}
              onChange={handleChange}
              min={0}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Precio venta *</label>
            <input
              type="number"
              className="form-control"
              name="precioVenta"
              value={form.precioVenta}
              onChange={handleChange}
              min={0}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn btn-success rounded-pill px-4">
              <i className="bi bi-check-circle me-2"></i>Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;