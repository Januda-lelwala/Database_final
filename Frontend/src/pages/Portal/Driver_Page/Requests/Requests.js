import React, { useState } from "react";
import "./Requests.css";

const MOCK = [
  { id: 1, shift: "Morning Shift (06:00-14:00)", date: "2025-10-21", status: "pending" },
  { id: 2, shift: "Evening Shift (14:00-22:00)", date: "2025-10-22", status: "pending" },
];

export default function DriverRequests() {
  const [rows, setRows] = useState(MOCK);

  const accept = (id) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status: "accepted" } : x)));
    // TODO: call API to accept shift
  };

  return (
    <div className="driver-requests">
      <h2>Admin Requests</h2>
      <div className="list">
        {rows.map((r) => (
          <div key={r.id} className="item">
            <div>
              <div><strong>{r.shift}</strong></div>
              <div className="meta">{r.date}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className={`status ${r.status}`}>{r.status}</span>
              {r.status === "pending" && (
                <button className="accept-btn" onClick={() => accept(r.id)}>Accept</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}