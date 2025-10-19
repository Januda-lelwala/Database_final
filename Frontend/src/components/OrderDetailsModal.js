import React, { useState } from 'react';

export default function OrderDetailsModal({ order, open, onClose, onCancel }) {
  React.useEffect(() => {
    setSelectedReason('');
  }, [order, open]);
  // Common cancellation reasons
  const commonReasons = [
    'Ordered by mistake',
    'Found a better price elsewhere',
    'No longer need the items',
    'Delay in delivery',
    'Change in requirements',
    'Other'
  ];
  const [selectedReason, setSelectedReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset cancel UI and selected reason when a new order is opened
  React.useEffect(() => {
    setShowCancel(false);
    setCancelReason('');
    setSelectedReason('');
    setError('');
    setSubmitting(false);
  }, [order, open]);

  if (!open || !order) return null;

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      setError('Please provide a reason for cancellation.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onCancel(order.id, cancelReason);
      setShowCancel(false);
      setCancelReason('');
    } catch (e) {
      setError(e.message || 'Failed to cancel order.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for date formatting
  const formatDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    if (isNaN(d)) return '—';
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Items rendering
  const items = Array.isArray(order.items) ? order.items : [];

  // Helper for formatting price
  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return '—';
    return `LKR ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Get placed date: prefer order.order_date, then order.created_at (from database)
  const placedDate = order.order_date || order.created_at || null;

  // Format date as 'dd MMM yyyy, HH:mm' (no seconds)
  const formatPlacedDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    if (isNaN(d)) return '—';
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Get total value: prefer order.total_value, then order.total, else sum items
  let totalValue = null;
  if (typeof order.total_value === 'number') {
    totalValue = order.total_value;
  } else if (typeof order.total === 'number') {
    totalValue = order.total;
  } else if (items.length > 0) {
    totalValue = items.reduce((sum, item) => {
      const price = Number(item.unit_price) || Number(item.price) || 0;
      const qty = Number(item.quantity) || Number(item.qty) || 0;
      return sum + price * qty;
    }, 0);
  }

  // Helper for formatting total value as LKR
  const formatTotalValue = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return '—';
    return `LKR ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={modernStyles.modal} onClick={e => e.stopPropagation()}>
        <div style={modernStyles.header}>
          <h2 style={modernStyles.title}>Order Details</h2>
          <button style={modernStyles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <div style={modernStyles.body}>
          <div style={modernStyles.section}>
            <div style={modernStyles.row}><span style={modernStyles.label}>Order ID:</span> <span style={modernStyles.value}>{order.id}</span></div>
            <div style={modernStyles.row}><span style={modernStyles.label}>Status:</span> <span style={modernStyles.value}>{order.status}</span></div>
            <div style={modernStyles.row}><span style={modernStyles.label}>Placed At:</span> <span style={modernStyles.value}>{formatPlacedDate(placedDate)}</span></div>
            <div style={modernStyles.row}><span style={modernStyles.label}>Total:</span> <span style={modernStyles.value}>{
              totalValue !== null ? formatTotalValue(totalValue) : '—'
            }</span></div>
          </div>
          <div style={modernStyles.divider} />
          <div style={modernStyles.section}>
            <div style={modernStyles.itemsTitle}>Items:</div>
            {items.length > 0 ? (
              <ul style={modernStyles.itemsList}>
                {items.map((item, idx) => {
                  const price = Number(item.unit_price) || Number(item.price) || Number(item.total_price) || 0;
                  const qty = Number(item.quantity) || Number(item.qty) || 0;
                  return (
                    <li key={idx} style={modernStyles.itemLine}>
                      <span style={modernStyles.itemName}>{item.product_name || item.name || item.title || 'Item'}</span>
                      <span style={modernStyles.itemQty}>× {qty}</span>
                      <span style={{ marginLeft: 12, color: '#6366f1', fontWeight: 500 }}>{formatPrice(price)}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div style={modernStyles.noItems}>No items</div>
            )}
          </div>
          {order.status === 'Processing' && !showCancel && (
            <button style={modernStyles.cancelBtn} onClick={() => setShowCancel(true)}>
              Cancel Order
            </button>
          )}
          {showCancel && (
            <div style={modernStyles.cancelBox}>
              <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: '#1e293b', display: 'block' }}>
                Reason for cancellation
              </label>
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <select
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 10,
                    border: '2px solid #e2e8f0',
                    fontSize: 16,
                    fontWeight: 500,
                    background: 'linear-gradient(90deg, #f8fafc 80%, #eef2ff 100%)',
                    color: selectedReason ? '#334155' : '#64748b',
                    appearance: 'none',
                    boxShadow: '0 4px 16px rgba(102,126,234,0.07)',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  value={selectedReason}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  onMouseOver={e => e.target.style.borderColor = '#6366f1'}
                  onMouseOut={e => e.target.style.borderColor = '#e2e8f0'}
                  onChange={e => {
                    setSelectedReason(e.target.value);
                    if (e.target.value !== 'Other') {
                      setCancelReason(e.target.value);
                    } else {
                      setCancelReason('');
                    }
                  }}
                  disabled={submitting}
                >
                  <option value="" disabled>
                    Select a reason...
                  </option>
                  {commonReasons.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <span style={{
                  position: 'absolute',
                  right: 18,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  fontSize: 22,
                  color: '#6366f1',
                  textShadow: '0 2px 8px #e0e7ff',
                  fontWeight: 700,
                  letterSpacing: '-1px',
                }}>▼</span>
              </div>
              {selectedReason === 'Other' && (
                <textarea
                  style={modernStyles.textarea}
                  placeholder="Type your reason..."
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  disabled={submitting}
                />
              )}
              {error && <div style={modernStyles.error}>{error}</div>}
              <div style={modernStyles.cancelActions}>
                <button style={modernStyles.confirmBtn} onClick={handleCancel} disabled={submitting}>
                  {submitting ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
                <button style={modernStyles.cancelBtn} onClick={()=>{setShowCancel(false);setError('');}} disabled={submitting}>
                  Back
                </button>
              </div>
            </div>
          )}
          {order.status === 'Cancelled' && order.cancelReason && (
            <div style={modernStyles.cancelInfo}>
              <b>Cancelled:</b> {order.cancelReason}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.18)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center' },
};

const modernStyles = {
  ...styles,
  modal: { background:'#fff',borderRadius:20,minWidth:340,maxWidth:440,boxShadow:'0 8px 32px rgba(0,0,0,0.18)',padding:'32px 28px 24px 28px',position:'relative',animation:'fadeIn 0.2s', width:'100%' },
  header: { display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18 },
  title: { fontSize:30, fontWeight:800, margin:0, color:'#1e293b', letterSpacing:'-1px' },
  closeBtn: { background:'none',border:'none',fontSize:26,cursor:'pointer',color:'#64748b',lineHeight:1 },
  body: { fontSize:17,color:'#334155',paddingTop:0 },
  section: { marginBottom:18 },
  row: { display:'flex',justifyContent:'flex-start',alignItems:'center',marginBottom:6 },
  label: { fontWeight:600, minWidth:90, color:'#334155', fontSize:16 },
  value: { fontWeight:500, color:'#475569', fontSize:16 },
  divider: { height:1, background:'#e2e8f0', margin:'18px 0 18px 0', border:'none' },
  itemsTitle: { fontWeight:700, fontSize:17, marginBottom:8, color:'#1e293b' },
  itemsList: { listStyle:'none',padding:0,margin:0 },
  itemLine: { display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid #f1f5f9',fontSize:16 },
  itemName: { fontWeight:500, color:'#334155' },
  itemQty: { fontWeight:600, color:'#6366f1', marginLeft:8 },
  noItems: { color:'#64748b', fontStyle:'italic', fontSize:15, margin:'8px 0' },
  cancelBtn: { background:'#f87171',color:'#fff',border:'none',borderRadius:8,padding:'12px 28px',fontWeight:700,cursor:'pointer',fontSize:17,marginTop:22,marginRight:8,transition:'background 0.2s' },
  confirmBtn: { background:'#6366f1',color:'#fff',border:'none',borderRadius:8,padding:'12px 28px',fontWeight:700,cursor:'pointer',fontSize:17,transition:'background 0.2s' },
  cancelBox: { marginTop:20,background:'#f3f4f6',borderRadius:12,padding:16 },
  textarea: { width:'100%',minHeight:60,borderRadius:8,border:'1px solid #cbd5e1',padding:10,fontSize:16,resize:'vertical',marginBottom:8 },
  error: { color:'#ef4444',marginTop:4,fontSize:15 },
  cancelActions: { display:'flex',gap:12,marginTop:8 },
  cancelInfo: { marginTop:18,background:'#fee2e2',borderRadius:8,padding:12,color:'#b91c1c',fontWeight:600,fontSize:16 },
};
