import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // State management
  const [currentView, setCurrentView] = useState('overview');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [systemStats, setSystemStats] = useState({});

  // Mock data for demonstration - in real app, fetch from API
  useEffect(() => {
    // Fetch pending orders that need allocation
    setPendingOrders([
      {
        order_id: 'ORD001',
        customer_name: 'John Doe',
        destination_city: 'Colombo',
        order_date: '2025-10-02',
        required_space: 12.5,
        status: 'confirmed'
      },
      {
        order_id: 'ORD002', 
        customer_name: 'Jane Smith',
        destination_city: 'Galle',
        order_date: '2025-10-03',
        required_space: 8.2,
        status: 'confirmed'
      }
    ]);

    // System statistics
    setSystemStats({
      totalPendingOrders: 15,
      totalTrains: 2,
      totalTrucks: 2,
      availableDrivers: 2,
      availableAssistants: 2,
      totalCapacityUtilization: 67
    });
  }, []);

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
              {pendingOrders.map(order => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.destination_city}</td>
                  <td>{order.required_space} units</td>
                  <td>{order.order_date}</td>
                  <td>
                    <button 
                      className="allocate-btn"
                      onClick={() => handleAllocateOrder(order.order_id)}
                    >
                      Allocate
                    </button>
                  </td>
                </tr>
              ))}
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
          <h3>Available Trains</h3>
          <div className="train-card">
            <h4>Train TR100</h4>
            <p>Capacity: 200.0 units</p>
            <p>Route: Kandy → Colombo</p>
            <p>Available Space: 200.0 units</p>
            <button className="schedule-btn">Schedule Trip</button>
          </div>
          <div className="train-card">
            <h4>Train TR200</h4>
            <p>Capacity: 150.0 units</p>
            <p>Route: Kandy → Galle</p>
            <p>Available Space: 150.0 units</p>
            <button className="schedule-btn">Schedule Trip</button>
          </div>
        </div>
      </div>
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
              <div className="truck-card">
                <h4>Truck TK01 (WP-1234)</h4>
                <p>Capacity: 60.0 units</p>
                <p>Status: Available</p>
              </div>
              <div className="truck-card">
                <h4>Truck TK02 (WP-5678)</h4>
                <p>Capacity: 60.0 units</p>
                <p>Status: Available</p>
              </div>
            </div>
          </div>
          
          <div className="resource-section">
            <h3>Available Drivers</h3>
            <div className="driver-list">
              <div className="driver-card">
                <h4>John Driver (DRV001)</h4>
                <p>Weekly Hours: 0/40</p>
                <p>Status: Available</p>
              </div>
              <div className="driver-card">
                <h4>Jane Transport (DRV002)</h4>
                <p>Weekly Hours: 0/40</p>
                <p>Status: Available</p>
              </div>
            </div>
          </div>
          
          <div className="resource-section">
            <h3>Available Assistants</h3>
            <div className="assistant-list">
              <div className="assistant-card">
                <h4>Sarah Support (AST001)</h4>
                <p>Weekly Hours: 0/60</p>
                <p>Status: Available</p>
              </div>
              <div className="assistant-card">
                <h4>David Logistics (AST002)</h4>
                <p>Weekly Hours: 0/60</p>
                <p>Status: Available</p>
              </div>
            </div>
          </div>
        </div>
        
        <button className="create-schedule-btn">Create New Schedule</button>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="reports-section">
      <h2>System Reports & Analytics</h2>
      <div className="report-cards">
        <div className="report-card">
          <h3>📊 Quarterly Sales Report</h3>
          <p>Revenue and space volume analysis</p>
          <button className="generate-btn">Generate Report</button>
        </div>
        
        <div className="report-card">
          <h3>🚂 Train Utilization Report</h3>
          <p>Train capacity and efficiency metrics</p>
          <button className="generate-btn">Generate Report</button>
        </div>
        
        <div className="report-card">
          <h3>🚛 Truck Performance Report</h3>
          <p>Truck usage and delivery performance</p>
          <button className="generate-btn">Generate Report</button>
        </div>
        
        <div className="report-card">
          <h3>👥 Worker Hours Report</h3>
          <p>Driver and assistant working hours</p>
          <button className="generate-btn">Generate Report</button>
        </div>
        
        <div className="report-card">
          <h3>🏙️ City-wise Sales Report</h3>
          <p>Sales performance by destination</p>
          <button className="generate-btn">Generate Report</button>
        </div>
        
        <div className="report-card">
          <h3>📦 Top Products Report</h3>
          <p>Most ordered items analysis</p>
          <button className="generate-btn">Generate Report</button>
        </div>
      </div>
    </div>
  );

  const handleAllocateOrder = (orderId) => {
    alert(`Allocating order ${orderId} - This will open the allocation wizard`);
    // In real implementation, this would open a modal for train/truck allocation
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`admin-dashboard ${theme}`}>
      <div className="dashboard-header">
        <div className="header-left">
          <h1>🚂 Rail & Road Distribution Control Center</h1>
          <p>Welcome, {user?.name || 'Administrator'}</p>
        </div>
        <div className="header-right">
          <button onClick={toggleTheme} className="theme-btn">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <nav className="nav-menu">
            <button 
              className={currentView === 'overview' ? 'active' : ''}
              onClick={() => setCurrentView('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={currentView === 'trains' ? 'active' : ''}
              onClick={() => setCurrentView('trains')}
            >
              🚂 Train Allocation
            </button>
            <button 
              className={currentView === 'trucks' ? 'active' : ''}
              onClick={() => setCurrentView('trucks')}
            >
              🚛 Truck Scheduling
            </button>
            <button 
              className={currentView === 'reports' ? 'active' : ''}
              onClick={() => setCurrentView('reports')}
            >
              📈 Reports & Analytics
            </button>
          </nav>
        </div>

        <div className="main-content">
          {currentView === 'overview' && renderOverview()}
          {currentView === 'trains' && renderTrainAllocation()}
          {currentView === 'trucks' && renderTruckScheduling()}
          {currentView === 'reports' && renderReports()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;