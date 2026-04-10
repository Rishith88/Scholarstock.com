import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function CategoryPage() {
  const { categoryName } = useParams();
  const { categories } = useData();
  const navigate = useNavigate();

  const name = decodeURIComponent(categoryName);
  let subcats = categories[name] || [];
  if (!subcats.includes('Free Resources')) subcats = ['Free Resources', ...subcats];

  const ICONS = { Physics: '⚛️', Chemistry: '🧪', Mathematics: '📐', Biology: '🧬', 'Previous Year Papers': '📋', 'Mock Tests': '📊', 'Free Resources': '🆓' };

  const go = (sub) => {
    window.ssSound?.('click');
    navigate(`/category/${encodeURIComponent(name)}/${encodeURIComponent(sub)}`);
  };

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <button className="back-btn" onClick={() => { window.ssSound?.('nav'); navigate('/'); }}>← Back to All Categories</button>
      <h2 className="sec-title">{name}</h2>
      <div className="subcat-grid">
        {subcats.map(sub => {
          const isFree = sub === 'Free Resources';
          return (
            <div key={sub} className="subcat-card reveal" style={{ position: 'relative' }} onMouseEnter={() => window.ssSound?.('hover')}>
              <span className="subcat-icon" onClick={() => go(sub)} style={{ cursor: 'pointer' }}>
                {ICONS[sub] || '📚'}
              </span>
              <div className="subcat-name" onClick={() => go(sub)} style={{ cursor: 'pointer' }}>
                {sub}
              </div>
              <div className="subcat-count" style={{ marginBottom: '.8rem' }}>
                {isFree
                  ? <span style={{ color: 'var(--green)', fontWeight: 700 }}>FREE ✅</span>
                  : <span style={{ color: 'var(--blue2)', fontWeight: 700 }}>View Plans</span>
                }
              </div>
              <button
                className="btn btn-grad"
                style={{ width: '100%', padding: '.5rem', fontSize: '.8rem' }}
                onClick={() => go(sub)}
              >
                {isFree ? '📖 Browse Free' : '⚡ View'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
