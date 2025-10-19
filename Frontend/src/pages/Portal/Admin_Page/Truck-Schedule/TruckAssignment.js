import React, { useEffect, useState } from "react";
import "./truckassignment.css";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

export default function TruckAssignment() {
  const [routes, setRoutes] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [form, setForm] = useState({ route_id:"", truck_id:"", driver_id:"", assistant_id:"", start_time:"", end_time:"" });
  const [availability, setAvailability] = useState({ driver:null, assistant:null });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      // Helper function to extract array from various response formats
      const extractArray = (data, key) => {
        if (Array.isArray(data)) return data;
        if (data.data) {
          if (Array.isArray(data.data)) return data.data;
          if (data.data[key]) return data.data[key];
          return Object.values(data.data);
        }
        if (data[key]) return data[key];
        return [];
      };
      
      try { 
        const r = await fetch("http://localhost:3000/api/truck-routes", { headers: tokenHeader }); 
        if (r.ok) {
          const data = await r.json();
          setRoutes(extractArray(data, 'routes'));
        }
      } catch {}
      if (!routes.length) setRoutes([{ route_id:"TR_COL_01", route_name:"Colombo City North" }]);
      
      try { 
        const r = await fetch("http://localhost:3000/api/trucks", { headers: tokenHeader }); 
        if (r.ok) {
          const data = await r.json();
          setTrucks(extractArray(data, 'trucks'));
        }
      } catch {}
      if (!trucks.length) setTrucks([{ truck_id:"TK01", license_plate:"WP-1234", capacity:60 }]);
      
      try { 
        const r = await fetch("http://localhost:3000/api/drivers", { headers: tokenHeader }); 
        if (r.ok) {
          const data = await r.json();
          setDrivers(extractArray(data, 'drivers'));
        }
      } catch {}
      if (!drivers.length) setDrivers([{ driver_id:"DRV001", name:"John Driver" }]);
      
      try { 
        const r = await fetch("http://localhost:3000/api/assistants", { headers: tokenHeader }); 
        if (r.ok) {
          const data = await r.json();
          setAssistants(extractArray(data, 'assistants'));
        }
      } catch {}
      if (!assistants.length) setAssistants([{ assistant_id:"AST001", name:"Sarah Support" }]);
    })();
    // eslint-disable-next-line
  }, []);

  const check = async (role, id, start, end) => {
    if (!id || !start || !end) return;
    try {
      const r = await fetch(`http://localhost:3000/api/availability?type=${role}&id=${encodeURIComponent(id)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
      if (r.ok) {
        const d = await r.json();
        return setAvailability(s=>({ ...s, [role]: d?.available ? "Available" : "Busy" }));
      }
    } catch {}
    // demo heuristic
    const even = new Date(start).getHours() % 2 === 0;
    setAvailability(s=>({ ...s, [role]: role==="driver" ? (id==="DRV001" && even ? "Busy":"Available") : (id==="AST002" && !even ? "Busy":"Available") }));
  };

  const create = async () => {
    const { route_id, truck_id, driver_id, assistant_id, start_time, end_time } = form;
    if (!route_id || !truck_id || !driver_id || !assistant_id || !start_time || !end_time) return alert("Fill all fields");
    setBusy(true);
    try {
      const r = await fetch("http://localhost:3000/api/truck-schedule", {
        method:"POST", headers:{ "Content-Type":"application/json", ...tokenHeader },
        body: JSON.stringify({ truck_schedule_id: crypto.randomUUID?.() || `TS_${Date.now()}`, ...form })
      });
      if (!r.ok) throw new Error();
    } catch {}
    setBusy(false);
    alert("Truck schedule created (demo).");
    setForm({ route_id:"", truck_id:"", driver_id:"", assistant_id:"", start_time:"", end_time:"" });
    setAvailability({ driver:null, assistant:null });
  };

  return (
    <div className="truckassign">
      <h2>Truck Assignment to Route</h2>

      <div className="panel">
        <div className="grid">
          <label><span>Route</span>
            <select value={form.route_id} onChange={e=>setForm(f=>({...f,route_id:e.target.value}))}>
              <option value="">Select…</option>
              {routes.map(r=> <option key={r.route_id} value={r.route_id}>{r.route_id} — {r.route_name}</option>)}
            </select>
          </label>

          <label><span>Truck</span>
            <select value={form.truck_id} onChange={e=>setForm(f=>({...f,truck_id:e.target.value}))}>
              <option value="">Select…</option>
              {trucks.map(t=> <option key={t.truck_id} value={t.truck_id}>{t.truck_id} ({t.license_plate}) • {t.capacity}u</option>)}
            </select>
          </label>

          <label><span>Driver</span>
            <select value={form.driver_id} onChange={async e=>{ const v=e.target.value; setForm(f=>({...f,driver_id:v})); await check("driver", v, form.start_time, form.end_time); }}>
              <option value="">Select…</option>
              {drivers.map(d=> <option key={d.driver_id} value={d.driver_id}>{d.driver_id} — {d.name}</option>)}
            </select>
            {availability.driver && <small className={availability.driver==="Available"?"ok":"err"}>{availability.driver}</small>}
          </label>

          <label><span>Assistant</span>
            <select value={form.assistant_id} onChange={async e=>{ const v=e.target.value; setForm(f=>({...f,assistant_id:v})); await check("assistant", v, form.start_time, form.end_time); }}>
              <option value="">Select…</option>
              {assistants.map(a=> <option key={a.assistant_id} value={a.assistant_id}>{a.assistant_id} — {a.name}</option>)}
            </select>
            {availability.assistant && <small className={availability.assistant==="Available"?"ok":"err"}>{availability.assistant}</small>}
          </label>

          <label><span>Start Time</span>
            <input type="datetime-local" value={form.start_time} onChange={async e=>{ const v=e.target.value; setForm(f=>({...f,start_time:v})); if (form.driver_id) await check("driver", form.driver_id, v, form.end_time); if (form.assistant_id) await check("assistant", form.assistant_id, v, form.end_time); }} />
          </label>

          <label><span>End Time</span>
            <input type="datetime-local" value={form.end_time} onChange={async e=>{ const v=e.target.value; setForm(f=>({...f,end_time:v})); if (form.driver_id) await check("driver", form.driver_id, form.start_time, v); if (form.assistant_id) await check("assistant", form.assistant_id, form.start_time, v); }} />
          </label>
        </div>

        <div className="actions">
          <button className="btn primary" disabled={busy} onClick={create}>{busy ? "Creating…" : "Create Schedule"}</button>
        </div>
      </div>
    </div>
  );
}
