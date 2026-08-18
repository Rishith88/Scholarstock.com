import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

const CATEGORIES = ['All', 'Reference Books', 'Study Notes', 'Study Kits', 'Question Banks', 'Stationery'];

export default function StudyStorePage() {
  const { isLoggedIn, token } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [filter, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = new URL(`${API_URL}/api/study-store/products`);
      if (filter !== 'All') url.searchParams.append('category', filter);
      if (search) url.searchParams.append('search', search);
      url.searchParams.append('sort', sortBy);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getQty = (id) => quantities[id] || 1;
  const setQty = (id, q) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, Math.min(10, q)) }));

  const handleAddToCart = (product) => {
    if (!isLoggedIn) { toast('Please login to add to cart', 'error'); return; }
    addToCart(product.category, product.name, product.price * getQty(product._id), product._id, `${product.name} x${getQty(product._id)}`, 0);
    toast(`🛒 ${product.name} added to cart!`, 'success');
    if (window.ssSound) window.ssSound('add');
  };

  const handleBuyNow = (product) => {
    if (!isLoggedIn) { toast('Please login to purchase', 'error'); return; }
    toast(`⚡ Redirecting to checkout for ${product.name}...`, 'success');
    if (window.ssSound) window.ssSound('success');
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const filtered = products; // Data is filtered on backend now

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Shop & Study</div>
      <h2 className="sec-title">🏪 Study Materials Store</h2>

      {/* Banner */}
      <div className="glass" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(59,130,246,.1), rgba(139,92,246,.08))', borderColor: 'rgba(59,130,246,.2)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.5rem' }}>📚 Everything You Need to Ace Your Exams</h3>
        <p style={{ color: 'var(--muted)', fontSize: '.9rem', maxWidth: '600px', margin: '0 auto' }}>Reference books, study notes, question banks, and more — all at student-friendly prices with free delivery on orders above ₹500.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
          {[{ icon: '📦', label: 'Free Delivery', sub: 'Above ₹500' }, { icon: '💰', label: 'Up to 45% Off', sub: 'Student Discounts' }, { icon: '✅', label: 'Verified Quality', sub: 'Curated Materials' }].map((f, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>{f.icon}</div>
              <div style={{ fontSize: '.78rem', fontWeight: 700, marginTop: '.2rem' }}>{f.label}</div>
              <div style={{ fontSize: '.65rem', color: 'var(--muted)' }}>{f.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '.8rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search products..."
          style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.6rem 1rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', flex: 1, minWidth: '200px' }} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.6rem 1rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit' }}>
          <option value="popular">🔥 Most Popular</option>
          <option value="price-low">💰 Price: Low→High</option>
          <option value="price-high">💰 Price: High→Low</option>
          <option value="rating">⭐ Top Rated</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: '.4rem .9rem', borderRadius: '50px', border: 'none', background: filter === c ? 'rgba(59,130,246,.3)' : 'var(--glass)', color: filter === c ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.78rem', fontFamily: 'inherit' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.2rem' }}>
        {filtered.map(product => (
          <div key={product._id} className="glass" style={{ borderRadius: '18px', overflow: 'hidden', transition: 'all .3s', position: 'relative' }}>
            {product.badge && (
              <div style={{ position: 'absolute', top: '.8rem', left: '.8rem', zIndex: 2, fontSize: '.62rem', padding: '.25rem .6rem', borderRadius: '50px', fontWeight: 700, background: product.badge === 'Bestseller' ? 'rgba(245,158,11,.2)' : product.badge === 'Top Pick' ? 'rgba(16,185,129,.2)' : product.badge === 'Bundle Deal' ? 'rgba(139,92,246,.2)' : 'rgba(59,130,246,.2)', color: product.badge === 'Bestseller' ? 'var(--gold)' : product.badge === 'Top Pick' ? 'var(--green)' : product.badge === 'Bundle Deal' ? 'var(--purple)' : 'var(--blue2)' }}>
                {product.badge}
              </div>
            )}

            {/* Product Image Area */}
            <div style={{ height: '140px', background: 'linear-gradient(135deg, rgba(59,130,246,.08), rgba(139,92,246,.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setSelectedProduct(selectedProduct?._id === product._id ? null : product)}>
              <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.3))' }}>{product.image}</div>
            </div>

            <div style={{ padding: '1.2rem 1.5rem' }}>
              <div style={{ fontSize: '.68rem', color: 'var(--purple)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '.3rem' }}>{product.category}</div>
              <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: '.4rem', lineHeight: 1.4, cursor: 'pointer' }}
                onClick={() => setSelectedProduct(selectedProduct?._id === product._id ? null : product)}>
                {product.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.5rem' }}>
                <span style={{ color: 'var(--gold)' }}>⭐ {product.rating}</span>
                <span>({product.reviews} reviews)</span>
                <span>· {product.seller || 'ScholarStock Official'}</span>
              </div>

              {product.features && (
                <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', marginBottom: '.8rem' }}>
                  {product.features.map(f => <span key={f} style={{ fontSize: '.62rem', padding: '.15rem .4rem', borderRadius: '4px', background: 'rgba(16,185,129,.1)', color: 'var(--green)', fontWeight: 600 }}>{f}</span>)}
                </div>
              )}

              {selectedProduct?._id === product._id && (
                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gb)' }}>
                  <p style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>{product.description}</p>
                  <div style={{ marginTop: '.5rem', fontSize: '.75rem', color: 'var(--muted2)' }}>
                    Condition: <strong style={{ color: 'var(--white)' }}>{product.condition}</strong> · Stock: <strong style={{ color: product.stock < 20 ? 'var(--red)' : 'var(--green)' }}>{product.stock < 20 ? `Only ${product.stock} left!` : 'In Stock'}</strong>
                  </div>
                </div>
              )}

              {/* Price & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
                <div>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--green)', fontFamily: "'Playfair Display', serif" }}>₹{product.price}</span>
                  <span style={{ fontSize: '.8rem', color: 'var(--muted2)', textDecoration: 'line-through', marginLeft: '.5rem' }}>₹{product.originalPrice}</span>
                  <span style={{ fontSize: '.7rem', color: 'var(--green)', fontWeight: 700, marginLeft: '.5rem' }}>{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>
                </div>
                {product.condition !== 'Digital' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                    <button onClick={() => setQty(product._id, getQty(product._id) - 1)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid var(--gb)', background: 'var(--glass)', color: 'var(--white)', cursor: 'pointer', fontSize: '.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontSize: '.85rem', fontWeight: 700, width: '20px', textAlign: 'center' }}>{getQty(product._id)}</span>
                    <button onClick={() => setQty(product._id, getQty(product._id) + 1)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid var(--gb)', background: 'var(--glass)', color: 'var(--white)', cursor: 'pointer', fontSize: '.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '.5rem' }}>
                <button className="btn btn-ghost" onClick={() => handleAddToCart(product)} style={{ flex: 1, padding: '.6rem', fontSize: '.8rem' }}>
                  🛒 Add to Cart
                </button>
                <button className="btn btn-grad" onClick={() => handleBuyNow(product)} style={{ flex: 1, padding: '.6rem', fontSize: '.8rem' }}>
                  ⚡ Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)', gridColumn: '1 / -1' }}>No products found in the store.</div>
        )}
      </div>
    </div>
  );
}
