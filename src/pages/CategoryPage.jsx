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

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <button className="back-btn" onClick={() => navigate('/')}>← Back to All Categories</button>
      <h2 className="sec-title">{name}</h2>
      <div className="subcat-grid">
        {subcats.map(sub => {
          const isFree = sub === 'Free Resources';
          return (
            <div key={sub} className="subcat-card" style={{ position: 'relative' }}>
              <span className="subcat-icon" onClick={() => navigate(`/category/${encodeURIComponent(name)}/${encodeURIComponent(sub)}`)} style={{ cursor: 'pointer' }}>
                {ICONS[sub] || '📚'}
              </span>
              <div className="subcat-name" onClick={() => navigate(`/category/${encodeURIComponent(name)}/${encodeURIComponent(sub)}`)} style={{ cursor: 'pointer' }}>
                {sub}
              </div>
              <div className="subcat-count" style={{ marginBottom: '.8rem' }}>
                {isFree
                  ? <span style={{ color: 'var(--green)', fontWeight: 700 }}>FREE ✅</span>
                  : <span style={{ color: 'var(--blue2)', fontWeight: 700 }}>₹199/month</span>
                }
              </div>
              <button
                className="btn btn-grad"
                style={{ width: '100%', padding: '.5rem', fontSize: '.8rem' }}
                onClick={() => navigate(`/category/${encodeURIComponent(name)}/${encodeURIComponent(sub)}`)}
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
