import React, { useEffect, useState } from "react";
import "./Assignments.css";
import { assistantPortalAPI, handleAPIError } from "../../../../services/api";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

export default function AssistantAssignments() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assistantPortalAPI.getRequests();
      const list =
        response?.data?.data?.requests ||
        response?.data?.requests ||
        response?.data ||
        [];
      const accepted = Array.isArray(list)
        ? list.filter((entry) => entry.status === "accepted")
        : [];
      setHistory(accepted);
    } catch (err) {
      setError(handleAPIError(err));
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="driver-assignments">
      <h2>Assignments History</h2>
      {error && <div className="driver-assignments__error">{error}</div>}
      {loading ? (
        <div className="driver-assignments__empty">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="driver-assignments__empty">
          No completed assignments yet. Accepted deliveries will appear here.
        </div>
      ) : (
        <div className="list">
          {history.map((item) => (
            <div key={item.id} className="card">
              <div className="title">Order {item.order_id || "-"}</div>
              <div className="meta">Customer: {item.customer_name || "-"}</div>
              <div className="meta">Destination: {item.destination_city || "-"}</div>
              <div className="meta">Address: {item.destination_address || "-"}</div>
              <div className="date">Delivery: {formatDate(item.delivery_date || item.updated_at)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
