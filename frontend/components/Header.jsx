import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarDays, LogOut, User } from "lucide-react";

import { logoutUser } from "../services/authService.js";

function Header() {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const username =
    localStorage.getItem("username") || "Chiamaka Joan";

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = today.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  function handleLogout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  function toggleNotifications() {
    setShowNotifications((current) => !current);
    setShowProfileMenu(false);
  }

  function toggleProfileMenu() {
    setShowProfileMenu((current) => !current);
    setShowNotifications(false);
  }

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <header className="top-header">
      <div className="header-title">
        <h1>Dashboard</h1>
        <p>Overview of fungal biosensing and environmental monitoring</p>
      </div>

      <div className="header-actions">
        <div className="header-date">
          <CalendarDays size={24} />

          <div>
            <strong>{formattedDate}</strong>
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="header-dropdown-wrapper" ref={notificationRef}>
          <button
            type="button"
            className="notification-button"
            onClick={toggleNotifications}
            aria-label="Open notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={23} />
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div className="header-dropdown notification-dropdown">
              <div className="dropdown-heading">
                <h3>Notifications</h3>
                <button
                  type="button"
                  onClick={() => navigate("/alerts")}
                >
                  View alerts
                </button>
              </div>

              <div className="notification-item">
                <span className="notification-dot critical" />

                <div>
                  <strong>Electrical activity alert</strong>
                  <p>LDPE sample exceeded the configured threshold.</p>
                </div>
              </div>

              <div className="notification-item">
                <span className="notification-dot warning" />

                <div>
                  <strong>High humidity detected</strong>
                  <p>Humidity is above the recommended range.</p>
                </div>
              </div>

              <div className="notification-item">
                <span className="notification-dot normal" />

                <div>
                  <strong>New sensor reading</strong>
                  <p>The latest Raspberry Pi reading was received.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="header-dropdown-wrapper" ref={profileRef}>
          <button
            type="button"
            className="profile-button"
            onClick={toggleProfileMenu}
            aria-label="Open profile menu"
            aria-expanded={showProfileMenu}
          >
            <div className="profile-avatar">CJ</div>

            <div className="profile-details">
              <strong>{username}</strong>
              <span>Researcher</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="header-dropdown profile-dropdown">
              <div className="profile-menu-header">
                <div className="profile-avatar large">CJ</div>

                <div>
                  <strong>{username}</strong>
                  <span>Researcher</span>
                </div>
              </div>

              <button
                type="button"
                className="profile-menu-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/settings");
                }}
              >
                <User size={18} />
                Account settings
              </button>

              <button
                type="button"
                className="profile-menu-item logout-item"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;