import React, { useEffect, useState } from "react";
import "./Overview.css";
import { assistantPortalAPI, handleAPIError } from "../../../../services/api";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

export default function AssistantOverview({ onGoAssignments, onGoRequests }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assistantPortalAPI.getRequests();
      const list =
        response?.data?.data?.requests ||
        response?.data?.requests ||
        response?.data ||
        [];
      setRequests(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(handleAPIError(err));
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  

  return (
    <div className="driver-overview">
      <h2>Overview</h2>
      <p>Stay on top of your assigned deliveries and pending confirmations.</p>
      <div className="quick-actions">
        <button onClick={onGoAssignments}>View Assignments History</button>
        <button onClick={onGoRequests}>View Admin Requests</button>
      </div>

      <div className="driver-overview-table">
        <div className="driver-overview-table__header">
          <h3>Upcoming Deliveries</h3>
          <button className="refresh-btn" onClick={loadAssignments} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        {error && <div className="driver-overview__error">{error}</div>}
        {!loading && requests.length === 0 ? (
          <div className="driver-overview__empty">
            No accepted deliveries yet. Check Admin Requests to accept a trip.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Destination</th>
                  <th>Address</th>
                  <th>Delivery Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="driver-overview__loading">
                      Loading assignments...
                    </td>
                  </tr>
                ) : (
                  requests.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className={`status-pill ${item.status}`}>{item.status}</span>
                      </td>
                      <td className="mono">{item.order_id || "-"}</td>
                      <td>{item.customer_name || "-"}</td>
                      <td>{item.destination_city || "-"}</td>
                      <td>{item.destination_address || "-"}</td>
                      <td>{formatDate(item.delivery_date || item.updated_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
