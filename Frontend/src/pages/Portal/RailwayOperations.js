import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const RailwayOperations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Railway stations data
  const [stations] = useState([
    {
      id: 'ST001',
      name: 'Colombo Fort Railway Station',
      code: 'CMB',
      location: 'Colombo 01',
      status: 'operational',
      platforms: 8,
      capacity: 2000,
      currentLoad: 1450,
      facilities: ['Loading Dock', 'Passenger Terminal', 'Cargo Yard', 'Maintenance Shop'],
      coordinates: { lat: 6.9344, lng: 79.8428 }
    },
    {
      id: 'ST002',
      name: 'Kandy Railway Station',
      code: 'KDY',
      location: 'Kandy',
      status: 'operational',
      platforms: 4,
      capacity: 800,
      currentLoad: 520,
      facilities: ['Loading Dock', 'Cargo Yard', 'Tourist Center'],
      coordinates: { lat: 7.2906, lng: 80.6337 }
    },
    {
      id: 'ST003',
      name: 'Galle Railway Station',
      code: 'GLE',
      location: 'Galle',
      status: 'operational',
      platforms: 3,
      capacity: 600,
      currentLoad: 380,
      facilities: ['Loading Dock', 'Port Connection', 'Cargo Yard'],
      coordinates: { lat: 6.0535, lng: 80.2210 }
    },
    {
      id: 'ST004',
      name: 'Jaffna Railway Station',
      code: 'JAF',
      location: 'Jaffna',
      status: 'maintenance',
      platforms: 2,
      capacity: 400,
      currentLoad: 0,
      facilities: ['Loading Dock', 'Basic Cargo'],
      coordinates: { lat: 9.6615, lng: 80.0255 }
    }
  ]);

  // Train schedules data
  const [trainSchedules] = useState([
    {
      id: 'TR001',
      trainNumber: 'TE-001',
      route: 'Colombo - Kandy',
      type: 'cargo',
      departure: '08:00',
      arrival: '12:30',
      status: 'on-time',
      capacity: '500 tons',
      currentLoad: '420 tons',
      stops: ['Colombo Fort', 'Rambukkana', 'Peradeniya', 'Kandy']
    },
    {
      id: 'TR002',
      trainNumber: 'TE-002',
      route: 'Colombo - Galle',
      type: 'mixed',
      departure: '14:00',
      arrival: '18:45',
      status: 'delayed',
      capacity: '300 tons',
      currentLoad: '280 tons',
      stops: ['Colombo Fort', 'Mount Lavinia', 'Kalutara', 'Bentota', 'Galle']
    },
    {
      id: 'TR003',
      trainNumber: 'TE-003',
      route: 'Kandy - Jaffna',
      type: 'cargo',
      departure: '06:00',
      arrival: '16:00',
      status: 'cancelled',
      capacity: '600 tons',
      currentLoad: '0 tons',
      stops: ['Kandy', 'Dambulla', 'Anuradhapura', 'Vavuniya', 'Jaffna']
    }
  ]);

  // Navigation handler
  const handleNavigation = (tab) => {
    navigate(`/employee/admin/${tab}`);
    setSidebarOpen(false);
  };

  // Get active tab
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('analytics')) return 'analytics';
    if (path.includes('drivers')) return 'drivers';
    if (path.includes('routes')) return 'routes';
    if (path.includes('tracking')) return 'tracking';
    if (path.includes('orders')) return 'orders';
    if (path.includes('warehouses')) return 'warehouses';
    if (path.includes('inventory')) return 'inventory';
    if (path.includes('railway')) return 'railway';
    if (path.includes('assistants')) return 'assistants';
    return 'overview';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'operational': return 'status-badge delivered';
      case 'maintenance': return 'status-badge pending';
      case 'offline': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };

  const getTrainStatusClass = (status) => {
    switch (status) {
      case 'on-time': return 'status-badge delivered';
      case 'delayed': return 'status-badge pending';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };

  const activeTab = getActiveTab();

  const renderSidebar = () => (
    <>
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">KP</div>
          <div className="sidebar-brand">
            <h1>KandyPack</h1>
            <p>Supply Chain</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Dashboard</div>
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleNavigation('overview')}
            >
              <span className="nav-item-icon">📊</span>
              <span className="nav-item-text">Overview</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => handleNavigation('analytics')}
            >
              <span className="nav-item-icon">📈</span>
              <span className="nav-item-text">Analytics</span>
            </button>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Fleet Management</div>
            <button 
              className={`nav-item ${activeTab === 'drivers' ? 'active' : ''}`}
              onClick={() => handleNavigation('drivers')}
            >
              <span className="nav-item-icon">🚛</span>
              <span className="nav-item-text">Fleet & Drivers</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'railway' ? 'active' : ''}`}
              onClick={() => handleNavigation('railway')}
            >
              <span className="nav-item-icon">🚄</span>
              <span className="nav-item-text">Railway Operations</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'routes' ? 'active' : ''}`}
              onClick={() => handleNavigation('routes')}
            >
              <span className="nav-item-icon">🛤️</span>
              <span className="nav-item-text">Routes & Scheduling</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'tracking' ? 'active' : ''}`}
              onClick={() => handleNavigation('tracking')}
            >
              <span className="nav-item-icon">📍</span>
              <span className="nav-item-text">Live Tracking</span>
            </button>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Operations</div>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleNavigation('orders')}
            >
              <span className="nav-item-icon">📦</span>
              <span className="nav-item-text">Shipments</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'warehouses' ? 'active' : ''}`}
              onClick={() => handleNavigation('warehouses')}
            >
              <span className="nav-item-icon">🏭</span>
              <span className="nav-item-text">Warehouses</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => handleNavigation('inventory')}
            >
              <span className="nav-item-icon">📋</span>
              <span className="nav-item-text">Inventory</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'assistants' ? 'active' : ''}`}
              onClick={() => handleNavigation('assistants')}
            >
              <span className="nav-item-icon">🤝</span>
              <span className="nav-item-text">Staff</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );

  const renderHeader = () => (
    <div className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <div>
          <h1 className="header-title">Railway Operations</h1>
          <p className="header-subtitle">
            Manage railway stations, train schedules, and cargo operations
          </p>
        </div>
      </div>
      
      <div className="header-right">
        <button 
          className="btn-primary"
          onClick={() => setShowScheduleModal(true)}
        >
          🚄 Schedule Train
        </button>
      </div>
    </div>
  );

  const renderStationsOverview = () => (
    <div className="stations-overview">
      <h2 className="section-title">Railway Stations</h2>
      <div className="stations-grid">
        {stations.map(station => (
          <div 
            key={station.id} 
            className="station-card"
            onClick={() => setSelectedStation(station)}
          >
            <div className="station-header">
              <div className="station-info">
                <h3>{station.name}</h3>
                <span className="station-code">{station.code}</span>
              </div>
              <span className={getStatusBadgeClass(station.status)}>
                {station.status}
              </span>
            </div>
            
            <div className="station-details">
              <div className="detail-item">
                <span className="detail-label">📍 Location:</span>
                <span className="detail-value">{station.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">🚉 Platforms:</span>
                <span className="detail-value">{station.platforms}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📊 Utilization:</span>
                <span className="detail-value">
                  {Math.round((station.currentLoad / station.capacity) * 100)}%
                </span>
              </div>
            </div>
            
            <div className="utilization-bar">
              <div 
                className="utilization-fill" 
                style={{ width: `${(station.currentLoad / station.capacity) * 100}%` }}
              ></div>
            </div>
            
            <div className="station-facilities">
              {station.facilities.map((facility, index) => (
                <span key={index} className="facility-tag">{facility}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrainSchedules = () => (
    <div className="train-schedules">
      <h2 className="section-title">Train Schedules</h2>
      <div className="schedules-table-container">
        <table className="schedules-table">
          <thead>
            <tr>
              <th>Train Number</th>
              <th>Route</th>
              <th>Type</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Load</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainSchedules.map(schedule => (
              <tr key={schedule.id}>
                <td className="train-number">🚄 {schedule.trainNumber}</td>
                <td>
                  <div className="route-info">
                    <div className="route-name">{schedule.route}</div>
                    <div className="route-stops">
                      Stops: {schedule.stops.length} stations
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`transport-badge ${schedule.type === 'cargo' ? 'rail' : 'road'}`}>
                    {schedule.type}
                  </span>
                </td>
                <td className="time-cell">{schedule.departure}</td>
                <td className="time-cell">{schedule.arrival}</td>
                <td>
                  <div className="load-info">
                    <div className="current-load">{schedule.currentLoad}</div>
                    <div className="capacity">of {schedule.capacity}</div>
                  </div>
                </td>
                <td>
                  <span className={getTrainStatusClass(schedule.status)}>
                    {schedule.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action view" title="View Details">👁️</button>
                    <button className="btn-action edit" title="Edit Schedule">✏️</button>
                    <button className="btn-action track" title="Track Train">📍</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRailwayMetrics = () => (
    <div className="railway-metrics">
      <h2 className="section-title">Railway Performance Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🚄</div>
          <div className="metric-content">
            <h3>Active Trains</h3>
            <div className="metric-value">12</div>
            <div className="metric-change up">↗️ +2 from yesterday</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🚉</div>
          <div className="metric-content">
            <h3>Operational Stations</h3>
            <div className="metric-value">3/4</div>
            <div className="metric-change down">⚠️ 1 under maintenance</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <h3>Cargo Transported</h3>
            <div className="metric-value">1,240 tons</div>
            <div className="metric-change up">↗️ +15% this week</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>On-Time Performance</h3>
            <div className="metric-value">92%</div>
            <div className="metric-change up">↗️ +3% improvement</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🛤️</div>
          <div className="metric-content">
            <h3>Track Utilization</h3>
            <div className="metric-value">78%</div>
            <div className="metric-change neutral">→ Steady</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">⛽</div>
          <div className="metric-content">
            <h3>Fuel Efficiency</h3>
            <div className="metric-value">2.8 L/ton-km</div>
            <div className="metric-change up">↗️ 8% more efficient</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStationModal = () => {
    if (!selectedStation) return null;

    return (
      <div className="modal-overlay" onClick={() => setSelectedStation(null)}>
        <div className="modal-content station-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{selectedStation.name}</h3>
            <button className="modal-close" onClick={() => setSelectedStation(null)}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="station-detail-grid">
              <div className="detail-section">
                <h4>Station Information</h4>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-label">Station Code:</span>
                    <span className="detail-value">{selectedStation.code}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{selectedStation.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={getStatusBadgeClass(selectedStation.status)}>
                      {selectedStation.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Platforms:</span>
                    <span className="detail-value">{selectedStation.platforms}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Capacity & Utilization</h4>
                <div className="capacity-chart">
                  <div className="capacity-bar">
                    <div 
                      className="capacity-fill"
                      style={{ width: `${(selectedStation.currentLoad / selectedStation.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <div className="capacity-text">
                    {selectedStation.currentLoad} / {selectedStation.capacity} tons
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Available Facilities</h4>
                <div className="facilities-list">
                  {selectedStation.facilities.map((facility, index) => (
                    <div key={index} className="facility-item">
                      <span className="facility-icon">✓</span>
                      <span className="facility-name">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setSelectedStation(null)}>Close</button>
            <button className="btn-primary">Manage Station</button>
          </div>
        </div>
      </div>
    );
  };

  const renderScheduleModal = () => {
    if (!showScheduleModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Schedule New Train</h3>
            <button className="modal-close" onClick={() => setShowScheduleModal(false)}>×</button>
          </div>
          
          <div className="modal-body">
            <form className="schedule-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Train Number</label>
                  <input type="text" className="form-control" placeholder="e.g., TE-004" />
                </div>
                <div className="form-group">
                  <label>Train Type</label>
                  <select className="form-control">
                    <option>Cargo</option>
                    <option>Mixed (Cargo + Passenger)</option>
                    <option>Passenger</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Origin Station</label>
                  <select className="form-control">
                    <option>Colombo Fort Railway Station</option>
                    <option>Kandy Railway Station</option>
                    <option>Galle Railway Station</option>
                    <option>Jaffna Railway Station</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Destination Station</label>
                  <select className="form-control">
                    <option>Kandy Railway Station</option>
                    <option>Galle Railway Station</option>
                    <option>Jaffna Railway Station</option>
                    <option>Colombo Fort Railway Station</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Departure Time</label>
                  <input type="time" className="form-control" />
                </div>
                <div className="form-group">
                  <label>Expected Duration (hours)</label>
                  <input type="number" className="form-control" placeholder="e.g., 4.5" />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Cargo Capacity (tons)</label>
                  <input type="number" className="form-control" placeholder="e.g., 500" />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="form-control">
                    <option>Standard</option>
                    <option>High</option>
                    <option>Express</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Intermediate Stops</label>
                <textarea className="form-control" rows="3" placeholder="Enter intermediate stations (one per line)"></textarea>
              </div>
            </form>
          </div>
          
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</button>
            <button className="btn-primary">Schedule Train</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {renderSidebar()}
      
      <div className="dashboard-main">
        {renderHeader()}
        
        <div className="dashboard-content">
          {renderRailwayMetrics()}
          {renderStationsOverview()}
          {renderTrainSchedules()}
        </div>
      </div>
      
      {renderStationModal()}
      {renderScheduleModal()}
    </div>
  );
};

export default RailwayOperations;