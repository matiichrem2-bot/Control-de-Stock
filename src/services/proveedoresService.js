import axios from "axios";

const API_URL = "http://localhost:5000/api/proveedores";

export const getProveedores = () => axios.get(API_URL).then(res => res.data);
export const createProveedor = (data) => axios.post(API_URL, data).then(res => res.data);
export const updateProveedor = (id, data) => axios.put(`${API_URL}/${id}`, data).then(res => res.data);
export const deleteProveedor = (id) => axios.delete(`${API_URL}/${id}`).then(res => res.data);