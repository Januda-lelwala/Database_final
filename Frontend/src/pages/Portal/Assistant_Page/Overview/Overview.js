import React from "react";
import "./Overview.css";

export default function DriverOverview({ onGoAssignments, onGoRequests }) {
  return (
    <div className="driver-overview">
      <h2>Overview</h2>
      <p>Quick glance at today’s schedule, pending requests, and recent assignments.</p>
      <div className="quick-actions">
        <button onClick={onGoAssignments}>View Assignments History</button>
        <button onClick={onGoRequests}>View Admin Requests</button>
      </div>
    </div>
  );
}