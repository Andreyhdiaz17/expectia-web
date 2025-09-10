import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SidebarLayout() {
  const { user, logout } = useAuth();
  const linkClass = ({ isActive }) =>
    'side-link' + (isActive ? ' side-link--active' : '');

  return (
    <div className="layout">
      <aside className="sidebar card">
        <div className="card-section">
          <div className="user">Hola, {user?.email}</div>

          <nav className="side-nav">
            <NavLink to="/Dashboard" end className={linkClass}>Inicio</NavLink>
            <NavLink to="/Proyectos" className={linkClass}>Proyectos</NavLink>
            <NavLink to="/Checklist" className={linkClass}>Checklist</NavLink>
            <NavLink to="/Hallazgos" className={linkClass}>Hallazgos</NavLink>
            
            <NavLink to="/InspeccionesNuevas" className={linkClass}>Nueva inspección</NavLink>
            <NavLink to="/Reportes" className={linkClass}>Reportes</NavLink>
          </nav>

          <button className="btn-logout" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <section>
        <Outlet />
      </section>
    </div>
  );
}
