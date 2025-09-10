import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const linkClass = ({ isActive }) =>
    'nav-link' + (isActive ? ' nav-link--active' : '');

  return (
    <header className="navbar">
      <nav className="container navbar__inner">
        <Link to="/" className="navbar__brand">Auditoría ISO/IEC 25010</Link>

        <div className="navbar__links">
          <NavLink to="/" className={linkClass} end>Inicio</NavLink>
          <NavLink to="/Productos" className={linkClass}>Productos</NavLink>

          {user ? (
            <NavLink to="/Dashboard" className={linkClass}>Panel</NavLink>
          ) : (
            <>
              <NavLink to="/Login" className={linkClass}>Iniciar sesión</NavLink>
              {/* primario para destacar registro */}
              <NavLink to="/Register" className="nav-link nav-link--primary">Registro</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
