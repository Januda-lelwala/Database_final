import React, { useState } from "react";
import "./reports.css";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };
const toCSV = (rows) => {
  if (!rows?.length) return ""; const headers = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g,'""')}"`;
  return [headers.join(","), ...rows.map(r => headers.map(h => esc(r[h])).join(","))].join("\n");
};
const download = (name, text) => { const blob = new Blob([text],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url); };

export default function Reports() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState(null);

  const run = async (name) => {
    setTitle(name); setOpen(true); setRows(null);
    const endpoint = {
      "Quarterly Sales": "/api/reports/quarterly-sales",
      "Train Utilization": "/api/reports/train-utilization",
      "Truck Performance": "/api/reports/truck-usage",
      "Worker Hours": "/api/reports/worker-hours",
      "City-wise Sales": "/api/reports/city-route-sales",
      "Top Products": "/api/reports/quarter-top-items",
    }[name];
    try { if (endpoint) { const r = await fetch(`http://localhost:3000${endpoint}`, { headers: tokenHeader }); if (r.ok) return setRows(await r.json()); } } catch {}
    const demo = {
      "Quarterly Sales":[{quarter:"2025-Q3", total_value:1250000, total_space_units:420, orders:118}],
      "Train Utilization":[{trip_id:"TT001", train_id:"TR100", route:"Kandy→Colombo", capacity:200, used:160, utilization:"80%"}],
      "Truck Performance":[{truck_id:"TK01", month:"2025-09", runs:24, hours:92}],
      "Worker Hours":[{role:"driver", worker_id:"DRV001", week:"2025-39", hours:36}],
      "City-wise Sales":[{destination_city:"Colombo", route_name:"City North", total_value:540000, orders:52}],
      "Top Products":[{year:2025, quarter:3, product_id:"P001", product_name:"Detergent Box", total_qty:420}],
    };
    setRows(demo[name]);
  };

  return (
    <div className="reports">
      <h2>Reports & Analytics</h2>
      <div className="cards">
        {["Quarterly Sales","Train Utilization","Truck Performance","Worker Hours","City-wise Sales","Top Products"].map(n=>(
          <div className="card" key={n}>
            <h3>{n}</h3>
            <p>{
              { "Quarterly Sales":"Revenue & space volume", "Train Utilization":"Capacity & efficiency",
                "Truck Performance":"Usage & deliveries", "Worker Hours":"Driver/assistant hours",
                "City-wise Sales":"Destination performance", "Top Products":"Most ordered items" }[n]
            }</p>
            <button className="btn primary" onClick={()=>run(n)}>Generate</button>
          </div>
        ))}
      </div>

      {open && (
        <div className="modal-overlay" onClick={()=>setOpen(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header">
              <h2>{title}</h2>
              <button className="icon-btn" onClick={()=>setOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              {!rows && <p>Generating…</p>}
              {rows && rows.length>0 && (
                <>
                  <div className="table-wrap">
                    <table>
                      <thead><tr>{Object.keys(rows[0]).map(k=><th key={k}>{k}</th>)}</tr></thead>
                      <tbody>{rows.map((r,i)=>(
                        <tr key={i}>{Object.keys(rows[0]).map(k=><td key={k}>{String(r[k])}</td>)}</tr>
                      ))}</tbody>
                    </table>
                  </div>
                  <div className="actions">
                    <button className="btn" onClick={()=>download(`${title.replace(/\s+/g,"_")}.csv`, toCSV(rows))}>Download CSV</button>
                    <button className="btn" onClick={()=>setOpen(false)}>Close</button>
                  </div>
                </>
              )}
              {rows && rows.length===0 && <p>No data.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
