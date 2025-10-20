import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
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
  { key: "overview", label: "Overview", path: "overview" },
  { key: "products", label: "Products", path: "products" },
  { key: "employees", label: "Employees", path: "employees" },
  { key: "trucks", label: "Trucks", path: "trucks" },
  { key: "trains", label: "Trains", path: "trains" },
  { key: "train-allocation", label: "Train Allocation", path: "train-allocation" },
  { key: "truck-assignment", label: "Truck Assignment", path: "truck-assignment" },
  { key: "reports", label: "Reports & Analytics", path: "reports" }
];

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingRefreshKey, setPendingRefreshKey] = useState(0);
  const [truckPlan, setTruckPlan] = useState(null);

  if (!isAdmin) {
    return <Navigate to="/employee" replace />;
  }

  const currentSegment = (() => {
    const parts = location.pathname.replace(/\/+$|$/,'').split('/');
    return parts[2] || 'overview';
  })();

  const goTo = (key) => {
    const item = NAV.find((n) => n.key === key);
    if (!item) return;
    const target = item.path === 'overview' ? '/admin/overview' : `/admin/${item.path}`;
    navigate(target);
  };

  const handleOrderPlaced = () => {
    setPendingRefreshKey((key) => key + 1);
  };

  const handleTruckSuggested = (suggestion) => {
    if (suggestion?.route?.truck_route_id) {
      const coverage = suggestion.route.coverage?.join(', ') || 'configured area';
      alert(`Rail leg assigned. Next step: schedule truck route ${suggestion.route.truck_route_id} from ${suggestion.route.first_city} covering ${coverage}.`);
    }
    setTruckPlan(suggestion);
    navigate('/admin/truck-assignment');
  };

  return (
    <div className={`admin-dashboard ${theme}`}>
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Rail &amp; Road Distribution Control Center</h1>
          <p>Welcome, {user?.name || 'Administrator'}</p>
        </div>
        <div className="header-right">
          <button onClick={toggleTheme} className="theme-btn">{theme === 'light' ? '🌙' : '☀️'}</button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <aside className="sidebar">
          <nav className="nav-menu">
            {NAV.map((n) => (
              <button
                key={n.key}
                className={currentSegment === n.path ? 'active' : ''}
                onClick={() => goTo(n.key)}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="main-content">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route
              path="overview"
              element={<Overview onGoAllocate={() => goTo('train-allocation')} onGoAssignTruck={() => goTo('truck-assignment')} refreshKey={pendingRefreshKey} />}
            />
            <Route path="products" element={<Products />} />
            <Route path="employees" element={<Employees />} />
            <Route path="trucks" element={<Trucks />} />
            <Route path="trains" element={<Trains />} />
            <Route
              path="train-allocation"
              element={<TrainAllocation onGoTruckAssignment={() => goTo('truck-assignment')} onOrderPlaced={handleOrderPlaced} onTruckSuggested={handleTruckSuggested} />}
            />
            <Route
              path="truck-assignment"
              element={<TruckAssignment prefill={truckPlan} onCompleted={() => { setTruckPlan(null); setPendingRefreshKey((key) => key + 1); }} />}
            />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}
