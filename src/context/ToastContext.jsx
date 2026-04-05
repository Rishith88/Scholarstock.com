import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toastState, setToastState] = useState({ msg: '', type: '', visible: false });

  const toast = useCallback((msg, type = '') => {
    setToastState({ msg, type, visible: true });
    setTimeout(() => setToastState(prev => ({ ...prev, visible: false })), 3000);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className={`toast ${toastState.type} ${toastState.visible ? 'on' : ''}`}
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}
      >
        {toastState.msg}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
