import React from "react";
import "./Assignments.css";

export default function DriverAssignments() {
  const history = [
    { id: 101, title: "Route A -> B", date: "2025-09-12" },
    { id: 102, title: "Route C -> D", date: "2025-09-25" },
  ];
  return (
    <div className="driver-assignments">
      <h2>Assignments History</h2>
      <div className="list">
        {history.map((h) => (
          <div key={h.id} className="card">
            <div className="title">{h.title}</div>
            <div className="date">{h.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}