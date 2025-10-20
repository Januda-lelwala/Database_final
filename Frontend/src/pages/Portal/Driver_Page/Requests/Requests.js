import React, { useEffect, useState } from "react";
import "./Requests.css";
import { driverPortalAPI, handleAPIError } from "../../../../services/api";

const formatDate = (value) => {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not set" : date.toLocaleString();
};

export default function DriverRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await driverPortalAPI.getRequests();
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
    loadRequests();
  }, []);

  const accept = async (id) => {
    setAcceptingId(id);
    setError(null);
    try {
      await driverPortalAPI.acceptRequest(id);
      await loadRequests();
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="driver-requests">
      <h2>Admin Requests</h2>
      {error && <div className="driver-requests__error">{error}</div>}
      {loading ? (
        <div className="driver-requests__empty">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="driver-requests__empty">No requests at the moment.</div>
      ) : (
        <div className="list">
          {requests.map((req) => (
            <div key={req.id} className="item">
              <div>
                <div>
                  <strong>Order {req.order_id || "N/A"}</strong>
                </div>
                <div className="meta">
                  {req.customer_name ? `${req.customer_name} • ` : ""}
                  {req.destination_city || ""}
                </div>
                <div className="meta">
                  {req.destination_address || "Address not provided"}
                </div>
                <div className="meta">
                  Delivery: {formatDate(req.delivery_date || req.updated_at)}
                </div>
              </div>
              <div className="actions">
                <span className={`status ${req.status}`}>{req.status}</span>
                {req.status === "pending" && (
                  <button
                    className="accept-btn"
                    onClick={() => accept(req.id)}
                    disabled={acceptingId === req.id}
                  >
                    {acceptingId === req.id ? "Accepting..." : "Accept"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
