import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function UniversityMarketplace() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('universities');
  const [search, setSearch] = useState('');
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUniversities();
    }
  }, [token]);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/universities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUniversities(data.universities || []);
      } else {
        setUniversities([]);
      }
    } catch (err) {
      console.error('Failed to fetch universities:', err);
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = universities.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.code.toLowerCase().includes(search.toLowerCase())
  );

  const CHART_DATA = universities.map(u => ({ 
    name: u.code, 
    value: typeof u.revenue === 'string' ? parseInt(u.revenue.replace(/[₹,]/g, '')) : u.revenue 
  }));

  return (
    <div className="ump-wrap">
      {/* Header */}
      <div className="ump-header">
        <div>
          <h2 className="ump-title">🏛️ University Marketplace</h2>
          <p className="ump-sub">Community-driven platform — students earn commission by uploading quality study materials</p>
        </div>
        <button className="ump-add-btn">+ Add University</button>
      </div>

      {/* Stats */}
      <div className="ump-stats-grid">
        {[
          { label: 'Universities', value: universities.length.toString(), icon: '🏛️', color: 'var(--blue)' },
          { label: 'Active Students', value: universities.reduce((sum, u) => sum + (u.students || 0), 0).toLocaleString(), icon: '👥', color: 'var(--green)' },
          { label: 'Total Materials', value: universities.reduce((sum, u) => sum + (u.materials || 0), 0).toLocaleString(), icon: '📄', color: 'var(--gold)' },
          { label: 'Total Payouts', value: universities.reduce((sum, u) => sum + (typeof u.revenue === 'string' ? parseInt(u.revenue.replace(/[₹,]/g, '')) : u.revenue || 0), 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), icon: '💰', color: 'var(--purple)' },
        ].map((s, i) => (
          <div key={i} className="ump-stat-card">
            <div className="ump-stat-icon" style={{ color: s.color }}>{s.icon}</div>
            <div className="ump-stat-val">{s.value}</div>
            <div className="ump-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="ump-tabs">
        {['universities', 'analytics'].map(t => (
          <button key={t} className={`ump-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t === 'universities' ? '🏛️ Universities' : '📊 Analytics'}
          </button>
        ))}
        <input className="ump-search" placeholder="Search universities..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {activeTab === 'universities' && (
        <div className="ump-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading universities...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
              {universities.length === 0 ? 'No universities added yet. Be the first to add your university!' : 'No universities match your search.'}
            </div>
          ) : (
            filtered.map(uni => (
              <div key={uni.id} className="ump-uni-card">
                <div className="ump-uni-avatar">{uni.code}</div>
                <div className="ump-uni-info">
                  <div className="ump-uni-name">
                    {uni.name}
                    {uni.verified && <span className="ump-verified-badge">✓ Verified</span>}
                    <span className="ump-rating">⭐ {uni.rating}</span>
                  </div>
                  <div className="ump-uni-domain">@{uni.domain}</div>
                  <div className="ump-uni-meta">
                    <span>👥 {(uni.students || 0).toLocaleString()} students</span>
                    <span>📄 {(uni.materials || 0).toLocaleString()} materials</span>
                    <span>💰 {typeof uni.revenue === 'string' ? uni.revenue : `₹${uni.revenue || 0}`} revenue</span>
                  </div>
                </div>
                <button className="ump-view-btn">View →</button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="ump-analytics">
          {universities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>No data to display. Add universities to see analytics.</div>
          ) : (
            <div className="ump-chart-card">
              <h3 className="ump-chart-title">Top Earning Universities</h3>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA} layout="vertical">
                    <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} width={60} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff' }} cursor={{ fill: 'rgba(139,92,246,0.1)' }} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
