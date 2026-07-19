import { FiBell, FiCalendar } from "react-icons/fi";

function Header() {
  const now = new Date();

  const formattedDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="top-header">
      <div>
        <h2>Dashboard</h2>
        <p>Overview of fungal biosensing and environmental monitoring</p>
      </div>

      <div className="header-actions">
        <div className="date-time">
          <FiCalendar />

          <div>
            <strong>{formattedDate}</strong>
            <span>{formattedTime}</span>
          </div>
        </div>

        <button className="icon-button" type="button" aria-label="Notifications">
          <FiBell />
          <span className="notification-count">3</span>
        </button>

        <div className="profile">
          <div className="profile-avatar">CJ</div>

          <div>
            <strong>Chiamaka Joan</strong>
            <span>Researcher</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;