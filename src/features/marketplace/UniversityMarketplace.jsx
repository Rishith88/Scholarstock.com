import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const UNIVERSITIES = [
  { id: 1, name: 'IIT Bombay', code: 'IITB', domain: 'iitb.ac.in', students: 1420, materials: 892, revenue: '₹1,24,500', verified: true, rating: 4.9 },
  { id: 2, name: 'IIT Delhi', code: 'IITD', domain: 'iitd.ac.in', students: 1105, materials: 756, revenue: '₹98,200', verified: true, rating: 4.8 },
  { id: 3, name: 'BITS Pilani', code: 'BITS', domain: 'bits-pilani.ac.in', students: 890, materials: 621, revenue: '₹76,500', verified: true, rating: 4.7 },
  { id: 4, name: 'NIT Trichy', code: 'NITT', domain: 'nitt.edu', students: 712, materials: 543, revenue: '₹62,100', verified: false, rating: 4.6 },
  { id: 5, name: 'Delhi University', code: 'DU', domain: 'du.ac.in', students: 645, materials: 489, revenue: '₹58,900', verified: true, rating: 4.8 },
];

const CHART_DATA = UNIVERSITIES.map(u => ({ name: u.code, value: parseInt(u.revenue.replace(/[₹,]/g, '')) }));

export default function UniversityMarketplace() {
  const [activeTab, setActiveTab] = useState('universities');
  const [search, setSearch] = useState('');

  const filtered = UNIVERSITIES.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.code.toLowerCase().includes(search.toLowerCase())
  );

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
          { label: 'Universities', value: '127', icon: '🏛️', color: 'var(--blue)' },
          { label: 'Active Students', value: '18,420', icon: '👥', color: 'var(--green)' },
          { label: 'Total Materials', value: '24,981', icon: '📄', color: 'var(--gold)' },
          { label: 'Total Payouts', value: '₹15.6L', icon: '💰', color: 'var(--purple)' },
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
          {filtered.map(uni => (
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
                  <span>👥 {uni.students.toLocaleString()} students</span>
                  <span>📄 {uni.materials.toLocaleString()} materials</span>
                  <span>💰 {uni.revenue} revenue</span>
                </div>
              </div>
              <button className="ump-view-btn">View →</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="ump-analytics">
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
        </div>
      )}
    </div>
  );
}
