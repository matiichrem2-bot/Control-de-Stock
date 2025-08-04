const express = require("express");
const router = express.Router();
const User = require("../models/UserMembresia");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Middleware simple para simular autenticación de admin (ajusta según tu auth real)
function requireAdmin(req, res, next) {
  // Si usas JWT, deberías extraer el usuario del token y chequear el rol
  // Aquí solo para ejemplo:
  if (req.headers["x-admin"] === "true") return next();
  return res.status(403).json({ error: "Solo admin autorizado" });
}

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password, membresia } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Completa todos los campos obligatorios." });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ error: "El email ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      nombre,
      email,
      password: hashedPassword,
      membresia: membresia || "basico"
    });

    await user.save();

    res.status(201).json({ message: "Usuario registrado correctamente." });
  } catch (err) {
    res.status(500).json({ error: "Error al registrar usuario." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" });

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        membresia: user.membresia,
        nombre: user.nombre
      },
      process.env.JWT_SECRET || "secreto", // Usa una variable de entorno en producción
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        membresia: user.membresia
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Error en login" });
  }
});

// Obtener todos los usuarios (solo admin)
router.get("/", requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // No enviar password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Editar membresía o rol de un usuario (solo admin)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { membresia, rol } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { membresia, rol },
      { new: true, runValidators: true, fields: "-password" }
    );
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

module.exports = router;