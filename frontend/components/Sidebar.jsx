import { NavLink } from "react-router-dom";
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiFileText,
  FiGrid,
  FiSettings,
  FiSliders,
} from "react-icons/fi";

function Sidebar() {
  const menuItems = [
    { label: "Dashboard", path: "/", icon: FiGrid },
    { label: "Experiments", path: "/experiments", icon: FiSliders },
    { label: "Monitoring", path: "/monitoring", icon: FiActivity },
    { label: "Analysis", path: "/analysis", icon: FiBarChart2 },
    { label: "Reports", path: "/reports", icon: FiFileText },
    { label: "Alerts", path: "/alerts", icon: FiAlertTriangle },
    { label: "Settings", path: "/settings", icon: FiSettings },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">🍄</div>

        <div>
          <h1>MycoSense</h1>
          <p>Fungal Bio-Sensing System</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="system-status">
        <h3>System Status</h3>

        <p>
          <span className="status-dot" />
          API connected
        </p>

        <p>
          <span className="status-dot" />
          Simulator operational
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;