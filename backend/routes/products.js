const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Crear producto
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const product = new Product(req.body);
    await product.save();
    console.log("Producto guardado:", product); // <-- agrega esto
    res.status(201).json(product);
  } catch (err) {
    console.error("ERROR AL GUARDAR:", err); // <-- así lo ves bien claro
    res.status(400).json({ error: err.message });
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar producto
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Reponer producto
router.put("/reponer/:id", async (req, res) => {
  try {
    const { cantidad, precioCosto } = req.body;
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    producto.stock += Number(cantidad);
    if (precioCosto) producto.precioCosto = precioCosto;
    await producto.save();
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;