import axios from "axios";

const API_URL = "http://localhost:5000/api/movimientos";

export const getMovimientos = () => axios.get(API_URL).then(res => res.data);

export const createMovimiento = (data) => axios.post(API_URL, data).then(res => res.data);