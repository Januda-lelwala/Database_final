import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../context/CheckoutContext';

export default function CheckoutDetails() {
  const navigate = useNavigate();
  const { destinationCity, setDestinationCity, destinationAddress, setDestinationAddress } = useCheckout();

  const canContinue = destinationCity.trim().length > 0 && destinationAddress.trim().length > 0;

  return (
    <div style={styles.card} className="cc-card">
      <h3 style={styles.title}>Delivery Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
        <div>
          <label style={styles.label}>Destination City</label>
          <input className="cc-input" style={styles.input} value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} placeholder="e.g., Colombo" />
        </div>
        <div>
          <label style={styles.label}>Destination Address</label>
          <input className="cc-input" style={styles.input} value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)} placeholder="Street, City, Postal Code" />
        </div>
      </div>
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <button className="cc-btn cc-btn-primary" disabled={!canContinue} onClick={() => navigate('/checkout/payment')} style={{ ...styles.nextBtn, ...(canContinue ? {} : styles.disabled) }}>Continue to Payment →</button>
      </div>
    </div>
  );
}

const styles = {
  card: { margin: '0 auto', maxWidth: 900, background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' },
  title: { marginTop: 0 },
  label: { display: 'block', fontSize: 12, color: '#4a5568', marginBottom: 6 },
  input: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' },
  nextBtn: { background: '#22c55e', color: 'white', border: 'none', borderRadius: 8, padding: '10px 16px' },
  disabled: { opacity: 0.5, cursor: 'not-allowed' },
};
