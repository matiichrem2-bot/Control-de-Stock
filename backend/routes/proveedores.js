const express = require("express");
const router = express.Router();
const Proveedor = require("../models/Proveedor");

router.get("/", async (req, res) => {
  const proveedores = await Proveedor.find().populate("productos");
  res.json(proveedores);
});

module.exports = router;