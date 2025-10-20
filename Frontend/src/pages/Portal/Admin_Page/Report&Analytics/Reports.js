import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./reports.css";

const API_BASE = "http://localhost:3000";
const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

const toCSV = (rows) => {
  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((h) => esc(row[h])).join(","))].join("\n");
};

const download = (name, text) => {
  const blob = new Blob([text], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const normalizeRows = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (payload?.rows && Array.isArray(payload.rows)) return payload.rows;
  if (payload?.data) {
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.data.rows)) return payload.data.rows;
    if (typeof payload.data === "object") return Object.values(payload.data);
  }
  return [];
};

const REPORT_ENDPOINTS = {
  "Quarterly Sales": "/api/reports/quarterly-sales",
  "Train Utilization": "/api/reports/train-utilization",
  "Truck Performance": "/api/reports/truck-usage",
  "Worker Hours": "/api/reports/worker-hours",
  "City-wise Sales": "/api/reports/city-route-sales",
  "Top Products": "/api/reports/quarter-top-items"
};

const REPORT_DESCRIPTIONS = {
  "Quarterly Sales": "Revenue & space volume",
  "Train Utilization": "Capacity & efficiency",
  "Truck Performance": "Usage & deliveries",
  "Worker Hours": "Driver/assistant hours",
  "City-wise Sales": "Destination performance",
  "Top Products": "Most ordered items"
};

export default function Reports() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const run = async (name) => {
    setTitle(name);
    setOpen(true);
    setRows(null);
    setError(null);
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const endpoint = REPORT_ENDPOINTS[name];

    if (!endpoint) {
      setError("Report not implemented.");
      setRows([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { Accept: "application/json", ...tokenHeader }
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Request failed");
      }

      const payload = await response.json();
      const data = normalizeRows(payload);
      setRows(data);
    } catch (err) {
      console.error("[Reports] Failed to run report:", err);
      setError(err.message || "Unable to generate report.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setRows(null);
    setError(null);
    setLoading(false);
  };

  const hasRows = Array.isArray(rows) && rows.length > 0;

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      modalRef.current.focus({ preventScroll: true });
    }
  }, [open, loading, hasRows, error]);

  return (
    <div className="reports">
      <h2>Reports & Analytics</h2>
      <div className="cards">
        {Object.keys(REPORT_ENDPOINTS).map((name) => (
          <div className="card" key={name}>
            <h3>{name}</h3>
            <p>{REPORT_DESCRIPTIONS[name]}</p>
            <button className="btn primary" onClick={() => run(name)}>
              Generate
            </button>
          </div>
        ))}
      </div>

      {isMounted && open &&
        createPortal(
          <div className="reports-modal-overlay" onClick={closeModal}>
            <div className="reports reports-portal-wrapper">
              <div
                className="reports-modal"
                ref={modalRef}
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>{title}</h2>
                  <button className="icon-btn" onClick={closeModal}>
                    A-
                  </button>
                </div>
                <div className="modal-body">
                  {loading && <p>Generating…</p>}
                  {!loading && error && <p>{error}</p>}
                  {!loading && !error && hasRows && (
                    <>
                      <div className="table-wrap">
                        <table>
                          <thead>
                            <tr>{Object.keys(rows[0]).map((key) => <th key={key}>{key}</th>)}</tr>
                          </thead>
                          <tbody>
                            {rows.map((row, index) => (
                              <tr key={index}>
                                {Object.keys(rows[0]).map((key) => (
                                  <td key={key}>{String(row[key])}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="actions">
                        <button
                          className="btn"
                          disabled={!hasRows}
                          onClick={() => download(`${title.replace(/\s+/g, "_")}.csv`, toCSV(rows))}
                        >
                          Download CSV
                        </button>
                        <button className="btn" onClick={closeModal}>
                          Close
                        </button>
                      </div>
                    </>
                  )}
                  {!loading && !error && rows && rows.length === 0 && <p>No data.</p>}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
