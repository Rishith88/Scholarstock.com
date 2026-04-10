import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

const DEFAULT_INDIVIDUAL = [
  { id: 'mat_1day', name: '1 Day', duration: 1, price: 5, savings: 0, badge: null },
  { id: 'mat_2day', name: '2 Days', duration: 2, price: 9, savings: 1, badge: null },
  { id: 'mat_3day', name: '3 Days', duration: 3, price: 13, savings: 2, badge: null },
  { id: 'mat_5day', name: '5 Days', duration: 5, price: 19, savings: 6, badge: null },
  { id: 'mat_1week', name: '1 Week', duration: 7, price: 29, savings: 10, badge: 'popular' },
  { id: 'mat_10day', name: '10 Days', duration: 10, price: 39, savings: 11, badge: null },
  { id: 'mat_2week', name: '2 Weeks', duration: 14, price: 49, savings: 21, badge: null },
  { id: 'mat_3week', name: '3 Weeks', duration: 21, price: 69, savings: 36, badge: null },
  { id: 'mat_1month', name: '1 Month', duration: 30, price: 89, savings: 61, badge: 'best_value' },
  { id: 'mat_2month', name: '2 Months', duration: 60, price: 149, savings: 151, badge: null },
];

const DEFAULT_BUNDLE = [
  { id: 'bundle_1day', name: '1 Day', duration: 1, price: 19, savings: 0, badge: null },
  { id: 'bundle_2day', name: '2 Days', duration: 2, price: 35, savings: 3, badge: null },
  { id: 'bundle_3day', name: '3 Days', duration: 3, price: 49, savings: 8, badge: null },
  { id: 'bundle_5day', name: '5 Days', duration: 5, price: 79, savings: 16, badge: null },
  { id: 'bundle_1week', name: '1 Week', duration: 7, price: 99, savings: 34, badge: 'popular' },
  { id: 'bundle_10day', name: '10 Days', duration: 10, price: 129, savings: 61, badge: null },
  { id: 'bundle_2week', name: '2 Weeks', duration: 14, price: 159, savings: 107, badge: null },
  { id: 'bundle_3week', name: '3 Weeks', duration: 21, price: 199, savings: 200, badge: null },
  { id: 'bundle_1month', name: '1 Month', duration: 30, price: 249, savings: 321, badge: 'best_value' },
  { id: 'bundle_2month', name: '2 Months', duration: 60, price: 399, savings: 781, badge: null },
];

export default function PricingPlansPage() {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const materialId = searchParams.get('material');
  const materialTitle = searchParams.get('title');
  const planType = searchParams.get('type');
  const cat = searchParams.get('cat');
  const sub = searchParams.get('sub');

  const [tab, setTab] = useState(planType === 'bundle' ? 'bundle' : 'individual');
  const [individualPlans, setIndividualPlans] = useState(DEFAULT_INDIVIDUAL);
  const [bundlePlans, setBundlePlans] = useState(DEFAULT_BUNDLE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch(`${API_URL}/api/pricing-plans/public`);
        const data = await res.json();
        if (data.success && data.plans) {
          if (data.plans.individualPlans?.length) setIndividualPlans(data.plans.individualPlans);
          if (data.plans.subcategoryPlans?.length) setBundlePlans(data.plans.subcategoryPlans);
        }
      } catch (e) { /* use defaults */ }
      finally { setLoading(false); }
    }
    loadPlans();
  }, []);

  function handleAddToCart(plan) {
    if (!isLoggedIn) { toast('Please login first', 'error'); navigate('/login'); return; }
    addToCart(cat || materialTitle || 'Material', sub || materialTitle || 'Material', plan.price, plan.id, plan.name, plan.duration);
    toast(`🛒 ${plan.name} plan added to cart!`, 'success');
    if (window.ssSound) window.ssSound('success');
  }

  function handleCheckout(plan) {
    if (!isLoggedIn) { toast('Please login first', 'error'); navigate('/login'); return; }
    if (window.ssSound) window.ssSound('click');
    const params = new URLSearchParams({
      planId: plan.id, planName: plan.name, price: plan.price,
      duration: plan.duration, type: tab,
      ...(materialId ? { material: materialId } : {}),
      ...(materialTitle ? { title: materialTitle } : {}),
      ...(cat ? { cat } : {}),
      ...(sub ? { sub } : {}),
    });
    navigate(`/checkout?${params.toString()}`);
  }

  const plans = tab === 'individual' ? individualPlans : bundlePlans;

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="eyebrow">Flexible Pricing</div>
      <h2 className="sec-title">💎 Choose Your Plan</h2>
      {materialTitle && (
        <p style={{ color: 'var(--blue2)', fontWeight: 600, marginBottom: '1rem' }}>📄 {decodeURIComponent(materialTitle)}</p>
      )}
      {(cat && sub) && (
        <p style={{ color: 'var(--purple)', fontWeight: 600, marginBottom: '1rem' }}>📦 {cat} › {sub}</p>
      )}
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Rent individual materials or unlock entire subcategories with bundle plans.</p>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,.04)', padding: '.4rem', borderRadius: '12px', width: 'fit-content' }}>
        {['individual', 'bundle'].map(t => (
          <button key={t} onClick={() => { setTab(t); if(window.ssSound) window.ssSound('click'); }}
            style={{ padding: '.7rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .3s',
              background: tab === t ? 'linear-gradient(135deg,var(--blue),var(--purple))' : 'transparent',
              color: tab === t ? '#fff' : 'var(--muted)' }}>
            {t === 'individual' ? '📄 Individual Plans' : '📦 Bundle Plans'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="pricing-plans-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '280px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : (
        <div className="pricing-plans-grid">
          {plans.map((plan, i) => (
            <div key={plan.id} className={`pricing-plan-card reveal ${plan.badge === 'popular' ? 'popular' : ''} ${plan.badge === 'best_value' ? 'best-value' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}>
              {plan.badge && (
                <div className={`plan-badge ${plan.badge === 'popular' ? 'popular' : 'best-value'}`}>
                  {plan.badge === 'popular' ? '⭐ POPULAR' : '💎 BEST VALUE'}
                </div>
              )}
              <div className="plan-name">{plan.name}{tab === 'bundle' ? ' Bundle' : ''}</div>
              <div className="plan-price-big">₹{plan.price}</div>
              <div className="plan-duration">{plan.duration} day{plan.duration !== 1 ? 's' : ''} access{tab === 'bundle' ? ' · ALL materials' : ''}</div>
              {plan.savings > 0
                ? <div className="plan-savings">💰 Save ₹{plan.savings}</div>
                : <div style={{ height: '1.5rem' }} />}
              <div className="plan-actions">
                <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => handleAddToCart(plan)}>🛒 Add to Cart</button>
                <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => handleCheckout(plan)}>⚡ Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
