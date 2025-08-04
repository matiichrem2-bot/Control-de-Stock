const express = require("express");
const router = express.Router();
const Movimiento = require("../models/Movimiento");
const Product = require("../models/Product");

// Registrar movimiento y actualizar stock
router.post("/", async (req, res) => {
  try {
    const { producto, tipo, cantidad, comentario } = req.body;
    const prod = await Product.findById(producto);
    if (!prod) return res.status(404).json({ error: "Producto no encontrado" });

    // Actualizar stock
    if (tipo === "entrada") {
      prod.stock += Number(cantidad);
    } else if (tipo === "salida") {
      if (prod.stock < cantidad) return res.status(400).json({ error: "Stock insuficiente" });
      prod.stock -= Number(cantidad);
    }
    await prod.save();

    // Registrar movimiento
    const movimiento = new Movimiento({ producto, tipo, cantidad, comentario });
    await movimiento.save();

    res.status(201).json(movimiento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener historial de movimientos
router.get("/", async (req, res) => {
  try {
    const movimientos = await Movimiento.find().populate("producto", "nombre codigo");
    res.json(movimientos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;