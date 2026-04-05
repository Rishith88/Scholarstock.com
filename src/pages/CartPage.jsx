import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
  const { isLoggedIn } = useAuth();
  const { cartItems, removeFromCart, clearCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const subtotal = cartItems.reduce((s, i) => s + i.price, 0);

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <h2 className="sec-title">🛒 Cart</h2>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '.5rem' }}>Your cart is empty</div>
          <div style={{ fontSize: '.9rem', marginBottom: '1.5rem' }}>Browse categories and add subcategories to rent</div>
          <button className="btn btn-grad" onClick={() => navigate('/')}>Browse Categories</button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            {cartItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '12px', padding: '1.2rem', marginBottom: '.8rem' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.subcategory}</div>
                  <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{item.examCategory} • 1 month</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--blue2)' }}>₹{item.price}</div>
                  <button onClick={() => removeFromCart(i)} style={{ background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.4)', color: 'var(--red)', padding: '.4rem .8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '.8rem' }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '14px', padding: '1.5rem', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', borderTop: '1px solid var(--gb)', paddingTop: '1rem' }}>
              <span style={{ fontWeight: 800 }}>Total</span>
              <span style={{ fontWeight: 800, color: 'var(--blue2)' }}>₹{subtotal}</span>
            </div>
            <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
              🏦 Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
