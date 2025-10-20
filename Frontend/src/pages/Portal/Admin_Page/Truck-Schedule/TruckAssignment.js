import React, { useEffect, useState } from "react";
import "./truckassignment.css";

const API_BASE = "http://localhost:3000";
const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

const extractArray = (payload, key) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (payload.data) {
    if (Array.isArray(payload.data)) return payload.data;
    if (payload.data[key]) return payload.data[key];
    return Object.values(payload.data);
  }
  if (payload[key]) return payload[key];
  return [];
};

const fallbackRoutes = [
  { route_id: "TR_COL_01", route_name: "Colombo City North", max_minutes: 240 }
];
const fallbackTrucks = [{ truck_id: "TK01", license_plate: "WP-1234", capacity: 60 }];
const fallbackDrivers = [{ driver_id: "DRV001", name: "John Driver" }];
const fallbackAssistants = [{ assistant_id: "AST001", name: "Sarah Support" }];

export default function TruckAssignment() {
  const [routes, setRoutes] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [form, setForm] = useState({
    route_id: "",
    truck_id: "",
    driver_id: "",
    assistant_id: "",
    start_time: "",
    end_time: ""
  });
  const [availability, setAvailability] = useState({ driver: null, assistant: null });
  const [busy, setBusy] = useState(false);

  const findRouteMinutes = (routeId, currentRoutes = routes) => {
    const route = currentRoutes.find((r) => r.route_id === routeId);
    const minutes = Number(route?.max_minutes);
    return Number.isFinite(minutes) && minutes > 0 ? minutes : 240;
  };

  const computeEndTime = (start, routeId, currentRoutes = routes) => {
    if (!start) return "";
    const startDate = new Date(start);
    if (Number.isNaN(startDate.getTime())) return "";
    const minutes = findRouteMinutes(routeId, currentRoutes);
    const endDate = new Date(startDate.getTime() + minutes * 60000);
    return endDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const hydrate = async (url, key, setter, fallback, storeRoutes) => {
        try {
          const res = await fetch(url, { headers: tokenHeader });
          if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
          const payload = await res.json();
          const items = extractArray(payload, key);
          setter(items.length ? items : fallback);
          return items.length ? items : fallback;
        } catch (error) {
          console.error(`Failed to load ${key}:`, error);
          setter((prev) => (prev.length ? prev : fallback));
          return fallback;
        }
      };

      const loadedRoutes = await hydrate(
        `${API_BASE}/api/truck-routes`,
        "routes",
        setRoutes,
        fallbackRoutes,
        true
      );
      await Promise.all([
        hydrate(`${API_BASE}/api/trucks`, "trucks", setTrucks, fallbackTrucks),
        hydrate(`${API_BASE}/api/drivers`, "drivers", setDrivers, fallbackDrivers),
        hydrate(`${API_BASE}/api/assistants`, "assistants", setAssistants, fallbackAssistants)
      ]);

      if (form.start_time) {
        const end = computeEndTime(form.start_time, form.route_id, loadedRoutes);
        setForm((prev) => ({ ...prev, end_time: end }));
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureEndTime = (nextForm) => {
    if (!nextForm.start_time) return nextForm;
    const end = computeEndTime(nextForm.start_time, nextForm.route_id);
    return { ...nextForm, end_time: end };
  };

  const checkAvailability = async (type, id, start, end) => {
    if (!id || !start || !end) {
      setAvailability((prev) => ({ ...prev, [type]: null }));
      return null;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/truck-schedule/availability?type=${encodeURIComponent(type)}&id=${encodeURIComponent(
          id
        )}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
        { headers: tokenHeader }
      );

      if (!res.ok) {
        throw new Error(`Availability request failed with status ${res.status}`);
      }

      const payload = await res.json();
      setAvailability((prev) => ({ ...prev, [type]: payload.available ? "Available" : "Busy" }));
      return payload.available;
    } catch (error) {
      console.error("Failed to check availability:", error);
      setAvailability((prev) => ({ ...prev, [type]: "Unknown" }));
      return null;
    }
  };

  const create = async () => {
    const { route_id, truck_id, driver_id, assistant_id, start_time } = form;

    if (!route_id || !truck_id || !driver_id || !assistant_id || !start_time) {
      alert("Fill all fields");
      return;
    }

    const payloadForm = ensureEndTime(form);

    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/truck-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify(payloadForm)
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(payload?.message || "Failed to create truck schedule.");
      }

      alert(payload?.message || "Truck schedule created successfully.");
      setForm({
        route_id: "",
        truck_id: "",
        driver_id: "",
        assistant_id: "",
        start_time: "",
        end_time: ""
      });
      setAvailability({ driver: null, assistant: null });
    } catch (error) {
      console.error("Failed to create truck schedule:", error);
      alert(error.message || "Unable to create truck schedule. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="truckassign">
      <h2>Truck Assignment to Route</h2>

      <div className="panel">
        <div className="grid">
          <label><span>Route</span>
            <select
              value={form.route_id}
              onChange={async (e) => {
                const value = e.target.value;
                const next = ensureEndTime({ ...form, route_id: value });
                setForm(next);
                if (next.start_time) {
                  if (next.driver_id) {
                    await checkAvailability("driver", next.driver_id, next.start_time, next.end_time);
                  }
                  if (next.assistant_id) {
                    await checkAvailability("assistant", next.assistant_id, next.start_time, next.end_time);
                  }
                }
              }}
            >
              <option value="">Select...</option>
              {routes.map((r) => (
                <option key={r.route_id} value={r.route_id}>
                  {r.route_id} - {r.route_name}
                </option>
              ))}
            </select>
          </label>

          <label><span>Truck</span>
            <select
              value={form.truck_id}
              onChange={(e) => setForm((f) => ({ ...f, truck_id: e.target.value }))}
            >
              <option value="">Select...</option>
              {trucks.map((t) => (
                <option key={t.truck_id} value={t.truck_id}>
                  {t.truck_id} ({t.license_plate}) - {t.capacity}u
                </option>
              ))}
            </select>
          </label>

          <label><span>Driver</span>
            <select
              value={form.driver_id}
              onChange={async (e) => {
                const value = e.target.value;
                const next = ensureEndTime({ ...form, driver_id: value });
                setForm(next);
                await checkAvailability("driver", value, next.start_time, next.end_time);
              }}
            >
              <option value="">Select...</option>
              {drivers.map((d) => (
                <option key={d.driver_id} value={d.driver_id}>
                  {d.driver_id} - {d.name}
                </option>
              ))}
            </select>
            {availability.driver && (
              <small className={availability.driver === "Available" ? "ok" : "err"}>
                {availability.driver}
              </small>
            )}
          </label>

          <label><span>Assistant</span>
            <select
              value={form.assistant_id}
              onChange={async (e) => {
                const value = e.target.value;
                const next = ensureEndTime({ ...form, assistant_id: value });
                setForm(next);
                await checkAvailability("assistant", value, next.start_time, next.end_time);
              }}
            >
              <option value="">Select...</option>
              {assistants.map((a) => (
                <option key={a.assistant_id} value={a.assistant_id}>
                  {a.assistant_id} - {a.name}
                </option>
              ))}
            </select>
            {availability.assistant && (
              <small className={availability.assistant === "Available" ? "ok" : "err"}>
                {availability.assistant}
              </small>
            )}
          </label>

          <label><span>Start Time</span>
            <input
              type="datetime-local"
              value={form.start_time}
              onChange={async (e) => {
                const value = e.target.value;
                const next = ensureEndTime({ ...form, start_time: value });
                setForm(next);
                if (next.driver_id) {
                  await checkAvailability("driver", next.driver_id, value, next.end_time);
                }
                if (next.assistant_id) {
                  await checkAvailability("assistant", next.assistant_id, value, next.end_time);
                }
              }}
            />
          </label>
        </div>

        <div className="actions">
          <button className="btn primary" disabled={busy} onClick={create}>
            {busy ? "Creating..." : "Create Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
