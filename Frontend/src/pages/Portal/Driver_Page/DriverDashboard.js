import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import "./DriverDashboard.css";

import DriverHeader from "./Components/DriverHeader";
import DriverSidebar from "./Components/DriverSidebar";

import DriverOverview from "./Overview/Overview";
import DriverRequests from "./Requests/Requests";
import DriverAssignments from "./Assignments/Assignments";
import DriverSettings from "./Settings/Settings";

const NAV_ITEMS = [
  { key: "overview", path: "overview", label: "Overview", icon: 'overview' },
  { key: "requests", path: "requests", label: "Admin Requests", icon: 'inbox' },
  { key: "assignments", path: "assignments", label: "Assignments History", icon: 'history' },
  { key: "settings", path: "settings", label: "Settings", icon: 'settings' },
];

export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const subtitle = `Welcome, ${user?.name || "Driver"}`;

  const onGoAssignments = () => navigate("assignments");
  const onGoRequests = () => navigate("requests");

  return (
    <div className={`driver-dashboard ${theme}`}>
      <DriverHeader
        title="Driver Portal"
        subtitle={subtitle}
        onLogout={logout}
        onToggleTheme={toggleTheme}
      />
      <main className="driver-dashboard-content">
        <DriverSidebar items={NAV_ITEMS} />
        <section className="driver-main-content">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DriverOverview onGoAssignments={onGoAssignments} onGoRequests={onGoRequests} />} />
            <Route path="profile" element={<Navigate to="settings?tab=profile" replace />} />
            <Route path="requests" element={<DriverRequests />} />
            <Route path="assignments" element={<DriverAssignments />} />
            <Route path="settings" element={<DriverSettings />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}