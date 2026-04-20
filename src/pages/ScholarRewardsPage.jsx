import { useState } from 'react';

const REWARDS_CATALOG = [
  { id: 1, name: 'Dark Hacker Theme', cost: 500, category: 'Themes', icon: '🎨', description: 'Unlock the exclusive matrix-inspired dark theme for your dashboard.', rarity: 'Rare' },
  { id: 2, name: 'Neon Gradient Pack', cost: 750, category: 'Themes', icon: '🌈', description: 'A collection of 5 vibrant neon gradient backgrounds.', rarity: 'Epic' },
  { id: 3, name: 'ScholarStock Hoodie', cost: 2000, category: 'Merch', icon: '👕', description: 'Premium quality hoodie with embroidered ScholarStock logo.', rarity: 'Legendary' },
  { id: 4, name: 'Amazon ₹500 Gift Card', cost: 5000, category: 'Gift Cards', icon: '🎁', description: 'Redeem for an Amazon India gift card worth ₹500.', rarity: 'Legendary' },
  { id: 5, name: 'Custom Avatar Frame', cost: 300, category: 'Customization', icon: '🖼️', description: 'Animated glowing frame around your profile picture.', rarity: 'Common' },
  { id: 6, name: 'Study Streak Badge', cost: 150, category: 'Badges', icon: '🔥', description: 'Display a fire badge next to your name in study rooms.', rarity: 'Common' },
  { id: 7, name: 'Top Scholar Title', cost: 1000, category: 'Badges', icon: '👑', description: 'Exclusive "Top Scholar" title visible on your profile.', rarity: 'Epic' },
  { id: 8, name: 'Sticker Pack (Digital)', cost: 200, category: 'Customization', icon: '✨', description: '25 animated stickers for study room chat.', rarity: 'Common' },
  { id: 9, name: 'Premium Note Templates', cost: 400, category: 'Tools', icon: '📝', description: 'Unlock 10 beautifully designed note-taking templates.', rarity: 'Rare' },
  { id: 10, name: 'Spotify ₹300 Gift Card', cost: 3000, category: 'Gift Cards', icon: '🎵', description: 'Spotify Premium gift card for uninterrupted study music.', rarity: 'Epic' },
];

const EARN_METHODS = [
  { action: 'Upload study notes', coins: '+50', icon: '📤', frequency: 'Per upload' },
  { action: 'Complete a quiz', coins: '+25', icon: '📝', frequency: 'Per quiz' },
  { action: 'Daily login streak', coins: '+10', icon: '🔥', frequency: 'Daily' },
  { action: 'Help a peer (tutoring)', coins: '+75', icon: '🤝', frequency: 'Per session' },
  { action: 'Complete a VR Lab', coins: '+40', icon: '🧪', frequency: 'Per lab' },
  { action: 'Write a review', coins: '+15', icon: '⭐', frequency: 'Per review' },
  { action: 'Refer a friend', coins: '+200', icon: '👥', frequency: 'Per referral' },
  { action: '7-day study streak', coins: '+100', icon: '🏆', frequency: 'Weekly bonus' },
];

const LEADERBOARD = [
  { rank: 1, name: 'Ananya K.', coins: 12400, avatar: '👩‍🎓', badge: '👑' },
  { rank: 2, name: 'Rohan M.', coins: 11200, avatar: '👨‍💻', badge: '🥈' },
  { rank: 3, name: 'Sneha P.', coins: 10800, avatar: '👩‍🔬', badge: '🥉' },
  { rank: 4, name: 'Arjun S.', coins: 9600, avatar: '👨‍🎓', badge: '' },
  { rank: 5, name: 'Kavya R.', coins: 8900, avatar: '👩‍💼', badge: '' },
  { rank: 6, name: 'You', coins: 2450, avatar: '😎', badge: '⭐' },
];

const RECENT_ACTIVITY = [
  { action: 'Uploaded Calculus Notes', coins: '+50', time: '2 hrs ago', icon: '📤' },
  { action: 'Completed Physics Quiz', coins: '+25', time: '5 hrs ago', icon: '📝' },
  { action: 'Daily Login Bonus', coins: '+10', time: 'Today', icon: '🔥' },
  { action: 'Helped peer in Study Room', coins: '+75', time: 'Yesterday', icon: '🤝' },
  { action: '7-day Streak Bonus!', coins: '+100', time: '2 days ago', icon: '🏆' },
];

export default function ScholarRewardsPage() {
  const [tab, setTab] = useState('shop');
  const [filterCat, setFilterCat] = useState('All');
  const [userCoins, setUserCoins] = useState(2450);
  const [purchased, setPurchased] = useState([]);
  const [showConfirm, setShowConfirm] = useState(null);

  const categories = ['All', 'Themes', 'Merch', 'Gift Cards', 'Customization', 'Badges', 'Tools'];
  const filtered = filterCat === 'All' ? REWARDS_CATALOG : REWARDS_CATALOG.filter(r => r.category === filterCat);

  const handlePurchase = (item) => {
    if (userCoins >= item.cost && !purchased.includes(item.id)) {
      setUserCoins(c => c - item.cost);
      setPurchased(p => [...p, item.id]);
      setShowConfirm(null);
      if(window.ssSound) window.ssSound('success');
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
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--green)' }}>+260</div>
            <div style={{ fontSize: '.68rem', color: 'var(--muted)' }}>This Week</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem 1.5rem', background: 'rgba(255,255,255,.05)', borderRadius: '14px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--blue2)' }}>#42</div>
            <div style={{ fontSize: '.68rem', color: 'var(--muted)' }}>Rank</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'shop', icon: '🛍️', label: 'Rewards Shop' }, { id: 'earn', icon: '💰', label: 'Earn Coins' }, { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' }, { id: 'activity', icon: '📜', label: 'Activity' }].map(t => (
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
          {LEADERBOARD.map((u, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '10px', background: u.name === 'You' ? 'rgba(59,130,246,.1)' : 'transparent', border: u.name === 'You' ? '1px solid rgba(59,130,246,.3)' : '1px solid transparent', marginBottom: '.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: u.rank <= 3 ? 'var(--gold)' : 'var(--muted)', width: '30px', textAlign: 'center' }}>{u.badge || `#${u.rank}`}</div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{u.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{u.name}</div>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '1rem' }}>🪙 {u.coins.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* Activity */}
      {tab === 'activity' && (
        <div style={{ maxWidth: '600px' }}>
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem', borderRadius: '10px', marginBottom: '.5rem' }}>
              <div style={{ fontSize: '1.5rem' }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '.88rem' }}>{a.action}</div>
                <div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{a.time}</div>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: '.95rem' }}>{a.coins}</div>
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
