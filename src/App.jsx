import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Background orbs */}
      <div className="orbs">
        <div className="orb o1"></div>
        <div className="orb o2"></div>
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
    </Router>
  );
}
