import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productsService";
import { getCategorias } from "../services/categoriasService";
import { getMarcas } from "../services/marcasService";

const EditProduct = () => {
  const { id } = useParams();
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
    getProductById(id).then((prod) => {
      if (prod) setForm(prod);
    });
    getCategorias().then(setCategorias);
    getMarcas().then(setMarcas);
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await updateProduct(id, form);
      setSuccess("Producto actualizado correctamente");
      setTimeout(() => navigate("/products"), 1200);
    } catch (err) {
      setError("Error al actualizar producto");
    }
  };

  const marcasFiltradas = form.categoria
    ? marcas.filter((m) => m.categoria === form.categoria)
    : marcas;

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4 border-0 rounded-4 mx-auto" style={{ maxWidth: 500 }}>
        <h3 className="mb-4 text-primary fw-bold text-center">
          <i className="bi bi-pencil me-2"></i>Editar Producto
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
            <label className="form-label">Stock *</label>
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
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill"
              onClick={() => navigate("/products")}
            >
              <i className="bi bi-arrow-left"></i> Volver
            </button>
            <button type="submit" className="btn btn-primary rounded-pill px-4">
              <i className="bi bi-check-circle me-2"></i>Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;