import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

import MockTestModal from '../components/MockTestModal';
import PdfViewerModal from '../components/PdfViewerModal';
import ReviewsModal from '../components/ReviewsModal';

export default function SubcategoryPage() {
  const { categoryName, subcategoryName } = useParams();
  const { isLoggedIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const cat = decodeURIComponent(categoryName);
  const sub = decodeURIComponent(subcategoryName);
  const isFree = sub === 'Free Resources';

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfMaterial, setPdfMaterial] = useState(null);
  
  const [mockModalOpen, setMockModalOpen] = useState(false);
  
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [reviewMaterial, setReviewMaterial] = useState(null);

  useEffect(() => { 
    async function loadMaterials() {
      setLoading(true);
      try {
        let url = `${API_URL}/api/materials?category=${encodeURIComponent(cat)}&subcategory=${encodeURIComponent(sub)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) setMaterials(data.materials);
      } catch (e) { console.warn(e); }
      finally { setLoading(false); }
    }
    loadMaterials(); 
  }, [cat, sub]);

  function handleRent(materialId, title) {
    if (!isLoggedIn) { toast('Please login first', 'error'); navigate('/login'); return; }
    window.ssSound?.('click');
    navigate(`/pricing-plans?material=${materialId}&title=${encodeURIComponent(title)}`);
  }

  function handleOpenPdf(m) {
    if (!isLoggedIn && !isFree && m.pricePerDay > 0) { toast('Please login first', 'error'); navigate('/login'); return; }
    window.ssSound?.('success');
    setPdfMaterial(m);
    setPdfModalOpen(true);
  }

  function handleOpenReviews(e, m) {
    e.stopPropagation();
    setReviewMaterial(m);
    setReviewsModalOpen(true);
  }

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <button className="back-btn" onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}>← Back to {cat}</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div className="eyebrow">{cat}</div>
          <h2 className="sec-title" style={{ marginBottom: 0 }}>{sub}</h2>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={() => setMockModalOpen(true)}>
            🧪 Mock Test
          </button>
          {!isFree && (
            <button className="btn btn-grad" onClick={() => navigate(`/pricing-plans?type=bundle&cat=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}`)}>
              ⚡ Buy Bundle Access
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>⏳ Loading materials...</div>
      ) : (
        <div className="doc-grid">
          {materials.length > 0 ? materials.map(m => {
            const mFree = m.pricePerDay === 0 || m.isFreeResource;
            return (
              <div key={m._id} className="doc-card">
                <div className="doc-top">
                  <span className={`tag ${mFree ? 'tgr' : 'tbl'}`}>{mFree ? 'FREE' : m.examLabel}</span>
                  <div className="doc-rating" onClick={(e) => handleOpenReviews(e, m)} style={{ cursor: 'pointer' }} title="View Reviews">⭐ {m.stars || 4.5}</div>
                </div>
                <div className="doc-title">{m.title}</div>
                <div className="doc-meta">
                  <span>📄 {m.pages || 0} pages</span>
                  <span>📚 {m.type || 'PDF'}</span>
                </div>
                <div className="doc-price">
                  {mFree
                    ? <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.2rem' }}>FREE</span>
                    : <>₹{m.pricePerDay}<span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>/day</span></>
                  }
                </div>
                {mFree ? (
                  <button className="btn btn-grad" style={{ width: '100%', padding: '.7rem' }} onClick={() => handleOpenPdf(m)}>
                    📖 View Free
                  </button>
                ) : m.isRented ? (
                  <button className="btn btn-ghost" style={{ width: '100%', padding: '.7rem', borderColor: 'var(--green)', color: 'var(--green)' }} onClick={() => handleOpenPdf(m)}>
                    📖 Read in Library
                  </button>
                ) : (
                  <button className="btn btn-grad" style={{ width: '100%', padding: '.7rem' }} onClick={() => handleRent(m._id, m.title)}>
                    ⚡ Rent Now
                  </button>
                )}
              </div>
            );
          }) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
              No materials found in this subcategory yet
            </div>
          )}
        </div>
      )}

      {/* Render Modals */}
      <MockTestModal 
        isOpen={mockModalOpen} 
        onClose={() => setMockModalOpen(false)} 
        category={cat} 
        subcategory={sub} 
      />
      <PdfViewerModal 
        isOpen={pdfModalOpen} 
        onClose={() => setPdfModalOpen(false)} 
        materialId={pdfMaterial?._id} 
        title={pdfMaterial?.title} 
        subcategory={sub} 
        examCategory={cat} 
      />
      <ReviewsModal 
        isOpen={reviewsModalOpen} 
        onClose={() => setReviewsModalOpen(false)} 
        materialId={reviewMaterial?._id} 
        title={reviewMaterial?.title} 
        avgStars={reviewMaterial?.stars} 
      />
    </div>
  );
}
