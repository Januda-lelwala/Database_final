import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AssistantDashboard.css';

const AssistantDashboard = () => {
  const { user } = useAuth();
  const [supportTickets, setSupportTickets] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [driverRequests, setDriverRequests] = useState([]);

  useEffect(() => {
    fetchSupportTickets();
    fetchInventoryStatus();
    fetchDriverRequests();
  }, []);

  const fetchSupportTickets = async () => {
    try {
      const sampleTickets = [
        {
          id: 'TKT001',
          customerName: 'Alice Johnson',
          issue: 'Package delivery delay',
          priority: 'high',
          status: 'open',
          assignedDriver: 'John Driver'
        },
        {
          id: 'TKT002',
          customerName: 'Bob Wilson',
          issue: 'Wrong delivery address',
          priority: 'medium',
          status: 'in-progress',
          assignedDriver: 'Jane Driver'
        }
      ];
      setSupportTickets(sampleTickets);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
    }
  };

  const fetchInventoryStatus = async () => {
    try {
      const sampleInventory = [
        {
          id: 'INV001',
          productName: 'Packaging Box (Large)',
          currentStock: 150,
          minStock: 50,
          status: 'adequate'
        },
        {
          id: 'INV002',
          productName: 'Bubble Wrap Roll',
          currentStock: 25,
          minStock: 30,
          status: 'low'
        },
        {
          id: 'INV003',
          productName: 'Shipping Labels',
          currentStock: 500,
          minStock: 100,
          status: 'adequate'
        }
      ];
      setInventory(sampleInventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchDriverRequests = async () => {
    try {
      const sampleRequests = [
        {
          id: 'REQ001',
          driverName: 'John Driver',
          requestType: 'Route Change',
          description: 'Traffic jam on main route',
          timestamp: '10:30 AM',
          status: 'pending'
        },
        {
          id: 'REQ002',
          driverName: 'Jane Driver',
          requestType: 'Vehicle Issue',
          description: 'Tire pressure warning',
          timestamp: '09:15 AM',
          status: 'resolved'
        }
      ];
      setDriverRequests(sampleRequests);
    } catch (error) {
      console.error('Error fetching driver requests:', error);
    }
  };

  const resolveTicket = (ticketId) => {
    setSupportTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: 'resolved' }
          : ticket
      )
    );
  };

  const handleDriverRequest = (requestId, action) => {
    setDriverRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status: action }
          : request
      )
    );
  };

  return (
    <div className="assistant-dashboard">
      <div className="dashboard-header">
        <h1>Assistant Dashboard</h1>
        <div className="assistant-info">
          <span>Welcome, {user?.name}</span>
          <div className="shift-indicator">
            <span className="shift-status active">On Duty</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Support Tickets */}
        <div className="dashboard-card support-tickets">
          <h2>Support Tickets</h2>
          <div className="tickets-list">
            {supportTickets.map(ticket => (
              <div key={ticket.id} className="ticket-item">
                <div className="ticket-header">
                  <span className="ticket-id">{ticket.id}</span>
                  <span className={`priority ${ticket.priority}`}>
                    {ticket.priority}
                  </span>
                </div>
                <h4>{ticket.customerName}</h4>
                <p>{ticket.issue}</p>
                <div className="ticket-details">
                  <span>Driver: {ticket.assignedDriver}</span>
                  <span className={`status ${ticket.status}`}>
                    {ticket.status}
                  </span>
                </div>
                {ticket.status === 'open' && (
                  <button 
                    className="btn-resolve"
                    onClick={() => resolveTicket(ticket.id)}
                  >
                    Resolve Ticket
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Driver Requests */}
        <div className="dashboard-card driver-requests">
          <h2>Driver Requests</h2>
          <div className="requests-list">
            {driverRequests.map(request => (
              <div key={request.id} className="request-item">
                <div className="request-header">
                  <span className="request-id">{request.id}</span>
                  <span className="timestamp">{request.timestamp}</span>
                </div>
                <h4>{request.driverName}</h4>
                <div className="request-type">{request.requestType}</div>
                <p>{request.description}</p>
                {request.status === 'pending' && (
                  <div className="request-actions">
                    <button 
                      className="btn-approve"
                      onClick={() => handleDriverRequest(request.id, 'approved')}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn-deny"
                      onClick={() => handleDriverRequest(request.id, 'denied')}
                    >
                      Deny
                    </button>
                  </div>
                )}
                {request.status !== 'pending' && (
                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="dashboard-card inventory-status">
          <h2>Inventory Status</h2>
          <div className="inventory-list">
            {inventory.map(item => (
              <div key={item.id} className="inventory-item">
                <div className="item-info">
                  <h4>{item.productName}</h4>
                  <div className="stock-info">
                    <span className="current-stock">
                      Current: {item.currentStock}
                    </span>
                    <span className="min-stock">
                      Min: {item.minStock}
                    </span>
                  </div>
                </div>
                <div className={`stock-status ${item.status}`}>
                  {item.status}
                  {item.status === 'low' && (
                    <button className="btn-reorder">Reorder</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assistant Tools */}
        <div className="dashboard-card assistant-tools">
          <h2>Assistant Tools</h2>
          <div className="tools-grid">
            <button className="tool-btn">
              <i className="icon-communication"></i>
              Driver Communication
            </button>
            <button className="tool-btn">
              <i className="icon-reports"></i>
              Generate Reports
            </button>
            <button className="tool-btn">
              <i className="icon-schedule"></i>
              Schedule Management
            </button>
            <button className="tool-btn">
              <i className="icon-maintenance"></i>
              Vehicle Maintenance
            </button>
            <button className="tool-btn">
              <i className="icon-customer"></i>
              Customer Follow-up
            </button>
            <button className="tool-btn">
              <i className="icon-emergency"></i>
              Emergency Protocol
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="dashboard-card metrics">
          <h2>Performance Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-number">28</span>
              <span className="metric-label">Tickets Resolved Today</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">95%</span>
              <span className="metric-label">Driver Satisfaction</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">15</span>
              <span className="metric-label">Active Drivers</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">2.5 min</span>
              <span className="metric-label">Avg Response Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantDashboard;