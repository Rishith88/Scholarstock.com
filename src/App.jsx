import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { DataProvider } from './context/DataContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import GuideBot from './components/GuideBot';
import IntroSplash, { sound } from './components/IntroSplash';

import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import CategoryPage from './pages/CategoryPage';
import SubcategoryPage from './pages/SubcategoryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LibraryPage from './pages/LibraryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import RentalsPage from './pages/RentalsPage';
import WishlistPage from './pages/WishlistPage';
import CalculatorPage from './pages/CalculatorPage';
import CountdownPage from './pages/CountdownPage';
import StudyStrategistPage from './pages/StudyStrategistPage';
import PricingPlansPage from './pages/PricingPlansPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import StudyRoomsPage from './pages/StudyRoomsPage';
import UniversityPage from './pages/UniversityPage';
import FlashcardsPage from './pages/FlashcardsPage';
import DashboardPage from './pages/DashboardPage';
import OfflinePage from './pages/OfflinePage';
import OrganizePage from './pages/OrganizePage';
import SettingsPage from './pages/SettingsPage';
import { useKeyboardShortcuts, KeyboardShortcutsHelp } from './hooks/useKeyboardShortcuts';
import { LanguageProvider } from './contexts/LanguageContext';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(!sessionStorage.getItem('ss_visited'));
  const navigate = useNavigate();
  const { showHelp, setShowHelp } = useKeyboardShortcuts();

  const handleSplashDone = () => {
    sessionStorage.setItem('ss_visited', '1');
    setShowSplash(false);
  };

  // ── High-Fidelity Synthesized Sound effects ──
  const handleRipple = (e) => {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
    btn.appendChild(ripple);
    if (window.ssSound) window.ssSound('click');
    setTimeout(() => ripple.remove(), 600);
  };

  // ── Cursor trail ──
  const handleMouseMove = (e) => {
    if (Math.random() > 0.88) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail';
      dot.style.cssText = `left:${e.clientX}px;top:${e.clientY}px`;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 500);
    }
  };

  // ── Scroll reveal ──
  const handleScroll = () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 60)
        el.classList.add('visible');
    });
  };

  useEffect(() => {
    const attachRipple = () => {
      document.querySelectorAll('.btn-grad,.nbtn-grad,.btn-ghost,.btn').forEach(btn => {
        if (!btn.dataset.ripple) {
          btn.dataset.ripple = '1';
          btn.addEventListener('click', handleRipple);
        }
      });
    };
    const observer = new MutationObserver(attachRipple);
    observer.observe(document.body, { childList: true, subtree: true });
    attachRipple();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleScroll();

    // High-Fidelity Synthesized Sound Engine
    const playVividSound = (type) => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();
        const t = ctx.currentTime;
        
        if (type === 'click') {
          // Futuristic wet pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, t);
          osc.frequency.exponentialRampToValueAtTime(150, t + 0.15);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.4, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.15);
        } else if (type === 'hover') {
          // Glitchy UI tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1200, t);
          osc.frequency.linearRampToValueAtTime(800, t + 0.04);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.04, t + 0.01);
          gain.gain.linearRampToValueAtTime(0.01, t + 0.04);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.05);
        } else if (type === 'success') {
          // Magical 3-tone arpeggio
          const freqs = [523.25, 659.25, 1046.50];
          freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            const startTime = t + i * 0.08;
            osc.frequency.setValueAtTime(f, startTime);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, startTime);
            filter.frequency.exponentialRampToValueAtTime(400, startTime + 0.3);
            osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
            osc.start(startTime); osc.stop(startTime + 0.3);
          });
        } else if (type === 'error') {
          // Low descending buzz
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, t);
          osc.frequency.exponentialRampToValueAtTime(80, t + 0.18);
          gain.gain.setValueAtTime(0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.2);
        } else if (type === 'open') {
          // Soft whoosh up
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(280, t);
          osc.frequency.exponentialRampToValueAtTime(720, t + 0.14);
          gain.gain.setValueAtTime(0.07, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.15);
        } else if (type === 'close') {
          // Soft whoosh down
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(720, t);
          osc.frequency.exponentialRampToValueAtTime(280, t + 0.12);
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.13);
        } else if (type === 'add') {
          // Bright pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1000, t);
          osc.frequency.exponentialRampToValueAtTime(500, t + 0.1);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(t); osc.stop(t + 0.11);
        } else if (type === 'toggle') {
          // Two-tone blip (light/dark switch)
          [600, 900].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0.06, t + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.07);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(t + i * 0.06); osc.stop(t + i * 0.06 + 0.08);
          });
        }
      } catch (err) { /* audio non-critical */ }
    };
    
    window.ssSound = playVividSound;

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });

  return (
    <>
      {showSplash && <IntroSplash onDone={handleSplashDone} />}
      <KeyboardShortcutsHelp show={showHelp} onClose={() => setShowHelp(false)} />

      <div className="vivid-bg-grid"></div>
      <div className="orbs">
        <div className="orb o1"></div>
        <div className="orb o2"></div>
        <div className="orb o3"></div>
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/category/:categoryName/:subcategoryName" element={<SubcategoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/materials" element={<RentalsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/countdown" element={<CountdownPage />} />
          <Route path="/study-strategist" element={<StudyStrategistPage />} />
          <Route path="/pricing-plans" element={<PricingPlansPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/study-rooms" element={<StudyRoomsPage />} />
          <Route path="/university" element={<UniversityPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="/organize" element={<OrganizePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={
            <div className="sec" style={{ marginTop: '4rem', textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🧭</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
              <h2 style={{ marginBottom: '1rem' }}>Lost in Space?</h2>
              <p style={{ color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
                The page you're looking for doesn't exist or has been moved to a new universe.
              </p>
              <button className="btn btn-grad" onClick={() => navigate('/')}>Take Me Home</button>
            </div>
          } />
        </Routes>
      </div>

      <Footer />
      <Chatbot />
      <GuideBot />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <DataProvider>
                <ToastProvider>
                  <AppLayout />
                </ToastProvider>
              </DataProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}

