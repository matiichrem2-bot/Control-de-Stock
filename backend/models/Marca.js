const mongoose = require("mongoose");

const marcaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  categoria: { type: String, required: true }
});

module.exports = mongoose.models.Marca || mongoose.model("Marca", marcaSchema);