import React, { useState, useEffect, useMemo } from 'react';
import OrderDetailsModal from '../../components/OrderDetailsModal';
import { ordersAPI } from '../../services/ordersAPI';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { customersAPI, productsAPI } from '../../services/api';
import { APP_VERSION } from '../../config/constants';
import { Bell, HelpCircle, Search, ChevronDown, User as UserIcon, Settings, LogOut, ShoppingCart } from 'lucide-react';

const CustomerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [trackingState, setTrackingState] = useState({ status: 'idle', order: null, error: null });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadIds, setUnreadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customerNotifUnread') || '[]'); } catch { return []; }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [productResults, setProductResults] = useState([]);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [avatarHover, setAvatarHover] = useState(false);

  // Modal state for order details
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handler for opening order details modal
  const handleOpenOrderModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };
  const handleCloseOrderModal = () => setModalOpen(false);

  // Cancel order handler
  const handleCancelOrder = async (orderId, reason) => {
    await ordersAPI.cancelOrder(orderId, reason);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled', cancelReason: reason } : o));
    setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: 'Cancelled', cancelReason: reason } : prev);
    setModalOpen(false);
  };
  useEffect(() => {
    const styleId = 'customer-page-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes fadeInContent {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  // Close menus when clicking outside of header controls
  useEffect(() => {
    const onDocClick = (e) => {
      const target = e.target;
      // If clicking inside dropdowns or the triggers, skip
      const isDropdown = target.closest && (target.closest('[data-dropdown="notif"]') || target.closest('[data-dropdown="user"]'));
      const isTrigger = target.closest && (target.closest('[data-trigger="notif"]') || target.closest('[data-trigger="user"]'));
      if (isDropdown || isTrigger) return;
      // Otherwise close both
      if (notifOpen) setNotifOpen(false);
      if (userMenuOpen) setUserMenuOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [notifOpen, userMenuOpen]);

  // Stable display values to avoid flicker during hydration
  // Memoize localStorage user snapshot to keep a stable reference across renders
  const storedUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  }, []);
  const displaySnapshot = (() => {
    try { return JSON.parse(localStorage.getItem('userDisplay') || 'null'); } catch { return null; }
  })();
  // Build a stable display name using multiple possible keys
  const displayName = useMemo(() => {
    const nameFromCtx = user?.name || user?.fullName || user?.displayName;
    const nameFromStorage = storedUser?.name || storedUser?.fullName || storedUser?.displayName || storedUser?.user?.name;
    const nameFromSnapshot = displaySnapshot?.name || displaySnapshot?.displayName;
    const firstLast = [
      storedUser?.first_name ?? storedUser?.firstName ?? storedUser?.user?.first_name ?? storedUser?.user?.firstName,
      storedUser?.last_name ?? storedUser?.lastName ?? storedUser?.user?.last_name ?? storedUser?.user?.lastName
    ].filter(Boolean).join(' ');
    const username = user?.username || storedUser?.username || storedUser?.user?.username;
    return nameFromCtx || nameFromStorage || nameFromSnapshot || firstLast || username || 'Customer';
  }, [user, storedUser, displaySnapshot]);
  const displayCompany = useMemo(() => (
    user?.company_name || storedUser?.company_name || storedUser?.company || storedUser?.user?.company_name || displaySnapshot?.company_name || user?.company || 'Wholesale Distributor'
  ), [user, storedUser, displaySnapshot]);

  const initials = (displayName)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userDisplay');
    } catch {}
    navigate('/customer/login');
  };

  // URL-driven tabs: derive active tab from pathname and navigate on click
  const location = useLocation();
  const getActiveTabFromPath = () => {
    const match = location.pathname.match(/\/customer\/?(.*)?$/);
    const seg = (match?.[1] || '').split('/')[0];
    const allowed = ['dashboard', 'current', 'history', 'tracking', 'support'];
    if (!seg) return 'dashboard';
    return allowed.includes(seg) ? seg : 'dashboard';
  };
  const activeTab = getActiveTabFromPath();
  const goTab = (id) => navigate(`/customer/${id === 'dashboard' ? '' : id}`);

  // Persist a minimal display snapshot for resilient header labels
  useEffect(() => {
    const safeName = (displayName && displayName !== 'Customer') ? displayName : null;
    const safeCompany = (displayCompany && displayCompany !== 'Wholesale Distributor') ? displayCompany : null;
    if (safeName || safeCompany) {
      try {
        localStorage.setItem('userDisplay', JSON.stringify({ name: safeName, company_name: safeCompany }));
      } catch {}
    }
  }, [displayName, displayCompany]);

  // Build notifications from orders (status updates)
  useEffect(() => {
    // Create summary notifications for each order based on status
    const notifs = orders.map((o) => ({
      id: `${o.id}:${o.status}`,
      orderId: o.id,
      title: `Order ${o.id} ${o.status}`,
      detail: o.status === 'Delivered' ? `Delivered to ${o.delivery_city}` : `Status: ${o.status}`,
      date: o.order_date,
      status: o.status
    }));
    setNotifications(notifs);
  }, [orders]);

  // Persist unread set
  useEffect(() => {
    try { localStorage.setItem('customerNotifUnread', JSON.stringify(unreadIds)); } catch {}
  }, [unreadIds]);

  const toggleNotif = () => {
    // Open notifications and ensure profile menu is closed
    setUserMenuOpen(false);
    setNotifOpen((v) => !v);
  };
  const markAllRead = () => {
    // Mark all current notifications as read
    const allIds = notifications.map((n) => n.id);
    const storedRead = (() => {
      try { return new Set(JSON.parse(localStorage.getItem('customerNotifRead') || '[]')); } catch { return new Set(); }
    })();
    allIds.forEach((id) => storedRead.add(id));
    try { localStorage.setItem('customerNotifRead', JSON.stringify(Array.from(storedRead))); } catch {}
    setUnreadIds([]);
    // Immediate localStorage update for instant feedback
    try { localStorage.setItem('customerNotifUnread', JSON.stringify([])); } catch {}
  };
  const markOneRead = (nid) => {
    // Add to read set
    const storedRead = (() => {
      try { return new Set(JSON.parse(localStorage.getItem('customerNotifRead') || '[]')); } catch { return new Set(); }
    })();
    storedRead.add(nid);
    try { localStorage.setItem('customerNotifRead', JSON.stringify(Array.from(storedRead))); } catch {}
    setUnreadIds((prev) => {
      const next = prev.filter((id) => id !== nid);
      // Immediate localStorage update for instant feedback
      try { localStorage.setItem('customerNotifUnread', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Mark only truly new notifications as unread (ones not in storage)
  useEffect(() => {
    if (notifications.length === 0) return;
    const storedRead = (() => {
      try { return new Set(JSON.parse(localStorage.getItem('customerNotifRead') || '[]')); } catch { return new Set(); }
    })();
    const currentIds = notifications.map((n) => n.id);
    const newUnread = currentIds.filter((nid) => !storedRead.has(nid));
    // Only update if there are truly new IDs not already read
    setUnreadIds((prev) => {
      const merged = new Set(prev);
      newUnread.forEach((nid) => merged.add(nid));
      // Remove any that have been explicitly marked read
      storedRead.forEach((rid) => merged.delete(rid));
      return Array.from(merged);
    });
  }, [notifications]);

  // Search: compute results when query or orders change
  useEffect(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (q.length < 2) {
      setSearchResults([]);
      setProductResults([]);
      return;
    }
    const inText = (v) => (v || '').toString().toLowerCase().includes(q);
    const results = orders.filter((o) => {
      if (inText(o.id)) return true;
      if (inText(o.status)) return true;
      if (inText(o.delivery_city)) return true;
      if (inText(o.route)) return true;
      if (Array.isArray(o.items) && o.items.some((it) => inText(it.name) || inText(it.product_name))) return true;
      return false;
    }).slice(0, 8);
    setSearchResults(results);
    // Fetch product matches (debounced effect kept simple)
    (async () => {
      try {
        const res = await productsAPI.search(q);
        const list = res.data?.data?.products || res.data?.products || [];
        setProductResults(list.slice(0, 5));
      } catch (err) {
        setProductResults([]);
      }
    })();
  }, [searchQuery, orders]);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);
  const clearSearch = () => { setSearchQuery(''); setSearchResults([]); closeSearch(); };
  const goTrackOrder = (id) => {
    setTrackingId(id);
    setSearchOpen(false);
    navigate('/customer/tracking');
  };
  const goProductsSearch = (q) => {
    setSearchOpen(false);
    navigate(`/products?q=${encodeURIComponent(q)}`);
  };
  
  // Compute a stable customerId from context and storage
  const customerId = useMemo(() => {
    const readStored = () => {
      try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    };
    const latestStored = readStored();
    let cid =
      user?.customer_id || user?.id || user?.user_id || user?.customerId || user?.customerID ||
      latestStored?.customer_id || latestStored?.id || latestStored?.user_id || latestStored?.customerId || latestStored?.customerID ||
      latestStored?.user?.customer_id || latestStored?.user?.id || latestStored?.user?.user_id || latestStored?.user?.customerId || latestStored?.user?.customerID ||
      storedUser?.customer_id || storedUser?.id || storedUser?.user_id || storedUser?.customerId || storedUser?.customerID ||
      storedUser?.user?.customer_id || storedUser?.user?.id || storedUser?.user?.user_id || storedUser?.user?.customerId || storedUser?.user?.customerID;
    if (!cid && user?.role === 'customer' && user?.id) cid = user.id;
    if (!cid && storedUser?.role === 'customer' && storedUser?.id) cid = storedUser.id;
    if (!cid) {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const parts = token.split('.');
          if (parts.length >= 2) {
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const json = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            const payload = JSON.parse(json);
            cid = payload?.id || payload?.customer_id || cid;
          }
        }
      } catch {}
    }
    return cid || null;
  }, [user, storedUser]);

  // Load orders from API when customerId becomes available
  useEffect(() => {
    if (!customerId) return;
    const statusToProgress = (status) => {
      const s = (status || '').toLowerCase();
      if (s.includes('delivered')) return 100;
      if (s.includes('in_transit') || s.includes('in transit')) return 75;
      if (s.includes('scheduled') || s.includes('confirmed')) return 50;
      if (s.includes('pending') || s.includes('processing')) return 25;
      if (s.includes('cancel')) return 0;
      return 10;
    };

    const fetchOrders = async () => {
      setLoading(true);
      try {
        console.log('[CustomerPage] Using customerId:', customerId);
        let list = [];
        if (customerId) {
          const res = await customersAPI.getOrdersByCustomer(customerId, { limit: 50 });
          list = res.data?.data?.orders || res.data?.orders || [];
          console.log('[CustomerPage] Orders fetched:', list);
        } else {
          list = [];
          console.warn('[CustomerPage] No customer_id found, cannot fetch orders.');
        }
        const mapped = list.map((o) => {
          const id = o.order_id || o.id || `ORD_${Math.random().toString(36).slice(2, 8)}`;
          const statusRaw = o.status || o.order_status || 'pending';
          const statusMap = {
            pending: 'Processing',
            confirmed: 'Processing',
            scheduled: 'Scheduled',
            in_transit: 'In Transit',
            delivered: 'Delivered',
            cancelled: 'Cancelled'
          };
          const norm = (statusRaw || '').toString().toLowerCase();
          const normKey = norm.replace(/\s+/g, '_');
          const status = statusMap[normKey] || statusMap[norm] || (statusRaw?.charAt(0).toUpperCase() + statusRaw?.slice(1)) || 'Processing';

          return {
            id,
            customer_id: o.customer_id,
            status,
            transport_mode: o.transport_mode || 'Rail',
            route: o.route || (o.destination_city ? `→ ${o.destination_city}` : '—'),
            items: Array.isArray(o.items)
              ? o.items
              : Array.isArray(o.orderItems)
                ? o.orderItems.map((it) => ({
                    product_id: it.product_id,
                    product_name: it.product?.name || it.product_name || 'Item',
                    name: it.product?.name || it.product_name || 'Item',
                    quantity: it.quantity,
                    unit_price: it.unit_price
                  }))
                : [],
            total_space: (() => {
              if (Number.isFinite(o.required_space)) return o.required_space;
              if (Number.isFinite(o.total_space)) return o.total_space;
              if (Array.isArray(o.orderItems)) {
                return o.orderItems.reduce((sum, it) => {
                  const perUnit = Number(
                    it.product?.space_consumption ??
                    it.space_consumption ??
                    it.spaceConsumption ??
                    it.space_per_unit ??
                    it.space
                  );
                  const qty = Number(it.quantity);
                  if (Number.isFinite(perUnit) && Number.isFinite(qty)) {
                    return sum + perUnit * qty;
                  }
                  return sum;
                }, 0);
              }
              return 0;
            })(),
            total_value: (() => {
              if (typeof o.total_amount === 'number') return o.total_amount;
              if (typeof o.total_value === 'number') return o.total_value;
              if (Array.isArray(o.orderItems)) {
                return o.orderItems.reduce((sum, it) => sum + (Number(it.unit_price) || 0) * (Number(it.quantity) || 0), 0);
              }
              return 0;
            })(),
            order_date: o.order_date || o.created_at || null,
            created_at: o.created_at || o.order_date || null,
            estimated_delivery: o.estimated_delivery || '—',
            actual_delivery: o.delivered_at || o.actual_delivery || null,
            // Progress is derived from DB-reported status only (no client-side simulation)
            progress: statusToProgress(norm),
            delivery_city: o.destination_city || o.city || '—',
            destination_address: o.destination_address || o.address || '',
            train_assignment: o.train_assignment || null,
            truck_assignment: o.truck_assignment || null,
            customer_notes: o.customer_notes || ''
          };
        });
  setOrders(mapped);
  console.log('[CustomerPage] setOrders called with:', mapped);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  // Auto-updates removed: status/progress strictly reflect database values

  // Calculate business statistics
  const stats = useMemo(() => {
  const totalOrders = orders.length;
  const activeDeliveries = orders.filter(o => ['In Transit', 'Processing', 'Scheduled'].includes(o.status)).length;
    const totalOrderValue = orders.reduce((sum, order) => sum + order.total_value, 0);
    const railDeliveries = orders.filter(o => o.transport_mode === 'Rail').length;
    const averageDeliveryTime = orders.filter(o => o.actual_delivery)
      .reduce((sum, order) => {
        const orderDate = new Date(order.order_date);
        const deliveryDate = new Date(order.actual_delivery);
        return sum + (deliveryDate - orderDate) / (1000 * 60 * 60 * 24);
      }, 0) / orders.filter(o => o.actual_delivery).length || 0;

  return { totalOrders, activeDeliveries, totalOrderValue, railDeliveries, averageDeliveryTime };
  }, [orders]);

  // Filter orders by status
  const currentOrders = orders.filter(o => ['In Transit', 'Processing', 'Scheduled'].includes(o.status));
  const pastOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));

  // Get status style
  const getStatusStyle = (status) => {
    const styles = {
      'Processing': { backgroundColor: '#f39c12', color: 'white' },
      'In Transit': { backgroundColor: '#3498db', color: 'white' },
      'Delivered': { backgroundColor: '#27ae60', color: 'white' },
      'Scheduled': { backgroundColor: '#9b59b6', color: 'white' },
      'Cancelled': { backgroundColor: '#e74c3c', color: 'white' }
    };
    return styles[status] || { backgroundColor: '#95a5a6', color: 'white' };
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div style={styles.dashboardGrid}>
      {/* Statistics Cards */}
      <div style={styles.statsContainer}>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
            const icon = e.currentTarget.querySelector('.stat-icon');
            if (icon) icon.style.transform = 'rotate(5deg) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(233, 236, 239, 0.8)';
            const icon = e.currentTarget.querySelector('.stat-icon');
            if (icon) icon.style.transform = 'rotate(0deg) scale(1)';
          }}
        >
          <div style={styles.statGlow}></div>
          <div className="stat-icon" style={styles.statIcon}>📦</div>
          <div style={styles.statContent}>
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
            <small>LKR {stats.totalOrderValue?.toLocaleString()}</small>
          </div>
        </div>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
            const icon = e.currentTarget.querySelector('.stat-icon');
            if (icon) icon.style.transform = 'rotate(5deg) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(233, 236, 239, 0.8)';
            const icon = e.currentTarget.querySelector('.stat-icon');
            if (icon) icon.style.transform = 'rotate(0deg) scale(1)';
          }}
        >
          <div style={styles.statGlow}></div>
          <div className="stat-icon" style={styles.statIcon}>🚚</div>
          <div style={styles.statContent}>
            <h3>{stats.activeDeliveries}</h3>
            <p>Active Deliveries</p>
            <small>In pipeline</small>
          </div>
        </div>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
            const icon = e.currentTarget.querySelector('.stat-icon');
            if (icon) icon.style.transform = 'rotate(5deg) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(233, 236, 239, 0.8)';
            const icon = e.currentTarget.querySelector('.stat-icon');
            if (icon) icon.style.transform = 'rotate(0deg) scale(1)';
          }}
        >
          <div style={styles.statGlow}></div>
          <div className="stat-icon" style={styles.statIcon}>🚂</div>
          <div style={styles.statContent}>
            <h3>{stats.railDeliveries}</h3>
            <p>Rail Deliveries</p>
            <small>Cost-efficient</small>
          </div>
        </div>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
            const icon = e.currentTarget.querySelector('.stat-icon');
            if (icon) icon.style.transform = 'rotate(5deg) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = 'rgba(233, 236, 239, 0.8)';
            const icon = e.currentTarget.querySelector('.stat-icon');
            if (icon) icon.style.transform = 'rotate(0deg) scale(1)';
          }}
        >
          <div style={styles.statGlow}></div>
          <div className="stat-icon" style={styles.statIcon}>⏱️</div>
          <div style={styles.statContent}>
            <h3>{stats.averageDeliveryTime?.toFixed(1)}</h3>
            <p>Avg. Days</p>
            <small>Delivery time</small>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.actionsSection}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionButtons}>
          <button 
            style={hoveredAction === 'order' ? { ...styles.actionBtn, ...styles.actionBtnHover } : styles.actionBtn}
            onMouseEnter={() => setHoveredAction('order')}
            onMouseLeave={() => setHoveredAction(null)}
            onClick={() => navigate('/products')}
          >
            {hoveredAction === 'order' && <div style={styles.actionGlow} />}
            <span style={styles.actionIcon}>🛒</span>
            <div>
              <div style={styles.actionTitle}>Place New Order</div>
              <div style={styles.actionDesc}>FMCG products catalog</div>
            </div>
          </button>
          <button 
            style={hoveredAction === 'track' ? { ...styles.actionBtn, ...styles.actionBtnHover } : styles.actionBtn}
            onMouseEnter={() => setHoveredAction('track')}
            onMouseLeave={() => setHoveredAction(null)}
            onClick={() => setShowTrackingModal(true)}
          >
            {hoveredAction === 'track' && <div style={styles.actionGlow} />}
            <span style={styles.actionIcon}>📍</span>
            <div>
              <div style={styles.actionTitle}>Track Delivery</div>
              <div style={styles.actionDesc}>Real-time order tracking</div>
            </div>
          </button>
          <button 
            style={hoveredAction === 'support' ? { ...styles.actionBtn, ...styles.actionBtnHover } : styles.actionBtn}
            onMouseEnter={() => setHoveredAction('support')}
            onMouseLeave={() => setHoveredAction(null)}
            onClick={() => navigate('/customer/support')}
          >
            {hoveredAction === 'support' && <div style={styles.actionGlow} />}
            <span style={styles.actionIcon}>💬</span>
            <div>
              <div style={styles.actionTitle}>Get Support</div>
              <div style={styles.actionDesc}>Customer service</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div style={styles.ordersSection}>
        <h3 style={styles.sectionTitle}>Recent Orders</h3>
        {orders.length > 0 ? (
          <div style={styles.ordersList}>
            {orders.slice(0, 3).map(order => (
              <OrderCard key={order.id} order={order} onClick={() => handleOpenOrderModal(order)} />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🧾</div>
            <h4>No Orders Yet</h4>
            <p>When you place your first order, it will appear here.</p>
            <button style={styles.primaryBtn} onClick={() => navigate('/products')}>
              Place Your First Order
            </button>
          </div>
        )}
        <OrderDetailsModal
          order={selectedOrder}
          open={modalOpen}
          onClose={handleCloseOrderModal}
          onCancel={handleCancelOrder}
        />
      </div>
    </div>
  );

  // Helper to format date for OrderCard
  const formatOrderDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    if (isNaN(d)) return '—';
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Order Card Component
  const OrderCard = React.memo(({ order, onClick }) => (
    <div
      style={styles.orderCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        e.currentTarget.style.borderColor = '#667eea';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#e9ecef';
      }}
      onClick={onClick ? () => onClick(order) : undefined}
      tabIndex={0}
      role="button"
      aria-label={`View details for order ${order.id}`}
    >
      <div style={styles.orderGlow}></div>
      <div style={styles.orderHeader}>
        <div>
          <span style={styles.orderId}>{order.id}</span>
          <span style={styles.orderDate}>{formatOrderDate(order.order_date || order.created_at)}</span>
        </div>
        <span style={{ ...styles.orderStatus, ...getStatusStyle(order.status) }}>
          {order.status}
        </span>
      </div>
      
      <div style={styles.orderDetails}>
        <div style={styles.orderInfo}>
          <div style={styles.transportMode}>
            <span style={styles.modeIcon}>
              {order.transport_mode === 'Rail' ? '🚂' : '🚛'}
            </span>
            <span>{order.transport_mode === 'Rail' ? 'Rail (Train Route)' : (order.transport_mode || '—')} • {order.route || '—'}</span>
          </div>
          
          <div style={styles.orderItems}>
            {Array.isArray(order.items) && order.items.slice(0, 2).map((item, index) => (
              <span key={index} style={styles.itemTag}>
                {(item.product_name || item.name || 'Item')} × {item.quantity ?? '?'}
              </span>
            ))}
            {Array.isArray(order.items) && order.items.length > 2 && (
              <span style={styles.moreItems}>+{order.items.length - 2} more</span>
            )}
          </div>
          
          <div style={styles.orderMeta}>
            <span>Space: {order.total_space} units</span>
            <span>Value: LKR {order.total_value?.toLocaleString()}</span>
            <span>City: {order.delivery_city}</span>
          </div>

          {order.train_assignment && (
            <div style={styles.assignmentInfo}>
              <small>Train: {order.train_assignment.trip_id} • Dep: {order.train_assignment.departure}</small>
            </div>
          )}
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${order.progress}%` }}></div>
          </div>
          <span style={styles.progressText}>
            {order.status === 'Delivered' ? 'Delivered' : `${order.progress}%`}
          </span>
          <div style={styles.eta}>
            {order.status === 'Delivered' ? (order.actual_delivery || '—') : `ETA: ${order.estimated_delivery || '—'}`}
          </div>
        </div>
      </div>
    </div>
  ));

  // Render Current Orders
  const renderCurrentOrders = () => (
    <div style={styles.ordersSection}>
      <h3 style={styles.sectionTitle}>Active Deliveries • {currentOrders.length} In Progress</h3>
      <div style={styles.ordersList}>
        {currentOrders.map(order => (
          <OrderCard key={order.id} order={order} onClick={handleOpenOrderModal} />
        ))}
        {currentOrders.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h4>No Active Orders</h4>
            <p>You don't have any orders in progress</p>
            <button style={styles.primaryBtn} onClick={() => navigate('/products')}>
              Place Your First Order
            </button>
          </div>
        )}
      </div>
      <OrderDetailsModal
        order={selectedOrder}
        open={modalOpen}
        onClose={handleCloseOrderModal}
        onCancel={handleCancelOrder}
      />
    </div>
  );

  // Render Order History
  const renderOrderHistory = () => {
    const deliveredCount = pastOrders.filter(o => o.status === 'Delivered').length;
    const cancelledCount = pastOrders.filter(o => o.status === 'Cancelled').length;
    
    return (
      <div style={styles.ordersSection}>
        <h3 style={styles.sectionTitle}>
          Order History • {deliveredCount} Delivered{cancelledCount > 0 ? `, ${cancelledCount} Cancelled` : ''}
        </h3>
        <div style={styles.ordersList}>
          {pastOrders.map(order => (
            <OrderCard key={order.id} order={order} onClick={handleOpenOrderModal} />
          ))}
          {pastOrders.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📋</div>
              <h4>No Order History</h4>
              <p>Your completed and cancelled orders will appear here</p>
            </div>
          )}
        </div>
        <OrderDetailsModal
          order={selectedOrder}
          open={modalOpen}
          onClose={handleCloseOrderModal}
          onCancel={handleCancelOrder}
        />
      </div>
    );
  };

  // Render Delivery Tracking
  const renderDeliveryTracking = () => {
    const statusToProgress = (status) => {
      const s = (status || '').toLowerCase();
      if (s.includes('delivered')) return 100;
      if (s.includes('in_transit') || s.includes('in transit')) return 75;
      if (s.includes('scheduled') || s.includes('confirmed')) return 50;
      if (s.includes('pending') || s.includes('processing')) return 25;
      if (s.includes('cancel')) return 0;
      return 10;
    };

    const mapOrder = (o) => {
      if (!o) return null;
      const statusRaw = o.status || o.order_status || 'pending';
      const statusMap = {
        pending: 'Processing',
        confirmed: 'Processing',
        scheduled: 'Scheduled',
        in_transit: 'In Transit',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      };
      const norm = (statusRaw || '').toString().toLowerCase();
      const normKey = norm.replace(/\s+/g, '_');
      const status = statusMap[normKey] || statusMap[norm] || (statusRaw?.charAt(0).toUpperCase() + statusRaw?.slice(1)) || 'Processing';

      return {
        id: o.order_id || o.id,
        customer_id: o.customer_id,
        status,
        transport_mode: o.transport_mode || 'Rail',
        route: o.route || (o.destination_city ? `→ ${o.destination_city}` : '—'),
        items: Array.isArray(o.orderItems)
          ? o.orderItems.map((it) => ({
              product_id: it.product_id,
              product_name: it.product?.name || it.product_name || 'Item',
              name: it.product?.name || it.product_name || 'Item',
              quantity: it.quantity,
              unit_price: it.unit_price
            }))
          : Array.isArray(o.items) ? o.items : [],
        total_space: (() => {
          if (Number.isFinite(o.required_space)) return o.required_space;
          if (Number.isFinite(o.total_space)) return o.total_space;
          if (Array.isArray(o.orderItems)) {
            return o.orderItems.reduce((sum, it) => {
              const perUnit = Number(
                it.product?.space_consumption ??
                it.space_consumption ??
                it.spaceConsumption ??
                it.space_per_unit ??
                it.space
              );
              const qty = Number(it.quantity);
              if (Number.isFinite(perUnit) && Number.isFinite(qty)) {
                return sum + perUnit * qty;
              }
              return sum;
            }, 0);
          }
          return 0;
        })(),
        total_value: (() => {
          if (typeof o.total_amount === 'number') return o.total_amount;
          if (typeof o.total_value === 'number') return o.total_value;
          if (Array.isArray(o.orderItems)) {
            return o.orderItems.reduce((sum, it) => sum + (Number(it.unit_price) || 0) * (Number(it.quantity) || 0), 0);
          }
          return 0;
        })(),
        order_date: (() => {
          const od = o.order_date || o.created_at;
          const d = od ? new Date(od) : null;
          return d && !isNaN(d) ? d.toISOString().split('T')[0] : '—';
        })(),
        estimated_delivery: o.estimated_delivery || '—',
        actual_delivery: o.delivered_at || o.actual_delivery || null,
        progress: statusToProgress(norm),
        delivery_city: o.destination_city || o.city || '—',
        destination_address: o.destination_address || o.address || '',
        train_assignment: o.train_assignment || null,
        truck_assignment: o.truck_assignment || null,
        customer_notes: o.customer_notes || ''
      };
    };

    const doTrack = async () => {
      const id = (trackingId || '').trim();
      if (!id) return;
      // If already loaded in current orders, use it
      const local = orders.find((o) => (o.id || '').toLowerCase() === id.toLowerCase());
      if (local) {
        setTrackingState({ status: 'success', order: local, error: null });
        return;
      }
      try {
        setTrackingState({ status: 'loading', order: null, error: null });
        const res = await ordersAPI.getById(id);
        const apiOrder = res.data?.data?.order || res.data?.order || res.data;
        if (!apiOrder) throw new Error('Invalid response');
        const mapped = mapOrder(apiOrder);
        setTrackingState({ status: 'success', order: mapped, error: null });
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to fetch order';
        setTrackingState({ status: 'error', order: null, error: msg });
      }
    };

    return (
      <div style={styles.ordersSection}>
        <h3 style={styles.sectionTitle}>Delivery Tracking</h3>
        <div style={styles.trackingContainer}>
          <div style={styles.trackingInput}>
            <input
              style={styles.input}
              placeholder="Enter Order ID (e.g., ORD007)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') doTrack(); }}
            />
            <button style={styles.primaryBtn} onClick={doTrack} disabled={!trackingId.trim()}>
              {trackingState.status === 'loading' ? 'Tracking…' : 'Track Delivery'}
            </button>
          </div>

          {trackingId && (
            <div style={styles.trackingResult}>
              {trackingState.status === 'error' && (
                <div style={styles.trackingNotFound}>
                  <div style={styles.statusIcon}>❌</div>
                  <h4>Unable to fetch order</h4>
                  <p>{trackingState.error}</p>
                </div>
              )}

              {trackingState.status !== 'error' && (() => {
                const order = trackingState.order || orders.find(o => (o.id || '').toLowerCase() === (trackingId || '').toLowerCase());
                if (!order) {
                  return (
                    <div style={styles.trackingNotFound}>
                      <div style={styles.statusIcon}>ℹ️</div>
                      <h4>Enter a valid Order ID</h4>
                      <p>We couldn't find order: {trackingId}</p>
                    </div>
                  );
                }

                return (
                  <div style={styles.trackingDetails}>
                    <div style={styles.trackingHeader}>
                      <h4>Order {order.id}</h4>
                      <span style={{ ...styles.orderStatus, ...getStatusStyle(order.status) }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={styles.trackingTimeline}>
                      <div style={styles.timelineStep}>
                        <div style={styles.timelineDot}></div>
                        <div style={styles.timelineContent}>
                          <strong>Order Placed</strong>
                          <p>{order.order_date}</p>
                        </div>
                      </div>

                      <div style={styles.timelineStep}>
                        <div style={{
                          ...styles.timelineDot,
                          ...(order.progress >= 25 ? styles.timelineDotActive : {})
                        }}></div>
                        <div style={styles.timelineContent}>
                          <strong>Processing</strong>
                          <p>Quality check & packaging</p>
                        </div>
                      </div>

                      {order.train_assignment && (
                        <div style={styles.timelineStep}>
                          <div style={{
                            ...styles.timelineDot,
                            ...(order.progress >= 50 ? styles.timelineDotActive : {})
                          }}></div>
                          <div style={styles.timelineContent}>
                            <strong>Rail Transport</strong>
                            <p>Train {order.train_assignment.trip_id}</p>
                            <small>Departs: {order.train_assignment.departure}</small>
                          </div>
                        </div>
                      )}

                      <div style={styles.timelineStep}>
                        <div style={{
                          ...styles.timelineDot,
                          ...(order.progress >= 75 ? styles.timelineDotActive : {})
                        }}></div>
                        <div style={styles.timelineContent}>
                          <strong>Last-Mile Delivery</strong>
                          {order.truck_assignment ? (
                            <p>Truck {order.truck_assignment.truck_id} • Driver: {order.truck_assignment.driver}</p>
                          ) : (
                            <p>Awaiting truck assignment</p>
                          )}
                        </div>
                      </div>

                      <div style={styles.timelineStep}>
                        <div style={{
                          ...styles.timelineDot,
                          ...(order.progress === 100 ? styles.timelineDotActive : {})
                        }}></div>
                        <div style={styles.timelineContent}>
                          <strong>Delivered</strong>
                          {order.actual_delivery ? (
                            <p>Completed on {order.actual_delivery}</p>
                          ) : (
                            <p>Estimated: {order.estimated_delivery}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Support
  const renderSupport = () => (
    <div style={styles.ordersSection}>
      <h3 style={styles.sectionTitle}>Customer Support</h3>
      <div style={styles.supportGrid}>
        <div style={styles.supportCard}>
          <h4>📞 Contact Information</h4>
          <div style={styles.contactInfo}>
            <p><strong>Kandypack Head Office</strong></p>
            <p>Kandy, Sri Lanka</p>
            <p>Phone: +94 81 234 5678</p>
            <p>Email: support@kandypack.lk</p>
            <p>Business Hours: 8:00 AM - 6:00 PM</p>
          </div>
        </div>

        <div style={styles.supportCard}>
          <h4>❓ Frequently Asked Questions</h4>
          <div style={styles.faqList}>
            <div style={styles.faqItem}>
              <strong>How far in advance should I place orders?</strong>
              <p>Minimum 7 days advance required for train scheduling and capacity allocation.</p>
            </div>
            <div style={styles.faqItem}>
              <strong>What is the space consumption rate?</strong>
              <p>Each product has a specific space consumption rate for train capacity planning.</p>
            </div>
            <div style={styles.faqItem}>
              <strong>How is last-mile delivery handled?</strong>
              <p>Trucks from local stores handle final delivery based on predefined routes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.appShell}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarGlow}></div>
          <div style={styles.sidebarBrand}>
            <div style={styles.brandLogo}>KP</div>
            <div>
              <div style={styles.brandTitle}>Kandypack</div>
              <div style={styles.brandSubtitle}>FMCG Distribution</div>
            </div>
          </div>

          <nav style={styles.sidebarNav}>
            {[
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'current', icon: '🚚', label: 'Current Orders' },
              { id: 'history', icon: '📋', label: 'Order History' },
              { id: 'tracking', icon: '📍', label: 'Track Delivery' },
              { id: 'support', icon: '💬', label: 'Support' }
            ].map(item => {
              const isActive = activeTab === item.id;
              const isHovered = hoveredTab === item.id;
              return (
                <button
                  key={item.id}
                  style={
                    isActive 
                      ? { ...styles.sidebarItem, ...styles.sidebarItemActive }
                      : isHovered
                      ? { ...styles.sidebarItem, ...styles.sidebarItemHover }
                      : styles.sidebarItem
                  }
                  onClick={() => goTab(item.id)}
                  onMouseEnter={() => {
                    if (!isActive) setHoveredTab(item.id);
                  }}
                  onMouseLeave={() => {
                    if (!isActive) setHoveredTab(null);
                  }}
                >
                  <span 
                    className="sidebar-icon" 
                    style={{
                      ...styles.sidebarIcon,
                      transform: isHovered && !isActive ? 'scale(1.15)' : 'scale(1)'
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div style={styles.sidebarSpacer}></div>
            
            <button
              style={{
                ...styles.sidebarItem,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                borderLeft: 'none',
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
              }}
              onClick={() => navigate('/products')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
              }}
            >
              <span style={styles.sidebarIcon}>🛒</span>
              <span>Place New Order</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div style={styles.contentArea}>
          <header style={styles.header}>
            <div style={styles.headerContent}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={styles.headerLeft}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h1 style={styles.title}>Customer Portal</h1>
                    <span style={{ color: '#95A5A6', fontSize: 12, lineHeight: '1' }}>{`v${APP_VERSION}`}</span>
                  </div>
                </div>
              </div>

              <div style={styles.headerCenter}>
                {/* Search */}
                <div style={styles.searchWrap}>
                  <Search size={16} color="#7f8c8d" style={styles.searchIcon} />
                  <input
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); openSearch(); }}
                    onFocus={() => { openSearch(); setSearchFocused(true); }}
                    onBlur={() => { setSearchFocused(false); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') { clearSearch(); }
                      if (e.key === 'Enter') {
                        if (searchResults.length > 0) {
                          goTrackOrder(searchResults[0].id);
                        } else if (searchQuery.trim()) {
                          // fallback: try to track exact id typed
                          goTrackOrder(searchQuery.trim());
                        }
                      }
                    }}
                    placeholder="Search orders, routes, products..."
                    style={searchFocused ? { ...styles.searchInput, ...styles.searchInputFocus } : styles.searchInput}
                  />
                  {!!searchQuery && (
                    <button title="Clear" style={styles.searchClearBtn} onClick={clearSearch}>×</button>
                  )}
                  {searchOpen && (searchResults.length > 0 || productResults.length > 0) && (
                    <div style={styles.searchDropdown}>
                      {searchResults.length > 0 && (
                        <div style={{ padding: '6px 12px', fontSize: 11, color: '#95A5A6' }}>Orders</div>
                      )}
                      {searchResults.map((o) => (
                        <button key={o.id} style={styles.searchItem} onClick={() => goTrackOrder(o.id)}>
                          <span style={styles.searchItemId}>{o.id}</span>
                          <span style={styles.searchItemMeta}>{o.status} • {o.delivery_city} • {o.items?.[0]?.name || o.items?.[0]?.product_name || 'Items'}</span>
                        </button>
                      ))}
                      {productResults.length > 0 && (
                        <div style={{ padding: '6px 12px', fontSize: 11, color: '#95A5A6', borderTop: '1px solid #f0f2f5' }}>Products</div>
                      )}
                      {productResults.map((p) => (
                        <button key={p.product_id} style={styles.searchItem} onClick={() => goProductsSearch(searchQuery)}>
                          <span style={styles.searchItemId}>{p.name}</span>
                          <span style={styles.searchItemMeta}>ID: {p.product_id} • LKR {Number(p.price)?.toLocaleString()} • {p.category || '—'}</span>
                        </button>
                      ))}
                      <div style={styles.searchFooter}>
                        {searchResults.length > 0 ? 'Press Enter to track first order match' : ' '}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div style={styles.headerRight}>
                {/* Actions */}
                <div style={styles.actions}>
                  <button
                    title="Cart"
                    style={hoveredIcon === 'cart' ? { ...styles.iconBtn, ...styles.iconBtnHover } : styles.iconBtn}
                    onMouseEnter={() => setHoveredIcon('cart')}
                    onMouseLeave={() => setHoveredIcon(null)}
                    onClick={() => navigate('/checkout')}
                  >
                    <ShoppingCart size={18} />
                  </button>
                  <div style={{ position: 'relative' }} data-dropdown="notif">
                    <button
                      title="Notifications"
                      style={hoveredIcon === 'notif' ? { ...styles.iconBtn, ...styles.iconBtnHover } : styles.iconBtn}
                      data-trigger="notif"
                      onMouseEnter={() => setHoveredIcon('notif')}
                      onMouseLeave={() => setHoveredIcon(null)}
                      onClick={toggleNotif}
                    >
                      <Bell size={18} />
                      {unreadIds.length > 0 && <span style={styles.badge}>{unreadIds.length}</span>}
                    </button>
                    {notifOpen && (
                      <div style={styles.dropdown}>
                        <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: '#7f8c8d' }}>Notifications</span>
                          <button
                            style={{ ...styles.dropdownItem, padding: '6px 8px', fontSize: 12 }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f7f8fa')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                            onClick={markAllRead}
                          >
                            Mark all as read
                          </button>
                        </div>
                        <div style={styles.dropdownDivider} />
                        {notifications.length === 0 && (
                          <div style={{ padding: '12px', fontSize: 13, color: '#7f8c8d' }}>No notifications</div>
                        )}
                        {notifications.map((n) => (
                          <button
                            key={n.id}
                            style={styles.dropdownItem}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f7f8fa')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                            onClick={() => { goTrackOrder(n.orderId); markOneRead(n.id); }}
                          >
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: unreadIds.includes(n.id) ? '#667eea' : '#e1e5ea', display: 'inline-block' }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</span>
                              <small style={{ color: '#7f8c8d' }}>{n.detail} • {n.date}</small>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    title="Help"
                    style={hoveredIcon === 'help' ? { ...styles.iconBtn, ...styles.iconBtnHover } : styles.iconBtn}
                    onMouseEnter={() => setHoveredIcon('help')}
                    onMouseLeave={() => setHoveredIcon(null)}
                    onClick={() => navigate('/customer/support')}
                  >
                    <HelpCircle size={18} />
                  </button>

                  {/* User Menu */}
                  <div style={{ position: 'relative' }} data-dropdown="user">
                    <button
                      style={avatarHover ? { ...styles.avatarBtn, ...styles.avatarBtnHover } : styles.avatarBtn}
                      data-trigger="user"
                      onMouseEnter={() => setAvatarHover(true)}
                      onMouseLeave={() => setAvatarHover(false)}
                      onClick={() => { setNotifOpen(false); setUserMenuOpen((v) => !v); }}
                    >
                      <span style={styles.avatarAvatar}>{initials}</span>
                      <span style={styles.avatarName}>{displayName}</span>
                      <ChevronDown size={16} />
                    </button>
                    {userMenuOpen && (
                      <div style={styles.dropdown}>
                        <div style={{ padding: '8px 12px', fontSize: 12, color: '#7f8c8d' }}>
                          Signed in as <strong>{displayName}</strong>
                        </div>
                        <div style={styles.dropdownDivider} />
                        <button
                          style={styles.dropdownItem}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f7f8fa')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                          onClick={() => navigate('/account/profile')}
                        >
                          <UserIcon size={16} /> Profile
                        </button>
                        <button
                          style={styles.dropdownItem}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f7f8fa')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                          onClick={() => navigate('/account/orders')}
                        >
                          <ShoppingCart size={16} /> Orders
                        </button>
                        <button
                          style={styles.dropdownItem}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f7f8fa')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                          onClick={() => navigate('/account/settings')}
                        >
                          <Settings size={16} /> Settings
                        </button>
                        <div style={styles.dropdownDivider} />
                        <button
                          style={{ ...styles.dropdownItem, color: '#e74c3c' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#fff5f5')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                          onClick={handleSignOut}
                        >
                          <LogOut size={16} /> Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main style={styles.main}>
            {loading && (
              <div style={styles.ordersSection}>
                <h3 style={styles.sectionTitle}>Loading your orders…</h3>
                <p style={{ color: '#7f8c8d' }}>Please wait while we fetch your latest orders.</p>
              </div>
            )}
            {!loading && (
              <Routes>
                <Route index element={renderDashboard()} />
                <Route path="dashboard" element={renderDashboard()} />
                <Route path="current" element={renderCurrentOrders()} />
                <Route path="history" element={renderOrderHistory()} />
                <Route path="tracking" element={renderDeliveryTracking()} />
                <Route path="support" element={renderSupport()} />
                <Route path="*" element={<Navigate to="/customer" replace />} />
              </Routes>
            )}
          </main>
        </div>
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div style={styles.modalOverlay} onClick={() => setShowTrackingModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalGlow}></div>
            <div style={styles.modalHeader}>
              <h3>Track Your Delivery</h3>
              <button style={styles.closeBtn} onClick={() => setShowTrackingModal(false)}>×</button>
            </div>
            <div style={styles.modalContent}>
              {renderDeliveryTracking()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced styles with FMCG theme
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflowX: 'hidden'
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
    zIndex: 0
  },
  appShell: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
    // Prevent content from being hidden under fixed sidebar on very small widths
    width: '100%'
  },
  sidebar: {
    width: '280px',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255,255,255,0.3)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    boxShadow: '2px 0 20px rgba(0,0,0,0.08)',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    height: '100vh',
    overflowY: 'auto',
    zIndex: 100
  },
  sidebarGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100px',
    background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%)',
    pointerEvents: 'none'
  },
  sidebarBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    color: '#2c3e50'
  },
  brandLogo: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    color: 'white'
  },
  brandTitle: {
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '1.1'
  },
  brandSubtitle: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '2px'
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 18px',
    color: '#2c3e50',
    background: 'transparent',
    border: 'none',
    borderLeft: '3px solid transparent',
    borderRadius: '0 12px 12px 0',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '14.5px',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    fontWeight: '500',
    letterSpacing: '0.2px'
  },
  sidebarItemHover: {
    background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.05))',
      borderLeft: '3px solid #667eea',
    transform: 'translateX(2px)',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)'
  },
  sidebarItemActive: {
    background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.1))',
    color: '#667eea',
      borderLeft: '3px solid #667eea',
    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)',
    transform: 'translateX(4px)',
    fontWeight: '600'
  },
  sidebarIcon: {
    width: '22px',
    height: '22px',
    textAlign: 'center',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.25s ease'
  },
  sidebarSpacer: {
    flex: 1
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#f8f9fa',
    // Offset for fixed sidebar
    marginLeft: '280px',
    minHeight: '100vh'
  },
  header: {
    background: 'white',
    padding: '12px 40px',
    borderBottom: '1px solid #e9ecef',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    // Fix header to top, beside the sidebar
    position: 'fixed',
    top: 0,
    left: '280px',
    right: 0,
    minHeight: '92px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 99,
  },
  headerContent: {
    display: 'grid',
    gridTemplateColumns: '1fr minmax(420px, 1.2fr) 1fr',
    alignItems: 'center',
    columnGap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  },
  headerCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerLeft: {
    color: '#2c3e50',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: '0',
    color: '#2c3e50',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#7f8c8d',
    margin: '2px 0 0 0'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    justifyContent: 'flex-end'
  },
  searchWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: '640px'
  },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    left: '10px',
    transform: 'translateY(-50%)'
  },
  searchInput: {
    width: '100%',
    padding: '9px 11px 9px 34px',
    borderRadius: '10px',
    border: '2px solid #e1e5ea',
    outline: 'none',
    fontSize: '14px',
    background: '#f9fafb',
    transition: 'all 0.3s ease'
  },
  searchInputFocus: {
    border: '2px solid #667eea',
    background: 'white',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  },
  searchClearBtn: {
    position: 'absolute',
    right: 6,
    top: '50%',
    transform: 'translateY(-50%)',
    border: 'none',
    background: 'transparent',
    fontSize: 18,
    color: '#7f8c8d',
    cursor: 'pointer',
    lineHeight: 1
  },
  searchDropdown: {
    position: 'absolute',
    top: '110%',
    left: 0,
    right: 0,
    background: 'white',
    border: '1px solid #e1e5ea',
    borderRadius: 12,
    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
    zIndex: 1000,
    overflow: 'hidden'
  },
  searchItem: {
    width: '100%',
    textAlign: 'left',
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    background: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    color: '#2c3e50'
  },
  searchItemId: {
    fontWeight: 700,
    fontSize: 13
  },
  searchItemMeta: {
    fontSize: 12,
    color: '#7f8c8d'
  },
  searchFooter: {
    padding: '8px 12px',
    fontSize: 11,
    color: '#95A5A6',
    borderTop: '1px solid #f0f2f5'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  iconBtn: {
    border: '1px solid #e1e5ea',
    background: 'white',
    borderRadius: '10px',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  iconBtnHover: {
    border: '1px solid #667eea',
    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.18)'
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    padding: '0 4px',
    borderRadius: 8,
    background: '#e74c3c',
    color: 'white',
    fontSize: 10,
    lineHeight: '16px',
    textAlign: 'center',
    fontWeight: 700
  },
  avatarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    border: '1px solid #e1e5ea',
    borderRadius: '999px',
    background: 'white',
    cursor: 'pointer',
    transition: 'border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  avatarBtnHover: {
    border: '1px solid #667eea',
    boxShadow: '0 8px 22px rgba(102, 126, 234, 0.18)'
  },
  avatarAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    fontWeight: 700
  },
  avatarName: {
    fontSize: '13px',
    color: '#2c3e50',
    fontWeight: 600
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '110%',
    width: '220px',
    background: 'white',
    border: '1px solid #e1e5ea',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    zIndex: 1000
  },
  dropdownItem: {
    width: '100%',
    textAlign: 'left',
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#2c3e50',
    transition: 'background 0.2s ease'
  },
  dropdownDivider: {
    height: '1px',
    background: '#f0f2f5',
  },
  brandCompact: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    fontWeight: 800,
    boxShadow: '0 6px 18px rgba(118,75,162,0.25)'
  },
  brandCompactLogo: {
    fontSize: '14px',
    letterSpacing: '0.5px'
  },
  userInfo: {
    textAlign: 'right'
  },
  userName: {
    display: 'block',
    fontWeight: '600',
    color: '#2c3e50'
  },
  userRole: {
    display: 'block',
    fontSize: '12px',
    color: '#7f8c8d'
  },
  main: {
    flex: 1,
    padding: '40px',
    // Add top padding to account for fixed header height
    paddingTop: '140px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    // Avoid re-animating content on minor state updates (like hover)
    // animation: 'fadeInContent 0.5s ease-out'
  },
  dashboardGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  statCard: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    borderRadius: '20px',
    padding: '28px',
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(233, 236, 239, 0.8)',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  statCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    borderColor: 'rgba(102, 126, 234, 0.3)'
  },
  statGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(30px, -30px)',
    pointerEvents: 'none'
  },
  statIcon: {
    fontSize: '2.2rem',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '14px',
    color: 'white',
    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)',
    transition: 'transform 0.3s ease'
  },
  statContent: {
    flex: 1
  },
  actionsSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  sectionTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '24px',
    letterSpacing: '-0.5px',
    position: 'relative',
    paddingBottom: '12px',
    borderBottom: '2px solid transparent',
    background: 'linear-gradient(to right, #667eea, #764ba2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
  },
  sectionTitleAccent: {
    position: 'absolute',
    bottom: '-5px',
    left: 0,
    width: '60px',
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    borderRadius: '2px'
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px'
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'white',
    border: '2px solid #e9ecef',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'left',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    fontWeight: '500',
    transform: 'translateY(0)'
  },
  actionBtnHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
    border: '2px solid #667eea'
  },
  actionGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '80px',
    height: '80px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(20px, -20px)',
    pointerEvents: 'none'
  },
  actionIcon: {
    fontSize: '1.5rem',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '10px',
    color: 'white'
  },
  actionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '4px'
  },
  actionDesc: {
    fontSize: '14px',
    color: '#7f8c8d'
  },
  ordersSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  orderCard: {
    border: '1px solid #e9ecef',
    borderRadius: '18px',
    padding: '24px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
    cursor: 'pointer'
  },
  orderCardHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    borderColor: '#667eea'
  },
  orderGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.06) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(30px, -30px)',
    pointerEvents: 'none'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#2c3e50',
    display: 'block'
  },
  orderDate: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '2px'
  },
  orderStatus: {
    padding: '8px 16px',
    borderRadius: '24px',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)'
  },
  orderDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '20px',
    alignItems: 'center'
  },
  orderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  transportMode: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  modeIcon: {
    fontSize: '16px'
  },
  orderItems: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    margin: '8px 0'
  },
  itemTag: {
    background: '#f8f9fa',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#495057',
    border: '1px solid #e9ecef'
  },
  moreItems: {
    fontSize: '12px',
    color: '#7f8c8d',
    fontStyle: 'italic'
  },
  orderMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#7f8c8d'
  },
  assignmentInfo: {
    marginTop: '8px'
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    minWidth: '120px'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: '#e9ecef',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    transition: 'width 0.3s ease',
    borderRadius: '3px'
  },
  progressText: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  eta: {
    fontSize: '11px',
    color: '#7f8c8d'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#7f8c8d'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '16px',
    opacity: 0.5
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
    textTransform: 'none',
    letterSpacing: '0.5px'
  },
  primaryBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
    background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)'
  },
  primaryBtnGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '20px',
    height: '20px',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%) scale(0)',
    transition: 'transform 0.3s ease',
    pointerEvents: 'none'
  },
  trackingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  trackingInput: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end'
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px'
  },
  trackingResult: {
    marginTop: '20px'
  },
  trackingNotFound: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#7f8c8d'
  },
  trackingDetails: {
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '24px'
  },
  trackingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  trackingTimeline: {
    position: 'relative',
    paddingLeft: '20px'
  },
  timelineStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '24px',
    position: 'relative'
  },
  timelineDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#e9ecef',
    marginTop: '4px',
    flexShrink: 0
  },
  timelineDotActive: {
    background: '#27ae60'
  },
  timelineContent: {
    flex: 1
  },
  supportGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px'
  },
  supportCard: {
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e9ecef'
  },
  contactInfo: {
    lineHeight: '1.6'
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  faqItem: {
    paddingBottom: '16px',
    borderBottom: '1px solid #e9ecef'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(20px)',
    position: 'relative'
  },
  modalGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    borderRadius: '20px',
    pointerEvents: 'none'
  },
  modalHeader: {
    padding: '24px 24px 16px 24px',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#7f8c8d',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  },
  modalContent: {
    padding: '24px'
  }
};

export default CustomerPage;
