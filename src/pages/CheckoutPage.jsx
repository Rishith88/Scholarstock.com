import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

export default function CheckoutPage() {
  const { isLoggedIn, token } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    loadCart();
  }, [isLoggedIn]);

  async function loadCart() {
    try {
      const res = await fetch(`${API_URL}/api/cart`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setCart(data.cart);
    } catch (e) { console.warn(e); }
    finally { setLoading(false); }
  }

  async function processCheckout() {
    if (processing) return;
    setProcessing(true);
    try {
      const res = await fetch(`${API_URL}/api/cart/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ useBalance: false, paymentMethod }),
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

  if (loading) return <div className="sec" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>⏳ Loading checkout...</div>;

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <button className="back-btn" onClick={() => navigate('/cart')}>← Back to Cart</button>
      <h2 className="sec-title">🏦 Checkout</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        {/* Order Summary */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Order Summary</h3>
          {cart.items?.length > 0 ? cart.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '1rem', marginBottom: '.5rem' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{item.planName}</div>
                <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{item.duration} days</div>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--blue2)' }}>₹{item.price}</div>
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
              <span style={{ color: 'var(--blue2)' }}>₹{cart.total || 0}</span>
            </div>
            <button className="btn btn-grad" style={{ width: '100%' }} onClick={processCheckout} disabled={processing || !cart.items?.length}>
              {processing ? '⏳ Processing...' : '🎉 Complete Purchase'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
