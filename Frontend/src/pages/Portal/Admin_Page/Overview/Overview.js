import React, { useEffect, useState } from "react";
import "./overview.css";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken")}` };

export default function Overview({ onGoAllocate, refreshKey = 0 }) {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [resources, setResources] = useState({ drivers: 0, assistants: 0, trucks: 0, trains: 0 });

  useEffect(() => {
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

    // Stats are calculated from actual fetched data (pending orders, trucks, trains)
    // No backend /api/system-stats endpoint needed

    // pending orders
    (async () => {
      try {
        const r = await fetch("http://localhost:3000/api/orders?status=pending", { headers: tokenHeader });
        if (r.ok) {
          const data = await r.json();
          
          // Handle multiple response formats
          let ordersArray = [];
          
          if (Array.isArray(data)) {
            ordersArray = data;
          } else if (data.data) {
            if (Array.isArray(data.data)) {
              ordersArray = data.data;
            } else if (data.data.orders) {
              ordersArray = data.data.orders;
            } else {
              ordersArray = Object.values(data.data);
            }
          } else if (data.orders) {
            ordersArray = data.orders;
          }
          
          setPendingOrders(ordersArray);
          return;
        }
      } catch (error) {
        console.error('Failed to fetch pending orders:', error);
        // Only set fallback if fetch failed
        setPendingOrders([]);
      }
    })();

    // quick counts
    (async () => {
      try {
        const [d, a, t, tr] = await Promise.all([
          fetch("http://localhost:3000/api/drivers", { headers: tokenHeader }),
          fetch("http://localhost:3000/api/assistants", { headers: tokenHeader }),
          fetch("http://localhost:3000/api/trucks", { headers: tokenHeader }),
          fetch("http://localhost:3000/api/trains", { headers: tokenHeader }),
        ]);
        
        const getArrayLength = async (response, key) => {
          if (!response.ok) return 0;
          const data = await response.json();
          const arr = extractArray(data, key);
          return arr.length;
        };
        
        setResources({
          drivers: await getArrayLength(d, 'drivers'),
          assistants: await getArrayLength(a, 'assistants'),
          trucks: await getArrayLength(t, 'trucks'),
          trains: await getArrayLength(tr, 'trains'),
        });
      } catch (error) {
        console.error('Failed to fetch resources:', error);
        setResources({ drivers: 0, assistants: 0, trucks: 0, trains: 0 });
      }
    })();
  }, [refreshKey]);

  return (
    <div className="overview">
      <div className="stats-grid">
        <div className="stat-card"><div className="icon">📋</div><div><h3>{pendingOrders.length}</h3><p>Pending Orders</p></div></div>
        <div className="stat-card"><div className="icon">🚛</div><div><h3>{resources.trucks}</h3><p>Available Trucks</p></div></div>
        <div className="stat-card"><div className="icon">🚂</div><div><h3>{resources.trains}</h3><p>Available Trains</p></div></div>
        <div className="stat-card"><div className="icon">👥</div><div><h3>{resources.drivers + resources.assistants}</h3><p>Total Employees</p></div></div>
      </div>

      <div className="mini-grid">
        <div className="panel">
          <h2>Orders Requiring Allocation</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Destination</th><th>Req. Space</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {Array.isArray(pendingOrders) && pendingOrders.map(o => {
                  const customerName = o.customer_name || o.customer?.name || 'Unknown';
                  const destination = o.destination_city;
                  const requiredValue = Number(o.required_space);
                  const requiredSpace = Number.isFinite(requiredValue) ? `${requiredValue.toFixed(2)} u` : 'N/A';
                  const orderDate = o.order_date ? new Date(o.order_date).toLocaleDateString() : 'N/A';
                  return (
                    <tr key={o.order_id}>
                      <td className="mono">{o.order_id}</td>
                      <td>{customerName}</td>
                      <td>{destination}</td>
                      <td>{requiredSpace}</td>
                      <td>{orderDate}</td>
                      <td><button className="btn primary" onClick={onGoAllocate}>Allocate</button></td>
                    </tr>
                  );
                })}
                {(!pendingOrders || pendingOrders.length === 0) && <tr><td colSpan={6} className="empty">No pending orders</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h2>Available Resources (Now)</h2>
          <ul className="bubbles">
            <li><span>Drivers</span><strong>{resources.drivers}</strong></li>
            <li><span>Assistants</span><strong>{resources.assistants}</strong></li>
            <li><span>Trucks</span><strong>{resources.trucks}</strong></li>
            <li><span>Trains</span><strong>{resources.trains}</strong></li>
          </ul>
          <p className="muted small">Tip: Add more in “Add Employees / Trucks / Trains”.</p>
        </div>
      </div>
    </div>
  );
}
