import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Sidebar from "./components/Sidebar";
import EditProduct from "./pages/EditProduct"; // Asegúrate de tener este archivo
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from "./components/Header";
import Reportes from "./pages/Reportes";
import Movimientos from "./pages/Movimientos";
import Dashboard from "./pages/Dashboard";
import ProductDetail from "./pages/ProductDetail";
import Categorias from "./pages/Categorias";
import Login from "./pages/Login";
import Contabilidad from "./pages/Contabilidad";
import VentaForm from "./pages/VentaForm";
import ReporteVentas from "./pages/ReporteVentas";
import ReponerStock from "./pages/ReponerStock";
import './styles/custom.css';
import AdminUsuarios from "./pages/AdminUsuarios";

function AppContent() {
  const location = useLocation();
  const isAuthenticated = () => !!localStorage.getItem("usuario");
  const user = JSON.parse(localStorage.getItem("usuario"));

  if (!isAuthenticated() && location.pathname !== "/login") {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <div className="d-flex">
        <Sidebar user={user} />
        <div className="flex-grow-1 p-4" style={{ minHeight: "100vh", background: "#f8f9fa" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/add-product" element={<ProductForm />} />
            <Route path="/ventas" element={<VentaForm />} />
            <Route
  path="/reporte-ventas"
  element={
    ["avanzado", "premium"].includes(user?.membresia)
      ? <ReporteVentas />
      : <Navigate to="/" />
  }
/>
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/movimientos" element={<Movimientos />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/login" element={<Login />} />
            <Route
  path="/contabilidad"
  element={
    user?.membresia === "premium"
      ? <Contabilidad />
      : <Navigate to="/" />
  }
/>
            <Route path="/reponer-stock" element={<ReponerStock />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          </Routes>
          {user?.rol === "admin" && (
  <NavLink to="/admin/usuarios">Administrar usuarios</NavLink>
)}
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
