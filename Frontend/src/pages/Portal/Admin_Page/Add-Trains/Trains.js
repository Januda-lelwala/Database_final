import React, { useEffect, useMemo, useState } from "react";
import "./trains.css";

import { ORDERED_ROUTES } from "../../../../data/rail/index";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

const norm = (s) => (s || "").trim().toLowerCase();

/** Find an ordered route JSON that contains both endpoints (fuzzy match). */
function findOrdered(start, end) {
  const sLC = norm(start), eLC = norm(end);
  for (const r of ORDERED_ROUTES) {
    const names = r.ordered.map((n) => norm(n));
    const si = names.findIndex((n) => n === sLC || n.includes(sLC) || sLC.includes(n));
    const ei = names.findIndex((n) => n === eLC || n.includes(eLC) || eLC.includes(n));
    if (si !== -1 && ei !== -1) return { r, si, ei };
  }
  return null;
}

/** Get the intermediate stops between two indices (exclude endpoints). */
function midsBetween(r, si, ei) {
  const [lo, hi] = si <= ei ? [si, ei] : [ei, si];
  return r.ordered.slice(lo + 1, hi);
}

export default function Trains() {
  const [trains, setTrains] = useState([]);
  // Matching Routes state
  const [matchingRoutes, setMatchingRoutes] = useState([]);
  const [findingRoutes, setFindingRoutes] = useState(false);
  /** Find Trips by destination */
  const findTrips = async () => {
    if (!findDestination.trim()) return alert("Enter a destination to search.");
    setFinding(true);
    setMatchingTrips([]);
    setFindingRoutes(true);
    setMatchingRoutes([]);
    try {
      const r = await fetch("http://localhost:3000/api/trains/find-trips", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify({ destination: findDestination.trim() })
      });
      if (!r.ok) throw new Error("Failed to find trips");
      const data = await r.json();
      let trips = [];
      if (Array.isArray(data)) trips = data;
      else if (data.data && Array.isArray(data.data.trains)) trips = data.data.trains;
      else if (data.trains) trips = data.trains;
      setMatchingTrips(trips);
      // Fetch matching routes as well
      const r2 = await fetch("http://localhost:3000/api/trains/find-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify({ destination: findDestination.trim() })
      });
      if (!r2.ok) throw new Error("Failed to find routes");
      const data2 = await r2.json();
      let routes = [];
      if (Array.isArray(data2)) routes = data2;
      else if (data2.data && Array.isArray(data2.data.routes)) routes = data2.data.routes;
      else if (data2.routes) routes = data2.routes;
      setMatchingRoutes(routes);
    } catch (err) {
      console.error(err);
      alert("Error finding trips. See console for details.");
    } finally {
      setFinding(false);
      setFindingRoutes(false);
    }
  };

  // Add form (keep all existing necessary components)
  const [form, setForm] = useState({ train_id: "", capacity: "", notes: "", begin_time: "" });
  const [route, setRoute] = useState({ route_id: "", start_city: "", end_city: "", destinations: "" });
  const [suggesting, setSuggesting] = useState(false);

  // Search
  const [query, setQuery] = useState("");

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ capacity: "", notes: "" });
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Load existing trains (demo fallback if backend is not up)
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:3000/api/trains", { headers: tokenHeader });
        if (r.ok) {
          const data = await r.json();
          
          // Handle multiple response formats:
          // 1. Direct array: [...]
          // 2. {trains: [...]}
          // 3. {data: [...]}
          // 4. {data: {trains: [...]}}
          // 5. {success: true, data: {...}}
          let trainsArray = [];
          
          if (Array.isArray(data)) {
            trainsArray = data;
          } else if (data.data) {
            if (Array.isArray(data.data)) {
              trainsArray = data.data;
            } else if (data.data.trains) {
              trainsArray = data.data.trains;
            } else {
              // data.data is an object, might contain the trains directly
              trainsArray = Object.values(data.data);
            }
          } else if (data.trains) {
            trainsArray = data.trains;
          }
          
          setTrains(trainsArray);
          return;
        }
      } catch (error) {
        console.error('Failed to fetch trains:', error);
      }
      setTrains([{ train_id: "TR100", capacity: 200, notes: "" }]); // fallback sample
    })();
  }, []);

  /** Add Train + Route */
  const add = async (e) => {
    e.preventDefault();

    // Prepare destinations: add end city if not present
    let destinationsArr = (route.destinations || "").split(",").map(s => s.trim()).filter(Boolean);
    const endCity = route.end_city.trim();
    if (endCity && !destinationsArr.map(d => d.toLowerCase()).includes(endCity.toLowerCase())) {
      destinationsArr.push(endCity);
    }

    // Merge all fields for backend
    const payload = {
      train_id: form.train_id.trim(),
      capacity: Number(form.capacity || 0),
      notes: form.notes?.trim() || "",
      begin_time: form.begin_time || null,
      route_id: route.route_id.trim() || `${form.train_id.trim()}-R`,
      start_city: route.start_city.trim(),
      end_city: endCity,
      destinations: destinationsArr.join(", "),
    };

    if (!payload.train_id) return alert("Train ID is required.");
    if (!payload.start_city || !payload.end_city) {
      return alert("Start and End city are required for the route.");
    }

    try {
      const r = await fetch("http://localhost:3000/api/trains", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error("Train + Route create failed");

      setTrains((t) => [payload, ...t]);
      setForm({ train_id: "", capacity: "", notes: "", begin_time: "" });
      setRoute({ route_id: "", start_city: "", end_city: "", destinations: "" });
      alert("Train + Route added");
    } catch (err) {
      console.error(err);
      setTrains((t) => [payload, ...t]); // optimistic fallback
      alert("Saved locally. Check backend endpoints if needed.");
    }
  };

  /** Suggest destinations from the predefined ordered routes (offline, instant) */
  const suggestFromOrdered = () => {
    const start = route.start_city.trim();
    const end = route.end_city.trim();
    if (!start || !end) return alert("Enter Start and End city first.");

    setSuggesting(true);
    try {
      const hit = findOrdered(start, end);
      if (!hit) {
        alert("No predefined route contains both endpoints. Add or adjust files in /src/data/rail.");
        return;
      }
      const mids = midsBetween(hit.r, hit.si, hit.ei);
      // Always include the end city at the end if not present
      let destArr = [...mids];
      if (
        end &&
        !destArr.map(d => d.trim().toLowerCase()).includes(end.toLowerCase())
      ) {
        destArr.push(end);
      }
      setRoute((r) => ({ ...r, destinations: destArr.join(", ") }));
    } finally {
      setSuggesting(false);
    }
  };

  /** Google Maps helper (visual only) */
  const mapsUrl = (origin, destination) => {
    const base = "https://www.google.com/maps/dir/?api=1";
    const p = new URLSearchParams({ origin, destination, travelmode: "transit", transit_mode: "train" });
    return `${base}&${p.toString()}`;
  };
  const openMaps = () => {
    const s = route.start_city.trim();
    const d = route.end_city.trim();
    if (!s || !d) return;
    window.open(mapsUrl(s, d), "_blank", "noopener,noreferrer");
  };

  // Derived list = filtered by query (no sorting requested)
  const visibleTrains = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trains;
    return trains.filter((t) => {
      const hay = `${t.train_id || t.id} ${t.capacity} ${t.notes || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [trains, query]);

  // Add sort state
  const [sort, setSort] = useState({ key: "train_id", dir: "asc" }); // key: train_id, capacity, notes

  // Derived sorted & filtered list
  const sortedTrains = useMemo(() => {
    const arr = [...visibleTrains];
    const { key, dir } = sort;
    const mult = dir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      let va = key === "train_id" ? (a.train_id || a.id) : (a[key] || "");
      let vb = key === "train_id" ? (b.train_id || b.id) : (b[key] || "");
      // Numeric sort for capacity
      if (key === "capacity") {
        va = Number(va);
        vb = Number(vb);
        return (va - vb) * mult;
      }
      return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: "base" }) * mult;
    });
    return arr;
  }, [visibleTrains, sort]);

  // Sort handler
  const onSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  // Edit helpers
  const startEdit = (t) => {
    const id = t.train_id || t.id;
    setEditingId(id);
    setEditForm({ capacity: String(t.capacity ?? ""), notes: t.notes ?? "" });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ capacity: "", notes: "" });
  };
  const saveEdit = async () => {
    const id = editingId;
    if (!id) return;
    setSavingId(id);
    const payload = { capacity: Number(editForm.capacity || 0), notes: editForm.notes?.trim() || "" };
    try {
      const r = await fetch(`http://localhost:3000/api/trains/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
    } catch {
      // demo fallback
    } finally {
      setSavingId(null);
    }
    setTrains((list) =>
      list.map((x) => ((x.train_id || x.id) === id ? { ...x, ...payload, train_id: x.train_id || id } : x))
    );
    cancelEdit();
  };

  // Delete
  const remove = async (id) => {
    if (!window.confirm("Delete this train?")) return;
    setDeletingId(id);
    let success = false;
    try {
      const r = await fetch(`http://localhost:3000/api/trains/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: tokenHeader,
      });
      if (!r.ok) {
        const payload = await r.json().catch(() => ({}));
        throw new Error(payload?.message || "Failed to delete train.");
      }
      success = true;
    } catch (error) {
      console.error("Failed to delete train:", error);
      alert(error.message || "Unable to delete train.");
    } finally {
      setDeletingId(null);
    }
    if (success) {
      setTrains((t) => t.filter((x) => (x.train_id || x.id) !== id));
    }
  };

  return (
    <div className="trains">
      {/* Header row: title left, search right */}
      <div className="page-header">
        <h2>Train Management</h2>
        <div className="header-tools">
          <input
            className="toolbar-input"
            placeholder="Search by ID, capacity, notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search trains"
          />
          <div className="muted">
            Showing <b>{visibleTrains.length}</b> of <b>{trains.length}</b>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="panels">
        <div className="panel">
          <h3>Add Train + Route</h3>
          <form className="grid" onSubmit={add}>
            {/* TRAIN */}
            <label>
              <span>Train ID</span>
              <input
                required
                value={form.train_id}
                onChange={(e) => setForm((f) => ({ ...f, train_id: e.target.value }))}
              />
            </label>
            <label>
              <span>Capacity (u)</span>
              <input
                required
                type="number"
                min="0"
                step="0.0001"
                value={form.capacity}
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
              />
            </label>

            <label className="full">
              <span>Notes</span>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </label>

            <label>
              <span>Begin Time</span>
              <input
                type="time"
                value={form.begin_time}
                onChange={(e) => setForm((f) => ({ ...f, begin_time: e.target.value }))}
                placeholder="e.g., 08:00"
              />
            </label>

            {/* ROUTE */}
            <label>
              <span>Route ID</span>
              <input
                placeholder="(auto if empty)"
                value={route.route_id}
                onChange={(e) => setRoute((r) => ({ ...r, route_id: e.target.value }))}
              />
            </label>
            <label>
              <span>Start City / Station</span>
              <input
                required
                placeholder="e.g., Kandy"
                value={route.start_city}
                onChange={(e) => setRoute((r) => ({ ...r, start_city: e.target.value }))}
              />
            </label>
            <label>
              <span>End City / Station</span>
              <input
                required
                placeholder="e.g., Colombo Fort / Negombo / Galle / Matara / Jaffna / Trincomalee"
                value={route.end_city}
                onChange={(e) => setRoute((r) => ({ ...r, end_city: e.target.value }))}
              />
            </label>
            <label className="full">
              <span>Destinations (intermediate stations)</span>
              <textarea
                rows={2}
                placeholder="Click ‘Suggest from Rail’ to auto-fill (editable)"
                value={route.destinations}
                onChange={(e) => setRoute((r) => ({ ...r, destinations: e.target.value }))}
              />
            </label>

            {/* Actions */}
            <div className="actions full" style={{ gap: 8, flexWrap: "wrap" }}>
              <button type="button" className="btn light" onClick={openMaps}>
                View route in Google Maps
              </button>

              <button type="button" className="btn light" onClick={suggestFromOrdered} disabled={suggesting}>
                {suggesting ? "Suggesting…" : "Suggest from Rail (offline)"}
              </button>
              <button className="btn primary" type="submit">
                Add Train
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th
                className={`sortable ${sort.key === "train_id" ? `sorted-${sort.dir}` : ""}`}
                onClick={() => onSort("train_id")}
              >
                ID
              </th>
              <th
                className={`sortable ${sort.key === "capacity" ? `sorted-${sort.dir}` : ""}`}
                onClick={() => onSort("capacity")}
              >
                Capacity
              </th>
              <th
                className={`sortable ${sort.key === "notes" ? `sorted-${sort.dir}` : ""}`}
                onClick={() => onSort("notes")}
              >
                Notes
              </th>
              <th className="right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTrains.map((t) => {
              const id = t.train_id || t.id;
              const isEditing = editingId === id;
              return (
                <tr key={id}>
                  <td className="mono">{id}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="0.0001"
                        value={editForm.capacity}
                        onChange={(e) => setEditForm((f) => ({ ...f, capacity: e.target.value }))}
                      />
                    ) : (
                      t.capacity
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editForm.notes}
                        onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                      />
                    ) : (
                      t.notes || "-"
                    )}
                  </td>
                  <td className="right">
                    {!isEditing ? (
                      <div className="row-actions">
                        <button className="btn" onClick={() => startEdit(t)}>Edit</button>
                        <button className="btn danger" onClick={() => remove(id)} disabled={deletingId === id}>
                          {deletingId === id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    ) : (
                      <div className="row-actions">
                        <button className="btn primary" onClick={saveEdit} disabled={savingId === id}>
                          {savingId === id ? "Saving…" : "Save"}
                        </button>
                        <button className="btn" onClick={cancelEdit}>Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {sortedTrains.length === 0 && (
              <tr>
                <td colSpan={4} className="empty">No matching trains</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
