import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import API_URL from '../config';

export default function BrowsePage() {
  const { categories } = useData();
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSubcat, setSelectedSubcat] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('popular');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const subcats = selectedCat && categories[selectedCat] ? categories[selectedCat] : [];

  useEffect(() => {
    loadMaterials();
  }, [selectedCat, selectedSubcat, typeFilter, sortFilter]);

  async function loadMaterials() {
    setLoading(true);
    try {
      let url = `${API_URL}/api/materials?`;
      if (selectedCat) url += `category=${encodeURIComponent(selectedCat)}&`;
      if (selectedSubcat) url += `subcategory=${encodeURIComponent(selectedSubcat)}&`;
      if (typeFilter) url += `type=${typeFilter}&`;
      url += `sort=${sortFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setMaterials(data.materials);
      else setMaterials([]);
    } catch (err) {
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <h2 className="sec-title">Browse Study Materials</h2>

      <div className="filter-bar">
        <select value={selectedCat} onChange={e => { setSelectedCat(e.target.value); setSelectedSubcat(''); }}>
          <option value="">All Categories</option>
          {Object.keys(categories).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select value={selectedSubcat} onChange={e => setSelectedSubcat(e.target.value)} disabled={!selectedCat}>
          <option value="">{selectedCat ? 'All Subcategories' : 'Select Category First'}</option>
          {subcats.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="notes">Notes</option>
          <option value="pyq">PYQ</option>
          <option value="book">Books</option>
          <option value="guide">Guides</option>
        </select>

        <select value={sortFilter} onChange={e => setSortFilter(e.target.value)}>
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>⏳ Loading materials...</div>
      ) : (
        <div className="doc-grid">
          {materials.length > 0 ? materials.map(m => {
            const isFree = m.pricePerDay === 0 || m.isFreeResource;
            return (
              <div key={m._id} className="doc-card" onClick={() => navigate(`/material/${m._id}`)}>
                <div className="doc-top">
                  <span className="tag tbl">{m.examLabel}</span>
                  <div className="doc-rating">⭐ {m.stars || 4.5}</div>
                </div>
                <div className="doc-title">{m.title}</div>
                {m.subcategory && <span className="subcat-badge">📂 {m.subcategory}</span>}
                <div className="doc-meta">
                  <span>📄 {m.pages} pages</span>
                  <span>📚 {m.type}</span>
                </div>
                <div className="doc-price">
                  {isFree
                    ? <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.2rem' }}>FREE</span>
                    : <>₹{m.pricePerDay}<span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>/day</span></>
                  }
                </div>
                <button className="btn btn-grad" style={{ width: '100%', padding: '.7rem' }}>
                  {isFree ? 'View Free' : 'Rent Now'}
                </button>
              </div>
            );
          }) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>No materials found</div>
          )}
        </div>
      )}
    </div>
  );
}
