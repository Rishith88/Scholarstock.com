import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(examCategory, subcategory, price, planId, planName, duration) {
    setCartItems(prev => {
      if (prev.find(i => i.examCategory === examCategory && i.subcategory === subcategory)) return prev;
      return [...prev, { examCategory, subcategory, price, planId, planName, duration }];
    });
  }

  function removeFromCart(index) {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  }

  function clearCart() {
    setCartItems([]);
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
