import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function HomePage() {
  const { categories, loading } = useData();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const keys = categories ? Object.keys(categories) : [];
  const filtered = search ? keys.filter(k => k.toLowerCase().includes(search.toLowerCase())) : keys;

  const handleCardClick = (name) => {
    if (window.ssSound) window.ssSound('click');
    navigate(`/category/${encodeURIComponent(name)}`);
  };

  const handleCardHover = () => {
    if (window.ssSound) window.ssSound('hover');
  };

  // Emoji map for common exams
  const examEmoji = {
    'JEE': '⚛️', 'NEET': '🧬', 'UPSC': '🏛️', 'CAT': '📊', 'GATE': '⚙️',
    'SAT': '🎓', 'GRE': '🔬', 'GMAT': '💼', 'IELTS': '🌍', 'TOEFL': '📝',
    'SSC': '📋', 'IBPS': '🏦', 'SBI': '💰', 'RRB': '🚂', 'NDA': '🎖️',
    'CBSE': '📚', 'ICSE': '📖', 'IIT': '⚡', 'CLAT': '⚖️', 'CA': '💹',
    'CFA': '📈', 'AWS': '☁️', 'CCNA': '🌐', 'PMP': '📌', 'IMO': '🔢',
  };
  const getEmoji = (name) => {
    for (const [key, emoji] of Object.entries(examEmoji)) {
      if (name.toUpperCase().includes(key)) return emoji;
    }
    return '📚';
  };

  return (
    <div className="page-enter">
      <div className="hero">
        <div className="hero-pill">🚀 {keys.length} Exam Categories • 10,000+ Study Materials</div>
        <h1 className="hero-title">Study Smarter, Pay Less</h1>
        <p className="hero-sub">Access premium study materials for 100+ competitive exams. Rent by the day, save thousands.</p>
        <div className="hero-btns">
          <button className="btn btn-grad" onClick={() => { if(window.ssSound) window.ssSound('click'); navigate('/browse'); }}>Browse Materials</button>
          <button className="btn btn-ghost" onClick={() => { if(window.ssSound) window.ssSound('click'); navigate('/study-strategist'); }}>🎯 AI Study Strategist</button>
        </div>
      </div>

      <div className="sec reveal">
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
          <div className="cat-grid">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '110px', borderRadius: '12px' }} />
            ))}
          </div>
        ) : (
          <div className="cat-grid" id="categoryGrid">
            {filtered.length > 0 ? filtered.map(name => (
              <div
                key={name}
                className="cat-card"
                onClick={() => handleCardClick(name)}
                onMouseEnter={handleCardHover}
              >
                <span className="cat-icon">{getEmoji(name)}</span>
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
