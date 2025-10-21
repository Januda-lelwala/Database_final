import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import Cards from "../components/Card.js"; 
import { useStore } from "../context/StoreContext";
import "./Product.css";
import {
  Search as SearchIcon,
  Filter as FilterIcon,
  Star as StarIcon,
} from 'lucide-react';

// Simple placeholder image as data URL (gray box with text)
const getPlaceholderImage = (text) => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, 300, 200);
  
  // Text
  ctx.fillStyle = '#999';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text || 'Product', 150, 100);
  
  return canvas.toDataURL();
};

// Removed profile menu and custom sort dropdown to simplify UI

export default function Product() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [addedItems, setAddedItems] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  
  const navigate = useNavigate();
  const location = useLocation();
  const { products, addToCart, removeFromCart, cart } = useStore();

  // Remove dynamic style injection in favor of CSS file

  // Handle URL parameters for initial category selection and query
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    const qParam = urlParams.get('q');
    let mutated = false;
    if (categoryParam && categoryParam !== category) {
      setCategory(categoryParam);
      mutated = true;
    }
    if (qParam && qParam !== query) {
      setQuery(qParam);
      mutated = true;
    }
    if (mutated) {
      // Clean up URL to avoid persistence of params after applying
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location.search, category, query]);

  // Simulate loading for better UX
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [category, sortBy]);

  // Wishlist removed in simplified UI

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  );

  const priceRanges = [
    { label: "Under $20", min: 0, max: 20 },
    { label: "$20 - $50", min: 20, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100 - $200", min: 100, max: 200 },
    { label: "Over $200", min: 200, max: 1000 }
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = products.filter(p => {
      const matchesCat = category === "All" || p.category === category;
      const matchesQ = !q || p.title.toLowerCase().includes(q);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const pr = p.rating ?? 4;
      const matchesRating = pr >= ratingFilter;
      return matchesCat && matchesQ && matchesPrice && matchesRating;
    });

    // Sort products
    result.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 4) - (a.rating || 4);
      if (sortBy === "newest") return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [query, category, sortBy, priceRange, ratingFilter, products]);

  // Wishlist removed

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      query !== "" ||
      category !== "All" ||
      sortBy !== "name" ||
      priceRange[0] !== 0 ||
      priceRange[1] !== 1000 ||
      ratingFilter !== 0
    );
  }, [query, category, sortBy, priceRange, ratingFilter]);

  // Reset to first page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, category, sortBy, priceRange, ratingFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const isInCart = (id) => cart.some((i) => i.id === id);

  function handleAdd(product, qty) {
    const existing = cart.find((i) => i.id === product.id);
    const currentQty = existing?.qty ?? 0;
    const stockValue = Number.isFinite(product.stock) ? Math.max(0, Math.floor(product.stock)) : 0;
    const remaining = Math.max(0, stockValue - currentQty);
    const requested = Number.isFinite(qty) ? Math.floor(qty) : 0;
    const allowed = Math.max(0, Math.min(requested, remaining));

    if (allowed <= 0) {
      return;
    }

    addToCart(product.id, allowed);
    setAddedItems((prev) => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  }

  function handleGoToCheckout() {
    navigate('/checkout');
  }

  function clearAllFilters() {
    setQuery("");
    setCategory("All");
    setSortBy("name");
    setPriceRange([0, 1000]);
    setRatingFilter(0);
  }

  // Removed compare, share and quick view for a cleaner UI

  // Simplified accents removed for minimalist look

  const renderStars = (rating = 4.8) => {
    const full = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon key={i} size={16} color="#fbbf24" fill={i < full ? '#fbbf24' : 'none'} />
      );
    }
    return <span style={{ display: 'inline-flex', gap: 2 }}>{stars}</span>;
  };

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="products-hero__inner">
          <h1 className="products-hero__title">Products</h1>
          <p className="products-hero__subtitle">Browse our catalog and add items to your cart</p>
        </div>
        <div className="products-toolbar">
          <div className="products-search">
            <span className="search-icon"><SearchIcon size={18} /></span>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div>
            <Form.Select value={category} onChange={(e)=>setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </Form.Select>
          </div>
          <div>
            <Form.Select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
              <option value="name">Name (A-Z)</option>
              <option value="price">Price (Low to High)</option>
              <option value="priceDesc">Price (High to Low)</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </Form.Select>
          </div>
          <button className="btn" onClick={()=>setShowFilters(!showFilters)}>
            <FilterIcon size={16} style={{marginRight:6}}/> Filters
          </button>
        </div>
      </section>

      <Container className="py-4">

        {showFilters && (
          <div className="products-content">
            <div className="products-summary" style={{marginBottom:12}}>
              <span>Filters</span>
              {hasActiveFilters && (
                <button className="btn" onClick={clearAllFilters}>Clear all</button>
              )}
            </div>
            <Row>
              <Col md={4}>
                <div className="products-summary" style={{display:'grid', gap:8}}>
                  <strong>Price</strong>
                  {priceRanges.map(r => (
                    <button key={r.label} className="btn" onClick={()=>setPriceRange([r.min, r.max])}>{r.label}</button>
                  ))}
                </div>
              </Col>
              <Col md={4}>
                <div className="products-summary" style={{display:'grid', gap:8}}>
                  <strong>Rating</strong>
                  {[5,4,3,2,1,0].map(r => (
                    <button key={r} className="btn" onClick={()=>setRatingFilter(r)}>
                      {r === 0 ? 'All' : `${r}+ stars`}
                    </button>
                  ))}
                </div>
              </Col>
              <Col md={4}>
                <div className="products-summary" style={{display:'grid', gap:8}}>
                  <strong>Actions</strong>
                  <button className="btn" onClick={clearAllFilters}>Reset</button>
                </div>
              </Col>
            </Row>
          </div>
        )}

  {/* Results Summary */}
        <div id="product-results" className="products-content">
          <div className="products-summary">
            <span>{isLoading ? 'Loading…' : `${filtered.length} products`}</span>
            <span>Cart: {cartCount}</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="products-empty">Loading…</div>
        )}

        {/* Product Grid/List */}
        {!isLoading && (
          <>
          <div className="products-content">
          <div className="products-grid">
            {pageItems.map((p) => {
              const cartEntry = cart.find((item) => item.id === p.id);
              const inCartQty = cartEntry?.qty ?? 0;
              const totalStock = Number.isFinite(p.stock) ? Math.max(0, Math.floor(p.stock)) : 0;
              const remaining = Math.max(0, totalStock - inCartQty);
              const initialQty = remaining > 0 ? 1 : 0;

              return (
                <div key={p.id} className="product-card">
                <div className="product-card__media">
                  <img
                    className="product-card__img"
                    src={p.image || getPlaceholderImage(p.title.split(' ')[0])}
                    alt={p.title}
                    onError={(e) => { e.target.src = getPlaceholderImage(p.title.split(' ')[0]); }}
                  />
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__title">{p.title}</h3>
                  <div className="product-card__meta">
                    <span>{renderStars(p.rating ?? 4)}</span>
                    <span className="product-card__price">${p.price.toFixed(2)}</span>
                  </div>
                  <div className="product-card__actions">
                    <Cards
                      embedded
                      price={p.price}
                      stock={p.stock}
                      reserved={inCartQty}
                      max={remaining}
                      min={remaining > 0 ? 1 : 0}
                      initialQty={initialQty}
                      onAdd={(qty) => handleAdd(p, qty)}
                      buttonText={addedItems.has(p.id) ? "Added" : "Add to Cart"}
                    />
                    {isInCart(p.id) && (
                      <button className="btn btn-ghost" onClick={() => removeFromCart(p.id)}>Remove</button>
                    )}
                  </div>
                </div>
                </div>
              );
            })}
            {filtered.length === 0 && !isLoading && (
              <div className="products-empty">No products found. Try adjusting filters.</div>
            )}
          </div>
          </div>
          {/* Pagination */}
          {filtered.length > pageSize && (
            <div className="products-pagination">
              <button className="btn" disabled={currentPage===1} onClick={()=>setCurrentPage(p=>Math.max(1,p-1))}>Prev</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button className="btn" disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))}>Next</button>
            </div>
          )}
          </>
        )}

        {/* Checkout CTA */}
        {cartCount > 0 && (
          <div className="cart-cta">
            <span>🛒 {cartCount} items</span>
            <button className="btn btn-primary" onClick={handleGoToCheckout}>Checkout</button>
          </div>
        )}
      </Container>
      {/* Simplified: quick view and compare tray removed */}
    </div>
  );
}
