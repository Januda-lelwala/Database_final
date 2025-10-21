import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { productsAPI } from '../services/api';

const StoreContext = createContext(null);

const seedProducts = () => [
  { 
    id: 1, 
    title: 'Rail Transport Box Small', 
    price: 3.5, 
    category: 'Rail Logistics', 
    stock: 100,
    image: '/images/shipping-box-small.svg',
    description: 'Compact containers optimized for rail cargo handling. Stackable design for efficient train car loading.'
  },
  { 
    id: 2, 
    title: 'Road Distribution Box Medium', 
    price: 6.9, 
    category: 'Road Logistics', 
    stock: 50,
    image: '/images/shipping-box-medium.svg',
    description: 'Truck-optimized packaging for last-mile delivery. Enhanced protection for road transportation.'
  },
  { 
    id: 3, 
    title: 'Multi-Modal Stretch Wrap', 
    price: 12.0, 
    category: 'Supply Chain Securing', 
    stock: 40,
    image: '/images/stretch-wrap.svg',
    description: 'Heavy-duty wrapping for rail and road transitions. Weather-resistant for outdoor rail yards.'
  },
  { 
    id: 4, 
    title: 'Transportation Sealing Tape', 
    price: 2.2, 
    category: 'Distribution Supplies', 
    stock: 200,
    image: '/images/packing-tape.svg',
    description: 'High-adhesion tape for multi-modal transport. Withstands rail vibrations and road conditions.'
  },
  { 
    id: 5, 
    title: 'Transit Protection Wrap', 
    price: 9.9, 
    category: 'Supply Chain Securing', 
    stock: 30,
    image: '/images/bubble-wrap.svg',
    description: 'Advanced cushioning for rail and road shock absorption. Maintains integrity across transport modes.'
  },
  { 
    id: 6, 
    title: 'Heavy Rail Cargo Container', 
    price: 8.5, 
    category: 'Rail Logistics', 
    stock: 75,
    image: '/images/shipping-box-large.svg',
    description: 'Industrial containers for rail freight. Reinforced for long-distance rail transport operations.'
  },
  { 
    id: 7, 
    title: 'Fragile Transit Protection', 
    price: 15.99, 
    category: 'Supply Chain Securing', 
    stock: 25,
    image: '/images/fragile-packaging.svg',
    description: 'Specialized protection for delicate items during rail and road transitions.'
  },
  { 
    id: 8, 
    title: 'Distribution Network Mailers', 
    price: 4.75, 
    category: 'Distribution Supplies', 
    stock: 150,
    image: '/images/eco-mailer-bags.svg',
    description: 'Eco-friendly mailers for sustainable supply chain distribution networks.'
  },
  { 
    id: 9, 
    title: 'Transport Stabilization Fill', 
    price: 7.25, 
    category: 'Supply Chain Securing', 
    stock: 60,
    image: '/images/void-fill.svg',
    description: 'Advanced void fill for multi-modal transport stabilization across rail and road networks.'
  },
  { 
    id: 10, 
    title: 'Logistics Branding Solutions', 
    price: 12.5, 
    category: 'Distribution Supplies', 
    stock: 35,
    image: '/images/custom-branded-boxes.svg',
    description: 'Custom branded packaging for supply chain visibility across rail and road distribution.'
  },
];

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(seedProducts());
  const [cart, setCart] = useState([]); // {id, qty}
  const [orders, setOrders] = useState([]); // {id, items, total, status}
  const [notifications, setNotifications] = useState([]); // {id, text, type}
  const [messages, setMessages] = useState([]); // {from, to, text, ts}

  // Persist to localStorage (simple demo persistence)
  useEffect(() => {
    const saved = localStorage.getItem('kandypack_store');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Do NOT restore products from localStorage to avoid stale items
      setCart(parsed.cart || []);
      setOrders(parsed.orders || []);
      setNotifications(parsed.notifications || []);
      setMessages(parsed.messages || []);
    }
  }, []);

  useEffect(() => {
    // Persist only customer state, not products
    localStorage.setItem(
      'kandypack_store',
      JSON.stringify({ cart, orders, notifications, messages })
    );
  }, [cart, orders, notifications, messages]);

  // Load products from backend API (with mock fallback via api layer)
  useEffect(() => {
    let didCancel = false;

    const mapProduct = (p, idx) => ({
      id: p.product_id ?? p.id ?? p.productId ?? p.productID ?? `TMP_${idx}`,
      title: p.product_name ?? p.title ?? p.name ?? 'Untitled Product',
      price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
      category: p.category || 'General',
      stock: p.available_quantity ?? p.stock ?? 0,
  image: p.image || null,
      description: p.description || ''
    });

    const fetchProducts = async () => {
      console.log('🔍 StoreContext: Fetching products from backend...');
      try {
        // Try without query params first (some backends don't handle them)
        const response = await productsAPI.getAll();
        console.log('📡 StoreContext: Raw response:', response);
        const responseData = response.data;
        console.log('📦 StoreContext: Response data:', responseData);
        
        // Handle multiple backend response formats:
        // 1. {success: true, data: [...]}
        // 2. {success: true, data: {products: [...]}}
        // 3. {products: [...]}
        // 4. Direct array [...]
        let incoming = [];
        
        if (Array.isArray(responseData)) {
          incoming = responseData;
        } else if (responseData?.data) {
          if (Array.isArray(responseData.data)) {
            incoming = responseData.data;
          } else if (Array.isArray(responseData.data.products)) {
            incoming = responseData.data.products;
          } else {
            incoming = Object.values(responseData.data);
          }
        } else if (Array.isArray(responseData?.products)) {
          incoming = responseData.products;
        }
        
        if (!didCancel && incoming.length > 0) {
          const mapped = incoming.map(mapProduct);
          console.log('✅ StoreContext: Loaded', mapped.length, 'products from backend');
          console.log('📦 StoreContext: First product:', mapped[0]);
          setProducts(mapped);
        } else if (!didCancel) {
          console.warn('⚠️ StoreContext: No products received from backend, keeping seed products');
          console.log('   Incoming array:', incoming);
        }
      } catch (err) {
        // Keep seed/local products on failure; log once for visibility
        console.error('❌ StoreContext: Failed to load products from API; using local products.');
        console.error('   Error:', err);
        console.error('   Error message:', err?.message);
      }
    };

    fetchProducts();

    return () => { didCancel = true; };
  }, []);

  // Optional: expose a manual refresh method
  const refreshProducts = useCallback(async () => {
    try {
      const response = await productsAPI.getAll();
      const responseData = response.data;
      
      // Handle multiple backend response formats
      let incoming = [];
      
      if (Array.isArray(responseData)) {
        incoming = responseData;
      } else if (responseData?.data) {
        if (Array.isArray(responseData.data)) {
          incoming = responseData.data;
        } else if (Array.isArray(responseData.data.products)) {
          incoming = responseData.data.products;
        } else {
          incoming = Object.values(responseData.data);
        }
      } else if (Array.isArray(responseData?.products)) {
        incoming = responseData.products;
      }
      
      const mapped = incoming.map((p, i) => ({
        id: p.product_id ?? p.id ?? p.productId ?? p.productID ?? `TMP_${i}`,
        title: p.product_name ?? p.title ?? p.name ?? 'Untitled Product',
        price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
        category: p.category || 'General',
        stock: p.available_quantity ?? p.stock ?? 0,
  image: p.image || null,
        description: p.description || ''
      }));
      setProducts(mapped);
      return mapped;
    } catch (err) {
      console.warn('refreshProducts failed:', err?.message || err);
      throw err;
    }
  }, []);

  // Cart helpers
  const addToCart = useCallback((id, qty = 1) => {
    const requested = Number.isFinite(qty) ? Math.floor(qty) : 0;
    if (requested <= 0) {
      return;
    }

    setCart((prev) => {
      const product = products.find((p) => p.id === id);
      const stock = Number.isFinite(product?.stock) ? product.stock : Infinity;
      const existing = prev.find((i) => i.id === id);
      const currentQty = existing?.qty ?? 0;
      const remaining = stock === Infinity ? Infinity : Math.max(0, stock - currentQty);
      const allowed = stock === Infinity ? requested : Math.min(requested, remaining);

      if (allowed <= 0) {
        return prev;
      }

      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, qty: currentQty + allowed } : i
        );
      }

      return [...prev, { id, qty: allowed }];
    });
  }, [products]);
  
  const removeFromCart = useCallback((id) => setCart((prev) => prev.filter((i) => i.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);

  // Orders
  const placeOrder = useCallback(() => {
    if (cart.length === 0) return null;
    const items = cart.map((ci) => {
      const p = products.find((p) => p.id === ci.id);
      return { ...p, qty: ci.qty, lineTotal: ci.qty * p.price };
    });
    const total = items.reduce((s, i) => s + i.lineTotal, 0);
    const order = {
      id: `ORD-${Date.now()}`,
      items,
      total,
      status: 'Processing',
      placedBy: localStorage.getItem('userName') || 'guest',
      placedAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    setNotifications((n) => [{ id: Date.now(), text: `Order ${order.id} placed`, type: 'success' }, ...n]);
    return order;
  }, [cart, products, clearCart]);

  // Admin product management
  const updateProduct = useCallback((id, patch) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    setNotifications((n) => [{ id: Date.now(), text: `Product ${id} updated`, type: 'info' }, ...n]);
  }, []);
  
  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setNotifications((n) => [{ id: Date.now(), text: `Product ${id} deleted`, type: 'warning' }, ...n]);
  }, []);
  
  const addProduct = useCallback((p) => {
    const withId = { ...p, id: Date.now() };
    setProducts((prev) => [withId, ...prev]);
    setNotifications((n) => [{ id: Date.now(), text: `New product added: ${withId.title}`, type: 'success' }, ...n]);
  }, []);

  const sendMessage = useCallback((from, to, text) => {
    const msg = { id: Date.now(), from, to, text, ts: new Date().toISOString() };
    setMessages((prev) => [msg, ...prev]);
    setNotifications((n) => [{ id: Date.now(), text: `New message from ${from}`, type: 'message' }, ...n]);
  }, []);

  const value = useMemo(
    () => ({ products, cart, orders, setOrders, notifications, messages, addToCart, removeFromCart, clearCart, placeOrder, updateProduct, deleteProduct, addProduct, sendMessage, refreshProducts }),
    [products, cart, orders, notifications, messages, addToCart, removeFromCart, clearCart, placeOrder, updateProduct, deleteProduct, addProduct, sendMessage, refreshProducts]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
