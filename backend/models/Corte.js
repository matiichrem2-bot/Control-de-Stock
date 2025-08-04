const mongoose = require("mongoose");

const CorteSchema = new mongoose.Schema({
  fecha: { type: String, required: true }, // formato YYYY-MM-DD
  totalDia: { type: Number, required: true },
  mes: { type: String, required: true },   // formato YYYY-MM
  totalMesAcumulado: { type: Number, required: true }
});

module.exports = mongoose.model("Corte", CorteSchema);