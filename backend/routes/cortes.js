const express = require("express");
const router = express.Router();
const Corte = require("../models/Corte.js");

router.post("/", async (req, res) => {
  try {
    const existe = await Corte.findOne({ fecha: req.body.fecha });
    if (existe) {
      return res.status(400).json({ error: "Ya existe un corte para este día." });
    }
    const corte = new Corte(req.body);
    await corte.save();
    res.status(201).json(corte);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const cortes = await Corte.find();
  res.json(cortes);
});

module.exports = router;