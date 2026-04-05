import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';
import { useState } from 'react';

export default function ProfilePage() {
  const { isLoggedIn, user, token } = useAuth();
  const navigate = useNavigate();
  const [refData, setRefData] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    loadReferralData();
  }, [isLoggedIn]);

  async function loadReferralData() {
    try {
      const res = await fetch(`${API_URL}/api/referral/my`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setRefData(data);
    } catch (e) { console.warn(e); }
  }

  if (!user) return null;

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <h2 className="sec-title">My Profile</h2>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="doc-card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem', color: 'white', fontWeight: 700 }}>
            {user.name[0].toUpperCase()}
          </div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '.5rem' }}>{user.name}</h3>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '1rem' }}>{user.email}</p>
          <div style={{ background: 'rgba(59,130,246,.1)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '.7rem', color: 'var(--blue2)', marginBottom: '.3rem' }}>MEMBER SINCE</div>
            <div style={{ fontWeight: 600 }}>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</div>
          </div>
        </div>

        {refData && (
          <div className="doc-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1.8rem' }}>🎁</span>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Referral Program</div>
                <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>Invite friends, earn ₹10 each when they make their first rental</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.3)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '.7rem', color: 'var(--green)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '.3rem' }}>Wallet Balance</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--green)' }}>₹{refData.referralBalance}</div>
              </div>
              <div style={{ background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.3)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '.7rem', color: 'var(--blue2)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '.3rem' }}>Friends Referred</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--blue2)' }}>{refData.referralCount}</div>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginBottom: '.4rem', fontWeight: 700 }}>YOUR USERNAME (share this)</div>
              <div style={{ display: 'flex', gap: '.5rem' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '2px dashed var(--blue)', borderRadius: '8px', padding: '.8rem 1rem', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '3px', color: 'var(--blue2)', textAlign: 'center' }}>
                  {refData.username || 'N/A'}
                </div>
                <button onClick={() => { navigator.clipboard.writeText(refData.username); }} style={{ padding: '.8rem 1.2rem', background: 'linear-gradient(135deg,var(--blue),var(--purple))', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: 700 }}>📋 Copy</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
