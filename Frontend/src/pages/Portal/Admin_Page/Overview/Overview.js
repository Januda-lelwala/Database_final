import React, { useEffect, useMemo, useState } from "react";
import "./overview.css";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken")}` };

const extractArray = (data, key) => {
  if (Array.isArray(data)) return data;
  if (data?.data) {
    if (Array.isArray(data.data)) return data.data;
    if (data.data[key]) return data.data[key];
    return Object.values(data.data);
  }
  if (data?.[key]) return data[key];
  return [];
};

export default function Overview({ onGoAllocate, onGoAssignTruck, refreshKey = 0 }) {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [pendingTruckTasks, setPendingTruckTasks] = useState([]);
  const [resources, setResources] = useState({ drivers: 0, assistants: 0, trucks: 0, trains: 0 });

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:3000/api/orders?status=pending", { headers: tokenHeader });
        if (r.ok) {
          const data = await r.json();
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
        console.error("Failed to fetch pending orders:", error);
      }
      setPendingOrders([]);
    })();

    (async () => {
      try {
        const r = await fetch("http://localhost:3000/api/truck-schedule/pending", { headers: tokenHeader });
        if (r.ok) {
          const data = await r.json();
          setPendingTruckTasks(extractArray(data, "tasks"));
        } else {
          setPendingTruckTasks([]);
        }
      } catch (error) {
        console.error("Failed to fetch pending truck tasks:", error);
        setPendingTruckTasks([]);
      }
    })();

    (async () => {
      try {
        const [d, a, t, tr] = await Promise.all([
          fetch("http://localhost:3000/api/drivers", { headers: tokenHeader }),
          fetch("http://localhost:3000/api/assistants", { headers: tokenHeader }),
          fetch("http://localhost:3000/api/trucks", { headers: tokenHeader }),
          fetch("http://localhost:3000/api/trains", { headers: tokenHeader })
        ]);

        const getArrayLength = async (response, key) => {
          if (!response.ok) return 0;
          const data = await response.json();
          const arr = extractArray(data, key);
          return arr.length;
        };

        setResources({
          drivers: await getArrayLength(d, "drivers"),
          assistants: await getArrayLength(a, "assistants"),
          trucks: await getArrayLength(t, "trucks"),
          trains: await getArrayLength(tr, "trains")
        });
      } catch (error) {
        console.error("Failed to fetch resources:", error);
        setResources({ drivers: 0, assistants: 0, trucks: 0, trains: 0 });
      }
    })();
  }, [refreshKey]);

  const combinedOrders = useMemo(() => {
    const normalizedOrders = Array.isArray(pendingOrders)
      ? pendingOrders.map(order => {
          const requiredValue = Number(order.required_space);
          return {
            type: "train",
            order_id: order.order_id,
            customer_name: order.customer_name || order.customer?.name || "Unknown",
            destination: order.destination_city,
            required_space: Number.isFinite(requiredValue) ? requiredValue : null,
            order_date: order.order_date || null
          };
        })
      : [];

    const seen = new Set(normalizedOrders.map(o => o.order_id));

    const normalizedTasks = Array.isArray(pendingTruckTasks)
      ? pendingTruckTasks
          .filter(task => task.status === "pending")
          .map(task => ({
            type: "truck",
            order_id: task.order_id,
            customer_name: task.customer_name || "Awaiting truck",
            destination: task.destination,
            required_space: Number(task.required_space),
            order_date: task.order_date || task.created_at || null
          }))
      : [];

    normalizedTasks.forEach(task => {
      if (!seen.has(task.order_id)) {
        normalizedOrders.push(task);
        seen.add(task.order_id);
      }
    });

    return normalizedOrders;
  }, [pendingOrders, pendingTruckTasks]);

  return (
    <div className="overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="icon" aria-hidden="true">📦</div>
          <div>
            <h3>{combinedOrders.length}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon" aria-hidden="true">🚚</div>
          <div>
            <h3>{resources.trucks}</h3>
            <p>Available Trucks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon" aria-hidden="true">🚆</div>
          <div>
            <h3>{resources.trains}</h3>
            <p>Available Trains</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon">🧑‍✈️</div>
          <div>
            <h3>{resources.drivers + resources.assistants}</h3>
            <p>Total Employees</p>
          </div>
        </div>
      </div>

      <div className="mini-grid">
        <div className="panel">
          <h2>Orders Requiring Allocation</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Destination</th>
                  <th>Req. Space</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(combinedOrders) &&
                  combinedOrders.map(order => {
                    const requiredSpace = Number.isFinite(order.required_space)
                      ? `${order.required_space.toFixed(2)} u`
                      : "N/A";
                    const orderDate = order.order_date ? new Date(order.order_date).toLocaleDateString() : "N/A";
                    const isTruckTask = order.type === "truck";
                    const action = isTruckTask ? onGoAssignTruck : onGoAllocate;
                    const actionLabel = isTruckTask ? "Assign Truck" : "Allocate";

                    return (
                      <tr key={order.order_id}>
                        <td className="mono">{order.order_id}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.destination}</td>
                        <td>{requiredSpace}</td>
                        <td>{orderDate}</td>
                        <td>
                          <button className="btn primary" onClick={action}>
                            {actionLabel}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                {(!combinedOrders || combinedOrders.length === 0) && (
                  <tr>
                    <td colSpan={6} className="empty">
                      No pending orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h2>Available Resources (Now)</h2>
          <ul className="bubbles">
            <li>
              <span className="bubble-label"><span className="bubble-icon" aria-hidden="true">🧑‍✈️</span>Drivers</span>
              <strong>{resources.drivers}</strong>
            </li>
            <li>
              <span className="bubble-label"><span className="bubble-icon" aria-hidden="true">🤝</span>Assistants</span>
              <strong>{resources.assistants}</strong>
            </li>
            <li>
              <span className="bubble-label"><span className="bubble-icon" aria-hidden="true">🚚</span>Trucks</span>
              <strong>{resources.trucks}</strong>
            </li>
            <li>
              <span className="bubble-label"><span className="bubble-icon" aria-hidden="true">🚆</span>Trains</span>
              <strong>{resources.trains}</strong>
            </li>
          </ul>
          <p className="muted small">Tip: Add more in “Add Employees / Trucks / Trains”.</p>
        </div>
      </div>
    </div>
  );
}
