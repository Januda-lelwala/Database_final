import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import {
  Heart as HeartIcon,
  ShoppingCart,
  Trash2 as TrashIcon,
  Star as StarIcon,
  ArrowLeft,
  Package as PackageIcon,
  Eye,
} from 'lucide-react';

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, addToCart } = useStore();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate loading wishlist from localStorage or API
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem(`wishlist_${user?.username || 'guest'}`);
        if (savedWishlist) {
          const wishlistIds = JSON.parse(savedWishlist);
          const wishlistProducts = products.filter(product => wishlistIds.includes(product.id));
          setWishlistItems(wishlistProducts);
        }
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [products, user]);

  const removeFromWishlist = (productId) => {
    try {
      const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
      setWishlistItems(updatedWishlist);
      
      // Update localStorage
      const wishlistIds = updatedWishlist.map(item => item.id);
      localStorage.setItem(`wishlist_${user?.username || 'guest'}`, JSON.stringify(wishlistIds));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const addToCartHandler = (product) => {
    // StoreContext.addToCart expects (id, qty)
    addToCart(product.id, 1);
    // Optional: Remove from wishlist after adding to cart
    // removeFromWishlist(product.id);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 4);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon 
          key={i} 
          size={16} 
          color="#fbbf24" 
          fill={i < fullStars ? '#fbbf24' : 'none'} 
        />
      );
    }
    return <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            <HeartIcon size={32} style={{ marginRight: '12px', color: '#e11d48' }} />
            My Wishlist
          </h1>
          <p style={styles.subtitle}>
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {wishlistItems.length === 0 ? (
          <div style={styles.emptyState}>
            <HeartIcon size={80} style={{ color: '#e2e8f0', marginBottom: '24px' }} />
            <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
            <p style={styles.emptyDescription}>
              Browse our products and add items you love to your wishlist
            </p>
            <button 
              style={styles.shopButton}
              onClick={() => navigate('/products')}
            >
              <PackageIcon size={18} style={{ marginRight: '8px' }} />
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={styles.wishlistGrid}>
            {wishlistItems.map((product) => (
              <div key={product.id} style={styles.productCard}>
                <div style={styles.productImageContainer}>
                  <img
                    src={product.image || '/images/product-placeholder.svg'}
                    alt={product.title}
                    style={styles.productImage}
                  />
                  <button
                    style={styles.removeButton}
                    onClick={() => removeFromWishlist(product.id)}
                    title="Remove from wishlist"
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>
                
                <div style={styles.productInfo}>
                  <h3 style={styles.productTitle}>{product.title}</h3>
                  <div style={styles.productRating}>
                    {renderStars(product.rating)}
                    <span style={styles.ratingText}>
                      ({product.rating || '4.0'})
                    </span>
                  </div>
                  <p style={styles.productCategory}>{product.category}</p>
                  <div style={styles.productPrice}>
                    <span style={styles.price}>${product.price?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>

                <div style={styles.productActions}>
                  <button
                    style={styles.viewButton}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <Eye size={16} style={{ marginRight: '6px' }} />
                    View
                  </button>
                  <button
                    style={styles.addToCartButton}
                    onClick={() => addToCartHandler(product)}
                  >
                    <ShoppingCart size={16} style={{ marginRight: '6px' }} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    paddingBottom: '60px',
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '20px',
  },
  
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    color: '#64748b',
    fontSize: '16px',
  },

  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    color: 'white',
  },

  backButton: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '12px',
    color: 'white',
    padding: '12px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    marginBottom: '24px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },

  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },

  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center',
  },

  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    margin: 0,
  },

  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },

  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },

  emptyTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '12px',
  },

  emptyDescription: {
    fontSize: '1.1rem',
    color: '#64748b',
    marginBottom: '32px',
    maxWidth: '400px',
    margin: '0 auto 32px',
  },

  shopButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },

  wishlistGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },

  productCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0',
  },

  productImageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
  },

  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  removeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#dc2626',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },

  productInfo: {
    padding: '20px',
  },

  productTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
    lineHeight: '1.4',
  },

  productRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },

  ratingText: {
    fontSize: '14px',
    color: '#64748b',
  },

  productCategory: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '12px',
  },

  productPrice: {
    marginBottom: '16px',
  },

  price: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#059669',
  },

  productActions: {
    padding: '0 20px 20px',
    display: 'flex',
    gap: '12px',
  },

  viewButton: {
    flex: 1,
    background: 'rgba(102, 126, 234, 0.1)',
    color: '#667eea',
    border: '1px solid #667eea',
    borderRadius: '12px',
    padding: '12px 16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },

  addToCartButton: {
    flex: 2,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
};

// Add CSS for animations
const wishlistStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .wishlist-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
  
  .remove-button:hover {
    background: rgba(220, 38, 38, 0.1) !important;
    transform: scale(1.1);
  }
  
  .view-button:hover {
    background: #667eea !important;
    color: white !important;
  }
  
  .add-to-cart-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  .back-button:hover {
    background: rgba(255,255,255,0.3) !important;
    transform: translateY(-1px);
  }
  
  .shop-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
`;

// Inject styles
if (!document.querySelector('#wishlist-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'wishlist-styles';
  styleSheet.textContent = wishlistStyles;
  document.head.appendChild(styleSheet);
}