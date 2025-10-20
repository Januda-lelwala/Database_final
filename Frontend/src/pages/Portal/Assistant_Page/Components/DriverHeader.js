import React, { useEffect, useState } from "react";
import "./DriverHeader.css";

export default function DriverHeader({ title, subtitle, onLogout }) {
  const [online, setOnline] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedOnline = localStorage.getItem("driver_online");
    if (savedOnline !== null) setOnline(savedOnline === "true");

    const savedTheme = localStorage.getItem("theme_mode");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  const toggleOnline = () => {
    setOnline((v) => {
      const next = !v;
      localStorage.setItem("driver_online", String(next));
      return next;
    });
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme_mode", next ? "dark" : "light");
    document.body.classList.toggle("dark", next);
  };

  return (
    <header className="driver-header">
      <div className="driver-header-left">
        <h1>{title}</h1>
        <p className="driver-subtitle">{subtitle}</p>
      </div>
      <div className="driver-header-right">
        <button
          className={`status-toggle ${online ? "online" : "offline"}`}
          onClick={toggleOnline}
          aria-pressed={online}
        >
          {online ? "🟢 Online" : "🔴 Offline"}
        </button>

        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button className="logout-btn" onClick={onLogout}>
          🔓 Logout
        </button>
      </div>
    </header>
  );
}
