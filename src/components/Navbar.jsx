import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenSidebar }) {
  const { isLoggedIn, user } = useAuth();
  const { isLight, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const s = (type) => window.ssSound?.(type);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className={`nav${scrolled ? ' scrolled' : ''}`} id="mainNav">
      <div className="nav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="hamburger" onClick={() => { s('click'); onOpenSidebar(); }} title="Menu">☰</button>
          <button className="back-btn" onClick={() => { s('nav'); navigate(-1); }} title="Go back" style={{ background: 'transparent', border: 'none', color: 'var(--white)', fontSize: '1.2rem', cursor: 'pointer', padding: '.3rem' }}>←</button>
          <div className="logo" onClick={() => { s('click'); navigate('/'); }}>SCHOLARSTOCK</div>
        </div>
        <div className="nav-links">
          <button className="nl" onClick={() => { s('nav'); navigate('/browse'); }}>Browse</button>
          <button className="theme-toggle" onClick={() => { s('click'); toggleTheme(); }} title="Toggle theme">
            {isLight ? '🌙' : '☀️'}
          </button>
          {isLoggedIn ? (
            <>
              <button className="cart-btn" onClick={() => { s('click'); navigate('/cart'); }} style={{ marginLeft: '.3rem' }}>
                🛒 <span style={{ fontSize: '.75rem', fontWeight: 700 }}>{cartCount || ''}</span>
              </button>
              <button className="nbtn nbtn-ghost" onClick={() => { s('click'); onOpenSidebar(); }}>
                👤 {user?.name?.split(' ')[0]}
              </button>
            </>
          ) : (
            <>
              <button className="nbtn nbtn-ghost" onClick={() => { s('click'); navigate('/login'); }}>Login</button>
              <button className="nbtn nbtn-grad" onClick={() => { s('success'); navigate('/signup'); }}>Get Started</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
