import './Sidebar.css';

function Sidebar() {
  return (
    <aside id="sidebar" className="sidebar">

      <ul className="sidebar-nav" id="sidebar-nav">

        <li className="nav-item">
          <a className="nav-link " href="./services">
            <i className="bi bi-grid"></i>
            <span>Crear servicio</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link " href="./home">
            <i className="bi bi-grid"></i>
            <span>Recargar saldo</span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse" href="./home">
            <i className="bi bi-journal-text"></i><span>Forms</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="forms-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>Form Elements</span>
              </a>
            </li>
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>Form Layouts</span>
              </a>
            </li>
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>Form Editors</span>
              </a>
            </li>
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>Form Validation</span>
              </a>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse" href="./home">
            <i className="bi bi-layout-text-window-reverse"></i><span>Tables</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="tables-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>General Tables</span>
              </a>
            </li>
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>Data Tables</span>
              </a>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#charts-nav" data-bs-toggle="collapse" href="./home">
            <i className="bi bi-bar-chart"></i><span>Charts</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="charts-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>Chart.js</span>
              </a>
            </li>
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>ApexCharts</span>
              </a>
            </li>
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>ECharts</span>
              </a>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#icons-nav" data-bs-toggle="collapse" href="./home">
            <i className="bi bi-gem"></i><span>Icons</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="icons-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>Bootstrap Icons</span>
              </a>
            </li>
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>Remix Icons</span>
              </a>
            </li>
            <li>
              <a href="./home">
                <i className="bi bi-circle"></i><span>Boxicons</span>
              </a>
            </li>
          </ul>
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