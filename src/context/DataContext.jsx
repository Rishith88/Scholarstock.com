import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API_URL from '../config';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [categories, setCategories] = useState({});
  const [settings, setSettings] = useState({
    referral: { rentalsRequiredForCashback: 3, cashbackAmount: 20, enabled: true },
    pricing: { subcategoryMonthlyPrice: 199, materialDayPrice: 29, freeResourcesEnabled: true },
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, settRes] = await Promise.all([
        fetch(`${API_URL}/api/categories/structure`),
        fetch(`${API_URL}/api/settings`),
      ]);
      const catData = await catRes.json();
      if (catData.success && catData.categories) {
        setCategories(catData.categories);
      }
      const settData = await settRes.json();
      if (settData.success) setSettings(settData.settings);
    } catch (e) {
      console.warn('Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <DataContext.Provider value={{ categories, settings, loading, reloadData: loadData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
