import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, ShoppingBag, Star, X } from 'lucide-react';
import type { Product } from '../data/products';


export const Shop: React.FC = () => {
  const { products, toggleWishlist, wishlist, setSelectedProductId, setActivePage, shopCategory, setShopCategory, searchQuery, setSearchQuery, categories: dbCategories, addToCart } = useStore();

  // Search & Filter state
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = shopCategory === 'all' || p.category === shopCategory;
        const matchesPrice = p.price <= priceRange;

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount-desc') return (b.discount || 0) - (a.discount || 0);
        if (sortBy === 'discount-asc') return (a.discount || 0) - (b.discount || 0);
        return 0; // Default/Relevance
      });
  }, [products, searchQuery, shopCategory, priceRange, sortBy]);

  // 3D Card Tilt effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) scale(1.02)`;
    const shine = card.querySelector('.shine-overlay') as HTMLDivElement;
    if (shine) {
      const angle = Math.atan2(y, x) * (180 / Math.PI);
      shine.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.15) 0%, transparent 80%)`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    const shine = card.querySelector('.shine-overlay') as HTMLDivElement;
    if (shine) {
      shine.style.background = 'transparent';
    }
  };

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setActivePage('product-details');
  };

  const addQuickViewToCart = (product: Product) => {
    window.dispatchEvent(new CustomEvent('product-added', { detail: { image: product.image } }));
    addToCart({
      product: { id: product.id, name: product.name, price: product.price, image: product.image, category: product.category },
      quantity: 1,
      selectedMetal: product.metalOptions[0] || product.specs.metal,
      selectedStone: product.stoneOptions[0] || product.specs.stoneType
    });
  };

  const categories = [
    { id: 'all', label: 'All Pieces' },
    ...dbCategories.map(cat => ({
      id: cat,
      label: cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    }))
  ];

  return (
    <div className="page-shell" style={{
      maxWidth: '1280px',
      margin: '64px auto 60px',
      padding: '0 24px',
      minHeight: '80vh'
    }}>
      {/* Title */}
      <div className="collections-heading" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ color: 'var(--gold-primary)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600 }}>Curated for everyday elegance</span>
        <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 300 }}>
          The Signature Collections
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 300, letterSpacing: '0.05em' }}>
          Explore our collections of micro-plated rolled gold and anti-tarnish jewelry.
        </p>
      </div>

      {/* Category Navigation Bar */}
      <div className="category-tabs collections-categories" style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setShopCategory(cat.id)}
            style={{
              padding: '8px 20px',
              borderRadius: '2px',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: shopCategory === cat.id ? 'var(--gold-primary)' : 'var(--border-light)',
              backgroundColor: shopCategory === cat.id ? 'var(--gold-primary)' : 'transparent',
              color: shopCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
              transition: 'var(--transition-fast)'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Horizontal Filter Bar */}
      <div className="glass collections-filter-bar" style={{
        padding: '16px 20px',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-light)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Price Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
            <span>Max Price</span>
            <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>₹{priceRange.toLocaleString('en-IN')}</span>
          </div>
          <input 
            type="range"
            min={500}
            max={5000}
            step={100}
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer', marginTop: '6px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span>₹500</span>
            <span>₹5,000+</span>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              padding: '10px',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount-desc">Discount: High to Low (More Discount)</option>
            <option value="discount-asc">Discount: Low to High (Less Discount)</option>
            <option value="rating">Reviews Rating</option>
          </select>
        </div>
      </div>

      <div className="collections-results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Showing</span>
          <h3 style={{ fontSize: '1.15rem', marginTop: '3px', fontWeight: 500 }}>{filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} to discover</h3>
        </div>
        <span style={{ color: 'var(--gold-primary)', fontSize: '0.78rem', fontWeight: 600 }}>{shopCategory === 'all' ? 'All collections' : categories.find(c => c.id === shopCategory)?.label}</span>
      </div>

      {/* Product grid or empty state */}
      {filteredProducts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--border-light)'
        }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 400 }}>No jewelry matches your search</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Try resetting your pricing filter, checking other categories, or typing a different query.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setPriceRange(5000);
              setShopCategory('all');
            }}
            className="gold-button"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="product-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {filteredProducts.map((p) => {
            const isWished = wishlist.includes(p.id);
            return (
              <div
                key={p.id}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleProductClick(p.id)}
                className="glass shop-card"
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  position: 'relative'
                }}
              >
                {/* Gloss Reflection Layer */}
                <div className="shine-overlay" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 2,
                  borderRadius: '8px',
                  transition: 'background 0.15s ease'
                }} />

                {/* Image Area */}
                <div style={{
                  height: '260px',
                  backgroundColor: 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderBottom: '1px solid var(--border-light)',
                  position: 'relative'
                }} className="gem-glint">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} 
                    className="product-img"
                  />

                  {/* Wishlist toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid var(--border-light)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: isWished ? 'var(--gold-primary)' : 'var(--text-muted)',
                      zIndex: 10
                    }}
                    title={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart size={16} fill={isWished ? 'var(--gold-primary)' : 'none'} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setQuickViewProduct(p); }}
                    className="quick-view-trigger"
                    style={{ position: 'absolute', left: '50%', bottom: '14px', transform: 'translateX(-50%) translateY(12px)', opacity: 0, display: 'inline-flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap', padding: '9px 15px', borderRadius: '20px', color: '#fff', background: 'var(--gold-primary)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', zIndex: 10, transition: 'all .35s cubic-bezier(.16,1,.3,1)' }}>
                    <Eye size={14} /> Quick View
                  </button>
                </div>

                {/* Info */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.category}</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{p.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.specs.coating || p.specs.metal}</span>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginTop: '8px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ color: 'var(--gold-primary)', fontSize: '1.1rem' }}>
                          ₹{p.price.toLocaleString('en-IN')}
                        </strong>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      {p.discount && p.discount > 0 ? (
                        <span style={{ color: '#e74c3c', fontSize: '0.72rem', fontWeight: 600 }}>
                          ({p.discount}% OFF)
                        </span>
                      ) : null}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ★ {p.rating} ({p.reviewsCount})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {quickViewProduct && (
        <div className="quick-view-backdrop" onClick={() => setQuickViewProduct(null)}>
          <div className="quick-view-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="quick-view-close" onClick={() => setQuickViewProduct(null)} aria-label="Close quick view"><X size={20} /></button>
            <div className="quick-view-image-wrap">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} />
              <span>Move your cursor to explore</span>
            </div>
            <div className="quick-view-copy">
              <span className="quick-view-category">{quickViewProduct.category}</span>
              <h2>{quickViewProduct.name}</h2>
              <div className="quick-view-rating"><Star size={15} fill="currentColor" /> {quickViewProduct.rating} <small>({quickViewProduct.reviewsCount} reviews)</small></div>
              <p>{quickViewProduct.description}</p>
              <strong>₹{quickViewProduct.price.toLocaleString('en-IN')}</strong>
              <div className="quick-view-actions">
                <button className="gold-button magnetic-button" onClick={() => addQuickViewToCart(quickViewProduct)}><ShoppingBag size={16} /> Add to Cart</button>
                <button className="gold-button-outline" onClick={() => handleProductClick(quickViewProduct.id)}>View Details</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .shop-card:hover {
          box-shadow: 0 10px 30px rgba(131, 39, 41, 0.08);
        }
        .shop-card:hover .product-img {
          transform: scale(1.05);
        }
        .shop-card:hover .quick-view-trigger { opacity: 1 !important; transform: translateX(-50%) translateY(0) !important; }
      `}</style>
    </div>
  );
};
