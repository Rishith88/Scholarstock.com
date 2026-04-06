import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function WishlistPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem('ss_wishlist') || '[]');
  });

  function removeItem(id) {
    const w = wishlist.filter(x => x._id !== id);
    localStorage.setItem('ss_wishlist', JSON.stringify(w));
    setWishlist(w);
    toast('Removed from wishlist');
  }

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Saved Materials</div>
      <h2 className="sec-title">❤️ My Wishlist</h2>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤍</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '.5rem' }}>Your wishlist is empty</div>
          <div style={{ fontSize: '.9rem' }}>Browse materials and tap the heart icon to save them here!</div>
          <button className="btn btn-grad" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/browse')}>Browse Materials</button>
        </div>
      ) : (
        <div className="doc-grid">
          {wishlist.map(m => {
            const isFree = m.pricePerDay === 0;
            const isSubcat = m._id?.startsWith('subcat_');
            return (
              <div key={m._id} className="doc-card">
                <button className="wish-btn active" onClick={() => removeItem(m._id)} title="Remove">❤️</button>
                <div className="doc-top">
                  <span className={`tag ${isSubcat ? 'tgo' : 'tbl'}`}>{isSubcat ? '📂 Subcategory' : m.examLabel || 'Study'}</span>
                  <div style={{ fontSize: '.7rem', color: 'var(--muted2)' }}>Saved {new Date(m.addedAt).toLocaleDateString()}</div>
                </div>
                <div className="doc-title">{m.title}</div>
                <div className="doc-meta">
                  {!isSubcat && m.pages ? <span>📄 {m.pages} pages</span> : null}
                  <span>📚 {m.type || 'PDF'}</span>
                </div>
                <div className="doc-price">
                  {isSubcat ? <span style={{ color: 'var(--blue2)', fontWeight: 700 }}>₹199/month</span>
                    : isFree ? <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.2rem' }}>FREE</span>
                    : <>₹{m.pricePerDay}<span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>/day</span></>}
                </div>
                <button className="btn btn-grad" style={{ width: '100%', padding: '.7rem' }} onClick={() => navigate('/browse')}>
                  {isFree ? 'View Free' : 'Rent Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
