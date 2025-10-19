import React from 'react';
import { Link } from 'react-router-dom';
import './PortalSelection.css';

const PortalSelection = () => {
  return (
    <div className="portal-selection">
      {/* Back to Homepage Button */}
      <Link to="/" className="back-to-home-btn">
        <span className="back-arrow">←</span>
        <span className="back-text">Back to Home</span>
      </Link>
      
      {/* Floating Particles */}
      <div className="floating-particle particle-1"></div>
      <div className="floating-particle particle-2"></div>
      <div className="floating-particle particle-3"></div>
      <div className="floating-particle particle-4"></div>
      <div className="floating-particle particle-5"></div>
      <div className="floating-particle particle-6"></div>
      
      {/* Geometric Shapes */}
      <div className="geometric-shape shape-1"></div>
      <div className="geometric-shape shape-2"></div>
      <div className="geometric-shape shape-3"></div>
      
      <div className="portal-container">
        <h1>KandyPack Portal Access</h1>
        <p>Please select your portal to continue</p>
        
        <div className="portal-cards">
          <div className="portal-card customer-card">
            <div className="card-icon">👤</div>
            <h2>Customer Portal</h2>
            <p>Track orders, manage account, and access customer support</p>
            <Link to="/customer/login" className="portal-btn customer">
              Customer Login
            </Link>
            <div className="card-footer">
              <Link to="/signup">Create New Account</Link>
            </div>
          </div>
          
          <div className="portal-card employee-card">
            <div className="card-icon">💼</div>
            <h2>Employee Portal</h2>
            <p>Access work dashboards, manage assignments, and admin tools</p>
            <Link to="/employee/login" className="portal-btn employee">
              Employee Login
            </Link>
            <div className="card-footer">
              <span>Admin • Driver • Assistant</span>
            </div>
          </div>
        </div>
        
        <div className="portal-info">
          <h3>Portal Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <h4>Customer Portal</h4>
              <ul>
                <li>Order tracking & history</li>
                <li>Account management</li>
                <li>Customer support</li>
                <li>Address & payment management</li>
              </ul>
            </div>
            <div className="feature-item">
              <h4>Employee Portal</h4>
              <ul>
                <li>Driver assignment management</li>
                <li>Assistant support tools</li>
                <li>Admin system oversight</li>
                <li>Performance analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalSelection;