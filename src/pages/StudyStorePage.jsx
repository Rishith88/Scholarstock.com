import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const PRODUCTS = [
  { id: 'p1', name: 'Engineering Mathematics — B.S. Grewal', category: 'Reference Books', price: 450, originalPrice: 680, image: '📘', rating: 4.8, reviews: 324, seller: 'ScholarStock Official', badge: 'Bestseller', stock: 45, description: 'The definitive textbook for engineering math covering Calculus, Linear Algebra, Complex Analysis, and Numerical Methods.', features: ['Latest Edition', 'Includes Solutions', 'Hardcover'], condition: 'New' },
  { id: 'p2', name: 'Fundamentals of Physics — Halliday & Resnick', category: 'Reference Books', price: 520, originalPrice: 850, image: '📗', rating: 4.9, reviews: 567, seller: 'ScholarStock Official', badge: 'Top Pick', stock: 32, description: 'Comprehensive physics textbook used in 90% of universities worldwide.', features: ['11th Edition', 'WileyPLUS Access', 'Full Color'], condition: 'New' },
  { id: 'p3', name: 'Data Structures & Algorithms Made Easy', category: 'Reference Books', price: 380, originalPrice: 550, image: '📙', rating: 4.7, reviews: 891, seller: 'ScholarStock Official', badge: 'Bestseller', stock: 78, description: 'The gold standard for DSA interview preparation with 700+ problems.', features: ['C/C++/Java', 'Interview Ready', 'Updated 2026'], condition: 'New' },
  { id: 'p4', name: 'Organic Chemistry — Morrison & Boyd', category: 'Reference Books', price: 490, originalPrice: 720, image: '📕', rating: 4.6, reviews: 234, seller: 'ScholarStock Official', badge: null, stock: 28, description: 'Classic organic chemistry reference with detailed reaction mechanisms and stereochemistry.', features: ['7th Edition', 'Mechanism Focus', 'Practice Sets'], condition: 'New' },
  { id: 'p5', name: 'Handwritten Calculus Notes Bundle', category: 'Study Notes', price: 120, originalPrice: 200, image: '📝', rating: 4.9, reviews: 156, seller: 'Priya S. (IIT Delhi)', badge: 'Student Pick', stock: 999, description: 'Beautifully handwritten, color-coded calculus notes covering all semester topics. PDF download.', features: ['30+ Pages', 'Color Coded', 'Exam Focused'], condition: 'Digital' },
  { id: 'p6', name: 'Machine Learning Crash Course Kit', category: 'Study Kits', price: 650, originalPrice: 1200, image: '🧠', rating: 4.8, reviews: 89, seller: 'ScholarStock Official', badge: 'Bundle Deal', stock: 15, description: 'Complete ML starter kit: textbook + notebook + cheatsheets + practice datasets.', features: ['4 Items', 'Beginner Friendly', 'Project Based'], condition: 'New' },
  { id: 'p7', name: 'Previous Year Question Papers (CS)', category: 'Question Banks', price: 80, originalPrice: 150, image: '📋', rating: 4.5, reviews: 445, seller: 'Rahul M. (BITS)', badge: null, stock: 999, description: '10 years of CS previous year exams with detailed solutions. Digital download.', features: ['2016-2026', 'Solutions Included', 'Topic Wise'], condition: 'Digital' },
  { id: 'p8', name: 'Scientific Calculator — Casio fx-991EX', category: 'Stationery', price: 1350, originalPrice: 1650, image: '🧮', rating: 4.7, reviews: 198, seller: 'ScholarStock Official', badge: null, stock: 22, description: 'Advanced scientific calculator with spreadsheet, QR code, and 552 functions.', features: ['552 Functions', 'Solar+Battery', 'QR Code'], condition: 'New' },
  { id: 'p9', name: 'Premium Notebook Set (5 Pack)', category: 'Stationery', price: 280, originalPrice: 400, image: '📓', rating: 4.6, reviews: 312, seller: 'ScholarStock Official', badge: null, stock: 55, description: 'A5 ruled notebooks with premium 80gsm paper, perfect for lecture notes.', features: ['200 Pages Each', '80gsm Paper', 'Lay Flat Design'], condition: 'New' },
  { id: 'p10', name: 'DSA Cheatsheet Poster Set', category: 'Study Kits', price: 150, originalPrice: 250, image: '🗺️', rating: 4.8, reviews: 267, seller: 'ScholarStock Official', badge: 'Student Pick', stock: 40, description: 'Set of 4 large posters covering all major data structures and algorithms with complexities.', features: ['4 Posters', 'A2 Size', 'Laminated'], condition: 'New' },
];

const CATEGORIES = ['All', 'Reference Books', 'Study Notes', 'Study Kits', 'Question Banks', 'Stationery'];

export default function StudyStorePage() {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState({});

  const filtered = PRODUCTS
    .filter(p => (filter === 'All' || p.category === filter) && p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'price-low' ? a.price - b.price : sortBy === 'price-high' ? b.price - a.price : sortBy === 'rating' ? b.rating - a.rating : b.reviews - a.reviews);

  const getQty = (id) => quantities[id] || 1;
  const setQty = (id, q) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, Math.min(10, q)) }));

  const handleAddToCart = (product) => {
    if (!isLoggedIn) { toast('Please login to add to cart', 'error'); return; }
    addToCart(product.category, product.name, product.price * getQty(product.id), product.id, `${product.name} x${getQty(product.id)}`, 0);
    toast(`🛒 ${product.name} added to cart!`, 'success');
    if (window.ssSound) window.ssSound('add');
  };

  const handleBuyNow = (product) => {
    if (!isLoggedIn) { toast('Please login to purchase', 'error'); return; }
    toast(`⚡ Redirecting to checkout for ${product.name}...`, 'success');
    if (window.ssSound) window.ssSound('success');
  };

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
          <div key={product.id} className="glass" style={{ borderRadius: '18px', overflow: 'hidden', transition: 'all .3s', position: 'relative' }}>
            {product.badge && (
              <div style={{ position: 'absolute', top: '.8rem', left: '.8rem', zIndex: 2, fontSize: '.62rem', padding: '.25rem .6rem', borderRadius: '50px', fontWeight: 700, background: product.badge === 'Bestseller' ? 'rgba(245,158,11,.2)' : product.badge === 'Top Pick' ? 'rgba(16,185,129,.2)' : product.badge === 'Bundle Deal' ? 'rgba(139,92,246,.2)' : 'rgba(59,130,246,.2)', color: product.badge === 'Bestseller' ? 'var(--gold)' : product.badge === 'Top Pick' ? 'var(--green)' : product.badge === 'Bundle Deal' ? 'var(--purple)' : 'var(--blue2)' }}>
                {product.badge}
              </div>
            )}

            {/* Product Image Area */}
            <div style={{ height: '140px', background: 'linear-gradient(135deg, rgba(59,130,246,.08), rgba(139,92,246,.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => setSelectedProduct(selectedProduct?.id === product.id ? null : product)}>
              <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.3))' }}>{product.image}</div>
            </div>

            <div style={{ padding: '1.2rem 1.5rem' }}>
              <div style={{ fontSize: '.68rem', color: 'var(--purple)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '.3rem' }}>{product.category}</div>
              <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: '.4rem', lineHeight: 1.4, cursor: 'pointer' }}
                onClick={() => setSelectedProduct(selectedProduct?.id === product.id ? null : product)}>
                {product.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.5rem' }}>
                <span style={{ color: 'var(--gold)' }}>⭐ {product.rating}</span>
                <span>({product.reviews} reviews)</span>
                <span>· {product.seller}</span>
              </div>

              {product.features && (
                <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', marginBottom: '.8rem' }}>
                  {product.features.map(f => <span key={f} style={{ fontSize: '.62rem', padding: '.15rem .4rem', borderRadius: '4px', background: 'rgba(16,185,129,.1)', color: 'var(--green)', fontWeight: 600 }}>{f}</span>)}
                </div>
              )}

              {selectedProduct?.id === product.id && (
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
                    <button onClick={() => setQty(product.id, getQty(product.id) - 1)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid var(--gb)', background: 'var(--glass)', color: 'var(--white)', cursor: 'pointer', fontSize: '.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontSize: '.85rem', fontWeight: 700, width: '20px', textAlign: 'center' }}>{getQty(product.id)}</span>
                    <button onClick={() => setQty(product.id, getQty(product.id) + 1)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid var(--gb)', background: 'var(--glass)', color: 'var(--white)', cursor: 'pointer', fontSize: '.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
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
      </div>
    </div>
  );
}
