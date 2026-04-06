import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function PricingPlansPage() {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const materialId = searchParams.get('material');
  const materialTitle = searchParams.get('title');
  const planType = searchParams.get('type'); // 'bundle' or null
  const cat = searchParams.get('cat');
  const sub = searchParams.get('sub');

  const individualPlans = [
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

  const bundlePlans = [
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

  // If coming from bundle link, default to bundle tab
  const [tab, setTab] = useState(planType === 'bundle' ? 'bundle' : 'individual');

  function handleAddToCart(plan) {
    if (!isLoggedIn) { toast('Please login first', 'error'); navigate('/login'); return; }
    addToCart(
      cat || materialTitle || 'Material',
      sub || materialTitle || 'Material',
      plan.price,
      plan.id,
      plan.name,
      plan.duration
    );
    toast(`🛒 ${plan.name} plan added to cart!`, 'success');
  }

  function handleCheckout(plan) {
    if (!isLoggedIn) { toast('Please login first', 'error'); navigate('/login'); return; }
    const params = new URLSearchParams({
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      duration: plan.duration,
      type: tab,
      ...(materialId ? { material: materialId } : {}),
      ...(materialTitle ? { title: materialTitle } : {}),
      ...(cat ? { cat } : {}),
      ...(sub ? { sub } : {}),
    });
    navigate(`/checkout?${params.toString()}`);
  }

  const plans = tab === 'individual' ? individualPlans : bundlePlans;

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="eyebrow">Flexible Pricing</div>
      <h2 className="sec-title">💎 Choose Your Plan</h2>
      {materialTitle && (
        <p style={{ color: 'var(--blue2)', fontWeight: 600, marginBottom: '1rem' }}>📄 {decodeURIComponent(materialTitle)}</p>
      )}
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Rent individual materials or unlock entire subcategories with bundle plans.</p>

      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '2rem' }}>
        <button onClick={() => setTab('individual')}
          style={{ padding: '.7rem 1.5rem', borderRadius: '8px', border: 'none', background: tab === 'individual' ? 'linear-gradient(135deg,var(--blue),var(--purple))' : 'var(--glass)', color: tab === 'individual' ? '#fff' : 'var(--muted)', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
          📄 Individual Plans
        </button>
        <button onClick={() => setTab('bundle')}
          style={{ padding: '.7rem 1.5rem', borderRadius: '8px', border: 'none', background: tab === 'bundle' ? 'linear-gradient(135deg,var(--blue),var(--purple))' : 'var(--glass)', color: tab === 'bundle' ? '#fff' : 'var(--muted)', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
          📦 Bundle Plans
        </button>
      </div>

      <div className="pricing-plans-grid">
        {plans.map(plan => (
          <div key={plan.id} className={`pricing-plan-card ${plan.badge === 'popular' ? 'popular' : ''} ${plan.badge === 'best_value' ? 'best-value' : ''}`}>
            {plan.badge && (
              <div className={`plan-badge ${plan.badge === 'popular' ? 'popular' : ''} ${plan.badge === 'best_value' ? 'best-value' : ''}`}>
                {plan.badge === 'popular' ? '⭐ POPULAR' : '💎 BEST VALUE'}
              </div>
            )}
            <div className="plan-name">{plan.name}{tab === 'bundle' ? ' Bundle' : ''}</div>
            <div className="plan-price-big">₹{plan.price}</div>
            <div className="plan-duration">{plan.duration} day{plan.duration !== 1 ? 's' : ''} access{tab === 'bundle' ? ' to ALL materials' : ''}</div>
            {plan.savings > 0 ? <div className="plan-savings">💰 Save ₹{plan.savings}</div> : <div style={{ height: '1.5rem' }} />}
            <div className="plan-actions">
              <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => handleAddToCart(plan)}>🛒 Add to Cart</button>
              <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => handleCheckout(plan)}>⚡ Proceed to Checkout</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
