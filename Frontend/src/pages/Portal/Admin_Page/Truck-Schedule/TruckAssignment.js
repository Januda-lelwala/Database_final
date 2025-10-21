import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../../components/ToastProvider";
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

const toDateInputValue = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

export default function TruckAssignment({ prefill = null, onCompleted = () => {} }) {
  const { showToast } = useToast();
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
  const [appliedPrefillKey, setAppliedPrefillKey] = useState(null);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

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
    return toDateInputValue(endDate);
  };

  const fetchPendingTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/truck-schedule/pending`, { headers: tokenHeader });
      if (!res.ok) {
        setPendingTasks([]);
        return [];
      }
      const payload = await res.json();
      const tasks = extractArray(payload, "tasks").filter((task) => task.status === "pending");
      setPendingTasks(tasks);
      return tasks;
    } catch (error) {
      console.error("Failed to load pending truck tasks:", error);
      setPendingTasks([]);
      return [];
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const hydrate = async (url, key, setter, fallback) => {
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
        fallbackRoutes
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
    fetchPendingTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPendingTasks();
    if (!prefill) {
      setAppliedPrefillKey(null);
      setActiveTask(null);
      return;
    }

    const keyParts = [
      prefill.route?.truck_route_id || "",
      prefill.order?.order_id || "",
      prefill.order?.destination_city || prefill.order?.destination || ""
    ];
    const key = keyParts.join("|");

    if (appliedPrefillKey === key) {
      return;
    }

    const recommendedRouteId = prefill.route?.truck_route_id || "";
    const routeExists =
      !recommendedRouteId || routes.some((route) => route.route_id === recommendedRouteId);
    if (!routeExists) {
      return;
    }

    const nextStart = toDateInputValue(new Date());

    setForm((prev) => {
      const next = { ...prev };
      if (recommendedRouteId) {
        next.route_id = recommendedRouteId;
      }
      if (!next.start_time) {
        next.start_time = nextStart;
      }
      if (next.start_time) {
        next.end_time = computeEndTime(next.start_time, next.route_id);
      }
      return next;
    });
    setAvailability({ driver: null, assistant: null });
    setActiveTask({
      order_id: prefill.order?.order_id || null,
      destination: prefill.order?.destination_city || prefill.order?.destination || null,
       first_city: prefill.route?.first_city || null,
      truck_route_id: recommendedRouteId,
      coverage: prefill.route?.coverage || []
    });
    setAppliedPrefillKey(key);
  }, [prefill, appliedPrefillKey, routes, fetchPendingTasks]);

  const recommendedRouteId =
    prefill?.route?.truck_route_id || activeTask?.truck_route_id || null;
  const recommendedCoverage = prefill?.route?.coverage || activeTask?.coverage || [];
  const coverageDisplay = recommendedCoverage.length ? recommendedCoverage.join(", ") : "configured area";
  const orderDestination =
    prefill?.order?.destination_city ||
    prefill?.order?.destination ||
    activeTask?.destination ||
    null;
  const orderId =
    prefill?.order?.order_id ||
    prefill?.order?.orderId ||
    activeTask?.order_id ||
    null;

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
      showToast("Fill all fields", { type: "warning" });
      return;
    }

    const payloadForm = ensureEndTime(form);
    if (orderId) {
      payloadForm.order_id = orderId;
    }

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

      showToast(payload?.message || "Truck schedule created successfully.", { type: "success" });
      const latestTasks = await fetchPendingTasks();
      if (Array.isArray(latestTasks)) {
        setPendingTasks(latestTasks);
      } else {
        setPendingTasks((prev) =>
          orderId ? prev.filter((task) => task.order_id !== orderId) : prev
        );
      }
      onCompleted?.();
      setForm({
        route_id: "",
        truck_id: "",
        driver_id: "",
        assistant_id: "",
        start_time: "",
        end_time: ""
      });
      setAvailability({ driver: null, assistant: null });
      setActiveTask(null);
      setAppliedPrefillKey(null);
    } catch (error) {
      console.error("Failed to create truck schedule:", error);
      showToast(error.message || "Unable to create truck schedule. Please try again.", { type: "error" });
    } finally {
      setBusy(false);
    }
  };

  const handleApplyTask = (task) => {
    const key = `${task.order_id}|${task.truck_route_id}`;
    const start = toDateInputValue(new Date());
    const nextForm = ensureEndTime({
      ...form,
      route_id: task.truck_route_id,
      start_time: start
    });
    setForm(nextForm);
    setAvailability({ driver: null, assistant: null });
    setActiveTask(task);
    setAppliedPrefillKey(key);
  };

  return (
    <div className="truckassign">
      <h2>Truck Assignment to Route</h2>
      {(prefill || activeTask) && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Recommended:</strong>{" "}
          {recommendedRouteId || "Select route"} from{" "}
          {prefill?.route?.first_city || activeTask?.first_city || "origin"} covering{" "}
          {coverageDisplay}.{" "}
          {orderId && (
            <>
              Order {orderId}
              {orderDestination ? ` → ${orderDestination}` : ""}
            </>
          )}
        </div>
      )}

      {pendingTasks.length > 0 && (
        <div className="panel">
          <h3>Pending Truck Dispatches</h3>
          <div className="tasks-grid" role="list">
            {pendingTasks.map((task) => (
              <article className="task-card" role="listitem" key={task.id}>
                <div className="task-row">
                  <span className="label">Order</span>
                  <span className="mono">{task.order_id}</span>
                </div>
                <div className="task-row">
                  <span className="label">Destination</span>
                  <span>{task.destination}</span>
                </div>
                <div className="task-row">
                  <span className="label">Route</span>
                  <span className="mono">{task.truck_route_id}</span>
                </div>
                <div className="task-row">
                  <span className="label">Created</span>
                  <span>{task.created_at ? new Date(task.created_at).toLocaleString() : "N/A"}</span>
                </div>
                <div className="card-actions">
                  <button className="btn" onClick={() => handleApplyTask(task)}>
                    Load
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="panel">
        <div className="grid">
          <label>
            <span>Route</span>
            <select
              value={form.route_id}
              onChange={async (e) => {
                const value = e.target.value;
                const next = ensureEndTime({ ...form, route_id: value });
                setForm(next);
                if (activeTask && activeTask.order_id) {
                  setActiveTask((prev) => (prev ? { ...prev, truck_route_id: value } : prev));
                }
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
              {routes.map((r) => {
                const isRecommended = recommendedRouteId === r.route_id;
                const optionLabel = `${r.route_id} - ${r.route_name}${isRecommended ? " (recommended)" : ""}`;
                return (
                  <option key={r.route_id} value={r.route_id}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            <span>Truck</span>
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

          <label>
            <span>Driver</span>
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

          <label>
            <span>Assistant</span>
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

          <label>
            <span>Start Time</span>
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
            {(prefill || activeTask) && <small>Defaulted to current time; adjust if needed.</small>}
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
