import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../components/ToastProvider";
import "./AdminDashboard.css";

/** Utilities */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmtMoney = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(
    Number(n || 0)
  );
const toCSV = (rows) => {
  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
};
const download = (name, text) => {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  /** Views */
  const [currentView, setCurrentView] = useState("overview"); // overview | trains | trucks | reports | products | resources

  /** Overview data */
  const [pendingOrders, setPendingOrders] = useState([]);
  const [systemStats, setSystemStats] = useState({});

  /** Products */
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product_id: "",
    name: "",
    description: "",
    price: "",
    space_consumption: "",
    category: "",
    available_quantity: "",
  });
  const [priceEdit, setPriceEdit] = useState({ product_id: "", price: "" });

  /** Allocation modal */
  const [allocOpen, setAllocOpen] = useState(false);
  const [allocOrder, setAllocOrder] = useState(null);
  const [allocStep, setAllocStep] = useState(1); // 1=train, 2=truck
  const [trainOptions, setTrainOptions] = useState([]); // upcoming trips with remaining capacity
  const [selectedTrain, setSelectedTrain] = useState(null);

  const [truckOptions, setTruckOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  const [assistantOptions, setAssistantOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);

  const [truckForm, setTruckForm] = useState({
    route_id: "",
    truck_id: "",
    driver_id: "",
    assistant_id: "",
    start_time: "",
    end_time: "",
  });
  const [availability, setAvailability] = useState({
    driver: null,
    assistant: null,
  });
  const [busy, setBusy] = useState(false);
  const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

  /** Reports */
  const [reportData, setReportData] = useState(null);
  const [reportTitle, setReportTitle] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  /** RESOURCES (Add Drivers, Assistants, Trucks, Trains) */
  const [drivers, setDrivers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [trains, setTrains] = useState([]);

  const [driverForm, setDriverForm] = useState({
    driver_id: "",
    name: "",
    email: "",
    phone_no: "",
    license_number: "",
    vehicle_assigned: "",
    hire_date: "",
  });
  const [assistantForm, setAssistantForm] = useState({
    assistant_id: "",
    name: "",
    email: "",
    phone_no: "",
    department: "logistics",
    shift_schedule: "",
    hire_date: "",
  });
  const [newTruck, setNewTruck] = useState({
    truck_id: "",
    license_plate: "",
    capacity: "",
  });
  const [newTrain, setNewTrain] = useState({
    train_id: "",
    capacity: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(null); // 'driver' | 'assistant' | 'truck' | 'train' | null

  /** Initial load */
  useEffect(() => {
    // Pending orders (real: GET /api/orders?status=confirmed or scheduled-needed)
    setPendingOrders([
      {
        order_id: "ORD001",
        customer_name: "John Doe",
        destination_city: "Colombo",
        order_date: "2025-10-02",
        required_space: 12.5,
        status: "confirmed",
      },
      {
        order_id: "ORD002",
        customer_name: "Jane Smith",
        destination_city: "Galle",
        order_date: "2025-10-03",
        required_space: 8.2,
        status: "confirmed",
      },
    ]);

    // System stats (real: GET /api/system-stats)
    setSystemStats({
      totalPendingOrders: 15,
      totalTrains: 2,
      totalTrucks: 2,
      availableDrivers: 2,
      availableAssistants: 2,
      totalCapacityUtilization: 67,
    });

    // Products (real: GET /api/products)
    setProducts([
      { product_id: "P001", name: "Detergent Box", price: 600, space_consumption: 0.5, category: "FMCG", available_quantity: 200 },
      { product_id: "P002", name: "Shampoo Pack", price: 450, space_consumption: 0.2, category: "FMCG", available_quantity: 300 },
      { product_id: "P003", name: "Soap Carton", price: 1200, space_consumption: 1.0, category: "FMCG", available_quantity: 150 },
    ]);

    // Route options (real: GET /api/truck-routes)
    setRouteOptions([
      { route_id: "TR_COL_01", route_name: "Colombo City North" },
      { route_id: "TR_COL_02", route_name: "Colombo City South" },
      { route_id: "TR_GAL_01", route_name: "Galle Town" },
    ]);

    // Try to preload resource lists (real: GETs)
    (async () => {
      try { const r = await fetch("http://localhost:3000/api/drivers", { headers: tokenHeader }); if (r.ok) setDrivers(await r.json()); } catch {}
      try { const r = await fetch("http://localhost:3000/api/assistants", { headers: tokenHeader }); if (r.ok) setAssistants(await r.json()); } catch {}
      try { const r = await fetch("http://localhost:3000/api/trucks", { headers: tokenHeader }); if (r.ok) setTrucks(await r.json()); } catch {}
      try { const r = await fetch("http://localhost:3000/api/trains", { headers: tokenHeader }); if (r.ok) setTrains(await r.json()); } catch {}
    })();
  }, []); // eslint-disable-line

  /** Fetch helpers used by Allocation Wizard */
  const fetchAvailableTrainTrips = async (order) => {
    try {
      // Real API: GET /api/train-trips?destination=...&from=now
      const res = await fetch(
        `http://localhost:3000/api/train-trips?city=${encodeURIComponent(order.destination_city)}`,
        { headers: tokenHeader }
      );
      if (res.ok) {
        const d = await res.json();
        setTrainOptions(Array.isArray(d) ? d : []);
        return;
      }
    } catch {}
    // fallback aligned with your seed trips
    setTrainOptions([
      {
        trip_id: "TT001",
        route_id: "R_KAN_COL",
        train_id: "TR100",
        store_id: "ST_COL",
        depart_time: new Date(Date.now() + 8 * 86400000).toISOString(),
        arrive_time: new Date(Date.now() + 8 * 86400000 + 6 * 3600000).toISOString(),
        capacity: 200,
        capacity_used: 0,
      },
      {
        trip_id: "TT002",
        route_id: "R_KAN_COL",
        train_id: "TR100",
        store_id: "ST_COL",
        depart_time: new Date(Date.now() + 9 * 86400000).toISOString(),
        arrive_time: new Date(Date.now() + 9 * 86400000 + 6 * 3600000).toISOString(),
        capacity: 200,
        capacity_used: 0,
      },
    ]);
  };

  const fetchTruckDriverAssistant = async () => {
    try {
      const [trucksRes, driversRes, assistantsRes] = await Promise.all([
        fetch("http://localhost:3000/api/trucks", { headers: tokenHeader }),
        fetch("http://localhost:3000/api/drivers", { headers: tokenHeader }),
        fetch("http://localhost:3000/api/assistants", { headers: tokenHeader }),
      ]);

      if (trucksRes.ok) {
        const t = await trucksRes.json();
        setTruckOptions(Array.isArray(t) ? t : []);
      }
      if (driversRes.ok) {
        const d = await driversRes.json();
        setDriverOptions(Array.isArray(d) ? d : []);
      }
      if (assistantsRes.ok) {
        const a = await assistantsRes.json();
        setAssistantOptions(Array.isArray(a) ? a : []);
      }
      if (trucksRes.ok || driversRes.ok || assistantsRes.ok) return;
    } catch {}
    // Fallbacks
    setTruckOptions([
      { truck_id: "TK01", license_plate: "WP-1234", capacity: 60 },
      { truck_id: "TK02", license_plate: "WP-5678", capacity: 60 },
    ]);
    setDriverOptions([
      { driver_id: "DRV001", name: "John Driver" },
      { driver_id: "DRV002", name: "Jane Transport" },
    ]);
    setAssistantOptions([
      { assistant_id: "AST001", name: "Sarah Support" },
      { assistant_id: "AST002", name: "David Logistics" },
    ]);
  };

  const checkAvailability = async (role, id, start, end) => {
    if (!start || !end) return;
    try {
      // Real API: GET /api/availability?type=driver|assistant&id=...&start=...&end=...
      const res = await fetch(
        `http://localhost:3000/api/availability?type=${role}&id=${encodeURIComponent(id)}&start=${encodeURIComponent(
          start
        )}&end=${encodeURIComponent(end)}`
      );
      if (res.ok) {
        const d = await res.json();
        setAvailability((prev) => ({ ...prev, [role === "driver" ? "driver" : "assistant"]: d?.available ? "Available" : "Busy" }));
        return;
      }
    } catch {}
    // Demo rule: DRV001 busy if starting on even hour
    const startH = new Date(start).getHours();
    if (role === "driver")
      setAvailability((prev) => ({ ...prev, driver: id === "DRV001" && startH % 2 === 0 ? "Busy" : "Available" }));
    if (role === "assistant")
      setAvailability((prev) => ({ ...prev, assistant: id === "AST002" && startH % 2 !== 0 ? "Busy" : "Available" }));
  };

  /** Allocation handlers */
  const openAllocation = async (order) => {
    setAllocOrder(order);
    setAllocStep(1);
    setSelectedTrain(null);
    setTruckForm({ route_id: "", truck_id: "", driver_id: "", assistant_id: "", start_time: "", end_time: "" });
    setAvailability({ driver: null, assistant: null });
    setAllocOpen(true);
    await fetchAvailableTrainTrips(order);
  };

  const scheduleOnTrain = async () => {
    if (!allocOrder || !selectedTrain) return;
    setBusy(true);
    try {
      // Real API that internally calls sp_schedule_order_to_trains
      const res = await fetch(
        `http://localhost:3000/api/orders/${encodeURIComponent(allocOrder.order_id)}/schedule-trains`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...tokenHeader },
          body: JSON.stringify({
            route_id: selectedTrain.route_id,
            store_id: selectedTrain.store_id,
          }),
        }
      );
      if (!res.ok) throw new Error("fallback");
    } catch {
      await sleep(500); // demo latency
    } finally {
      setBusy(false);
    }
    setAllocStep(2);
    await fetchTruckDriverAssistant();
  };

  const createTruckSchedule = async () => {
    const { route_id, truck_id, driver_id, assistant_id, start_time, end_time } = truckForm;
    if (!route_id || !truck_id || !driver_id || !assistant_id || !start_time || !end_time) {
      showToast("Please fill all schedule fields.", { type: "warning" });
      return;
    }
    setBusy(true);
    try {
      // Real API that calls sp_create_truck_schedule
      const schedulePayload = {
        truck_schedule_id: crypto.randomUUID?.() || `TS_${Date.now()}`,
        route_id,
        truck_id,
        driver_id,
        assistant_id,
        start_time,
        end_time,
      };

      if (allocOrder?.order_id) {
        schedulePayload.order_id = allocOrder.order_id;
      }

      const res = await fetch("http://localhost:3000/api/truck-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify(schedulePayload),
      });
      if (!res.ok) throw new Error("fallback");
    } catch {
      await sleep(600);
    } finally {
      setBusy(false);
    }
    showToast("Truck schedule created and order is now fully assigned (demo).", { type: "success" });
    setAllocOpen(false);
    // refresh overview lists
    setPendingOrders((prev) => prev.filter((o) => o.order_id !== allocOrder.order_id));
  };

  /** Product actions */
  const addProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...newProduct,
      price: Number(newProduct.price),
      space_consumption: Number(newProduct.space_consumption),
      available_quantity: Number(newProduct.available_quantity),
    };
    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("fallback");
      const added = await res.json();
      setProducts((p) => [added, ...p]);
    } catch {
      // fallback to local mutate
      setProducts((p) => [payload, ...p]);
    }
    setNewProduct({ product_id: "", name: "", description: "", price: "", space_consumption: "", category: "", available_quantity: "" });
  };

  const changePrice = async (e) => {
    e.preventDefault();
    if (!priceEdit.product_id || !priceEdit.price) return;
    try {
      const res = await fetch(`http://localhost:3000/api/products/${encodeURIComponent(priceEdit.product_id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify({ price: Number(priceEdit.price) }),
      });
      if (!res.ok) throw new Error("fallback");
    } catch {
      await sleep(300);
    }
    setProducts((p) => p.map((x) => (x.product_id === priceEdit.product_id ? { ...x, price: Number(priceEdit.price) } : x)));
    setPriceEdit({ product_id: "", price: "" });
  };

  /** Reports */
  const runReport = async (key) => {
    setReportTitle(key);
    setReportOpen(true);
    setReportData(null);
    try {
      // Map report key -> endpoint using your DB views
      const ep = {
        "Quarterly Sales": "/api/reports/quarterly-sales", // v_quarterly_sales
        "Train Utilization": "/api/reports/train-utilization", // custom
        "Truck Performance": "/api/reports/truck-usage", // v_truck_usage
        "Worker Hours": "/api/reports/worker-hours", // v_worker_hours
        "City-wise Sales": "/api/reports/city-route-sales", // v_city_route_sales
        "Top Products": "/api/reports/quarter-top-items", // v_quarter_top_items
      }[key];

      if (ep) {
        const res = await fetch(`http://localhost:3000${ep}`, { headers: tokenHeader });
        if (res.ok) {
          const d = await res.json();
          setReportData(Array.isArray(d) ? d : []);
          return;
        }
      }
    } catch {}
    // Fallback demo rows
    const demo = {
      "Quarterly Sales": [
        { quarter: "2025-Q3", total_value: 1250000, total_space_units: 420, orders: 118 },
        { quarter: "2025-Q2", total_value: 980000, total_space_units: 350, orders: 102 },
      ],
      "Train Utilization": [
        { trip_id: "TT001", train_id: "TR100", route: "Kandy→Colombo", capacity: 200, used: 160, utilization: "80%" },
      ],
      "Truck Performance": [
        { truck_id: "TK01", month: "2025-09", runs: 24, hours: 92 },
        { truck_id: "TK02", month: "2025-09", runs: 21, hours: 85 },
      ],
      "Worker Hours": [
        { role: "driver", worker_id: "DRV001", week: "2025-39", hours: 36 },
        { role: "assistant", worker_id: "AST001", week: "2025-39", hours: 44 },
      ],
      "City-wise Sales": [
        { destination_city: "Colombo", route_name: "City North", total_value: 540000, orders: 52 },
        { destination_city: "Galle", route_name: "Galle Town", total_value: 320000, orders: 29 },
      ],
      "Top Products": [
        { year: 2025, quarter: 3, product_id: "P001", product_name: "Detergent Box", total_qty: 420 },
        { year: 2025, quarter: 3, product_id: "P002", product_name: "Shampoo Pack", total_qty: 390 },
      ],
    };
    setReportData(demo[key] || []);
  };

  /** Render sections */
  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card pending">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{systemStats.totalPendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="stat-card trains">
          <div className="stat-icon">🚂</div>
          <div className="stat-content">
            <h3>{systemStats.totalTrains}</h3>
            <p>Available Trains</p>
          </div>
        </div>

        <div className="stat-card trucks">
          <div className="stat-icon">🚛</div>
          <div className="stat-content">
            <h3>{systemStats.totalTrucks}</h3>
            <p>Available Trucks</p>
          </div>
        </div>

        <div className="stat-card capacity">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{systemStats.totalCapacityUtilization}%</h3>
            <p>Capacity Utilization</p>
          </div>
        </div>
      </div>

      <div className="pending-orders-section">
        <h2>Orders Requiring Allocation</h2>
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Required Space</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.destination_city}</td>
                  <td>{order.required_space} units</td>
                  <td>{order.order_date}</td>
                  <td>
                    <button className="allocate-btn" onClick={() => openAllocation(order)}>
                      Allocate
                    </button>
                  </td>
                </tr>
              ))}
              {pendingOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    No orders pending allocation
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTrainAllocation = () => (
    <div className="train-allocation">
      <h2>Train Capacity Management</h2>
      <div className="allocation-controls">
        <div className="train-list">
          <h3>Upcoming Trips</h3>
          <div className="train-grid">
            {(trainOptions.length ? trainOptions : [
              {
                trip_id: "TT001",
                route_id: "R_KAN_COL",
                train_id: "TR100",
                depart_time: new Date(Date.now() + 8 * 86400000).toISOString(),
                arrive_time: new Date(Date.now() + 8 * 86400000 + 6 * 3600000).toISOString(),
                capacity: 200,
                capacity_used: 40,
              },
            ]).map((t) => {
              const remaining = Number(t.capacity) - Number(t.capacity_used || 0);
              return (
                <div key={t.trip_id} className="train-card">
                  <h4>
                    Train {t.train_id} • {t.route_id}
                  </h4>
                  <p>
                    Departs: {new Date(t.depart_time).toLocaleString()} — Arrives:{" "}
                    {new Date(t.arrive_time).toLocaleString()}
                  </p>
                  <p>Capacity: {t.capacity} • Used: {t.capacity_used || 0} • Remaining: {remaining}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="muted small">Use the allocation wizard from Overview → “Allocate”.</p>
    </div>
  );

  const renderTruckScheduling = () => (
    <div className="truck-scheduling">
      <h2>Truck Schedule Management</h2>
      <div className="scheduling-controls">
        <div className="available-resources">
          <div className="resource-section">
            <h3>Available Trucks</h3>
            <div className="truck-list">
              {(truckOptions.length ? truckOptions : [
                { truck_id: "TK01", license_plate: "WP-1234", capacity: 60 },
                { truck_id: "TK02", license_plate: "WP-5678", capacity: 60 },
              ]).map((t) => (
                <div key={t.truck_id} className="truck-card">
                  <h4>
                    Truck {t.truck_id} ({t.license_plate})
                  </h4>
                  <p>Capacity: {t.capacity} units</p>
                  <p>Status: Available</p>
                </div>
              ))}
            </div>
          </div>

          <div className="resource-section">
            <h3>Available Drivers</h3>
            <div className="driver-list">
              {(driverOptions.length ? driverOptions : [
                { driver_id: "DRV001", name: "John Driver" },
                { driver_id: "DRV002", name: "Jane Transport" },
              ]).map((d) => (
                <div key={d.driver_id} className="driver-card">
                  <h4>
                    {d.name} ({d.driver_id})
                  </h4>
                  <p>Weekly Hours: 0/40</p>
                  <p>Status: Available</p>
                </div>
              ))}
            </div>
          </div>

          <div className="resource-section">
            <h3>Available Assistants</h3>
            <div className="assistant-list">
              {(assistantOptions.length ? assistantOptions : [
                { assistant_id: "AST001", name: "Sarah Support" },
                { assistant_id: "AST002", name: "David Logistics" },
              ]).map((a) => (
                <div key={a.assistant_id} className="assistant-card">
                  <h4>
                    {a.name} ({a.assistant_id})
                  </h4>
                  <p>Weekly Hours: 0/60</p>
                  <p>Status: Available</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="create-schedule-btn" onClick={() => setCurrentView("overview")}>
          Use Allocation Wizard
        </button>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="reports-section">
      <h2>System Reports & Analytics</h2>
      <div className="report-cards">
        {[
          "Quarterly Sales",
          "Train Utilization",
          "Truck Performance",
          "Worker Hours",
          "City-wise Sales",
          "Top Products",
        ].map((name) => (
          <div className="report-card" key={name}>
            <h3>{name === "Quarterly Sales" ? "📊" : name === "Truck Performance" ? "🚛" : name === "Train Utilization" ? "🚂" : name === "Worker Hours" ? "👥" : name === "City-wise Sales" ? "🏙️" : "📦"} {name} Report</h3>
            <p>
              {
                {
                  "Quarterly Sales": "Revenue and space volume analysis",
                  "Train Utilization": "Train capacity and efficiency metrics",
                  "Truck Performance": "Truck usage and delivery performance",
                  "Worker Hours": "Driver and assistant working hours",
                  "City-wise Sales": "Sales performance by destination",
                  "Top Products": "Most ordered items analysis",
                }[name]
              }
            </p>
            <button className="generate-btn" onClick={() => runReport(name)}>
              Generate Report
            </button>
          </div>
        ))}
      </div>

      {/* Report modal */}
      {reportOpen && (
        <div className="modal-overlay" onClick={() => setReportOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{reportTitle} Report</h2>
              <button className="icon-btn" onClick={() => setReportOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {!reportData && <p>Generating…</p>}
              {reportData && reportData.length > 0 && (
                <>
                  <div className="assignments-table-wrapper">
                    <table className="assignments-table">
                      <thead>
                        <tr>
                          {Object.keys(reportData[0]).map((k) => (
                            <th key={k}>{k}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map((row, i) => (
                          <tr key={i}>
                            {Object.keys(reportData[0]).map((k) => (
                              <td key={k}>{String(row[k])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-actions">
                    <button className="btn primary" onClick={() => download(`${reportTitle.replace(/\s+/g, "_")}.csv`, toCSV(reportData))}>
                      Download CSV
                    </button>
                    <button className="btn" onClick={() => setReportOpen(false)}>
                      Close
                    </button>
                  </div>
                </>
              )}
              {reportData && reportData.length === 0 && <p>No data.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="products-section">
      <h2>Product Management</h2>

      <div className="product-panels">
        <div className="product-panel">
          <h3>Add Product</h3>
          <form className="form-grid" onSubmit={addProduct}>
            <label>
              <span>Product ID</span>
              <input required value={newProduct.product_id} onChange={(e) => setNewProduct((p) => ({ ...p, product_id: e.target.value }))} />
            </label>
            <label>
              <span>Name</span>
              <input required value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} />
            </label>
            <label className="full">
              <span>Description</span>
              <textarea rows={2} value={newProduct.description} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} />
            </label>
            <label>
              <span>Price (LKR)</span>
              <input required type="number" min="0" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} />
            </label>
            <label>
              <span>Space / item</span>
              <input required type="number" step="0.0001" min="0" value={newProduct.space_consumption} onChange={(e) => setNewProduct((p) => ({ ...p, space_consumption: e.target.value }))} />
            </label>
            <label>
              <span>Category</span>
              <input value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))} />
            </label>
            <label>
              <span>Available Qty</span>
              <input required type="number" min="0" value={newProduct.available_quantity} onChange={(e) => setNewProduct((p) => ({ ...p, available_quantity: e.target.value }))} />
            </label>
            <div className="form-actions full">
              <button className="btn primary" type="submit">
                Add Product
              </button>
            </div>
          </form>
        </div>

        <div className="product-panel">
          <h3>Update Price</h3>
          <form className="form-inline" onSubmit={changePrice}>
            <select required value={priceEdit.product_id} onChange={(e) => setPriceEdit((s) => ({ ...s, product_id: e.target.value }))}>
              <option value="">Select product…</option>
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.product_id} — {p.name}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              min="0"
              placeholder="New price"
              value={priceEdit.price}
              onChange={(e) => setPriceEdit((s) => ({ ...s, price: e.target.value }))}
            />
            <button className="btn primary" type="submit">
              Update
            </button>
          </form>
        </div>
      </div>

      <div className="orders-table" style={{ marginTop: 16 }}>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Space</th>
              <th>Category</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.product_id}>
                <td>{p.product_id}</td>
                <td>{p.name}</td>
                <td>{fmtMoney(p.price)}</td>
                <td>{p.space_consumption}</td>
                <td>{p.category}</td>
                <td>{p.available_quantity}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  No products
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  /** NEW: Resources view (Add Drivers, Assistants, Trucks, Trains) */
  const renderResources = () => (
    <div className="products-section">
      <h2 style={{ marginTop: 0 }}>Resources — Add New</h2>

      <div className="product-panels">
        {/* Driver */}
        <div className="product-panel">
          <h3 style={{ marginTop: 0 }}>Add Driver</h3>
          <form
            className="form-grid"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting("driver");
              try {
                const res = await fetch("http://localhost:3000/api/drivers", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", ...tokenHeader },
                  body: JSON.stringify(driverForm),
                });
                if (!res.ok) throw new Error("fallback");
              } catch {}
              setDrivers((d) => [driverForm, ...d]);
              setDriverForm({ driver_id: "", name: "", email: "", phone_no: "", license_number: "", vehicle_assigned: "", hire_date: "" });
              setSubmitting(null);
              showToast("Driver added", { type: "success" });
            }}
          >
            <label>
              <span>Driver ID</span>
              <input required value={driverForm.driver_id} onChange={(e) => setDriverForm((f) => ({ ...f, driver_id: e.target.value }))} placeholder="DRV001" />
            </label>
            <label>
              <span>Name</span>
              <input required value={driverForm.name} onChange={(e) => setDriverForm((f) => ({ ...f, name: e.target.value }))} placeholder="John Driver" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={driverForm.email} onChange={(e) => setDriverForm((f) => ({ ...f, email: e.target.value }))} placeholder="john@kandypack.com" />
            </label>
            <label>
              <span>Phone</span>
              <input value={driverForm.phone_no} onChange={(e) => setDriverForm((f) => ({ ...f, phone_no: e.target.value }))} placeholder="+94…" />
            </label>
            <label>
              <span>License Number</span>
              <input required value={driverForm.license_number} onChange={(e) => setDriverForm((f) => ({ ...f, license_number: e.target.value }))} placeholder="DL123456" />
            </label>
            <label>
              <span>Vehicle Assigned</span>
              <input value={driverForm.vehicle_assigned} onChange={(e) => setDriverForm((f) => ({ ...f, vehicle_assigned: e.target.value }))} placeholder="TRUCK-001" />
            </label>
            <label className="full">
              <span>Hire Date</span>
              <input type="date" required value={driverForm.hire_date} onChange={(e) => setDriverForm((f) => ({ ...f, hire_date: e.target.value }))} />
            </label>
            <div className="form-actions full">
              <button className="btn primary" disabled={submitting === "driver"}>{submitting === "driver" ? "Saving…" : "Add Driver"}</button>
            </div>
          </form>

          {!!drivers.length && (
            <div className="assignments-table-wrapper" style={{ marginTop: 12 }}>
              <table className="assignments-table">
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
                <tbody>
                  {drivers.slice(0, 5).map((d, i) => (
                    <tr key={i}><td className="mono">{d.driver_id || d.id}</td><td>{d.name}</td><td>{d.email || "-"}</td><td>{d.phone_no || d.phone || "-"}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Assistant */}
        <div className="product-panel">
          <h3 style={{ marginTop: 0 }}>Add Assistant</h3>
          <form
            className="form-grid"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting("assistant");
              try {
                const res = await fetch("http://localhost:3000/api/assistants", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", ...tokenHeader },
                  body: JSON.stringify(assistantForm),
                });
                if (!res.ok) throw new Error("fallback");
              } catch {}
              setAssistants((d) => [assistantForm, ...d]);
              setAssistantForm({ assistant_id: "", name: "", email: "", phone_no: "", department: "logistics", shift_schedule: "", hire_date: "" });
              setSubmitting(null);
              showToast("Assistant added", { type: "success" });
            }}
          >
            <label>
              <span>Assistant ID</span>
              <input required value={assistantForm.assistant_id} onChange={(e) => setAssistantForm((f) => ({ ...f, assistant_id: e.target.value }))} placeholder="AST001" />
            </label>
            <label>
              <span>Name</span>
              <input required value={assistantForm.name} onChange={(e) => setAssistantForm((f) => ({ ...f, name: e.target.value }))} placeholder="Sarah Support" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={assistantForm.email} onChange={(e) => setAssistantForm((f) => ({ ...f, email: e.target.value }))} placeholder="sarah@kandypack.com" />
            </label>
            <label>
              <span>Phone</span>
              <input value={assistantForm.phone_no} onChange={(e) => setAssistantForm((f) => ({ ...f, phone_no: e.target.value }))} placeholder="+94…" />
            </label>
            <label>
              <span>Department</span>
              <select value={assistantForm.department} onChange={(e) => setAssistantForm((f) => ({ ...f, department: e.target.value }))}>
                <option value="logistics">Logistics</option>
                <option value="customer_service">Customer Service</option>
                <option value="inventory">Inventory</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </label>
            <label>
              <span>Shift Schedule</span>
              <input value={assistantForm.shift_schedule} onChange={(e) => setAssistantForm((f) => ({ ...f, shift_schedule: e.target.value }))} placeholder="Day Shift (8AM-5PM)" />
            </label>
            <label className="full">
              <span>Hire Date</span>
              <input type="date" required value={assistantForm.hire_date} onChange={(e) => setAssistantForm((f) => ({ ...f, hire_date: e.target.value }))} />
            </label>
            <div className="form-actions full">
              <button className="btn primary" disabled={submitting === "assistant"}>{submitting === "assistant" ? "Saving…" : "Add Assistant"}</button>
            </div>
          </form>

          {!!assistants.length && (
            <div className="assignments-table-wrapper" style={{ marginTop: 12 }}>
              <table className="assignments-table">
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
                <tbody>
                  {assistants.slice(0, 5).map((a, i) => (
                    <tr key={i}><td className="mono">{a.assistant_id || a.id}</td><td>{a.name}</td><td>{a.email || "-"}</td><td>{a.phone_no || a.phone || "-"}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Truck */}
        <div className="product-panel">
          <h3 style={{ marginTop: 0 }}>Add Truck</h3>
          <form
            className="form-grid"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting("truck");
              const payload = { ...newTruck, capacity: newTruck.capacity ? Number(newTruck.capacity) : 0 };
              try {
                const res = await fetch("http://localhost:3000/api/trucks", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", ...tokenHeader },
                  body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("fallback");
              } catch {}
              setTrucks((d) => [payload, ...d]);
              setNewTruck({ truck_id: "", license_plate: "", capacity: "" });
              setSubmitting(null);
              showToast("Truck added", { type: "success" });
            }}
          >
            <label>
              <span>Truck ID</span>
              <input required value={newTruck.truck_id} onChange={(e) => setNewTruck((f) => ({ ...f, truck_id: e.target.value }))} placeholder="TK01" />
            </label>
            <label>
              <span>License Plate</span>
              <input required value={newTruck.license_plate} onChange={(e) => setNewTruck((f) => ({ ...f, license_plate: e.target.value }))} placeholder="WP-1234" />
            </label>
            <label className="full">
              <span>Capacity (units)</span>
              <input required type="number" min="0" step="0.0001" value={newTruck.capacity} onChange={(e) => setNewTruck((f) => ({ ...f, capacity: e.target.value }))} placeholder="60.0" />
            </label>
            <div className="form-actions full">
              <button className="btn primary" disabled={submitting === "truck"}>{submitting === "truck" ? "Saving…" : "Add Truck"}</button>
            </div>
          </form>

          {!!trucks.length && (
            <div className="assignments-table-wrapper" style={{ marginTop: 12 }}>
              <table className="assignments-table">
                <thead><tr><th>ID</th><th>Plate</th><th>Capacity</th></tr></thead>
                <tbody>
                  {trucks.slice(0, 5).map((t, i) => (
                    <tr key={i}><td className="mono">{t.truck_id || t.id}</td><td>{t.license_plate}</td><td>{t.capacity}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Train */}
        <div className="product-panel">
          <h3 style={{ marginTop: 0 }}>Add Train</h3>
          <form
            className="form-grid"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting("train");
              const payload = { ...newTrain, capacity: newTrain.capacity ? Number(newTrain.capacity) : 0 };
              try {
                const res = await fetch("http://localhost:3000/api/trains", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", ...tokenHeader },
                  body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("fallback");
              } catch {}
              setTrains((d) => [payload, ...d]);
              setNewTrain({ train_id: "", capacity: "", notes: "" });
              setSubmitting(null);
              showToast("Train added", { type: "success" });
            }}
          >
            <label>
              <span>Train ID</span>
              <input required value={newTrain.train_id} onChange={(e) => setNewTrain((f) => ({ ...f, train_id: e.target.value }))} placeholder="TR100" />
            </label>
            <label>
              <span>Capacity (units)</span>
              <input required type="number" min="0" step="0.0001" value={newTrain.capacity} onChange={(e) => setNewTrain((f) => ({ ...f, capacity: e.target.value }))} placeholder="200.0" />
            </label>
            <label className="full">
              <span>Notes</span>
              <textarea value={newTrain.notes} onChange={(e) => setNewTrain((f) => ({ ...f, notes: e.target.value }))} placeholder="Bulk cargo, refrigeration available…" />
            </label>
            <div className="form-actions full">
              <button className="btn primary" disabled={submitting === "train"}>{submitting === "train" ? "Saving…" : "Add Train"}</button>
            </div>
          </form>

          {!!trains.length && (
            <div className="assignments-table-wrapper" style={{ marginTop: 12 }}>
              <table className="assignments-table">
                <thead><tr><th>ID</th><th>Capacity</th><th>Notes</th></tr></thead>
                <tbody>
                  {trains.slice(0, 5).map((t, i) => (
                    <tr key={i}><td className="mono">{t.train_id || t.id}</td><td>{t.capacity}</td><td>{t.notes || "-"}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /** Handlers */
  const handleLogout = () => logout();

  /** Main render */
  return (
    <div className={`admin-dashboard ${theme}`}>
      <div className="dashboard-header">
        <div className="header-left">
          <h1>🚂 Rail & Road Distribution Control Center</h1>
          <p>Welcome, {user?.name || "Administrator"}</p>
        </div>
        <div className="header-right">
          <button onClick={toggleTheme} className="theme-btn">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <nav className="nav-menu">
            <button className={currentView === "overview" ? "active" : ""} onClick={() => setCurrentView("overview")}>
              📊 Overview
            </button>
            <button className={currentView === "trains" ? "active" : ""} onClick={() => setCurrentView("trains")}>
              🚂 Train Allocation
            </button>
            <button className={currentView === "trucks" ? "active" : ""} onClick={() => setCurrentView("trucks")}>
              🚛 Truck Scheduling
            </button>
            <button className={currentView === "reports" ? "active" : ""} onClick={() => setCurrentView("reports")}>
              📈 Reports & Analytics
            </button>
            <button className={currentView === "products" ? "active" : ""} onClick={() => setCurrentView("products")}>
              📦 Products
            </button>
            <button className={currentView === "resources" ? "active" : ""} onClick={() => setCurrentView("resources")}>
              🧩 Resources
            </button>
          </nav>
        </div>

        <div className="main-content">
          {currentView === "overview" && renderOverview()}
          {currentView === "trains" && renderTrainAllocation()}
          {currentView === "trucks" && renderTruckScheduling()}
          {currentView === "reports" && renderReports()}
          {currentView === "products" && renderProducts()}
          {currentView === "resources" && renderResources()}
        </div>
      </div>

      {/* Allocation Wizard Modal */}
      {allocOpen && (
        <div className="modal-overlay" onClick={() => setAllocOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                Allocate Order {allocOrder?.order_id} • Required: {allocOrder?.required_space} space units
              </h2>
              <button className="icon-btn" onClick={() => setAllocOpen(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Steps nav */}
              <div className="steps">
                <button className={`step ${allocStep === 1 ? "active" : ""}`} onClick={() => setAllocStep(1)}>
                  1) Assign Train
                </button>
                <button className={`step ${allocStep === 2 ? "active" : ""}`} onClick={() => setAllocStep(2)} disabled={!selectedTrain}>
                  2) Create Truck Schedule
                </button>
              </div>

              {/* Step 1: Train */}
              {allocStep === 1 && (
                <>
                  <div className="orders-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Trip ID</th>
                          <th>Train</th>
                          <th>Route</th>
                          <th>Depart</th>
                          <th>Arrive</th>
                          <th>Remaining</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {trainOptions.map((t) => {
                          const remaining = Number(t.capacity) - Number(t.capacity_used || 0);
                          return (
                            <tr key={t.trip_id}>
                              <td className="mono">{t.trip_id}</td>
                              <td>{t.train_id}</td>
                              <td>{t.route_id}</td>
                              <td>{new Date(t.depart_time).toLocaleString()}</td>
                              <td>{new Date(t.arrive_time).toLocaleString()}</td>
                              <td>{remaining}</td>
                              <td>
                                <button
                                  className={`btn ${selectedTrain?.trip_id === t.trip_id ? "success" : ""}`}
                                  onClick={() => setSelectedTrain(t)}
                                >
                                  {selectedTrain?.trip_id === t.trip_id ? "Selected" : "Select"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {trainOptions.length === 0 && (
                          <tr>
                            <td colSpan={7} className="empty">
                              No suitable upcoming trips
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="modal-actions">
                    <button className="btn" onClick={() => setAllocOpen(false)}>
                      Cancel
                    </button>
                    <button className="btn primary" disabled={!selectedTrain || busy} onClick={scheduleOnTrain}>
                      {busy ? "Scheduling…" : "Schedule on Train"}
                    </button>
                  </div>
                </>
              )}

              {/* Step 2: Truck schedule */}
              {allocStep === 2 && (
                <>
                  <div className="form-grid">
                    <label>
                      <span>Route</span>
                      <select
                        value={truckForm.route_id}
                        onChange={(e) => setTruckForm((f) => ({ ...f, route_id: e.target.value }))}
                      >
                        <option value="">Select…</option>
                        {routeOptions.map((r) => (
                          <option key={r.route_id} value={r.route_id}>
                            {r.route_id} — {r.route_name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Truck</span>
                      <select
                        value={truckForm.truck_id}
                        onChange={(e) => setTruckForm((f) => ({ ...f, truck_id: e.target.value }))}
                      >
                        <option value="">Select…</option>
                        {truckOptions.map((t) => (
                          <option key={t.truck_id} value={t.truck_id}>
                            {t.truck_id} ({t.license_plate}) — {t.capacity}u
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Driver</span>
                      <select
                        value={truckForm.driver_id}
                        onChange={async (e) => {
                          const v = e.target.value;
                          setTruckForm((f) => ({ ...f, driver_id: v }));
                          if (truckForm.start_time && truckForm.end_time) {
                            await checkAvailability("driver", v, truckForm.start_time, truckForm.end_time);
                          }
                        }}
                      >
                        <option value="">Select…</option>
                        {driverOptions.map((d) => (
                          <option key={d.driver_id} value={d.driver_id}>
                            {d.driver_id} — {d.name}
                          </option>
                        ))}
                      </select>
                      {availability.driver && <small className={availability.driver === "Available" ? "ok" : "err"}>{availability.driver}</small>}
                    </label>

                    <label>
                      <span>Assistant</span>
                      <select
                        value={truckForm.assistant_id}
                        onChange={async (e) => {
                          const v = e.target.value;
                          setTruckForm((f) => ({ ...f, assistant_id: v }));
                          if (truckForm.start_time && truckForm.end_time) {
                            await checkAvailability("assistant", v, truckForm.start_time, truckForm.end_time);
                          }
                        }}
                      >
                        <option value="">Select…</option>
                        {assistantOptions.map((a) => (
                          <option key={a.assistant_id} value={a.assistant_id}>
                            {a.assistant_id} — {a.name}
                          </option>
                        ))}
                      </select>
                      {availability.assistant && (
                        <small className={availability.assistant === "Available" ? "ok" : "err"}>{availability.assistant}</small>
                      )}
                    </label>

                    <label>
                      <span>Start Time</span>
                      <input
                        type="datetime-local"
                        value={truckForm.start_time}
                        onChange={async (e) => {
                          const v = e.target.value;
                          setTruckForm((f) => ({ ...f, start_time: v }));
                          if (truckForm.driver_id) await checkAvailability("driver", truckForm.driver_id, v, truckForm.end_time);
                          if (truckForm.assistant_id) await checkAvailability("assistant", truckForm.assistant_id, v, truckForm.end_time);
                        }}
                      />
                    </label>

                    <label>
                      <span>End Time</span>
                      <input
                        type="datetime-local"
                        value={truckForm.end_time}
                        onChange={async (e) => {
                          const v = e.target.value;
                          setTruckForm((f) => ({ ...f, end_time: v }));
                          if (truckForm.driver_id) await checkAvailability("driver", truckForm.driver_id, truckForm.start_time, v);
                          if (truckForm.assistant_id) await checkAvailability("assistant", truckForm.assistant_id, truckForm.start_time, v);
                        }}
                      />
                    </label>
                  </div>

                  <div className="modal-actions">
                    <button className="btn" onClick={() => setAllocOpen(false)}>
                      Close
                    </button>
                    <button className="btn primary" disabled={busy} onClick={createTruckSchedule}>
                      {busy ? "Creating…" : "Create Schedule"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

