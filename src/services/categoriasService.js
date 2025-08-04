import axios from "axios";

export const getCategorias = async () => {
  const res = await axios.get("/api/categorias");
  return res.data;
};