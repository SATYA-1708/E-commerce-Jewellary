import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ArrowRight, Award, ShieldCheck, Heart, 
  Truck, MessageSquare, Clipboard, Check, Star
} from 'lucide-react';
export const Home: React.FC = () => {
  const { setActivePage, setShopCategory, products, toggleWishlist, wishlist, setSelectedProductId } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setActivePage('product-details');
  };

  const couponsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const newArrivalsRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const instagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupAutoScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
      const el = ref.current;
      if (!el) return;

      let isPaused = false;
      let intervalId: any = null;

      const handleMouseEnter = () => { isPaused = true; };
      const handleMouseLeave = () => { isPaused = false; };
      const handleTouchStart = () => { isPaused = true; };
      const handleTouchEnd = () => {
        setTimeout(() => {
          isPaused = false;
        }, 2500);
      };

      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('touchstart', handleTouchStart);
      el.addEventListener('touchend', handleTouchEnd);

      intervalId = setInterval(() => {
        if (isPaused) return;

        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 0) return;

        if (el.scrollLeft >= maxScroll - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const cardWidth = el.firstElementChild ? el.firstElementChild.clientWidth + 20 : 300;
          el.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }, 3500);

      return () => {
        clearInterval(intervalId);
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchend', handleTouchEnd);
      };
    };

    const cleanup1 = setupAutoScroll(couponsRef);
    const cleanup2 = setupAutoScroll(trustRef);
    const cleanup3 = setupAutoScroll(newArrivalsRef);
    const cleanup4 = setupAutoScroll(bestSellersRef);
    const cleanup5 = setupAutoScroll(trendingRef);
    const cleanup6 = setupAutoScroll(reviewsRef);
    const cleanup7 = setupAutoScroll(instagramRef);

    return () => {
      cleanup1 && cleanup1();
      cleanup2 && cleanup2();
      cleanup3 && cleanup3();
      cleanup4 && cleanup4();
      cleanup5 && cleanup5();
      cleanup6 && cleanup6();
      cleanup7 && cleanup7();
    };
  }, [products.length]);

  // Hero Slides
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
      title: 'Anti-Tarnish Elegance',
      subtitle: 'Premium 18k Rolled Gold',
      desc: 'Beautifully crafted jewelry micro-plated with a tarnish-resistant polymer seal. Designed for daily wear, sweat, and showers.'
    },
    {
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
      title: 'Everyday Hair Aesthetics',
      subtitle: 'Silk Scrunchies & Metallic Clutchers',
      desc: 'Protect your hair health while maintaining a high-fashion look. Our mulberry silk scrunchies minimize breakage.'
    },
    {
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
      title: 'Kashmiri Jhumke & Payals',
      subtitle: 'Traditional Royal Splendor',
      desc: 'Enchanting ethnic statements micro-plated in rich gold tones, bringing timeless Indian heritage straight to your collection.'
    }
  ];

  // Auto-rotate hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const categories = [
    { id: 'earrings', name: 'Earrings', desc: 'Western & Traditional', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80' },
    { id: 'necklaces', name: 'Necklaces', desc: 'Chains & Chokers', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80' },
    { id: 'bracelets', name: 'Bracelets', desc: 'Delicate wristwear', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80' },
    { id: 'pendants', name: 'Pendants', desc: 'Minimalist statement charms', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80' },
    { id: 'payals', name: 'Payals', desc: 'Elegant traditional anklets', image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=400&q=80' },
    { id: 'kashmiri_jhumke', name: 'Kashmiri Jhumke', desc: 'Intricate royal bells', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=400&q=80' },
    { id: 'hair_accessories', name: 'Hair Accessories', desc: 'Clutchers & Scrunchies', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80' }
  ];

  // Filtering products
  const newArrivals = products;
  const bestSellers = products.filter(p => p.rating >= 4.8);
  const trending = products.slice(3);

  // Copy coupon handler
  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleCategoryClick = (catId: string) => {
    setShopCategory(catId);
    setActivePage('shop');
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent("Hello! I am browsing the Maa Diaries website and would like some assistance.");
    window.open(`https://wa.me/918448229528?text=${text}`, '_blank');
  };

  return (
    <div className="home-page" style={{ display: 'flex', flexDirection: 'column', gap: '52px', position: 'relative' }}>
      
      {/* 1. HERO SLIDER */}
      <div 
        style={{ 
          position: 'relative', 
          height: '75vh', 
          width: '94%', 
          maxWidth: '1360px',
          margin: '20px auto 0',
          overflow: 'hidden', 
          display: 'flex', 
          alignItems: 'center',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
        }}
        className="hero-slider-container"
      >
        {heroSlides.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
                zIndex: isActive ? 1 : 0
              }}
            >
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `linear-gradient(rgba(15, 15, 18, 0.3) 0%, rgba(15, 15, 18, 0.75) 100%), url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '8%',
                  transform: 'translateY(-50%)',
                  maxWidth: '600px',
                  zIndex: 2,
                  animation: 'slideUpText 0.8s ease-out'
                }}>
                  <span style={{ color: '#bfa575', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.2em', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                    {slide.subtitle}
                  </span>
                  <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-serif)', lineHeight: '1.1', marginBottom: '20px', color: '#ffffff', fontWeight: 300 }}>
                    {slide.title}
                  </h1>
                  <p style={{ color: '#e5e0d8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px' }}>
                    {slide.desc}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button 
                      onClick={() => { setShopCategory('all'); setActivePage('shop'); }}
                      className="gold-button"
                      style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                      Shop Collections <ArrowRight size={16} />
                    </button>
                    <button 
                      onClick={() => setActivePage('about')}
                      className="gold-button-outline"
                      style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.4)', background: 'transparent' }}
                    >
                      Our Story
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Diamond Pagination Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '14px',
          zIndex: 10
        }}>
          {heroSlides.map((_, idx) => {
            const isActive = idx === activeSlide;
            return (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                style={{
                  width: '7px',
                  height: '7px',
                  backgroundColor: isActive ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.45)',
                  border: 'none',
                  transform: 'rotate(45deg)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0
                }}
                title={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. TRUST ELEMENTS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <div ref={trustRef} className="glass trust-carousel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
          <div>
            <div style={{ color: 'var(--gold-primary)', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}><ShieldCheck size={28} /></div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '4px' }}>100% Anti-Tarnish</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Sweatproof, waterproof organic coating</p>
          </div>
          <div>
            <div style={{ color: 'var(--gold-primary)', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}><Truck size={28} /></div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '4px' }}>Fast Shipping India</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Express courier delivery via Shiprocket</p>
          </div>
          <div>
            <div style={{ color: 'var(--gold-primary)', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}><Award size={28} /></div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '4px' }}>18k Gold Plating</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Rich look and heavy gold micro-plating</p>
          </div>
          <div>
            <div style={{ color: 'var(--gold-primary)', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}><MessageSquare size={28} /></div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '4px' }}>Genuine Support</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>24/7 dedicated WhatsApp support desk</p>
          </div>
        </div>
      </div>

      {/* 3. SHOP BY CATEGORY */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Curated Aesthetics</span>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', marginTop: '8px', color: 'var(--text-primary)', fontWeight: 300 }}>Shop By Category</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="glass"
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                position: 'relative',
                height: '240px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `linear-gradient(to top, rgba(15,15,18,0.9) 0%, rgba(15,15,18,0.2) 100%), url(${cat.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                <h3 style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0, fontWeight: 500 }}>{cat.name}</h3>
                <p style={{ color: '#e0e0e0', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DYNAMIC OFFERS & COUPONS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Limited Time Perks</span>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', marginTop: '8px', color: 'var(--text-primary)', fontWeight: 300 }}>Exclusive Offers & Coupons</h2>
        </div>

        <div ref={couponsRef} className="product-grid-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            { code: 'FREE1000', disc: 'FREE Delivery', desc: 'Get free express delivery on orders above ₹1,000.', tag: 'Free Shipping' },
            { code: 'LOYALGIFT', disc: 'FREE Surprise Gift', desc: 'Complimentary luxury surprise gift for customers buying within 1 month.', tag: 'Monthly Reward' }
          ].map((c) => (
            <div 
              key={c.code}
              className="glass"
              style={{
                padding: '24px',
                borderRadius: '8px',
                borderLeft: '4px solid var(--gold-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ background: 'var(--gold-light)', color: 'var(--gold-primary)', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '3px', fontWeight: 600, textTransform: 'uppercase' }}>
                  {c.tag}
                </span>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', margin: '8px 0 4px' }}>{c.disc}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>{c.desc}</p>
              </div>
              <button 
                onClick={() => handleCopyCoupon(c.code)}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px dashed var(--border-light)',
                  padding: '10px 14px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: 'var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                {copiedCoupon === c.code ? (
                  <>
                    <Check size={14} style={{ color: '#2ecc71' }} />
                    Copied
                  </>
                ) : (
                  <>
                    <Clipboard size={14} />
                    {c.code}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. NEW ARRIVALS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Just Added</span>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', marginTop: '8px', color: 'var(--text-primary)', fontWeight: 300 }}>New Arrivals</h2>
          </div>
          <button onClick={() => { setShopCategory('all'); setActivePage('shop'); }} style={{ color: 'var(--gold-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 500 }}>
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div ref={newArrivalsRef} className="product-grid-scroll home-product-carousel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {newArrivals.map((prod) => (
            <div 
              key={prod.id} 
              className="glass product-card" 
              style={{ borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', background: '#ffffff', boxShadow: '0 2px 16px rgba(131,39,41,0.06)' }}
            >
              {/* Wishlist button overlay */}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleWishlist(prod.id); }}
                style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 3, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <Heart size={18} fill={wishlist.includes(prod.id) ? 'var(--gold-primary)' : 'none'} color={wishlist.includes(prod.id) ? 'var(--gold-primary)' : '#999'} />
              </button>
              {/* Product Image */}
              <div 
                onClick={() => handleProductClick(prod.id)}
                style={{ height: '300px', width: '100%', overflow: 'hidden', cursor: 'pointer', backgroundImage: `url(${prod.image})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }}
              />
              {/* Info */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{prod.category}</span>
                <h4 
                  onClick={() => handleProductClick(prod.id)}
                  style={{ color: 'var(--text-primary)', fontSize: '1rem', margin: 0, fontWeight: 500, lineHeight: 1.3, cursor: 'pointer' }}
                >
                  {prod.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--gold-primary)', fontSize: '1.1rem', fontWeight: 700 }}>₹{prod.price.toLocaleString('en-IN')}</span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.78rem' }}>₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    {prod.discount && prod.discount > 0 && (
                      <span style={{ color: '#e74c3c', fontSize: '0.72rem', fontWeight: 600 }}>({prod.discount}% OFF)</span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleProductClick(prod.id)}
                    style={{ background: 'var(--gold-primary)', border: 'none', borderRadius: '6px', padding: '6px 14px', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em' }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. BEST SELLERS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Customer Favorites</span>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', marginTop: '8px', color: 'var(--text-primary)', fontWeight: 300 }}>Best Sellers</h2>
          </div>
          <button onClick={() => { setShopCategory('all'); setActivePage('shop'); }} style={{ color: 'var(--gold-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 500 }}>
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div ref={bestSellersRef} className="product-grid-scroll home-product-carousel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {bestSellers.map((prod) => (
            <div 
              key={prod.id} 
              className="glass product-card" 
              style={{ borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', background: '#ffffff', boxShadow: '0 2px 16px rgba(131,39,41,0.06)' }}
            >
              {/* Rating badge */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 3, background: 'rgba(241,196,15,0.92)', borderRadius: '20px', padding: '3px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={11} fill="#fff" color="#fff" />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>{prod.rating}</span>
              </div>
              {/* Wishlist button */}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleWishlist(prod.id); }}
                style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 3, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <Heart size={18} fill={wishlist.includes(prod.id) ? 'var(--gold-primary)' : 'none'} color={wishlist.includes(prod.id) ? 'var(--gold-primary)' : '#999'} />
              </button>
              <div 
                onClick={() => handleProductClick(prod.id)}
                style={{ height: '300px', width: '100%', overflow: 'hidden', cursor: 'pointer', backgroundImage: `url(${prod.image})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }}
              />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{prod.category}</span>
                <h4 
                  onClick={() => handleProductClick(prod.id)}
                  style={{ color: 'var(--text-primary)', fontSize: '1rem', margin: 0, fontWeight: 500, lineHeight: 1.3, cursor: 'pointer' }}
                >
                  {prod.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--gold-primary)', fontSize: '1.1rem', fontWeight: 700 }}>₹{prod.price.toLocaleString('en-IN')}</span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.78rem' }}>₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    {prod.discount && prod.discount > 0 && (
                      <span style={{ color: '#e74c3c', fontSize: '0.72rem', fontWeight: 600 }}>({prod.discount}% OFF)</span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleProductClick(prod.id)}
                    style={{ background: 'var(--gold-primary)', border: 'none', borderRadius: '6px', padding: '6px 14px', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em' }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6.5. TRENDING COLLECTION */}
      <div style={{ maxWidth: '1200px', margin: '28px auto', width: '100%', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Viral on Socials</span>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', marginTop: '8px', color: 'var(--text-primary)', fontWeight: 300 }}>Trending Collection</h2>
          </div>
          <button onClick={() => { setShopCategory('all'); setActivePage('shop'); }} style={{ color: 'var(--gold-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 500 }}>
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div ref={trendingRef} className="product-grid-scroll home-product-carousel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {trending.map((prod) => (
            <div 
              key={prod.id} 
              className="glass" 
              style={{ borderRadius: '8px', overflow: 'hidden', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}
            >
              {/* Trending badge */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 3, background: 'rgba(131,39,41,0.88)', borderRadius: '20px', padding: '3px 10px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>🔥 TRENDING</span>
              </div>
              {/* Wishlist button */}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleWishlist(prod.id); }}
                style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 3, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <Heart size={18} fill={wishlist.includes(prod.id) ? 'var(--gold-primary)' : 'none'} color={wishlist.includes(prod.id) ? 'var(--gold-primary)' : '#999'} />
              </button>
              <div 
                onClick={() => handleProductClick(prod.id)}
                style={{ height: '300px', width: '100%', overflow: 'hidden', cursor: 'pointer', backgroundImage: `url(${prod.image})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }}
              />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{prod.category}</span>
                <h4 
                  onClick={() => handleProductClick(prod.id)}
                  style={{ color: 'var(--text-primary)', fontSize: '1rem', margin: 0, fontWeight: 500, lineHeight: 1.3, cursor: 'pointer' }}
                >
                  {prod.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--gold-primary)', fontSize: '1.1rem', fontWeight: 700 }}>₹{prod.price.toLocaleString('en-IN')}</span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.78rem' }}>₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    {prod.discount && prod.discount > 0 && (
                      <span style={{ color: '#e74c3c', fontSize: '0.72rem', fontWeight: 600 }}>({prod.discount}% OFF)</span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleProductClick(prod.id)}
                    style={{ background: 'var(--gold-primary)', border: 'none', borderRadius: '6px', padding: '6px 14px', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em' }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. WHY CHOOSE MAA DIARIES */}
      <div style={{ background: 'var(--bg-secondary)', padding: '56px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Uncompromised Quality</span>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', marginTop: '8px', color: 'var(--text-primary)', fontWeight: 300 }}>Why Choose Maa Diaries?</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div className="glass" style={{ padding: '30px', borderRadius: '6px' }}>
              <div style={{ color: 'var(--gold-primary)', marginBottom: '16px' }}><Heart size={28} /></div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '12px', fontWeight: 500 }}>Heritage-Inspired Designs</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Celebrating India's rich culture and divine grace. Our collections are inspired by traditional motifs, bringing a touch of history and timeless beauty to modern ensembles.
              </p>
            </div>
            <div className="glass" style={{ padding: '30px', borderRadius: '6px' }}>
              <div style={{ color: 'var(--gold-primary)', marginBottom: '16px' }}><Award size={28} /></div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '12px', fontWeight: 500 }}>Handcrafted with Love</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Designed and crafted by local Indian artisans. Every piece is meticulously handmade with a focus on purity, authentic aesthetics, and exceptional attention to detail.
              </p>
            </div>
            <div className="glass" style={{ padding: '30px', borderRadius: '6px' }}>
              <div style={{ color: 'var(--gold-primary)', marginBottom: '16px' }}><ShieldCheck size={28} /></div>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '12px', fontWeight: 500 }}>Premium Anti-Tarnish Polish</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Crafted with 18k micro-rolled-gold plating over a skin-safe base. Fully water-resistant and hypoallergenic, ensuring long-lasting lustre for everyday wear.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. CUSTOMER REVIEWS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Hear from our clients</span>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', marginTop: '8px', color: 'var(--text-primary)', fontWeight: 300 }}>Customer Reviews</h2>
        </div>

        <div ref={reviewsRef} className="product-grid-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[
            { name: 'Aishwarya R.', city: 'Mumbai', text: 'Stunning anti-tarnish payals! I was skeptical but I have been wearing them daily in the shower and there is zero change in shine. Absolutely love Maa Diaries.', rating: 5 },
            { name: 'Megha S.', city: 'Delhi', text: 'The metal clutchers are so strong and hold my thick hair perfectly. The rose theme packaging felt incredibly premium and luxury. Will buy again!', rating: 5 },
            { name: 'Kavita J.', city: 'Bangalore', text: 'Highly recommend the Kashmiri Jhumke. Heavy details but extremely lightweight on the ears. Hypoallergenic claim is true—no itchiness at all!', rating: 5 }
          ].map((rev, idx) => (
            <div key={idx} className="glass" style={{ padding: '30px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '4px', color: '#f1c40f' }}>
                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={16} fill="#f1c40f" />)}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{rev.text}"
              </p>
              <div>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', margin: 0 }}>{rev.name}</h4>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{rev.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. INSTAGRAM SOCIAL FEED */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px', marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Join the community</span>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', marginTop: '8px', color: 'var(--text-primary)', fontWeight: 300 }}>Instagram Social Feed</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Click on any post or reel to watch on our official page <a href="https://www.instagram.com/maadiaries_?igsh=MTkxNGlydGhscXR6aA==" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-primary)', fontWeight: 500, textDecoration: 'underline' }}>@maadiaries_</a>
          </p>
        </div>

        <div ref={instagramRef} className="product-grid-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[
            { 
              type: 'Reel', 
              likes: '2.4k', 
              comments: '184', 
              img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80',
              title: 'Aesthetic 18k Rolled Gold Bangles Collection ✨'
            },
            { 
              type: 'Post', 
              likes: '1.8k', 
              comments: '96', 
              img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80',
              title: 'Water-resistant anti-tarnish premium chains 💧'
            },
            { 
              type: 'Reel', 
              likes: '3.1k', 
              comments: '245', 
              img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=80',
              title: 'Premium Claw Clips & Hair Scrunchies Aesthetics 🎀'
            },
            { 
              type: 'Post', 
              likes: '1.5k', 
              comments: '78', 
              img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80',
              title: 'Stackable minimalist anti-tarnish rings collection 💍'
            },
          ].map((feed, idx) => (
            <a 
              key={idx}
              href="https://www.instagram.com/maadiaries_?igsh=MTkxNGlydGhscXR6aA==" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                height: '280px',
                cursor: 'pointer',
                display: 'block',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                border: '1px solid var(--border-light)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                const overlay = e.currentTarget.querySelector('.insta-overlay') as HTMLDivElement;
                if (overlay) overlay.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                const overlay = e.currentTarget.querySelector('.insta-overlay') as HTMLDivElement;
                if (overlay) overlay.style.opacity = '0';
              }}
            >
              {/* Type Badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {feed.type === 'Reel' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateY(0.5px)' }}>
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                    <line x1="15" y1="3" x2="15" y2="21"></line>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="3" y1="15" x2="21" y2="15"></line>
                  </svg>
                )}
                {feed.type}
              </div>

              {/* Image */}
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${feed.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.5s ease'
                }}
              />

              {/* Hover Overlay */}
              <div 
                className="insta-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(131, 39, 41, 0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  color: '#ffffff',
                  textAlign: 'center'
                }}
              >
                {/* Instagram Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '14px' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>

                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', margin: '0 0 16px', lineHeight: 1.4 }}>
                  "{feed.title}"
                </p>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.88rem', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {feed.likes}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                    </svg>
                    {feed.comments}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 10. FLOATING WHATSAPP CHAT BUTTON */}
      <div 
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000
        }}
      >
        <button 
          onClick={handleWhatsAppChat}
          title="Chat on WhatsApp"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#25D366',
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="#ffffff">
            <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.46 3.415 1.258 4.864L2.03 22.03l5.312-1.393c1.4.76 2.99 1.196 4.67 1.196 5.505 0 9.988-4.482 9.988-9.988S17.518 2 12.01 2zm4.767 14.286c-.2.56-1.18 1.08-1.63 1.13-.43.05-.98.24-2.88-.54-2.44-1-4.01-3.49-4.13-3.65-.12-.15-.99-1.31-.99-2.5 0-1.19.62-1.78.84-2.02.2-.24.45-.3.6-.3.15 0 .3 0 .44.01.15.01.35-.06.55.42.2.49.69 1.68.75 1.8.06.12.1.27.02.43-.08.16-.18.27-.3.41-.12.14-.26.31-.37.42-.12.13-.25.27-.11.51.14.24.62 1.01 1.32 1.63.9.79 1.66 1.04 1.89 1.16.24.12.38.1.52-.06.14-.17.6-.7 1.12-.95.19-.09.38-.08.57 0 .2.08 1.25.59 1.46.7.2.1.34.15.39.24.06.09.06.52-.14 1.08z"/>
          </svg>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-slider-container {
            width: 100% !important;
            border-radius: 0 !important;
            margin: 0 !important;
            height: 55vh !important;
          }
          .hero-slider-container h1 {
            font-size: clamp(2rem, 9vw, 2.7rem) !important;
            margin-bottom: 12px !important;
          }
          .hero-slider-container p {
            font-size: 0.85rem !important;
            margin-bottom: 20px !important;
          }
          .hero-slider-container .gold-button,
          .hero-slider-container .gold-button-outline {
            padding: 10px 14px !important;
            font-size: 0.72rem !important;
          }
          .product-grid-scroll {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 16px !important;
            padding: 10px 20px 24px 20px !important;
            scroll-behavior: smooth !important;
            scrollbar-width: none !important;
          }
          .product-grid-scroll::-webkit-scrollbar {
            display: none !important;
          }
          /* Product carousels: one card at a time, next card peeks */
          .home-product-carousel > div {
            flex: 0 0 85vw !important;
            max-width: 340px !important;
            scroll-snap-align: center !important;
          }
          /* Coupon / review cards keep smaller fixed width */
          .product-grid-scroll:not(.home-product-carousel) > div {
            flex: 0 0 80vw !important;
            max-width: 320px !important;
            scroll-snap-align: start !important;
          }
          .product-card {
            border-radius: 12px !important;
          }
          .trust-carousel {
            display: flex !important;
            overflow-x: auto !important;
            gap: 14px !important;
            padding: 20px 14px !important;
            scroll-snap-type: x mandatory !important;
            scroll-behavior: smooth !important;
            scrollbar-width: none !important;
          }
          .trust-carousel::-webkit-scrollbar { display: none !important; }
          .trust-carousel > div {
            flex: 0 0 100% !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </div>
  );
};
