import React from "react";
import { NavLink } from "react-router-dom";
import "./DriverSidebar.css";

const ICONS = {
  overview: "📊",
  user: "👤",
  inbox: "📥",
  history: "🕑",
  settings: "⚙️"
};

export default function DriverSidebar({ items = [] }) {
  return (
    <aside className="driver-sidebar">
      <nav>
        <ul>
          {items.map((it) => (
            <li key={it.key}>
              <NavLink
                to={it.path}
                className={({ isActive }) => (isActive ? "active" : undefined)}
                end={it.path === "overview"}
              >
                <span className="icon" aria-hidden>{ICONS[it.icon] || ICONS.overview}</span>
                <span className="label">{it.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}