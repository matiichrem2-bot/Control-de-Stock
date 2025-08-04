const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  categoria: { type: String, required: true }, // Ej: "CHOCOLATES"
  marca: { type: String, required: true },     // Ej: "Arcor", "Nestlé"
  nombre: { type: String, required: true },    // Ej: "Chocolate con leche"
  presentacion: { type: String },              // Ej: "100g", "Barra", etc.
  codigo: { type: String },                    // Código interno o de barra (opcional)
  stock: { type: Number, required: true },
  precioCosto: { type: Number, required: true },
  precioVenta: { type: Number, required: true },
  fechaCreacion: { type: Date, default: Date.now }
});

// Hace que NO se repita la misma marca+nombre+presentación en la misma categoría
productSchema.index(
  { categoria: 1, marca: 1, nombre: 1, presentacion: 1 },
  { unique: true }
);

module.exports = mongoose.model("Product", productSchema);