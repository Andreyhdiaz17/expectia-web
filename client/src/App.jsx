// client/src/App.jsx
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import SidebarLayout from "./components/SidebarLayout";

import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Proyectos from "./pages/Proyectos";
import Checklist from "./pages/Checklist";
import Hallazgos from "./pages/Hallazgos";
import Reportes from "./pages/Reportes";
import InspeccionesNuevas from "./pages/InspeccionesNuevas";

// Wrapper mínimo: usa tu SidebarLayout y coloca <Outlet/> adentro
function Shell() {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  );
}

// Página 404 simple (opcional)
function NotFound() {
  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'60vh', gap:12}}>
      <h1 style={{margin:0}}>404</h1>
      <p style={{color:'#64748b'}}>Página no encontrada</p>
      <a className="btn" href="/Dashboard">Ir al Dashboard</a>
    </div>
  );
}

export default function App() {
  return (
    <div>
      {/* Dejamos tu Navbar como lo tenías */}
      <Navbar />

      <main style={{ padding: "1rem" }}>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/Productos" element={<Productos />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />

          {/* Protegidas: ahora usamos el wrapper Shell que sí tiene <Outlet/> */}
          <Route element={<Shell />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Proyectos" element={<Proyectos />} />
            <Route path="/Checklist" element={<Checklist />} />
            <Route path="/Hallazgos" element={<Hallazgos />} />
            <Route path="/Reportes" element={<Reportes />} />
            <Route path="/InspeccionesNuevas" element={<InspeccionesNuevas />} />
          </Route>

          {/* 404 (opcional) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
