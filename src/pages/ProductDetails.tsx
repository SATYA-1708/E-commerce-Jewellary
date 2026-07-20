import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, ShoppingBag, Heart, ShieldCheck, MapPin, Truck, Star } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { 
    selectedProductId, 
    products, 
    addToCart, 
    setCartOpen, 
    toggleWishlist, 
    wishlist, 
    setActivePage,
    setTriggerGemRain,
    getProductReviews,
    submitProductReview,
    currentUser,
    orders
  } = useStore();

  const product = products.find(p => p.id === selectedProductId);

  // Configuration selections
  const selectedMetal = product?.metalOptions[0] || '18k Yellow Gold';
  const selectedStone = product?.stoneOptions[0] || '1.0ct VVS1 Diamond';

  // Shipping widget states
  const [checkPincode, setCheckPincode] = useState('');
  const [shippingEstimate, setShippingEstimate] = useState<string | null>(null);
  const [logisticsPartner, setLogisticsPartner] = useState<string | null>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  // Reviews states
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Check if currentUser has purchased, paid, and received this product
  const hasPurchasedAndPaidAndDelivered = () => {
    if (!currentUser) return false;
    
    // Find all orders for this user (matching email or phone)
    const userOrders = orders.filter(o => 
      (o.customerEmail && currentUser.email && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
      (o.customerPhone && currentUser.phone && o.customerPhone === currentUser.phone)
    );

    // Look for a delivered and paid order containing this product ID
    return userOrders.some(order => {
      // Must be delivered
      const isDelivered = order.status === 'Delivered';
      // Must be paid
      const isPaid = order.paymentStatus === 'Paid';
      // Must contain the product ID
      const hasProduct = order.items && order.items.some((item: any) => item.id === product?.id);

      return isDelivered && isPaid && hasProduct;
    });
  };

  const filteredAndSortedReviews = (rawReviews: any[]) => {
    return rawReviews
      .filter((r: any) => r.rating === 5 || r.rating === 4)
      .sort((a: any, b: any) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  };

  useEffect(() => {
    if (selectedProductId) {
      getProductReviews(selectedProductId).then((rawReviews) => {
        setReviews(filteredAndSortedReviews(rawReviews));
      });
    }
    // Reset review form when switching products
    setReviewRating(5);
    setReviewComment('');
    setReviewSubmitted(false);
    setReviewError(null);
  }, [selectedProductId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !currentUser) return;
    if (!reviewComment.trim()) {
      setReviewError("Please write a comment for your review.");
      return;
    }

    setReviewLoading(true);
    setReviewError(null);

    try {
      const newReview = await submitProductReview({
        productId: product.id,
        userName: currentUser.name,
        rating: reviewRating,
        comment: reviewComment
      });

      setReviews(prev => {
        const updated = [newReview, ...prev];
        return filteredAndSortedReviews(updated);
      });
      setReviewComment('');
      setReviewRating(5);
      setReviewSubmitted(true);
    } catch (err: any) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  if (!product) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h3>Product Not Found</h3>
        <button onClick={() => setActivePage('shop')} className="gold-button-outline" style={{ marginTop: '16px' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const isWished = wishlist.includes(product.id);

  const getCustomPrice = () => {
    return product.price;
  };

  const calculatedPrice = getCustomPrice();

  const handleAddToCart = () => {
    window.dispatchEvent(new CustomEvent('product-added', { detail: { image: product.image } }));
    addToCart({
      product: {
        id: product.id,
        name: product.name,
        price: calculatedPrice,
        image: product.image,
        category: product.category
      },
      quantity: 1,
      selectedMetal,
      selectedStone,
      customEngraving: undefined
    });
    setTriggerGemRain(true); // Gem Rain!
    setCartOpen(true);
  };

  // Indian Pincode Validator for local delivery estimate
  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError(null);
    setShippingEstimate(null);
    setLogisticsPartner(null);

    if (checkPincode.length !== 6 || !/^\d+$/.test(checkPincode)) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    const prefix3 = checkPincode.substring(0, 3);
    
    // Classify Metros vs Tier-2/3
    const isMetro = ['400', '110', '560', '600', '700', '500', '380'].includes(prefix3);

    setTimeout(() => {
      setShippingEstimate('within 15 days from ordered date');
      if (isMetro) {
        setLogisticsPartner('BlueDart Air Express (Insured)');
      } else {
        setLogisticsPartner('Delhivery Premium Logistics');
      }
    }, 800); // 800ms loading effect
  };

  return (
    <div className="product-page page-shell" style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 24px',
      minHeight: '80vh'
    }}>
      {/* Back to catalog breadcrumb */}
      <button 
        onClick={() => setActivePage('shop')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          marginBottom: '32px'
        }}
        className="back-btn"
      >
        <ArrowLeft size={16} /> Back to collections
      </button>

      <div className="product-details-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '64px',
        alignItems: 'start'
      }}>
        {/* Left column: Product Image */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass gem-glint product-image" style={{
            borderRadius: '12px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            overflow: 'hidden',
            height: '450px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Wishlist floating toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(7, 7, 8, 0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isWished ? 'var(--gold-primary)' : '#fff',
                zIndex: 10
              }}
            >
              <Heart size={20} fill={isWished ? 'var(--gold-primary)' : 'none'} />
            </button>
          </div>

          {/* Lifetime Guarantee Badge */}
          <div className="glass" style={{
            padding: '16px',
            borderRadius: '8px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <ShieldCheck size={28} style={{ color: 'var(--gold-primary)' }} />
            <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
              <strong>Lifetime Anti-Tarnish Guarantee</strong>
              <div style={{ color: 'var(--text-secondary)' }}>Waterproof, sweatproof, and skin-friendly hypoallergenic bases.</div>
            </div>
          </div>
        </div>

        {/* Right column: Configurator Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '8px' }}>
              {product.category.toUpperCase()} Collection
            </span>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', marginBottom: '8px', lineHeight: '1.2' }}>
              {product.name}
            </h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              ★ {product.rating} ({product.reviewsCount} verified reviews)
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 300 }}>
            {product.description}
          </p>

          <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }} />



          {/* Pricing area */}
          <div className="product-price-row" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '6px',
            border: '1px solid var(--border-light)'
          }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Selected Configuration Price</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: '1.8rem', color: 'var(--gold-primary)' }}>
                  ₹{calculatedPrice.toLocaleString('en-IN')}
                </strong>
                {product.originalPrice && product.originalPrice > calculatedPrice && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1rem' }}>
                    MRP: ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discount && product.discount > 0 && (
                  <span style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={handleAddToCart}
              className="gold-button"
              style={{ display: 'flex', gap: '8px' }}
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>
          </div>

          {/* PINCODE LOGISTICS ESTIMATOR */}
          <div className="glass" style={{
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)'
          }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} style={{ color: 'var(--gold-primary)' }} /> Estimate Shipping (India Only)
            </h4>
            <form onSubmit={handlePincodeCheck} className="pincode-form" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode (e.g. 400001)"
                value={checkPincode}
                onChange={e => setCheckPincode(e.target.value.replace(/\D/g, ''))}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  padding: '10px 14px',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              />
              <button 
                type="submit" 
                className="gold-button-outline"
                style={{ padding: '0 20px', fontSize: '0.8rem' }}
              >
                Check
              </button>
            </form>

            {pincodeError && <span style={{ fontSize: '0.75rem', color: '#e74c3c' }}>{pincodeError}</span>}

            {shippingEstimate && (
              <div style={{
                marginTop: '12px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                <Truck size={18} style={{ color: 'var(--gold-primary)' }} />
                <div>
                  Delivery Partner: <strong style={{ color: 'var(--text-primary)' }}>{logisticsPartner}</strong>
                  <br />
                  Est. Delivery: <strong style={{ color: 'var(--text-primary)' }}>{shippingEstimate}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Specifications Table */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', color: 'var(--gold-primary)' }}>
              Specifications Detail
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Base Metal Core</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{product.specs.metal}</td>
                </tr>
                {product.specs.coating && (
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Protective Coating</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{product.specs.coating}</td>
                  </tr>
                )}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Stone Sourcing</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{product.specs.stoneType}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Durability</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{product.specs.durability}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Craft Finish</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{product.specs.finish}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Product Reviews Section */}
      <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', margin: '60px 0 40px' }} />
      
      <div className="product-reviews-section" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', marginBottom: '32px', color: 'var(--text-primary)' }}>
          Customer Reviews & Ratings
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column: Review Form / Score Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div className="glass" style={{
              padding: '24px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '3rem', fontWeight: 300, color: 'var(--gold-primary)', lineHeight: 1 }}>
                {product.rating}
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '12px 0 6px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    fill={star <= Math.round(product.rating) ? 'var(--gold-primary)' : 'none'} 
                    color={star <= Math.round(product.rating) ? 'var(--gold-primary)' : 'var(--text-muted)'} 
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Based on {reviews.length} verified reviews
              </span>
            </div>

            {/* Write a Review Form */}
            <div className="glass" style={{
              padding: '28px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)'
            }}>
              <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px', color: 'var(--text-primary)' }}>
                Write a Review
              </h4>

              {!currentUser ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                    Only registered customers who purchased from us can leave a product review.
                  </p>
                  <button 
                    onClick={() => setActivePage('account')}
                    className="gold-button-outline"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
                  >
                    Log In / Register
                  </button>
                </div>
              ) : !hasPurchasedAndPaidAndDelivered() ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                    Only verified customers who purchased this product, completed their payment, and had the item delivered can leave a review.
                  </p>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--gold-primary)',
                    backgroundColor: 'rgba(212, 175, 55, 0.05)',
                    border: '1px solid var(--border-light)',
                    padding: '10px',
                    borderRadius: '4px',
                    fontWeight: 500
                  }}>
                    Requirement: Paid & Delivered Order
                  </div>
                </div>
              ) : reviewSubmitted ? (
                <div style={{ textAlign: 'center', padding: '20px 0', animation: 'fadeIn 0.4s ease' }}>
                  <span style={{ fontSize: '2.5rem', color: 'var(--gold-primary)' }}>✓</span>
                  <h5 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: '10px 0 6px' }}>Review Submitted!</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Thank you for sharing your experience. Your feedback keeps us going!
                  </p>
                  <button 
                    onClick={() => setReviewSubmitted(false)}
                    className="gold-button-outline"
                    style={{ marginTop: '16px', padding: '6px 16px', fontSize: '0.78rem' }}
                  >
                    Write another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Interactive Star Picker */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Overall Rating:
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', outline: 'none' }}
                        >
                          <Star 
                            size={24} 
                            fill={star <= reviewRating ? 'var(--gold-primary)' : 'none'} 
                            color={star <= reviewRating ? 'var(--gold-primary)' : 'var(--text-muted)'} 
                            style={{ transition: 'transform 0.15s ease' }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Review Comment:
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share your thoughts on the metal finish, shine, and fit..."
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '4px',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        resize: 'none'
                      }}
                    />
                  </div>

                  {reviewError && (
                    <span style={{ fontSize: '0.78rem', color: '#e74c3c' }}>
                      {reviewError}
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="gold-button"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    {reviewLoading ? 'Submitting Review...' : 'Post Review'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', color: 'var(--text-primary)' }}>
              Latest Verified Reviews
            </h4>

            {reviews.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                border: '1px dashed var(--border-light)',
                borderRadius: '8px',
                color: 'var(--text-muted)'
              }}>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>No reviews yet for this product. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '550px', overflowY: 'auto', paddingRight: '8px' }} className="reviews-scroller">
                {reviews.map((rev) => (
                  <div 
                    key={rev.id} 
                    className="glass" 
                    style={{
                      padding: '20px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-light)',
                      animation: 'slideDown 0.3s ease-out'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {rev.userName}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={12} 
                          fill={star <= rev.rating ? 'var(--gold-primary)' : 'none'} 
                          color={star <= rev.rating ? 'var(--gold-primary)' : 'var(--text-muted)'} 
                        />
                      ))}
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
