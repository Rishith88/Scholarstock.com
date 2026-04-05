import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function HomePage() {
  const { categories, loading } = useData();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const keys = categories ? Object.keys(categories) : [];
  const filtered = search ? keys.filter(k => k.toLowerCase().includes(search.toLowerCase())) : keys;

  return (
    <div>
      <div className="hero">
        <div className="hero-pill">🚀 {keys.length} Exam Categories • 10,000+ Study Materials</div>
        <h1 className="hero-title">Study Smarter, Pay Less</h1>
        <p className="hero-sub">Access premium study materials for 100+ competitive exams. Rent by the day, save thousands.</p>
        <div className="hero-btns">
          <button className="btn btn-grad" onClick={() => navigate('/browse')}>Browse Materials</button>
          <button className="btn btn-ghost" onClick={() => navigate('/study-strategist')}>🎯 AI Study Strategist</button>
        </div>
      </div>

      <div className="sec">
        <div className="eyebrow">All Exam Categories</div>
        <h2 className="sec-title">Browse by Exam ({keys.length} Categories)</h2>
        <div className="cat-search">
          <input
            type="text"
            placeholder="Search exams (JEE, NEET, SAT, UPSC...)"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>⏳ Loading categories...</div>
        ) : (
          <div className="cat-grid" id="categoryGrid">
            {filtered.length > 0 ? filtered.map(name => (
              <div key={name} className="cat-card" onClick={() => navigate(`/category/${encodeURIComponent(name)}`)}>
                <span className="cat-icon">📚</span>
                <div className="cat-name">{name}</div>
                <div className="cat-docs">{categories[name].length} subcategories</div>
              </div>
            )) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                {keys.length === 0 ? '⚠️ Could not load categories. Make sure the backend is running.' : 'No categories found'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
