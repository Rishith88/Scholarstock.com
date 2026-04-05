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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className={`nav${scrolled ? ' scrolled' : ''}`} id="mainNav">
      <div className="nav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="hamburger" onClick={onOpenSidebar} title="Menu">☰</button>
          <div className="logo" onClick={() => navigate('/')}>SCHOLARSTOCK</div>
        </div>
        <div className="nav-links">
          <button className="nl" onClick={() => navigate('/browse')}>Browse</button>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {isLight ? '🌙' : '☀️'}
          </button>
          {isLoggedIn ? (
            <>
              <button className="cart-btn" onClick={() => navigate('/cart')} style={{ marginLeft: '.3rem' }}>
                🛒 <span style={{ fontSize: '.75rem', fontWeight: 700 }}>{cartCount || ''}</span>
              </button>
              <button className="nbtn nbtn-ghost" onClick={onOpenSidebar}>
                👤 {user?.name?.split(' ')[0]}
              </button>
            </>
          ) : (
            <>
              <button className="nbtn nbtn-ghost" onClick={() => navigate('/login')}>Login</button>
              <button className="nbtn nbtn-grad" onClick={() => navigate('/signup')}>Get Started</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
