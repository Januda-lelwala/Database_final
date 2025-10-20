import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../context/CheckoutContext';
import axios from 'axios';

export default function CheckoutDetails() {
  const navigate = useNavigate();
  const {
    destinationCity,
    setDestinationCity,
    destinationAddress,
    setDestinationAddress,
    deliveryDate,
    setDeliveryDate,
  } = useCheckout();

  const [availableCities, setAvailableCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

  // Fetch available delivery cities from the database
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/routes/cities');
        if (response.data.success) {
          setAvailableCities(response.data.data.cities);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setIsLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Initialize search term from context
  useEffect(() => {
    if (destinationCity) {
      setSearchTerm(destinationCity.charAt(0).toUpperCase() + destinationCity.slice(1));
    }
  }, [destinationCity]);

  // Filter cities based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = availableCities.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(availableCities);
    }
  }, [searchTerm, availableCities]);

  // Helper: get today's date in yyyy-mm-dd
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
  const minDateStr = minDate.toISOString().split('T')[0];

  const canContinue =
    destinationCity.trim().length > 0 &&
    destinationAddress.trim().length > 0 &&
    deliveryDate &&
    deliveryDate >= minDateStr;

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setDestinationCity(value.trim());
    setShowDropdown(true);
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
    setSearchTerm(capitalizedCity);
    setDestinationCity(city);
    setShowDropdown(false);
  };

  // Handle input focus
  const handleFocus = () => {
    setShowDropdown(true);
  };

  // Handle blur (with delay to allow click on dropdown)
  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div style={styles.card} className="cc-card">
      <h3 style={styles.title}>Delivery Details</h3>
      {isLoadingCities && (
        <div style={{ color: '#666', marginBottom: 12 }}>Loading available cities...</div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <label style={styles.label}>Destination City *</label>
          <input
            className="cc-input"
            style={styles.input}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Type to search cities..."
            disabled={isLoadingCities}
            autoComplete="off"
          />
          {showDropdown && filteredCities.length > 0 && (
            <div style={styles.dropdown}>
              {filteredCities.slice(0, 10).map((city) => (
                <div
                  key={city}
                  style={styles.dropdownItem}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur
                    handleCitySelect(city);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9ff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </div>
              ))}
              {filteredCities.length > 10 && (
                <div style={{ ...styles.dropdownItem, color: '#888', fontStyle: 'italic' }}>
                  + {filteredCities.length - 10} more cities...
                </div>
              )}
            </div>
          )}
          {showDropdown && searchTerm && filteredCities.length === 0 && (
            <div style={styles.dropdown}>
              <div style={{ ...styles.dropdownItem, color: '#999' }}>
                No cities found matching "{searchTerm}"
              </div>
            </div>
          )}
          {!isLoadingCities && availableCities.length > 0 && !showDropdown && (
            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
              {availableCities.length} cities available for delivery
            </div>
          )}
        </div>
        <div>
          <label style={styles.label}>Destination Address</label>
          <input className="cc-input" style={styles.input} value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)} placeholder="Street, City, Postal Code" />
        </div>
        <div>
          <label style={styles.label}>Delivery Date</label>
          <input
            type="date"
            className="cc-input"
            style={styles.input}
            value={deliveryDate}
            min={minDateStr}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            Must be at least 7 days from today
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button
          className="cc-btn cc-btn-primary"
          disabled={!canContinue}
          onClick={() => navigate('/checkout/payment')}
          style={{ ...styles.nextBtn, ...(canContinue ? {} : styles.disabled) }}
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { margin: '0 auto', maxWidth: 900, background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
  title: { marginTop: 0 },
  label: { display: 'block', fontSize: 12, color: '#4a5568', marginBottom: 6, fontWeight: '600' },
  input: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    maxHeight: '300px',
    overflowY: 'auto',
    background: 'white',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000
  },
  dropdownItem: {
    padding: '10px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #f1f5f9',
    transition: 'background 0.2s',
    fontSize: '14px'
  },
  nextBtn: { background: '#22c55e', color: 'white', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  disabled: { opacity: 0.5, cursor: 'not-allowed' },
};
