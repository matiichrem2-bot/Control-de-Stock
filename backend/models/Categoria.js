const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true }
});

// Esta línea evita el error de overwrite:
module.exports = mongoose.models.Categoria || mongoose.model("Categoria", categoriaSchema);