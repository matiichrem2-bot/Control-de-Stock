const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // ¡Fundamental para recibir JSON!

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error conectando a MongoDB:", err));

app.get("/", (req, res) => {
  res.send("API funcionando");
});

// Rutas principales
const productsRouter = require("./routes/products");
app.use("/api/products", productsRouter);

const movimientosRouter = require("./routes/movimientos");
app.use("/api/movimientos", movimientosRouter);

const proveedoresRoutes = require('./routes/proveedores');
app.use('/api/proveedores', proveedoresRoutes);

const cortesRouter = require("./routes/cortes");
app.use("/api/cortes", cortesRouter);

// SOLO español:
const categoriasRouter = require("./routes/categorias");
const marcasRouter = require("./routes/marcas");

app.use("/api/categorias", categoriasRouter);
app.use("/api/marcas", marcasRouter);

const userMemberRoutes = require("./routes/userMember");
app.use("/api/userMember", userMemberRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});