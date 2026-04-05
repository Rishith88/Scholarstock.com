import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

export default function RentalsPage() {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    loadRentals();
  }, [isLoggedIn]);

  async function loadRentals() {
    try {
      const res = await fetch(`${API_URL}/api/rentals`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setRentals(data.rentals);
    } catch (e) { console.warn(e); }
    finally { setLoading(false); }
  }

  if (loading) return <div className="sec" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>⏳ Loading rentals...</div>;

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <h2 className="sec-title">📄 My Rentals</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>All your material rentals and their status.</p>

      <div className="doc-grid">
        {rentals.length > 0 ? rentals.map((r, i) => {
          const isActive = r.status === 'active';
          return (
            <div key={i} className="doc-card" style={!isActive ? { opacity: .6 } : {}}>
              <div className="doc-top">
                <span className={`tag ${isActive ? 'tgr' : 'tr'}`}>{isActive ? 'ACTIVE' : 'EXPIRED'}</span>
                <span style={{ fontSize: '.7rem', color: 'var(--muted)' }}>{r.planName}</span>
              </div>
              <div className="doc-title">{r.materialTitle || r.subcategory || 'Material'}</div>
              <div style={{ fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.5rem' }}>
                {r.examCategory && `📁 ${r.examCategory}`}
                {r.duration && ` • ${r.duration} days`}
              </div>
              {isActive && r.expiryDate && (
                <div style={{ color: 'var(--green)', fontSize: '.85rem', fontWeight: 700, marginBottom: '.8rem' }}>
                  ⏰ Expires {new Date(r.expiryDate).toLocaleDateString()}
                </div>
              )}
              {!isActive && r.expiryDate && (
                <div style={{ color: 'var(--red)', fontSize: '.85rem', marginBottom: '.8rem' }}>
                  Expired on {new Date(r.expiryDate).toLocaleDateString()}
                </div>
              )}
              <button className={`btn ${isActive ? 'btn-grad' : 'btn-ghost'}`} style={{ width: '100%', padding: '.7rem' }}
                onClick={() => isActive ? navigate('/library') : navigate('/')}>
                {isActive ? '📖 Open in Library' : '🔄 Renew'}
              </button>
            </div>
          );
        }) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '.5rem' }}>No rentals yet</div>
            <div style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Browse and rent materials to see them here</div>
            <button className="btn btn-grad" onClick={() => navigate('/')}>Browse Categories</button>
          </div>
        )}
      </div>
    </div>
  );
}
