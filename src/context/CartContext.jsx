import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

function loadCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
}

function saveCart(items) {
  localStorage.setItem('cart', JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  function addToCart(examCategory, subcategory, price, planId, planName, duration) {
    setCartItems(prev => {
      if (prev.find(i => i.planId === planId && i.subcategory === subcategory)) return prev;
      const next = [...prev, { examCategory, subcategory, price, planId, planName, duration }];
      saveCart(next);
      return next;
    });
  }

  function removeFromCart(index) {
    setCartItems(prev => {
      const next = prev.filter((_, i) => i !== index);
      saveCart(next);
      return next;
    });
  }

  function clearCart() {
    setCartItems([]);
    localStorage.removeItem('cart');
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount: cartItems.length }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
