import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const DEFAULT_WIDGETS = [
  { id: 'stats', title: '📊 Study Stats', enabled: true },
  { id: 'due', title: '⏰ Due Today', enabled: true },
  { id: 'recent', title: '📄 Recent Materials', enabled: true },
  { id: 'streak', title: '🔥 Study Streak', enabled: true },
  { id: 'chart', title: '📈 Weekly Activity', enabled: true },
  { id: 'tasks', title: '✅ Tasks', enabled: true },
];

const MOCK_WEEKLY = [
  { day: 'Mon', hours: 2.5 }, { day: 'Tue', hours: 1.8 }, { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 0.5 }, { day: 'Fri', hours: 2.1 }, { day: 'Sat', hours: 4.0 }, { day: 'Sun', hours: 1.5 },
];

// Toast notification system
const showToast = (message, type = 'info') => {
  const container = document.querySelector('.toast-container') || (() => {
    const div = document.createElement('div');
    div.className = 'toast-container';
    document.body.appendChild(div);
    return div;
  })();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('on'), 10);
  setTimeout(() => {
    toast.classList.remove('on');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

export default function StudyDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_dashboard_widgets')) || DEFAULT_WIDGETS; }
    catch { return DEFAULT_WIDGETS; }
  });
  const [widgetOrder, setWidgetOrder] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_dashboard_order')) || DEFAULT_WIDGETS.map(w => w.id); }
    catch { return DEFAULT_WIDGETS.map(w => w.id); }
  });
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState({ totalCards: 0, dueCards: 0, totalReviews: 0, accuracy: 0 });
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const authH = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    Promise.all([
      fetch(`${API_URL}/api/flashcards/stats`, { headers: authH() }).then(r => r.json()).catch(e => { setErrors(prev => ({...prev, stats: e.message})); return {}; }),
      fetch(`${API_URL}/api/materials?limit=5`, { headers: authH() }).then(r => r.json()).catch(e => { setErrors(prev => ({...prev, materials: e.message})); return {}; }),
      fetch(`${API_URL}/api/tasks?limit=5`, { headers: authH() }).then(r => r.json()).catch(e => { setErrors(prev => ({...prev, tasks: e.message})); return {}; }),
    ]).then(([sData, mData, tData]) => {
      if (sData.success) setStats(sData.stats);
      if (mData.success) setRecentMaterials(mData.materials?.slice(0, 5) || []);
      if (tData.success) setTasks(tData.tasks?.slice(0, 5) || []);
      const lastStudy = localStorage.getItem('ss_last_study');
      if (lastStudy) {
        const diff = Math.floor((Date.now() - parseInt(lastStudy)) / 86400000);
        setStreak(diff <= 1 ? parseInt(localStorage.getItem('ss_streak') || '0') : 0);
      }
    }).finally(() => setLoading(false));
  }, [token, authH]);

  const toggleWidget = (id) => {
    const updated = widgets.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w);
    setWidgets(updated);
    localStorage.setItem('ss_dashboard_widgets', JSON.stringify(updated));
    showToast(`Widget ${updated.find(w => w.id === id).enabled ? 'enabled' : 'disabled'}`, 'success');
  };

  const saveLayout = () => {
    localStorage.setItem('ss_dashboard_widgets', JSON.stringify(widgets));
    localStorage.setItem('ss_dashboard_order', JSON.stringify(widgetOrder));
    setEditing(false);
    showToast('Dashboard layout saved', 'success');
  };

  const enabledWidgets = widgets.filter(w => w.enabled).sort((a, b) => widgetOrder.indexOf(a.id) - widgetOrder.indexOf(b.id));

  if (!token) return (
    <div className="dash-wrap">
      <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '.5rem' }}>Login to view your dashboard</h3>
        <button onClick={() => navigate('/login')} style={{ background: 'linear-gradient(135deg,var(--blue),var(--purple))', border: 'none', color: '#fff', padding: '.6rem 1.4rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, marginTop: '1rem' }}>
          Login Now
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="dash-wrap">
      <div className="dash-header">
        <div>
          <div className="skeleton skeleton-text" style={{ width: '200px' }}></div>
          <div className="skeleton skeleton-text" style={{ width: '300px', marginTop: '.5rem' }}></div>
        </div>
      </div>
      <div className="dash-grid">
        {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton skeleton-widget"></div>)}
      </div>
    </div>
  );

  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <div>
          <h2 className="dash-title">📊 Study Dashboard</h2>
          <p className="dash-sub">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}! Here's your study overview.</p>
        </div>
        <button className={`dash-edit-btn ${editing ? 'active' : ''}`} onClick={() => setEditing(e => !e)} title="Customize dashboard">
          {editing ? '✓ Done' : '⚙ Customize'}
        </button>
      </div>

      {/* Widget Customizer */}
      {editing && (
        <div className="dash-customizer">
          <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginBottom: '.8rem', fontWeight: 600 }}>Toggle widgets on/off:</div>
          <div className="dash-widget-toggles">
            {widgets.map(w => (
              <button key={w.id} className={`dash-widget-toggle ${w.enabled ? 'on' : ''}`} onClick={() => toggleWidget(w.id)} title={`${w.enabled ? 'Hide' : 'Show'} ${w.title}`}>
                {w.enabled ? '✓' : '+'} {w.title}
              </button>
            ))}
          </div>
          <button onClick={saveLayout} style={{ marginTop: '1rem', background: 'linear-gradient(135deg,var(--green),var(--cyan))', border: 'none', color: '#fff', padding: '.6rem 1.4rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, width: '100%' }}>
            Save Layout
          </button>
        </div>
      )}

      {/* Widget Grid */}
      <div className="dash-grid">
        {enabledWidgets.map(widget => (
          <div key={widget.id} className={`dash-widget ${widget.id === 'chart' ? 'dash-widget-wide' : ''}`}>
            {widget.id === 'stats' && (
              <>
                <div className="dash-widget-title">📊 Study Stats</div>
                <div className="dash-mini-stats">
                  <div className="dash-mini-stat"><div style={{ color: 'var(--blue)', fontSize: '1.4rem', fontWeight: 900 }}>{stats.totalCards}</div><div>Total Cards</div></div>
                  <div className="dash-mini-stat"><div style={{ color: 'var(--gold)', fontSize: '1.4rem', fontWeight: 900 }}>{stats.dueCards}</div><div>Due Today</div></div>
                  <div className="dash-mini-stat"><div style={{ color: 'var(--green)', fontSize: '1.4rem', fontWeight: 900 }}>{stats.accuracy}%</div><div>Accuracy</div></div>
                </div>
              </>
            )}
            {widget.id === 'due' && (
              <>
                <div className="dash-widget-title">⏰ Due Today</div>
                {stats.dueCards === 0 ? (
                  <div className="dash-widget-empty">🎉 All caught up!</div>
                ) : (
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--gold)', fontFamily: "'Playfair Display',serif" }}>{stats.dueCards}</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginBottom: '1rem' }}>flashcards to review</div>
                    <button className="dash-action-btn" onClick={() => navigate('/flashcards')}>Review Now →</button>
                  </div>
                )}
              </>
            )}
            {widget.id === 'streak' && (
              <>
                <div className="dash-widget-title">🔥 Study Streak</div>
                <div style={{ textAlign: 'center', padding: '.5rem 0' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--gold)', fontFamily: "'Playfair Display',serif" }}>{streak}</div>
                  <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>day streak</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '.3rem', marginTop: '.8rem' }}>
                    {[...Array(7)].map((_, i) => (
                      <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: i < streak % 7 ? 'var(--gold)' : 'var(--glass)', border: '1px solid var(--gb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', color: 'var(--muted)' }}>
                        {['M','T','W','T','F','S','S'][i]}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {widget.id === 'recent' && (
              <>
                <div className="dash-widget-title">📄 Recent Materials</div>
                {recentMaterials.length === 0 ? (
                  <div className="dash-widget-empty">No materials yet. <span style={{ color: 'var(--blue2)', cursor: 'pointer' }} onClick={() => navigate('/browse')}>Browse →</span></div>
                ) : recentMaterials.map((m, i) => (
                  <div key={i} className="dash-recent-item" onClick={() => navigate('/browse')}>
                    <span style={{ fontSize: '1rem' }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                      <div style={{ fontSize: '.7rem', color: 'var(--muted)' }}>{m.examCategory}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {widget.id === 'chart' && (
              <>
                <div className="dash-widget-title">📈 Weekly Study Activity</div>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_WEEKLY}>
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                      <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                      <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
            {widget.id === 'tasks' && (
              <>
                <div className="dash-widget-title">✅ Upcoming Tasks</div>
                {tasks.length === 0 ? (
                  <div className="dash-widget-empty">No tasks. <span style={{ color: 'var(--blue2)', cursor: 'pointer' }} onClick={() => navigate('/countdown')}>Add tasks →</span></div>
                ) : tasks.map((t, i) => (
                  <div key={i} className="dash-task-item">
                    <div className={`dash-task-dot ${t.priority}`} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '.82rem' }}>{t.title}</div>
                      <div style={{ fontSize: '.7rem', color: 'var(--muted)' }}>{t.date} {t.time}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dash-quick-actions">
        <div className="dash-qa-title">Quick Actions</div>
        <div className="dash-qa-grid">
          {[
            { icon: '🧠', label: 'Flashcards', path: '/flashcards' },
            { icon: '👥', label: 'Study Rooms', path: '/study-rooms' },
            { icon: '🏛️', label: 'University Hub', path: '/university' },
            { icon: '🎯', label: 'AI Strategist', path: '/study-strategist' },
            { icon: '⏳', label: 'Countdown', path: '/countdown' },
            { icon: '🔍', label: 'Browse', path: '/browse' },
          ].map((a, i) => (
            <button key={i} className="dash-qa-btn" onClick={() => navigate(a.path)}>
              <span style={{ fontSize: '1.5rem' }}>{a.icon}</span>
              <span style={{ fontSize: '.78rem', fontWeight: 600 }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
