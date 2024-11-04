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
          <NavLink to={"/home"} className={`nav-link ${(location.pathname === "/home") ? "active" : "collapsed"}`}>
            <i className="bi bi-grid"></i>
            <span>Recargar saldo</span>
          </NavLink>
        </li>

        <li className="nav-heading">Pages</li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="./home">
            <i className="bi bi-person"></i>
            <span>Profile</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="./home">
            <i className="bi bi-question-circle"></i>
            <span>F.A.Q</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="./home">
            <i className="bi bi-envelope"></i>
            <span>Contact</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="./home">
            <i className="bi bi-card-list"></i>
            <span>Register</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="./home">
            <i className="bi bi-box-arrow-in-right"></i>
            <span>Login</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="./home">
            <i className="bi bi-dash-circle"></i>
            <span>Error 404</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" href="./home">
            <i className="bi bi-file-earmark"></i>
            <span>Blank</span>
          </a>
        </li>

      </ul>

    </aside>
  );
}

export default Sidebar;