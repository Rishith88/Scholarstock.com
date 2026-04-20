import { useState } from 'react';

const TUTORS = [
  { id: 1, name: 'Priya Sharma', avatar: '👩‍🎓', uni: 'IIT Delhi', rating: 4.9, reviews: 234, subjects: ['Calculus', 'Linear Algebra'], rate: 150, badge: 'Top Tutor', bio: 'Gold medalist in Mathematics. 3+ years of tutoring experience.', online: true, sessions: 480 },
  { id: 2, name: 'James Chen', avatar: '👨‍💻', uni: 'MIT', rating: 4.8, reviews: 189, subjects: ['Data Structures', 'Algorithms'], rate: 200, badge: 'Expert', bio: 'Teaching assistant for CS fundamentals. Competitive programming champion.', online: true, sessions: 320 },
  { id: 3, name: 'Sarah Williams', avatar: '👩‍🔬', uni: 'Oxford', rating: 4.9, reviews: 156, subjects: ['Organic Chemistry', 'Biochemistry'], rate: 180, badge: 'Top Tutor', bio: 'PhD candidate in Biochemistry with a passion for making complex topics simple.', online: false, sessions: 270 },
  { id: 4, name: 'Rahul Patel', avatar: '👨‍🎓', uni: 'IIT Bombay', rating: 4.7, reviews: 312, subjects: ['Physics', 'Thermodynamics'], rate: 120, badge: null, bio: 'Physics enthusiast who loves breaking down tough problems step by step.', online: true, sessions: 560 },
  { id: 5, name: 'Emma Johnson', avatar: '👩‍💼', uni: 'Stanford', rating: 4.8, reviews: 198, subjects: ['Economics', 'Statistics'], rate: 220, badge: 'Expert', bio: 'Former Goldman Sachs analyst. Makes economics relatable and practical.', online: true, sessions: 390 },
  { id: 6, name: 'Akira Tanaka', avatar: '👨‍🔧', uni: 'Tokyo U', rating: 4.6, reviews: 145, subjects: ['Electrical Engineering', 'Signal Processing'], rate: 160, badge: null, bio: 'Hardware lab assistant with expertise in analog and digital circuits.', online: false, sessions: 210 },
];

const REQUESTS = [
  { id: 1, student: 'Alex M.', subject: 'Quantum Mechanics', topic: 'Schrödinger Equation solving techniques', urgency: 'high', budget: '₹300/hr', time: '2 hrs ago', bids: 5 },
  { id: 2, student: 'Lisa K.', subject: 'Calculus III', topic: 'Triple integrals and surface area calculations', urgency: 'medium', budget: '₹200/hr', time: '4 hrs ago', bids: 3 },
  { id: 3, student: 'Mohan R.', subject: 'Machine Learning', topic: 'Backpropagation implementation from scratch', urgency: 'high', budget: '₹400/hr', time: '30 min ago', bids: 8 },
  { id: 4, student: 'Sophie T.', subject: 'Essay Writing', topic: 'Academic argument structure for philosophy paper', urgency: 'low', budget: '₹150/hr', time: '6 hrs ago', bids: 2 },
];

export default function PeerTutoringPage() {
  const [tab, setTab] = useState('find');
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [requestForm, setRequestForm] = useState({ subject: '', topic: '', budget: '', details: '' });
  const [showBooking, setShowBooking] = useState(false);

  const allSubjects = ['All', ...new Set(TUTORS.flatMap(t => t.subjects))];
  const filteredTutors = subjectFilter === 'All' ? TUTORS : TUTORS.filter(t => t.subjects.includes(subjectFilter));

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Learn Together</div>
      <h2 className="sec-title">🤝 Peer Tutoring Exchange</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: '👨‍🏫', value: '2,400+', label: 'Active Tutors' },
          { icon: '📚', value: '180+', label: 'Subjects' },
          { icon: '⭐', value: '4.82', label: 'Avg Rating' },
          { icon: '🎯', value: '12K+', label: 'Sessions Done' },
        ].map((s, i) => (
          <div key={i} className="glass" style={{ padding: '1rem', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--blue2)' }}>{s.value}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,.04)', padding: '.4rem', borderRadius: '12px', width: 'fit-content' }}>
        {[{ id: 'find', icon: '🔍', label: 'Find Tutors' }, { id: 'requests', icon: '📋', label: 'Open Requests' }, { id: 'post', icon: '➕', label: 'Post Request' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '.6rem 1.2rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', transition: 'all .3s', background: tab === t.id ? 'linear-gradient(135deg,var(--blue),var(--purple))' : 'transparent', color: tab === t.id ? '#fff' : 'var(--muted)', fontSize: '.85rem' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Find Tutors */}
      {tab === 'find' && (
        <div>
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {allSubjects.map(s => (
              <button key={s} onClick={() => setSubjectFilter(s)}
                style={{ padding: '.4rem .9rem', borderRadius: '50px', border: 'none', background: subjectFilter === s ? 'rgba(59,130,246,.3)' : 'var(--glass)', color: subjectFilter === s ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.78rem', fontFamily: 'inherit' }}>
                {s}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
            {filteredTutors.map(tutor => (
              <div key={tutor.id} className="glass" style={{ padding: '1.5rem', borderRadius: '18px', transition: 'all .3s', position: 'relative', overflow: 'hidden' }}>
                {tutor.badge && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '.65rem', padding: '.2rem .6rem', borderRadius: '50px', background: tutor.badge === 'Top Tutor' ? 'rgba(245,158,11,.2)' : 'rgba(139,92,246,.2)', color: tutor.badge === 'Top Tutor' ? 'var(--gold)' : 'var(--purple)', fontWeight: 700 }}>
                    {tutor.badge === 'Top Tutor' ? '🏆' : '⚡'} {tutor.badge}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', position: 'relative' }}>
                    {tutor.avatar}
                    <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', borderRadius: '50%', background: tutor.online ? 'var(--green)' : 'var(--muted2)', border: '2px solid var(--bg)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.1rem' }}>{tutor.name}</h3>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{tutor.uni}</div>
                  </div>
                </div>

                <p style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '.8rem' }}>{tutor.bio}</p>

                <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {tutor.subjects.map(s => (
                    <span key={s} style={{ fontSize: '.72rem', padding: '.2rem .6rem', borderRadius: '50px', background: 'rgba(59,130,246,.12)', color: 'var(--blue2)', fontWeight: 600 }}>{s}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '.8rem' }}>
                  <span style={{ color: 'var(--gold)' }}>⭐ {tutor.rating} ({tutor.reviews})</span>
                  <span style={{ color: 'var(--muted)' }}>{tutor.sessions} sessions</span>
                  <span style={{ fontWeight: 800, color: 'var(--green)', fontSize: '1rem' }}>₹{tutor.rate}/hr</span>
                </div>

                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button className="btn btn-grad" style={{ flex: 1, padding: '.6rem', fontSize: '.82rem' }} onClick={() => { setShowBooking(!showBooking); setSelectedTutor(tutor); if(window.ssSound) window.ssSound('click'); }}>
                    📅 Book Session
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '.6rem .8rem', fontSize: '.82rem' }}>💬</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open Requests */}
      {tab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {REQUESTS.map(r => (
            <div key={r.id} className="glass" style={{ padding: '1.5rem', borderRadius: '14px', borderLeft: `4px solid ${r.urgency === 'high' ? 'var(--red)' : r.urgency === 'medium' ? 'var(--gold)' : 'var(--green)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.8rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.2rem' }}>{r.subject}: {r.topic}</h3>
                  <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>Posted by {r.student} · {r.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--green)' }}>{r.budget}</div>
                  <div style={{ fontSize: '.7rem', padding: '.2rem .5rem', borderRadius: '4px', background: r.urgency === 'high' ? 'rgba(239,68,68,.15)' : r.urgency === 'medium' ? 'rgba(245,158,11,.15)' : 'rgba(16,185,129,.15)', color: r.urgency === 'high' ? 'var(--red)' : r.urgency === 'medium' ? 'var(--gold)' : 'var(--green)', fontWeight: 700, textTransform: 'uppercase', marginTop: '.3rem' }}>
                    {r.urgency} urgency
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.8rem', color: 'var(--blue2)' }}>📨 {r.bids} bids placed</span>
                <button className="btn btn-grad" style={{ padding: '.5rem 1.2rem', fontSize: '.82rem' }}>🎯 Place Bid</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Request */}
      {tab === 'post' && (
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px', maxWidth: '700px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>📝 Post a Tutoring Request</h3>
          {[
            { label: 'Subject', key: 'subject', placeholder: 'e.g., Calculus, Physics, Chemistry' },
            { label: 'Specific Topic', key: 'topic', placeholder: 'e.g., Integration by parts, Quantum mechanics' },
            { label: 'Budget (₹/hr)', key: 'budget', placeholder: 'e.g., 200', type: 'number' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>{f.label}</label>
              <input value={requestForm[f.key]} onChange={e => setRequestForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} type={f.type || 'text'}
                style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }} />
            </div>
          ))}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Additional Details</label>
            <textarea value={requestForm.details} onChange={e => setRequestForm(p => ({ ...p, details: e.target.value }))} placeholder="Describe what you need help with..."
              style={{ width: '100%', minHeight: '120px', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
          <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => { if(window.ssSound) window.ssSound('success'); }}>🚀 Post Request</button>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && selectedTutor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}
          onClick={() => setShowBooking(false)}>
          <div className="glass" onClick={e => e.stopPropagation()}
            style={{ padding: '2.5rem', borderRadius: '24px', maxWidth: '500px', width: '90%', background: 'var(--bg)', border: '1px solid var(--gb)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>{selectedTutor.avatar}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedTutor.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>{selectedTutor.uni} · ₹{selectedTutor.rate}/hr</p>
            </div>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Preferred Date & Time</label>
              <input type="datetime-local" style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Duration</label>
              <select style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }}>
                <option value="30">30 minutes — ₹{selectedTutor.rate / 2}</option>
                <option value="60">1 hour — ₹{selectedTutor.rate}</option>
                <option value="90">1.5 hours — ₹{Math.round(selectedTutor.rate * 1.5)}</option>
                <option value="120">2 hours — ₹{selectedTutor.rate * 2}</option>
              </select>
            </div>
            <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => { setShowBooking(false); if(window.ssSound) window.ssSound('success'); }}>
              ✅ Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
