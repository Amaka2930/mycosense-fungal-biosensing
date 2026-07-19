function SensorCard({
  title,
  value,
  unit,
  icon,
  status = "Normal",
  className = "",
}) {
  return (
    <article className={`sensor-card ${className}`}>
      <div className="sensor-card-icon">{icon}</div>

      <div className="sensor-card-content">
        <p className="sensor-card-title">{title}</p>

        <div className="sensor-card-value">
          <strong>{value ?? "--"}</strong>
          {unit && <span>{unit}</span>}
        </div>

        <p className="sensor-card-status">
          <span className="sensor-status-dot" />
          {status}
        </p>
      </div>
    </article>
  );
}

export default SensorCard;