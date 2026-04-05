import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

import PdfViewerModal from '../components/PdfViewerModal';

export default function LibraryPage() {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfMaterial, setPdfMaterial] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    loadLibrary();
  }, [isLoggedIn]);

  async function loadLibrary() {
    try {
      const res = await fetch(`${API_URL}/api/rentals/library`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setLibrary(data.library);
    } catch (e) {
      console.warn('Library load failed:', e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="sec" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>⏳ Loading library...</div>;

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <h2 className="sec-title">📚 My Library</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>All your rented subcategories. Click any to browse its materials.</p>
      <div className="doc-grid">
        {library.length > 0 ? library.map((item, i) => {
          const isExpired = item.status === 'expired';
          const daysLeft = item.daysLeft;
          const urgentColor = daysLeft <= 3 ? 'var(--red)' : daysLeft <= 7 ? 'var(--gold)' : 'var(--green)';
          return (
            <div key={i} className="doc-card" style={isExpired ? { opacity: .6 } : {}} onClick={() => !isExpired && navigate(`/category/${encodeURIComponent(item.examCategory)}/${encodeURIComponent(item.subcategory)}`)}>
              <div className="doc-top">
                <span className={`tag ${isExpired ? 'tr' : 'tgr'}`}>{isExpired ? 'EXPIRED' : 'ACTIVE'}</span>
                {item.isFree && <span style={{ color: 'var(--green)', fontSize: '.75rem', fontWeight: 700 }}>FREE</span>}
              </div>
              <div className="doc-title">{item.subcategory}</div>
              <div style={{ fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.5rem' }}>📁 {item.examCategory}</div>
              {!isExpired ? (
                <div style={{ color: urgentColor, fontSize: '.85rem', fontWeight: 700, marginBottom: '.8rem' }}>
                  ⏰ {daysLeft} day{daysLeft !== 1 ? 's' : ''} left • Expires {new Date(item.expiryDate).toLocaleDateString()}
                </div>
              ) : (
                <div style={{ color: 'var(--red)', fontSize: '.85rem', marginBottom: '.8rem' }}>
                  Expired on {new Date(item.expiryDate).toLocaleDateString()}
                </div>
              )}
              <button 
                className={`btn ${isExpired ? 'btn-ghost' : 'btn-grad'}`} 
                style={{ width: '100%', padding: '.7rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isExpired) {
                    navigate(`/pricing-plans?type=bundle&cat=${encodeURIComponent(item.examCategory)}&sub=${encodeURIComponent(item.subcategory)}`);
                  } else {
                    // Open subcategory to view contents
                    navigate(`/category/${encodeURIComponent(item.examCategory)}/${encodeURIComponent(item.subcategory)}`);
                  }
                }}
              >
                {isExpired ? '🔄 Renew ₹199' : '📖 Open'}
              </button>
            </div>
          );
        }) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '.5rem' }}>Your library is empty</div>
            <div style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Rent subcategories to access their materials</div>
            <button className="btn btn-grad" onClick={() => navigate('/')}>Browse Categories</button>
          </div>
        )}
      </div>

      <PdfViewerModal 
        isOpen={pdfModalOpen} 
        onClose={() => setPdfModalOpen(false)} 
        materialId={pdfMaterial?._id} 
        title={pdfMaterial?.title} 
        subcategory={pdfMaterial?.subcategory} 
        examCategory={pdfMaterial?.examCategory} 
      />
    </div>
  );
}
