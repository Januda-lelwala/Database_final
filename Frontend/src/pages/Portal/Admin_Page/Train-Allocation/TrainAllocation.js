import React, { useCallback, useEffect, useState } from "react";
import "./trainallocation.css";

const API_BASE = "http://localhost:3000";
const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken")}` };

const extractOrders = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (payload.data?.orders) return payload.data.orders;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.orders) return payload.orders;
  if (payload.data) return Object.values(payload.data);
  return [];
};

const extractTrips = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (payload.data?.trips) return payload.data.trips;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.trips) return payload.trips;
  return [];
};

const formatCapacity = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : "N/A";
};

const formatOrderDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
};

const formatBeginTime = (trip) => {
  if (!trip) return "N/A";
  if (trip.begin_time) {
    return trip.begin_time.substring(0, 5);
  }
  if (trip.depart_time) {
    const date = new Date(trip.depart_time);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  }
  return "N/A";
};

export default function TrainAllocation({
  onGoTruckAssignment,
  onOrderPlaced,
  onTruckSuggested = () => {}
}) {
  const [orders, setOrders] = useState([]);
  const [trips, setTrips] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingTrips, setLoadingTrips] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch(`${API_BASE}/api/orders?status=pending`, { headers: tokenHeader });
      if (!response.ok) {
        throw new Error("Failed to load pending orders.");
      }
      const payload = await response.json();
      setOrders(extractOrders(payload));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const loadTrips = useCallback(async (order) => {
    setSelectedOrder(order);
    setSelectedTrip(null);
    setLoadingTrips(true);

    try {
      const response = await fetch(`${API_BASE}/api/trains/find-trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...tokenHeader },
        body: JSON.stringify({ destination: order.destination_city })
      });

      if (!response.ok) {
        throw new Error("Failed to load trips for the selected destination.");
      }

      const payload = await response.json();
      setTrips(extractTrips(payload));
    } catch (error) {
      console.error("Failed to fetch trips:", error);
      setTrips([]);
    } finally {
      setLoadingTrips(false);
    }
  }, []);

  const assign = useCallback(async () => {
    if (!selectedOrder || !selectedTrip) return;
    setBusy(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/orders/${encodeURIComponent(selectedOrder.order_id)}/assign-train`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...tokenHeader },
          body: JSON.stringify({
            trip_id: selectedTrip.trip_id,
            train_id: selectedTrip.train_id,
            route_id: selectedTrip.route_id
          })
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        const message = payload?.message || payload?.error || "Failed to assign order to train.";
        throw new Error(message);
      }

      const updatedTrip = payload?.data?.trip;
      const recommendedTruckRoute = payload?.data?.recommended_truck_route;
      const truckTask = payload?.data?.truck_task;
      const orderSnapshot = { ...selectedOrder };

      setOrders((prev) => prev.filter((order) => order.order_id !== selectedOrder.order_id));

      if (updatedTrip) {
      setTrips((prev) =>
        prev.map((trip) => {
          const sameTrip =
            (updatedTrip.trip_id && trip.trip_id && trip.trip_id === updatedTrip.trip_id) ||
            (!trip.trip_id && updatedTrip.train_id && trip.train_id === updatedTrip.train_id);
          return sameTrip ? { ...trip, ...updatedTrip, is_provisional: false } : trip;
        })
      );
      }

      setSelectedOrder(null);
      setSelectedTrip(null);
      setTrips([]);
      await fetchOrders();
      onOrderPlaced?.();
      if (recommendedTruckRoute) {
        onTruckSuggested({
          order: orderSnapshot,
          trip: updatedTrip,
          route: recommendedTruckRoute,
          task: truckTask
        });
      } else {
        alert("Order assigned to train successfully.");
      }
    } catch (error) {
      alert(error.message || "Unable to assign order. Please try again.");
    } finally {
      setBusy(false);
    }
  }, [selectedOrder, selectedTrip, onOrderPlaced, fetchOrders, onTruckSuggested]);

  const renderOrders = () => {
    if (loadingOrders) {
      return (
        <tr>
          <td colSpan={5} className="empty">Loading orders...</td>
        </tr>
      );
    }

    if (!orders.length) {
      return (
        <tr>
          <td colSpan={5} className="empty">No pending orders</td>
        </tr>
      );
    }

    return orders.map((order) => {
      const requiredValue = formatCapacity(order.required_space);
      const orderDate = formatOrderDate(order.order_date);
      return (
        <tr key={order.order_id}>
          <td className="mono">{order.order_id}</td>
          <td>{order.destination_city}</td>
          <td>{requiredValue} u</td>
          <td>{orderDate}</td>
          <td>
            <button className="btn" onClick={() => loadTrips(order)}>
              Find Trips
            </button>
          </td>
        </tr>
      );
    });
  };

  const renderTrips = () => {
    if (!selectedOrder) {
      return (
        <tr>
          <td colSpan={5} className="empty">Select an order to view matching trips</td>
        </tr>
      );
    }

    if (loadingTrips) {
      return (
        <tr>
          <td colSpan={5} className="empty">Loading trips...</td>
        </tr>
      );
    }

    if (!trips.length) {
      return (
        <tr>
          <td colSpan={5} className="empty">No trips available</td>
        </tr>
      );
    }

    return trips.map((trip) => {
      const remaining = Number.isFinite(Number(trip.remaining_capacity))
        ? Number(trip.remaining_capacity).toFixed(2)
        : formatCapacity(Number(trip.capacity) - Number(trip.capacity_used || 0));
      const isSelected =
        selectedTrip &&
        selectedTrip.train_id === trip.train_id &&
        (selectedTrip.trip_id || null) === (trip.trip_id || null);
      const displayTrain = trip.is_provisional ? `${trip.train_id} (new)` : trip.train_id;
      const fallbackLabel = trip?.fallback
        ? `⚠ Rail to ${trip.fallback.first_city};`
        : null;
      const rowKey = trip.trip_id || `train-${trip.train_id}`;

      return (
        <tr key={rowKey}>
          <td className="mono">{displayTrain}</td>
          <td>{trip.route_id}</td>
          <td>{formatBeginTime(trip)}</td>
          <td>
            {remaining}
            {fallbackLabel && (
              <>
                <br />
                <small>{fallbackLabel}</small>
              </>
            )}
          </td>
          <td>
            {isSelected ? (
              <button className="btn primary" disabled>
                Selected
              </button>
            ) : (
              <button className="btn" onClick={() => setSelectedTrip(trip)}>
                Select
              </button>
            )}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="trainalloc">
      <h2>Train Allocation</h2>

      <div className="grid">
        <div className="panel">
          <h3>Pending Orders</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Destination</th>
                  <th>Req.</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{renderOrders()}</tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h3>
            Matching Train Trips {selectedOrder ? `-> ${selectedOrder.destination_city}` : ""}
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Train</th>
                  <th>Route</th>
                  <th>Begin</th>
                  <th>Remaining</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{renderTrips()}</tbody>
            </table>
          </div>
          <div className="actions">
            <button
              className="btn"
              disabled={!selectedTrip || busy}
              onClick={assign}
            >
              {busy ? "Assigning..." : "Assign to Train"}
            </button>
          </div>
        </div>
      </div>
      <div className="actions">
        <button className="btn" onClick={onGoTruckAssignment}>
          Go to Truck Assignment
        </button>
      </div>
    </div>
  );
}
