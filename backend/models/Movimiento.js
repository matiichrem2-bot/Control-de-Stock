const mongoose = require("mongoose");

const movimientoSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  tipo: { type: String, enum: ["entrada", "salida"], required: true },
  cantidad: { type: Number, required: true },
  comentario: String,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Movimiento", movimientoSchema);