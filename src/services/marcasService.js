import axios from "axios";

export const getMarcas = async () => {
  const res = await axios.get("/api/marcas");
  return res.data;
};