import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
          <Route path="*" element={
            <div className="sec" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h2 style={{ marginBottom: '.5rem' }}>Page Not Found</h2>
              <p style={{ color: 'var(--muted)' }}>The page you're looking for doesn't exist.</p>
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
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
