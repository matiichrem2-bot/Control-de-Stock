import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productsService";

const ProductDetail = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    getProductById(id).then(setProducto);
  }, [id]);

  if (!producto) {
    return <div className="text-center py-5">Cargando...</div>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4 border-0 rounded-4 mx-auto" style={{ maxWidth: 500 }}>
        <h3 className="mb-4 text-success fw-bold text-center">
          <i className="bi bi-box-seam me-2"></i>Detalle de Producto
        </h3>
        <ul className="list-group list-group-flush mb-4">
          <li className="list-group-item"><strong>Nombre:</strong> {producto.nombre}</li>
          <li className="list-group-item"><strong>Categoría:</strong> {producto.categoria}</li>
          <li className="list-group-item"><strong>Marca:</strong> {producto.marca}</li>
          <li className="list-group-item"><strong>Stock:</strong> {producto.stock}</li>
          <li className="list-group-item"><strong>Precio costo:</strong> ${Number(producto.precioCosto).toLocaleString()}</li>
          <li className="list-group-item"><strong>Precio venta:</strong> ${Number(producto.precioVenta).toLocaleString()}</li>
        </ul>
        <div className="d-flex justify-content-between">
          <Link to="/products" className="btn btn-outline-secondary rounded-pill">
            <i className="bi bi-arrow-left"></i> Volver
          </Link>
          <Link to={`/edit-product/${producto._id}`} className="btn btn-success rounded-pill">
            <i className="bi bi-pencil"></i> Editar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;