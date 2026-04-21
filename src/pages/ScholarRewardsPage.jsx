import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

export default function ScholarRewardsPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState('shop');
  const [filterCat, setFilterCat] = useState('All');
  const [userCoins, setUserCoins] = useState(0);
  const [stats, setStats] = useState({ totalEarned: 0, totalSpent: 0, streakDays: 0, weeklyEarned: 0 });
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [showConfirm, setShowConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [earnMethods, setEarnMethods] = useState([]);

  const categories = ['All', 'Themes', 'Merch', 'Gift Cards', 'Customization', 'Badges', 'Tools'];
  const filtered = filterCat === 'All' ? rewards : rewards.filter(r => r.category === filterCat);

  useEffect(() => {
    if (token) {
      fetchData();
      fetchRewards();
      fetchEarnMethods();
      claimDaily();
    }
  }, [token]);

  const fetchRewards = async () => {
    try {
      const res = await fetch(`${API_URL}/api/scholar-coins/rewards`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRewards(data.rewards || []);
      }
    } catch (err) {
      console.error('Failed to fetch rewards:', err);
      setRewards([]);
    }
  };

  const fetchEarnMethods = async () => {
    try {
      const res = await fetch(`${API_URL}/api/scholar-coins/earn-methods`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEarnMethods(data.methods || []);
      }
    } catch (err) {
      console.error('Failed to fetch earn methods:', err);
      setEarnMethods([]);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [balRes, actRes, leadRes] = await Promise.all([
        fetch(`${API_URL}/api/scholar-coins/balance`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/scholar-coins/activity`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/scholar-coins/leaderboard`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const balData = await balRes.json();
      const actData = await actRes.json();
      const leadData = await leadRes.json();

      if (balData.success) {
        setUserCoins(balData.balance);
        setStats({
          totalEarned: balData.totalEarned,
          totalSpent: balData.totalSpent,
          streakDays: balData.streakDays,
          weeklyEarned: balData.weeklyEarned
        });
        setPurchased(balData.purchasedItems || []);
      }
      if (actData.success) setHistory(actData.transactions);
      if (leadData.success) setLeaderboard(leadData.leaderboard);
    } catch (err) {
      console.error('Failed to fetch rewards data:', err);
    } finally {
      setLoading(false);
    }
  };

  const claimDaily = async () => {
    try {
      const res = await fetch(`${API_URL}/api/scholar-coins/daily-login`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.bonus > 0) {
        if(window.ssSound) window.ssSound('success');
        fetchData();
      }
    } catch (err) { /* ignore */ }
  };

  const handlePurchase = async (item) => {
    if (userCoins < item.cost) return;
    try {
      const res = await fetch(`${API_URL}/api/scholar-coins/spend`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId: item.id, itemName: item.name, cost: item.cost })
      });
      const data = await res.json();
      if (data.success) {
        if(window.ssSound) window.ssSound('success');
        fetchData();
        setShowConfirm(null);
      }
    } catch (err) {
      console.error('Redemption failed:', err);
    }
  };

  const rarityColor = (r) => r === 'Legendary' ? 'var(--gold)' : r === 'Epic' ? 'var(--purple)' : r === 'Rare' ? 'var(--blue2)' : 'var(--muted)';

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Earn & Redeem</div>
      <h2 className="sec-title">🪙 ScholarCoin Rewards</h2>

      {/* Coin Balance Card */}
      <div className="glass" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, rgba(245,158,11,.08), rgba(168,85,247,.08))', borderColor: 'rgba(245,158,11,.2)' }}>
        <div>
          <div style={{ fontSize: '.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.3rem' }}>Your Balance</div>
          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", color: 'var(--gold)', textShadow: '0 0 30px rgba(245,158,11,.3)' }}>
            🪙 {userCoins.toLocaleString()}
          </div>
          <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>ScholarCoins</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem 1.5rem', background: 'rgba(255,255,255,.05)', borderRadius: '14px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--green)' }}>+{stats.weeklyEarned}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--muted)' }}>This Week</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem 1.5rem', background: 'rgba(255,255,255,.05)', borderRadius: '14px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--blue2)' }}>{stats.streakDays}d</div>
            <div style={{ fontSize: '.68rem', color: 'var(--muted)' }}>Streak</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'shop', icon: '🛍️', label: 'Rewards Shop' }, { id: 'earn', icon: '💰', label: 'Earn Coins' }, { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' }, { id: 'history', icon: '📜', label: 'Activity' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '.6rem 1.2rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', background: tab === t.id ? 'linear-gradient(135deg,var(--gold),var(--purple))' : 'var(--glass)', color: tab === t.id ? '#fff' : 'var(--muted)', fontSize: '.85rem', transition: 'all .3s' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Shop */}
      {tab === 'shop' && (
        <div>
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilterCat(c)}
                style={{ padding: '.4rem .9rem', borderRadius: '50px', border: 'none', background: filterCat === c ? 'rgba(245,158,11,.25)' : 'var(--glass)', color: filterCat === c ? 'var(--gold)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.78rem', fontFamily: 'inherit' }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem' }}>
            {filtered.map(item => (
              <div key={item.id} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', position: 'relative', opacity: purchased.includes(item.id) ? .6 : 1 }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '.65rem', padding: '.2rem .6rem', borderRadius: '50px', fontWeight: 700, color: rarityColor(item.rarity), background: `${rarityColor(item.rarity)}15`, border: `1px solid ${rarityColor(item.rarity)}30` }}>{item.rarity}</div>
                <div style={{ fontSize: '3rem', marginBottom: '.8rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.3rem' }}>{item.name}</h3>
                <p style={{ fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem' }}>{item.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold)' }}>🪙 {item.cost}</span>
                  {purchased.includes(item.id) ? (
                    <span style={{ fontSize: '.8rem', color: 'var(--green)', fontWeight: 700 }}>✅ Owned</span>
                  ) : (
                    <button className="btn btn-grad" onClick={() => setShowConfirm(item)}
                      style={{ padding: '.5rem 1rem', fontSize: '.82rem', opacity: userCoins < item.cost ? .4 : 1 }}
                      disabled={userCoins < item.cost}>
                      {userCoins < item.cost ? '🔒 Need More' : '🛒 Redeem'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Earn */}
      {tab === 'earn' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {EARN_METHODS.map((e, i) => (
            <div key={i} className="glass" style={{ padding: '1.3rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--gold)' }}>
              <div style={{ fontSize: '2rem' }}>{e.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: '.2rem' }}>{e.action}</div>
                <div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{e.frequency}</div>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--green)' }}>{e.coins}</div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard */}
      {tab === 'leaderboard' && (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', maxWidth: '600px' }}>
          {leaderboard.map((u, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '10px', background: u.isYou ? 'rgba(59,130,246,.1)' : 'transparent', border: u.isYou ? '1px solid rgba(59,130,246,.3)' : '1px solid transparent', marginBottom: '.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: u.rank <= 3 ? 'var(--gold)' : 'var(--muted)', width: '30px', textAlign: 'center' }}>{u.rank <= 3 ? ['🥇', '🥈', '🥉'][u.rank-1] : `#${u.rank}`}</div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#fff' }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{u.name}</div>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '1rem' }}>🪙 {u.coins.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div style={{ maxWidth: '600px' }}>
          {history.map((a, i) => (
            <div key={i} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem', borderRadius: '10px', marginBottom: '.5rem' }}>
              <div style={{ fontSize: '1.5rem' }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '.88rem' }}>{a.action}</div>
                <div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{new Date(a.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={{ fontWeight: 800, color: a.type === 'earn' ? 'var(--green)' : 'var(--red)', fontSize: '.95rem' }}>
                {a.type === 'earn' ? '+' : '-'}{a.amount}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }} onClick={() => setShowConfirm(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg)', border: '1px solid var(--gb)', borderRadius: '24px', padding: '2.5rem', maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{showConfirm.icon}</div>
            <h3 style={{ marginBottom: '.5rem' }}>{showConfirm.name}</h3>
            <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '1.5rem' }}>{showConfirm.description}</p>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '1.5rem' }}>🪙 {showConfirm.cost} ScholarCoins</div>
            <div style={{ display: 'flex', gap: '.8rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setShowConfirm(null)}>Cancel</button>
              <button className="btn btn-grad" onClick={() => handlePurchase(showConfirm)}>✅ Confirm Purchase</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
