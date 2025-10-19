// src/pages/Portal/Admin_Page/Employees.js
import React, { useEffect, useState } from "react";
import "./employees.css";

const API_BASE = "http://localhost:3000/api";
const getTokenHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("authToken") || ""}` });

// no credential helpers needed for employee creation
// (removed: deliveryHint helper was unused)

export default function Employees() {
  // NEW: segment state (default to "driver")
  const [tab, setTab] = useState("driver");

  const [drivers, setDrivers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Forms: only requested fields
  const [driverForm, setDriverForm] = useState({
    name: "", address: "", phone_no: "", email: "",
  });
  const [assistantForm, setAssistantForm] = useState({
    name: "", address: "", phone_no: "", email: "",
  });

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const driverRes = await fetch(`${API_BASE}/drivers`, { headers: getTokenHeader() });
      if (driverRes.ok) {
        const driverData = await driverRes.json();
        const drv = Array.isArray(driverData?.data)
          ? driverData.data
          : Array.isArray(driverData?.drivers)
          ? driverData.drivers
          : Array.isArray(driverData)
          ? driverData
          : [];
        setDrivers(drv);
      }
    } catch (err) {
      console.error('Error fetching drivers:', err);
    }

    try {
      const assistantRes = await fetch(`${API_BASE}/assistants`, { headers: getTokenHeader() });
      if (assistantRes.ok) {
        const assistantData = await assistantRes.json();
        const ast = Array.isArray(assistantData?.data)
          ? assistantData.data
          : Array.isArray(assistantData?.assistants)
          ? assistantData.assistants
          : Array.isArray(assistantData)
          ? assistantData
          : [];
        setAssistants(ast);
      }
    } catch (err) {
      console.error('Error fetching assistants:', err);
    }
    setLoading(false);
  };

  // Submit: follow your procedure
  const addDriver = async (e) => {
    e.preventDefault();
    
    if (!driverForm.name.trim()) {
      alert("Please provide driver name");
      return;
    }

    const payload = { 
      name: driverForm.name,
      address: driverForm.address || "",
      phone_no: driverForm.phone_no || "",
      email: driverForm.email || ""
    };

    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/drivers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getTokenHeader() },
        body: JSON.stringify(payload),
      });
      
      const data = await r.json();
      
      if (!r.ok) {
        throw new Error(data.message || 'Failed to add driver');
      }
      
      const created = data?.data || {};
      const credentials = data?.credentials || {};
      const emailStatus = data?.emailStatus;
      const emailLine = emailStatus?.sent
        ? `✓ Email sent to ${created.email}`
        : emailStatus?.reason === 'SMTP_NOT_CONFIGURED' 
        ? `⚠ Email skipped (SMTP not configured)` 
        : `⚠ Email not sent`;
      
      alert(`Driver added successfully!\n\nID: ${created.driver_id || '(see list)'}\nName: ${created.name || driverForm.name}\n\nLogin Credentials:\nUsername: ${credentials.user_name}\nPassword: ${credentials.password}\n\n${emailLine}\n\nPlease save these credentials securely.`);
      setDriverForm({ name: "", address: "", phone_no: "", email: "" });
      fetchEmployees(); // Refresh the list
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addAssistant = async (e) => {
    e.preventDefault();
    
    if (!assistantForm.name.trim()) {
      alert("Please provide assistant name");
      return;
    }

    const payload = {
      name: assistantForm.name,
      address: assistantForm.address || "",
      phone_no: assistantForm.phone_no || "",
      email: assistantForm.email || ""
    };

    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/assistants`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getTokenHeader() },
        body: JSON.stringify(payload),
      });
      
      const data = await r.json();
      
      if (!r.ok) {
        throw new Error(data.message || 'Failed to add assistant');
      }
      
      const created = data?.data || {};
      const credentials = data?.credentials || {};
      const emailStatus = data?.emailStatus;
      const emailLine = emailStatus?.sent
        ? `✓ Email sent to ${created.email}`
        : emailStatus?.reason === 'SMTP_NOT_CONFIGURED' 
        ? `⚠ Email skipped (SMTP not configured)` 
        : `⚠ Email not sent`;
      
      alert(`Assistant added successfully!\n\nID: ${created.assistant_id || '(see list)'}\nName: ${created.name || assistantForm.name}\n\nLogin Credentials:\nUsername: ${credentials.user_name}\nPassword: ${credentials.password}\n\n${emailLine}\n\nPlease save these credentials securely.`);
      setAssistantForm({ name: "", address: "", phone_no: "", email: "" });
      fetchEmployees(); // Refresh the list
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page employees">
      <h2>Employees</h2>

      {/* Segmented toggle */}
      <div className="segmented" role="tablist" aria-label="Employee type">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "driver"}
          className={`seg-btn ${tab === "driver" ? "active" : ""}`}
          onClick={() => setTab("driver")}
        >
          🚚 <span>Driver</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "assistant"}
          className={`seg-btn ${tab === "assistant" ? "active" : ""}`}
          onClick={() => setTab("assistant")}
        >
          🤝 <span>Assistant</span>
        </button>
      </div>

      {/* DRIVER PANEL */}
      {tab === "driver" && (
        <div className="panel">
          <h3>Add Driver</h3>
          <form className="grid" onSubmit={addDriver}>
            <label><span>Name</span>
              <input required value={driverForm.name} onChange={(e)=>setDriverForm(f=>({...f,name:e.target.value}))} />
            </label>
            <label className="full"><span>Address</span>
              <textarea rows={2} value={driverForm.address} onChange={(e)=>setDriverForm(f=>({...f,address:e.target.value}))} />
            </label>
            <label><span>Phone</span>
              <input value={driverForm.phone_no} onChange={(e)=>setDriverForm(f=>({...f,phone_no:e.target.value}))} />
            </label>
            <label><span>Email</span>
              <input type="email" value={driverForm.email} onChange={(e)=>setDriverForm(f=>({...f,email:e.target.value}))} />
            </label>
            <div className="actions full"><button className="btn primary">Add Driver</button></div>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Address</th><th>Phone</th><th>Email</th></tr></thead>
              <tbody>
                {drivers.slice(0,6).map((d,i)=> (
                  <tr key={i}>
                    <td className="mono">{d.driver_id || d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.address || "-"}</td>
                    <td>{d.phone_no || d.phone || "-"}</td>
                    <td>{d.email || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ASSISTANT PANEL */}
      {tab === "assistant" && (
        <div className="panel">
          <h3>Add Assistant</h3>
          <form className="grid" onSubmit={addAssistant}>
            <label><span>Name</span>
              <input required value={assistantForm.name} onChange={(e)=>setAssistantForm(f=>({...f,name:e.target.value}))} />
            </label>
            <label className="full"><span>Address</span>
              <textarea rows={2} value={assistantForm.address} onChange={(e)=>setAssistantForm(f=>({...f,address:e.target.value}))} />
            </label>
            <label><span>Phone</span>
              <input value={assistantForm.phone_no} onChange={(e)=>setAssistantForm(f=>({...f,phone_no:e.target.value}))} />
            </label>
            <label><span>Email</span>
              <input type="email" value={assistantForm.email} onChange={(e)=>setAssistantForm(f=>({...f,email:e.target.value}))} />
            </label>
            <div className="actions full"><button className="btn primary">Add Assistant</button></div>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Address</th><th>Phone</th><th>Email</th></tr></thead>
              <tbody>
                {assistants.slice(0,6).map((a,i)=> (
                  <tr key={i}>
                    <td className="mono">{a.assistant_id || a.id}</td>
                    <td>{a.name}</td>
                    <td>{a.address || "-"}</td>
                    <td>{a.phone_no || a.phone || "-"}</td>
                    <td>{a.email || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}