import { useState } from 'react';

const COMPETITIONS = [
  { id: 1, name: 'ScholarHack 2026', type: 'Hackathon', icon: '💻', organizer: 'ScholarStock x Google', deadline: 'May 15, 2026', prize: '$25,000', participants: 2400, maxTeam: 4, status: 'open', tags: ['AI/ML', 'Web Dev', 'Open Innovation'], description: 'Build the future of education technology. 48 hours to create an innovative EdTech solution.', difficulty: 'All Levels', mode: 'Hybrid' },
  { id: 2, name: 'Global Case Competition', type: 'Case Study', icon: '📊', organizer: 'McKinsey x Harvard', deadline: 'Jun 1, 2026', prize: '$15,000', participants: 1800, maxTeam: 3, status: 'open', tags: ['Strategy', 'Business', 'Consulting'], description: 'Solve a real-world business challenge for a Fortune 500 company.', difficulty: 'Advanced', mode: 'Virtual' },
  { id: 3, name: 'Neural Net Challenge', type: 'AI Competition', icon: '🧠', organizer: 'DeepMind', deadline: 'Apr 30, 2026', prize: '$50,000', participants: 5200, maxTeam: 2, status: 'closing', tags: ['Deep Learning', 'NLP', 'Computer Vision'], description: 'Push the boundaries of neural network efficiency on benchmark datasets.', difficulty: 'Expert', mode: 'Virtual' },
  { id: 4, name: 'Startup Weekend EDU', type: 'Pitch', icon: '🚀', organizer: 'Techstars', deadline: 'May 20, 2026', prize: '$10,000 + Incubation', participants: 950, maxTeam: 5, status: 'open', tags: ['Entrepreneurship', 'EdTech', 'Pitching'], description: 'From idea to pitch in 54 hours. Win seed funding and mentorship.', difficulty: 'Beginner Friendly', mode: 'In-Person' },
  { id: 5, name: 'Data Viz Olympics', type: 'Data Science', icon: '📈', organizer: 'Tableau x Kaggle', deadline: 'Jul 10, 2026', prize: '$8,000', participants: 3100, maxTeam: 2, status: 'open', tags: ['Data Visualization', 'Storytelling', 'Analytics'], description: 'Transform messy datasets into beautiful, insightful visual stories.', difficulty: 'Intermediate', mode: 'Virtual' },
  { id: 6, name: 'Quantum Computing Q&A', type: 'Quiz', icon: '⚛️', organizer: 'IBM Quantum', deadline: 'May 5, 2026', prize: '$5,000', participants: 890, maxTeam: 1, status: 'open', tags: ['Quantum', 'Physics', 'CS Theory'], description: 'Test your knowledge of quantum gates, Qiskit, and quantum algorithms.', difficulty: 'Expert', mode: 'Virtual' },
  { id: 7, name: 'Design Jam 2026', type: 'Design', icon: '🎨', organizer: 'Figma x Dribbble', deadline: 'Jun 15, 2026', prize: '$12,000', participants: 1600, maxTeam: 3, status: 'open', tags: ['UI/UX', 'Branding', 'Mobile Design'], description: 'Redesign a public service app with accessibility and delight in mind.', difficulty: 'All Levels', mode: 'Virtual' },
  { id: 8, name: 'CTF CyberSec War', type: 'Cybersecurity', icon: '🛡️', organizer: 'HackerOne', deadline: 'Apr 28, 2026', prize: '$20,000', participants: 4100, maxTeam: 4, status: 'closing', tags: ['Security', 'Pentesting', 'Cryptography'], description: 'Capture the Flag competition with real-world vulnerability challenges.', difficulty: 'Advanced', mode: 'Virtual' },
];

const TYPES = ['All', 'Hackathon', 'Case Study', 'AI Competition', 'Pitch', 'Data Science', 'Quiz', 'Design', 'Cybersecurity'];

export default function CompetitionsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedComp, setSelectedComp] = useState(null);
  const [registered, setRegistered] = useState([]);
  const [showTeamForm, setShowTeamForm] = useState(null);
  const [teamName, setTeamName] = useState('');

  const filtered = COMPETITIONS.filter(c =>
    (filter === 'All' || c.type === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRegister = (comp) => {
    setRegistered(p => [...p, comp.id]);
    setShowTeamForm(null);
    if(window.ssSound) window.ssSound('success');
  };

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Compete & Win</div>
      <h2 className="sec-title">🏆 Competitions & Hackathons</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: '🏆', value: `${COMPETITIONS.length}`, label: 'Active Competitions' },
          { icon: '💰', value: '$145K+', label: 'Total Prizes' },
          { icon: '👥', value: '19K+', label: 'Participants' },
          { icon: '📋', value: `${registered.length}`, label: 'You Registered' },
        ].map((s, i) => (
          <div key={i} className="glass" style={{ padding: '1rem', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--blue2)', fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '.8rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search competitions..."
          style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.6rem 1rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', width: '250px' }} />
      </div>
      <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ padding: '.4rem .8rem', borderRadius: '50px', border: 'none', background: filter === t ? 'rgba(59,130,246,.3)' : 'var(--glass)', color: filter === t ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.75rem', fontFamily: 'inherit' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Competition Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(comp => (
          <div key={comp.id} className="glass" style={{ borderRadius: '18px', overflow: 'hidden', transition: 'all .3s' }}>
            {/* Header */}
            <div style={{ padding: '1.2rem 1.5rem', background: comp.status === 'closing' ? 'linear-gradient(135deg, rgba(239,68,68,.1), rgba(245,158,11,.08))' : 'linear-gradient(135deg, rgba(59,130,246,.08), rgba(139,92,246,.06))', borderBottom: '1px solid var(--gb)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
                <span style={{ fontSize: '2rem' }}>{comp.icon}</span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{comp.name}</h3>
                  <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{comp.organizer}</div>
                </div>
              </div>
              <div style={{ fontSize: '.68rem', padding: '.2rem .6rem', borderRadius: '50px', fontWeight: 700, background: comp.status === 'closing' ? 'rgba(239,68,68,.2)' : 'rgba(16,185,129,.2)', color: comp.status === 'closing' ? 'var(--red)' : 'var(--green)' }}>
                {comp.status === 'closing' ? '⏰ Closing Soon' : '✅ Open'}
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem' }}>{comp.description}</p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {comp.tags.map(t => (
                  <span key={t} style={{ fontSize: '.68rem', padding: '.2rem .5rem', borderRadius: '4px', background: 'rgba(139,92,246,.12)', color: 'var(--purple)', fontWeight: 600 }}>{t}</span>
                ))}
              </div>

              {/* Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.5rem', marginBottom: '1rem' }}>
                {[
                  { label: 'Prize', value: comp.prize, color: 'var(--gold)' },
                  { label: 'Deadline', value: comp.deadline.split(',')[0], color: comp.status === 'closing' ? 'var(--red)' : 'var(--muted)' },
                  { label: 'Team Size', value: `Up to ${comp.maxTeam}`, color: 'var(--blue2)' },
                ].map((info, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '.5rem', background: 'rgba(255,255,255,.03)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '.88rem', fontWeight: 700, color: info.color }}>{info.value}</div>
                    <div style={{ fontSize: '.62rem', color: 'var(--muted2)', textTransform: 'uppercase' }}>{info.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.78rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                <span>👥 {comp.participants.toLocaleString()} participants</span>
                <span>📍 {comp.mode}</span>
                <span>📊 {comp.difficulty}</span>
              </div>

              {registered.includes(comp.id) ? (
                <div style={{ textAlign: 'center', padding: '.8rem', background: 'rgba(16,185,129,.1)', borderRadius: '10px', color: 'var(--green)', fontWeight: 700, fontSize: '.9rem' }}>
                  ✅ You're Registered!
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button className="btn btn-grad" style={{ flex: 1, padding: '.7rem', fontSize: '.85rem' }} onClick={() => setShowTeamForm(comp)}>
                    🚀 Register Now
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '.7rem 1rem', fontSize: '.85rem' }} onClick={() => setSelectedComp(selectedComp?.id === comp.id ? null : comp)}>
                    ℹ️
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {showTeamForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }} onClick={() => setShowTeamForm(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg)', border: '1px solid var(--gb)', borderRadius: '24px', padding: '2.5rem', maxWidth: '500px', width: '90%' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>{showTeamForm.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Register for {showTeamForm.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '.82rem' }}>Prize Pool: {showTeamForm.prize}</p>
            </div>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Team Name</label>
              <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="e.g., Code Warriors"
                style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Invite Teammates (Optional)</label>
              <input placeholder="Enter email addresses, comma separated"
                style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => handleRegister(showTeamForm)}>🏆 Confirm Registration</button>
          </div>
        </div>
      )}
    </div>
  );
}
