import { useState, useEffect } from 'react';

const MOODS = ['😊 Great', '🙂 Good', '😐 Okay', '😔 Low', '😢 Stressed', '😤 Overwhelmed'];
const MEDITATIONS = [
  { id: 1, name: 'Study Break Calm', duration: '5 min', icon: '🧘', type: 'meditation', description: 'Quick breathing exercise to reset between study sessions.' },
  { id: 2, name: 'Deep Focus Prep', duration: '10 min', icon: '🎯', type: 'meditation', description: 'Guided visualization to prepare your mind for deep work.' },
  { id: 3, name: 'Exam Anxiety Relief', duration: '8 min', icon: '😮‍💨', type: 'meditation', description: 'Body scan technique specifically designed for pre-exam stress.' },
  { id: 4, name: 'Forest Rain', duration: '30 min', icon: '🌧️', type: 'soundscape', description: 'Gentle rain falling on forest canopy with distant thunder.' },
  { id: 5, name: 'Ocean Waves', duration: '45 min', icon: '🌊', type: 'soundscape', description: 'Rhythmic ocean waves for background study ambient.' },
  { id: 6, name: 'Sleep Stories: Space', duration: '20 min', icon: '🌌', type: 'sleep', description: 'A narrated journey through the cosmos to help you drift off.' },
  { id: 7, name: 'Morning Energy', duration: '7 min', icon: '☀️', type: 'meditation', description: 'Start your study day with intention and positive energy.' },
  { id: 8, name: 'Gratitude Practice', duration: '5 min', icon: '🙏', type: 'meditation', description: 'End-of-day reflection to appreciate your learning journey.' },
];

const TIPS = [
  { title: '20-20-20 Rule', desc: 'Every 20 min, look at something 20 feet away for 20 seconds.', icon: '👁️' },
  { title: 'Hydration Check', desc: 'Drink water every hour. Dehydration reduces focus by 25%.', icon: '💧' },
  { title: 'Movement Break', desc: 'Stand and stretch every 45 min to boost blood flow to your brain.', icon: '🏃' },
  { title: 'Social Connect', desc: 'Spend 15 min talking to a friend or family member daily.', icon: '💬' },
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WellnessTrackerPage() {
  const [tab, setTab] = useState('dashboard');
  const [todayMood, setTodayMood] = useState(null);
  const [journalText, setJournalText] = useState('');
  const [studyHours, setStudyHours] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [activeMeditation, setActiveMeditation] = useState(null);
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const [weekLog, setWeekLog] = useState([
    { mood: 3, study: 6, sleep: 7 }, { mood: 2, study: 8, sleep: 6 }, { mood: 4, study: 5, sleep: 8 },
    { mood: 1, study: 4, sleep: 7.5 }, { mood: 2, study: 7, sleep: 6.5 }, { mood: 1, study: 3, sleep: 9 }, null
  ]);
  const [streakDays, setStreakDays] = useState(6);

  useEffect(() => {
    let interval;
    if (isMeditating) {
      interval = setInterval(() => setMeditationTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isMeditating]);

  const formatTimer = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const burnoutScore = (() => {
    const logs = weekLog.filter(Boolean);
    if (!logs.length) return 0;
    const avgStudy = logs.reduce((a, l) => a + l.study, 0) / logs.length;
    const avgSleep = logs.reduce((a, l) => a + l.sleep, 0) / logs.length;
    const avgMood = logs.reduce((a, l) => a + l.mood, 0) / logs.length;
    return Math.min(100, Math.max(0, Math.round((avgStudy * 8 - avgSleep * 5 + avgMood * 10))));
  })();

  const burnoutColor = burnoutScore > 70 ? 'var(--red)' : burnoutScore > 40 ? 'var(--gold)' : 'var(--green)';
  const burnoutLabel = burnoutScore > 70 ? '⚠️ High Risk' : burnoutScore > 40 ? '⚡ Moderate' : '✅ Healthy';

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Mind & Body</div>
      <h2 className="sec-title">🧠 Wellness Tracker</h2>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'checkin', icon: '📝', label: 'Daily Check-in' }, { id: 'meditate', icon: '🧘', label: 'Meditate' }, { id: 'tips', icon: '💡', label: 'Wellness Tips' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '.6rem 1.2rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .3s', background: tab === t.id ? 'linear-gradient(135deg,var(--blue),var(--purple))' : 'var(--glass)', color: tab === t.id ? '#fff' : 'var(--muted)', fontSize: '.85rem' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div>
          {/* Burnout Meter */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>🔥 Burnout Risk Meter</h3>
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 1rem', borderRadius: '50%', background: `conic-gradient(${burnoutColor} ${burnoutScore * 3.6}deg, rgba(255,255,255,.08) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", color: burnoutColor }}>{burnoutScore}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>/ 100</div>
              </div>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: burnoutColor }}>{burnoutLabel}</div>
          </div>

          {/* Week Overview */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4>📅 This Week</h4>
              <span style={{ fontSize: '.82rem', color: 'var(--gold)', fontWeight: 700 }}>🔥 {streakDays} day streak</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '.5rem' }}>
              {WEEK_DAYS.map((day, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '.8rem .4rem', borderRadius: '12px', background: weekLog[i] ? 'rgba(59,130,246,.08)' : 'rgba(255,255,255,.02)', border: '1px solid var(--gb)' }}>
                  <div style={{ fontSize: '.68rem', color: 'var(--muted)', fontWeight: 700, marginBottom: '.4rem' }}>{day}</div>
                  {weekLog[i] ? (
                    <>
                      <div style={{ fontSize: '1.3rem', marginBottom: '.2rem' }}>{MOODS[weekLog[i].mood]?.split(' ')[0]}</div>
                      <div style={{ fontSize: '.62rem', color: 'var(--blue2)' }}>{weekLog[i].study}h study</div>
                      <div style={{ fontSize: '.62rem', color: 'var(--purple)' }}>{weekLog[i].sleep}h sleep</div>
                    </>
                  ) : (
                    <div style={{ fontSize: '.72rem', color: 'var(--muted2)' }}>—</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '📚', label: 'Avg Study', value: '5.5 hrs/day', color: 'var(--blue2)' },
              { icon: '😴', label: 'Avg Sleep', value: '7.3 hrs/night', color: 'var(--purple)' },
              { icon: '😊', label: 'Avg Mood', value: 'Good', color: 'var(--green)' },
              { icon: '🧘', label: 'Meditation', value: '23 min/week', color: 'var(--cyan)' },
            ].map((s, i) => (
              <div key={i} className="glass" style={{ padding: '1.2rem', borderRadius: '14px', textAlign: 'center', borderTop: `3px solid ${s.color}` }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '.3rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Check-in */}
      {tab === 'checkin' && (
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px', maxWidth: '700px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>📝 How are you feeling today?</h3>

          <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {MOODS.map((m, i) => (
              <button key={i} onClick={() => { setTodayMood(i); if(window.ssSound) window.ssSound('click'); }}
                style={{ padding: '.8rem 1.2rem', borderRadius: '14px', border: todayMood === i ? '2px solid var(--blue)' : '1px solid var(--gb)', background: todayMood === i ? 'rgba(59,130,246,.15)' : 'var(--glass)', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit', color: 'var(--white)', transition: 'all .2s' }}>
                {m}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Study Hours Today</label>
              <input type="number" value={studyHours} onChange={e => setStudyHours(e.target.value)} placeholder="e.g., 6"
                style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Sleep Last Night (hrs)</label>
              <input type="number" value={sleepHours} onChange={e => setSleepHours(e.target.value)} placeholder="e.g., 7"
                style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Journal (Optional)</label>
            <textarea value={journalText} onChange={e => setJournalText(e.target.value)} placeholder="How was your day? Any wins or challenges?"
              style={{ width: '100%', minHeight: '120px', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.7 }} />
          </div>

          <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => { if(window.ssSound) window.ssSound('success'); }}>
            ✅ Save Today's Check-in
          </button>
        </div>
      )}

      {/* Meditate */}
      {tab === 'meditate' && (
        <div>
          {activeMeditation ? (
            <div className="glass" style={{ padding: '3rem', borderRadius: '24px', textAlign: 'center', maxWidth: '600px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(139,92,246,.1), transparent 70%)', pointerEvents: 'none' }} />
              <button onClick={() => { setActiveMeditation(null); setIsMeditating(false); setMeditationTimer(0); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'breathe 4s ease-in-out infinite' }}>{activeMeditation.icon}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '.5rem' }}>{activeMeditation.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '2rem' }}>{activeMeditation.description}</p>
              <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", color: 'var(--blue2)', marginBottom: '2rem', textShadow: '0 0 30px rgba(59,130,246,.3)' }}>
                {formatTimer(meditationTimer)}
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-grad" onClick={() => { setIsMeditating(!isMeditating); if(window.ssSound) window.ssSound('click'); }}>
                  {isMeditating ? '⏸ Pause' : '▶ Start'}
                </button>
                <button className="btn btn-ghost" onClick={() => { setMeditationTimer(0); setIsMeditating(false); }}>🔄 Reset</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {MEDITATIONS.map(m => (
                <div key={m.id} className="glass" onClick={() => { setActiveMeditation(m); setMeditationTimer(0); if(window.ssSound) window.ssSound('open'); }}
                  style={{ padding: '1.5rem', borderRadius: '16px', cursor: 'pointer', transition: 'all .3s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.8rem' }}>
                    <div style={{ fontSize: '2rem' }}>{m.icon}</div>
                    <div>
                      <h4 style={{ fontSize: '.95rem', fontWeight: 700 }}>{m.name}</h4>
                      <div style={{ display: 'flex', gap: '.5rem', fontSize: '.72rem' }}>
                        <span style={{ color: 'var(--blue2)' }}>⏱ {m.duration}</span>
                        <span style={{ padding: '.1rem .4rem', borderRadius: '4px', background: m.type === 'meditation' ? 'rgba(139,92,246,.15)' : m.type === 'soundscape' ? 'rgba(16,185,129,.15)' : 'rgba(59,130,246,.15)', color: m.type === 'meditation' ? 'var(--purple)' : m.type === 'soundscape' ? 'var(--green)' : 'var(--blue2)', fontWeight: 600 }}>{m.type}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>{m.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wellness Tips */}
      {tab === 'tips' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {TIPS.map((t, i) => (
            <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', borderTop: '3px solid var(--green)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '.8rem' }}>{t.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.5rem' }}>{t.title}</h3>
              <p style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes breathe { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: .8; } }
      `}</style>
    </div>
  );
}
