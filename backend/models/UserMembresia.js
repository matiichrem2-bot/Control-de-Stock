const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membresia: {
    type: String,
    enum: ["basico", "avanzado", "premium"],
    default: "basico"
  },
  rol: {
    type: String,
    enum: ["admin", "cliente"],
    default: "cliente"
  }
}, { timestamps: true });

module.exports = mongoose.models.UserMembresia || mongoose.model("UserMembresia", userSchema);