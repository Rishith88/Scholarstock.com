import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';

const ACCESS_LEVELS = [
  {
    title: '✅ Verified Student',
    color: 'var(--green)',
    desc: 'Official university email domain',
    perks: ['Full free access to all institutional materials', 'No paywalls on university content', 'Priority support & early access', 'Account issued by institution'],
  },
  {
    title: '⚠️ External Guest',
    color: 'var(--gold)',
    desc: 'User from outside the university',
    perks: ['No free institutional material access', 'Can purchase individual items only', 'Premium subscription (set by university)', 'Standard support only'],
  },
  {
    title: '🔒 Institution Admin',
    color: 'var(--purple)',
    desc: 'Official university administrator',
    perks: ['Full control over all university settings', 'Create and manage student accounts', 'Set pricing, revenue splits & permissions', 'View analytics and payout reports'],
  },
];

export default function UniversityAccessSystem() {
  const { token } = useAuth();
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

  return (
    <div className="uas-wrap">
      {/* Header */}
      <div className="uas-header">
        <h2 className="uas-title">🛡️ Institutional Access System</h2>
        <p className="uas-sub">Dynamic domain-based access control. Fully configurable per university. No hardcoding.</p>
      </div>

      {/* Info Banner */}
      <div className="uas-info-banner">
        <span style={{ fontSize: '1.3rem' }}>🛡️</span>
        <div>
          <div className="uas-info-title">Dynamic Access Control System</div>
          <div className="uas-info-text">
            Each university sets their own rules. System auto-detects user email domain at signup.
            Verified institutional emails get full free access automatically. External guests can purchase
            access with pricing set individually by each university.
          </div>
        </div>
      </div>

      {/* Configuration Table */}
      <h3 className="uas-section-title">University Access Configuration</h3>
      <div className="uas-table-wrap">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>Loading universities...</div>
        ) : universities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No universities configured yet. Add your university to get started!</div>
        ) : (
          <table className="uas-table">
            <thead>
              <tr>
                <th>University</th>
                <th>Domain</th>
                <th>Auto Access</th>
                <th>Student Access</th>
                <th>Guest Access</th>
                <th>Revenue Split</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {universities.map(uni => (
                <tr key={uni.id}>
                  <td>
                    <div className="uas-uni-cell">
                      <div className="uas-uni-avatar">{uni.name.match(/\b(\w)/g).slice(0, 2).join('')}</div>
                      <span>{uni.name}</span>
                    </div>
                  </td>
                  <td className="uas-domain">@{uni.domain}</td>
                  <td>
                    <div className={`uas-toggle ${uni.settings?.domainAutoAccess ? 'on' : ''}`}>
                      <div className="uas-toggle-knob" />
                    </div>
                  </td>
                  <td>
                    <span className={`uas-badge ${uni.settings?.freeAccessForStudents ? 'green' : 'gold'}`}>
                      {uni.settings?.freeAccessForStudents ? 'FREE' : 'PAID'}
                    </span>
                  </td>
                  <td>
                    <span className={`uas-badge ${uni.settings?.guestAccessAllowed ? 'blue' : 'red'}`}>
                      {uni.settings?.guestAccessAllowed ? 'ALLOWED' : 'BLOCKED'}
                    </span>
                  </td>
                  <td className="uas-split">
                    {uni.settings?.revenueSplitUniversity || 0}% / {uni.settings?.revenueSplitUploader || 0}% / {uni.settings?.revenueSplitPlatform || 0}%
                  </td>
                  <td>
                    {uni.verified
                      ? <span className="uas-status verified">✓ Verified</span>
                      : <span className="uas-status pending">⏳ Pending</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Access Level Matrix */}
      <h3 className="uas-section-title">Dynamic Access Level Matrix</h3>
      <div className="uas-matrix-grid">
        {ACCESS_LEVELS.map((level, i) => (
          <div key={i} className="uas-matrix-card" style={{ borderColor: level.color }}>
            <div className="uas-matrix-title" style={{ color: level.color }}>{level.title}</div>
            <div className="uas-matrix-desc">{level.desc}</div>
            <ul className="uas-matrix-list">
              {level.perks.map((p, j) => (
                <li key={j}>
                  <span className="uas-matrix-dot" style={{ background: level.color }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="uas-footer-note">All rules are 100% dynamic. No hardcoded universities. Every institution defines their own system.</p>
    </div>
  );
}
