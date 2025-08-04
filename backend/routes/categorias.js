// backend/models/Categoria.js
const mongoose = require("mongoose");
const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true }
});
module.exports = mongoose.model("Categoria", categoriaSchema);

// backend/routes/categorias.js
const express = require("express");
const router = express.Router();
const Categoria = require("../models/Categoria");

// Obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una nueva categoría
router.post("/", async (req, res) => {
  try {
    const nuevaCategoria = new Categoria({ nombre: req.body.nombre });
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar una categoría
router.put("/:id", async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nombre: req.body.nombre },
      { new: true }
    );
    res.json(categoria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar una categoría
router.delete("/:id", async (req, res) => {
  try {
    await Categoria.findByIdAndDelete(req.params.id);
    res.json({ msg: "Eliminada" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;