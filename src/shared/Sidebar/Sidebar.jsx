import './Sidebar.css';
import { useLocation, NavLink } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  return (
    <aside id="sidebar" className="sidebar">

      <ul className="sidebar-nav" id="sidebar-nav">

        <li className="nav-item">
          <NavLink to={"/services"} className={`nav-link ${(location.pathname === "/services") ? "active" : "collapsed"}`}>
            <i className="bi bi-grid"></i>
            <span>Crear servicio</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to={"/recharges"} className={`nav-link ${(location.pathname === "/recharges") ? "active" : "collapsed"}`}>
            <i className="bi bi-grid"></i>
            <span>Recargar saldo</span>
          </NavLink>
        </li>

      </ul>

    </aside>
  );
}

export default Sidebar;