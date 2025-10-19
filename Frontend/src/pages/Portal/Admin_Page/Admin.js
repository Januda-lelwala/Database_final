import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import "../AdminDashboard.css";

import Overview from "./Overview/Overview.js";
import Products from "./Add-Products/Products.js";
import Employees from "./Add-Employees/Employees.js";
import Trucks from "./Add-Trucks/Trucks.js";
import Trains from "./Add-Trains/Trains.js";
import TrainAllocation from "./Train-Allocation/TrainAllocation.js";
import TruckAssignment from "./Truck-Schedule/TruckAssignment.js";
import Reports from "./Report&Analytics/Reports.js";

const NAV = [
  { key: "overview", label: "📊 Overview" },
  { key: "products", label: "📦 Add Products" },
  { key: "employees", label: "👥 Add Employees" },
  { key: "trucks", label: "🚛 Add Trucks" },
  { key: "trains", label: "🚂 Add Trains" },
  { key: "train-allocation", label: "🧭 Train Allocation" },
  { key: "truck-assignment", label: "🛣️ Truck Assignment" },
  { key: "reports", label: "📈 Reports & Analytics" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState("overview");

  return (
    <div className={`admin-dashboard ${theme}`}>
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Rail & Road Distribution Control Center</h1>
          <p>Welcome, {user?.name || "Administrator"}</p>
        </div>
        <div className="header-right">
          <button onClick={toggleTheme} className="theme-btn">{theme === "light" ? "🌙" : "☀️"}</button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <aside className="sidebar">
          <nav className="nav-menu">
            {NAV.map((n) => (
              <button key={n.key} className={view === n.key ? "active" : ""} onClick={() => setView(n.key)}>
                {n.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="main-content">
          {view === "overview" && <Overview onGoAllocate={() => setView("train-allocation")} />}
          {view === "products" && <Products />}
          {view === "employees" && <Employees />}
          {view === "trucks" && <Trucks />}
          {view === "trains" && <Trains />}
          {view === "train-allocation" && <TrainAllocation onGoTruckAssignment={() => setView("truck-assignment")} />}
          {view === "truck-assignment" && <TruckAssignment />}
          {view === "reports" && <Reports />}
        </section>
      </main>
    </div>
  );
}
