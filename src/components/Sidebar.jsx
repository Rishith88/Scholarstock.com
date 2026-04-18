import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

export default function Sidebar({ open, onClose }) {
  const { isLoggedIn, user, logout } = useAuth();
  const { isLight, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  function go(path) {
    onClose();
    navigate(path);
  }

  function handleLogout() {
    onClose();
    logout();
    navigate('/');
  }

  return (
    <>
      <div className={`sidebar-overlay${open ? ' on' : ''}`} onClick={onClose} />
      <div className={`sidebar${open ? ' on' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">SCHOLARSTOCK</span>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>

        {isLoggedIn && user && (
          <div onClick={() => go('/profile')} style={{ cursor: 'pointer' }}>
            <div className="sidebar-profile">
              <div className="sidebar-avatar">{user.name?.[0]?.toUpperCase() || '👤'}</div>
              <div>
                <div className="sidebar-username">{user.name}</div>
                <div className="sidebar-email">View Profile →</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '.8rem 0' }}>
          <div className="sidebar-section">
            <div className="sidebar-label">Navigate</div>
            <button className="sidebar-item" onClick={() => go('/')}>
              <span className="sidebar-item-icon">🏠</span> Home
            </button>
            <button className="sidebar-item" onClick={() => go('/browse')}>
              <span className="sidebar-item-icon">🔍</span> Browse Materials
            </button>
            <button className="sidebar-item" onClick={() => go('/pricing-plans')}>
              <span className="sidebar-item-icon">💎</span> Pricing Plans
            </button>
          </div>

          {isLoggedIn && (
            <>
              <div className="sidebar-section">
                <div className="sidebar-label">My Account</div>
                <button className="sidebar-item" onClick={() => go('/profile')}>
                  <span className="sidebar-item-icon">👤</span> My Profile
                </button>
                <button className="sidebar-item" onClick={() => go('/materials')}>
                  <span className="sidebar-item-icon">📄</span> My Rentals
                </button>
                <button className="sidebar-item" onClick={() => go('/library')}>
                  <span className="sidebar-item-icon">📚</span> Library
                </button>
                <button className="sidebar-item" onClick={() => go('/wishlist')}>
                  <span className="sidebar-item-icon">❤️</span> Wishlist
                </button>
                <button className="sidebar-item" onClick={() => go('/cart')}>
                  <span className="sidebar-item-icon">🛒</span> Cart
                  {cartCount > 0 && <span className="sidebar-item-badge">{cartCount}</span>}
                </button>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-label">Collaborate</div>
                <button className="sidebar-item" onClick={() => go('/dashboard')}>
                  <span className="sidebar-item-icon">📊</span> Dashboard
                </button>
                <button className="sidebar-item" onClick={() => go('/study-rooms')}>
                  <span className="sidebar-item-icon">👥</span> Study Rooms
                </button>
                <button className="sidebar-item" onClick={() => go('/university')}>
                  <span className="sidebar-item-icon">🏛️</span> University Hub
                </button>
                <button className="sidebar-item" onClick={() => go('/flashcards')}>
                  <span className="sidebar-item-icon">🧠</span> Flashcards
                </button>
                <button className="sidebar-item" onClick={() => go('/organize')}>
                  <span className="sidebar-item-icon">📂</span> Smart Folders
                </button>
                <button className="sidebar-item" onClick={() => go('/offline')}>
                  <span className="sidebar-item-icon">📴</span> Offline Mode
                </button>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-label">Tools</div>
                <button className="sidebar-item" onClick={() => go('/calculator')}>
                  <span className="sidebar-item-icon">🧮</span> Calculator
                </button>
                <button className="sidebar-item" onClick={() => go('/countdown')}>
                  <span className="sidebar-item-icon">⏳</span> Exam Countdown
                </button>
                <button className="sidebar-item" onClick={() => go('/study-strategist')}>
                  <span className="sidebar-item-icon">🎯</span> AI Study Strategist
                </button>
              </div>
            </>
          )}

          {!isLoggedIn && (
            <div className="sidebar-section">
              <div className="sidebar-label">Account</div>
              <button className="sidebar-item" onClick={() => go('/login')}>
                <span className="sidebar-item-icon">🔑</span> Login
              </button>
              <button className="sidebar-item" onClick={() => go('/signup')}>
                <span className="sidebar-item-icon">✨</span> Get Started
              </button>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-theme-row">
            <span>{isLight ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
            <button className="theme-toggle" onClick={toggleTheme} style={{ border: 'none', padding: 0, fontSize: '1rem', background: 'transparent' }}>
              {isLight ? '🌙' : '☀️'}
            </button>
          </div>
          {isLoggedIn && (
            <button className="sidebar-logout" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}
