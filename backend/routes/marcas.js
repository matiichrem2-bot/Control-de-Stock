// routes/marcas.js
const express = require("express");
const router = express.Router();
const Marca = require("../models/Marca");

// Obtener todas las marcas
router.get("/", async (req, res) => {
  try {
    const marcas = await Marca.find();
    res.json(marcas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una nueva marca
router.post("/", async (req, res) => {
  try {
    const nuevaMarca = new Marca({
      nombre: req.body.nombre,
      categoria: req.body.categoria
    });
    await nuevaMarca.save();
    res.status(201).json(nuevaMarca);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Editar una marca
router.put("/:id", async (req, res) => {
  try {
    const marca = await Marca.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        categoria: req.body.categoria
      },
      { new: true }
    );
    res.json(marca);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar una marca
router.delete("/:id", async (req, res) => {
  try {
    await Marca.findByIdAndDelete(req.params.id);
    res.json({ msg: "Marca eliminada" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;