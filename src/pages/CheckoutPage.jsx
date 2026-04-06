import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

export default function CheckoutPage() {
  const { isLoggedIn, token } = useAuth();
  const { cartItems, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Direct checkout from pricing page via URL params
  const planId = searchParams.get('planId');
  const planName = searchParams.get('planName');
  const price = searchParams.get('price');
  const duration = searchParams.get('duration');
  const type = searchParams.get('type');
  const materialId = searchParams.get('material');
  const materialTitle = searchParams.get('title');
  const cat = searchParams.get('cat');
  const sub = searchParams.get('sub');

  const directItem = planId ? {
    planId, planName, price: Number(price), duration: Number(duration),
    type, materialId, title: materialTitle ? decodeURIComponent(materialTitle) : null,
    category: cat, subcategory: sub
  } : null;

  // Use direct item or fall back to cart items
  const items = directItem ? [directItem] : cartItems;
  const total = items.reduce((s, i) => s + Number(i.price), 0);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); }
  }, [isLoggedIn]);

  async function processCheckout() {
    if (processing) return;
    setProcessing(true);
    try {
      const body = directItem
        ? { planId: directItem.planId, materialId: directItem.materialId, type: directItem.type, paymentMethod }
        : { useBalance: false, paymentMethod };

      const res = await fetch(`${API_URL}/api/rentals/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        toast('🎉 Purchase successful!', 'success');
        navigate('/library');
      } else {
        toast(data.message || 'Checkout failed', 'error');
      }
    } catch (e) { toast('Checkout failed', 'error'); }
    finally { setProcessing(false); }
  }

  if (!isLoggedIn) return null;

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="sec-title">🏦 Checkout</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        {/* Order Summary */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Order Summary</h3>
          {items.length > 0 ? items.map((item, i) => (
            <div key={i} style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '1.2rem', marginBottom: '.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.planName} {item.type === 'bundle' ? 'Bundle' : 'Plan'}</div>
                  {item.title && <div style={{ fontSize: '.85rem', color: 'var(--blue2)', marginTop: '.2rem' }}>📄 {item.title}</div>}
                  {item.subcategory && <div style={{ fontSize: '.85rem', color: 'var(--blue2)', marginTop: '.2rem' }}>📦 {item.subcategory}</div>}
                  <div style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '.3rem' }}>{item.duration} day{item.duration !== 1 ? 's' : ''} access</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--blue2)', fontSize: '1.3rem' }}>₹{item.price}</div>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No items to checkout</div>
          )}
        </div>

        {/* Payment */}
        <div style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '14px', padding: '1.5rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Payment Method</h3>
          {['upi', 'card', 'netbanking', 'wallet'].map(m => (
            <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.8rem', background: paymentMethod === m ? 'rgba(59,130,246,.1)' : 'var(--glass)', border: `1px solid ${paymentMethod === m ? 'var(--blue)' : 'var(--gb)'}`, borderRadius: '10px', marginBottom: '.5rem', cursor: 'pointer' }}>
              <input type="radio" name="pay" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
              <span>{m === 'upi' ? '📱 UPI' : m === 'card' ? '💳 Card' : m === 'netbanking' ? '🏦 Net Banking' : '👛 Wallet'}</span>
            </label>
          ))}

          <div style={{ borderTop: '1px solid var(--gb)', paddingTop: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--blue2)' }}>₹{total}</span>
            </div>
            <button className="btn btn-grad" style={{ width: '100%' }} onClick={processCheckout} disabled={processing || items.length === 0}>
              {processing ? '⏳ Processing...' : '🎉 Complete Purchase'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
