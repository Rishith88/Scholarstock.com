import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

import MockTestModal from '../components/MockTestModal';
import PdfViewerModal from '../components/PdfViewerModal';
import ReviewsModal from '../components/ReviewsModal';

const PLANS = [
  { id:'mat_1day',  name:'1 Day',     duration:1,  price:5,   badge:null },
  { id:'mat_2day',  name:'2 Days',    duration:2,  price:9,   badge:null },
  { id:'mat_3day',  name:'3 Days',    duration:3,  price:13,  badge:null },
  { id:'mat_5day',  name:'5 Days',    duration:5,  price:19,  badge:null },
  { id:'mat_1week', name:'1 Week',    duration:7,  price:29,  badge:'popular' },
  { id:'mat_10day', name:'10 Days',   duration:10, price:39,  badge:null },
  { id:'mat_2week', name:'2 Weeks',   duration:14, price:49,  badge:null },
  { id:'mat_3week', name:'3 Weeks',   duration:21, price:69,  badge:null },
  { id:'mat_1month',name:'1 Month',   duration:30, price:89,  badge:'best_value' },
  { id:'mat_2month',name:'2 Months',  duration:60, price:149, badge:null },
];

export default function SubcategoryPage() {
  const { categoryName, subcategoryName } = useParams();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const cat = decodeURIComponent(categoryName);
  const sub = decodeURIComponent(subcategoryName);
  const isFree = sub === 'Free Resources';

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfMaterial, setPdfMaterial] = useState(null);
  const [mockModalOpen, setMockModalOpen] = useState(false);
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [reviewMaterial, setReviewMaterial] = useState(null);
  // Inline pricing modal
  const [pricingMaterial, setPricingMaterial] = useState(null);

  useEffect(() => {
    async function loadMaterials() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/materials?category=${encodeURIComponent(cat)}&subcategory=${encodeURIComponent(sub)}`);
        const data = await res.json();
        if (data.success) setMaterials(data.materials);
      } catch (e) { console.warn(e); }
      finally { setLoading(false); }
    }
    loadMaterials();
  }, [cat, sub]);

  function handleRent(m) {
    if (!isLoggedIn) { toast('Please login first', 'error'); navigate('/login'); return; }
    window.ssSound?.('click');
    setPricingMaterial(m);
  }

  function handleOpenPdf(m) {
    if (!isLoggedIn && !isFree && m.pricePerDay > 0) { toast('Please login first', 'error'); navigate('/login'); return; }
    window.ssSound?.('success');
    setPdfMaterial(m);
    setPdfModalOpen(true);
  }

  function handleAddToCart(plan) {
    if (!pricingMaterial) return;
    addToCart(cat, sub, plan.price, plan.id, plan.name, plan.duration);
    toast(`🛒 ${plan.name} added to cart!`, 'success');
    window.ssSound?.('success');
    setPricingMaterial(null);
  }

  function handleBuyNow(plan) {
    if (!pricingMaterial) return;
    window.ssSound?.('click');
    const params = new URLSearchParams({
      planId: plan.id, planName: plan.name, price: plan.price,
      duration: plan.duration, type: 'individual',
      material: pricingMaterial._id,
      title: encodeURIComponent(pricingMaterial.title),
      cat, sub,
    });
    navigate(`/checkout?${params.toString()}`);
  }

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <button className="back-btn" onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}>← Back to {cat}</button>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem', marginBottom:'1.5rem' }}>
        <div>
          <div className="eyebrow">{cat}</div>
          <h2 className="sec-title" style={{ marginBottom:0 }}>{sub}</h2>
        </div>
        <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
          <button className="btn btn-ghost" onClick={() => setMockModalOpen(true)}>🧪 Mock Test</button>
          {!isFree && (
            <button className="btn btn-grad" onClick={() => navigate(`/pricing-plans?type=bundle&cat=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}`)}>
              ⚡ Buy Bundle Access
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="doc-grid">
          {[...Array(6)].map((_,i) => <div key={i} className="skeleton" style={{ height:'220px', borderRadius:'14px' }} />)}
        </div>
      ) : (
        <div className="doc-grid">
          {materials.length > 0 ? materials.map(m => {
            const mFree = isFree || m.pricePerDay === 0 || m.isFreeResource;
            return (
              <div key={m._id} className="doc-card reveal" onMouseEnter={() => window.ssSound?.('hover')}>
                <div className="doc-top">
                  <span className={`tag ${mFree ? 'tgr' : 'tbl'}`}>{mFree ? 'FREE' : m.examLabel || cat}</span>
                  <div className="doc-rating" onClick={(e) => { e.stopPropagation(); setReviewMaterial(m); setReviewsModalOpen(true); }} style={{ cursor:'pointer' }}>⭐ {m.stars || 4.5}</div>
                </div>
                <div className="doc-title">{m.title}</div>
                <div className="doc-meta">
                  <span>📄 {m.pages || 0} pages</span>
                  <span>📚 PDF</span>
                </div>
                <div className="doc-price">
                  {mFree ? <span style={{ color:'#10b981', fontWeight:700, fontSize:'1.2rem' }}>FREE</span>
                    : <>₹{m.pricePerDay}<span style={{ fontSize:'.8rem', color:'var(--muted)' }}>/day</span></>}
                </div>
                {mFree ? (
                  <button className="btn btn-grad" style={{ width:'100%', padding:'.7rem' }} onClick={() => handleOpenPdf(m)}>📖 View Free</button>
                ) : m.isRented ? (
                  <button className="btn btn-ghost" style={{ width:'100%', padding:'.7rem', borderColor:'var(--green)', color:'var(--green)' }} onClick={() => handleOpenPdf(m)}>📖 Read Now</button>
                ) : (
                  <button className="btn btn-grad" style={{ width:'100%', padding:'.7rem' }} onClick={() => handleRent(m)}>⚡ Rent Now</button>
                )}
              </div>
            );
          }) : (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'3rem', color:'var(--muted)' }}>No materials found yet</div>
          )}
        </div>
      )}

      {/* ── INLINE PRICING MODAL ── */}
      {pricingMaterial && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', backdropFilter:'blur(10px)' }}
          onClick={e => { if(e.target===e.currentTarget) setPricingMaterial(null); }}>
          <div style={{ background:'var(--bg)', border:'1px solid var(--gb)', borderRadius:'20px', width:'100%', maxWidth:'900px', maxHeight:'90vh', overflow:'auto', padding:'2rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
              <div>
                <div style={{ fontSize:'.75rem', color:'var(--blue2)', fontWeight:700, textTransform:'uppercase', marginBottom:'.3rem' }}>Choose a Plan</div>
                <div style={{ fontSize:'1.2rem', fontWeight:800 }}>📄 {pricingMaterial.title}</div>
                <div style={{ fontSize:'.85rem', color:'var(--muted)', marginTop:'.3rem' }}>{cat} › {sub}</div>
              </div>
              <button onClick={() => setPricingMaterial(null)} style={{ background:'rgba(239,68,68,.15)', border:'none', color:'var(--red)', width:36, height:36, borderRadius:'50%', cursor:'pointer', fontSize:'1.2rem', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'1rem' }}>
              {PLANS.map(plan => (
                <div key={plan.id} style={{
                  background: plan.badge ? 'linear-gradient(135deg,rgba(59,130,246,.12),rgba(139,92,246,.12))' : 'var(--glass)',
                  border: `2px solid ${plan.badge==='popular'?'var(--green)':plan.badge==='best_value'?'var(--gold)':'var(--gb)'}`,
                  borderRadius:'14px', padding:'1.2rem', position:'relative', transition:'transform .3s',
                  cursor:'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; window.ssSound?.('hover'); }}
                  onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
                >
                  {plan.badge && (
                    <div style={{ position:'absolute', top:'-10px', left:'50%', transform:'translateX(-50%)', background:plan.badge==='popular'?'var(--green)':'var(--gold)', color:'#fff', fontSize:'.65rem', fontWeight:800, padding:'.2rem .7rem', borderRadius:'50px', whiteSpace:'nowrap' }}>
                      {plan.badge==='popular'?'⭐ POPULAR':'💎 BEST VALUE'}
                    </div>
                  )}
                  <div style={{ fontWeight:800, fontSize:'1rem', marginBottom:'.3rem' }}>{plan.name}</div>
                  <div style={{ fontSize:'1.6rem', fontWeight:900, color:'var(--blue2)', marginBottom:'.2rem' }}>₹{plan.price}</div>
                  <div style={{ fontSize:'.75rem', color:'var(--muted)', marginBottom:'1rem' }}>{plan.duration} day{plan.duration!==1?'s':''} access</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'.4rem' }}>
                    <button className="btn btn-ghost" style={{ width:'100%', padding:'.4rem', fontSize:'.78rem' }} onClick={() => handleAddToCart(plan)}>🛒 Cart</button>
                    <button className="btn btn-grad" style={{ width:'100%', padding:'.4rem', fontSize:'.78rem' }} onClick={() => handleBuyNow(plan)}>⚡ Buy</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop:'1.5rem', textAlign:'center' }}>
              <button className="btn btn-ghost" style={{ fontSize:'.85rem' }} onClick={() => navigate(`/pricing-plans?type=bundle&cat=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}`)}>
                📦 View Bundle Plans (unlock all materials in {sub})
              </button>
            </div>
          </div>
        </div>
      )}

      <MockTestModal isOpen={mockModalOpen} onClose={() => setMockModalOpen(false)} category={cat} subcategory={sub} />
      <PdfViewerModal isOpen={pdfModalOpen} onClose={() => setPdfModalOpen(false)} materialId={pdfMaterial?._id} title={pdfMaterial?.title} subcategory={sub} examCategory={cat} />
      <ReviewsModal isOpen={reviewsModalOpen} onClose={() => setReviewsModalOpen(false)} materialId={reviewMaterial?._id} title={reviewMaterial?.title} avgStars={reviewMaterial?.stars} />
    </div>
  );
}
