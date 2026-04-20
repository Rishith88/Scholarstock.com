import { useState } from 'react';

const ALUMNI = [
  { id: 1, name: 'Dr. Meera Krishnan', avatar: '👩‍⚕️', role: 'Senior Data Scientist', company: 'Google DeepMind', uni: 'IIT Delhi', batch: '2018', expertise: ['AI/ML', 'Research', 'Career Growth'], rating: 4.9, sessions: 145, bio: 'Led multiple AI research projects published in top-tier conferences. Passionate about mentoring the next gen.', available: ['Mon 6PM', 'Wed 7PM', 'Sat 11AM'], price: 'Free', verified: true },
  { id: 2, name: 'Rahul Agarwal', avatar: '👨‍💼', role: 'Product Manager', company: 'Microsoft', uni: 'IIT Bombay', batch: '2016', expertise: ['Product', 'Strategy', 'Interview Prep'], rating: 4.8, sessions: 98, bio: 'Shipped products used by millions. Expert in PM interview prep and career transitions.', available: ['Tue 8PM', 'Thu 7PM'], price: '₹200/session', verified: true },
  { id: 3, name: 'Ananya Sharma', avatar: '👩‍💻', role: 'Engineering Manager', company: 'Amazon', uni: 'BITS Pilani', batch: '2015', expertise: ['System Design', 'Leadership', 'DSA'], rating: 4.9, sessions: 212, bio: 'From SDE to EM in 5 years. Helps students crack FAANG interviews and build careers.', available: ['Mon 9PM', 'Fri 6PM', 'Sun 10AM'], price: 'Free', verified: true },
  { id: 4, name: 'Karthik Reddy', avatar: '👨‍🔬', role: 'Founder & CEO', company: 'EduTech AI (YC W23)', uni: 'IIT Madras', batch: '2017', expertise: ['Startups', 'Fundraising', 'EdTech'], rating: 4.7, sessions: 67, bio: 'Built a startup from dorm room to $5M funding. Advisor for aspiring student entrepreneurs.', available: ['Wed 8PM', 'Sat 3PM'], price: '₹500/session', verified: true },
  { id: 5, name: 'Priya Nair', avatar: '👩‍🎓', role: 'PhD Researcher', company: 'MIT CSAIL', uni: 'IIT Kanpur', batch: '2019', expertise: ['PhD Applications', 'Research', 'NLP'], rating: 4.8, sessions: 56, bio: 'Currently pursuing PhD at MIT. Guides students through grad school applications and research.', available: ['Thu 10PM', 'Sun 2PM'], price: 'Free', verified: true },
  { id: 6, name: 'Vikram Singh', avatar: '👨‍💻', role: 'Senior SDE', company: 'Meta', uni: 'NIT Trichy', batch: '2014', expertise: ['Coding Interviews', 'System Design', 'Career Growth'], rating: 4.6, sessions: 189, bio: '10 years in Big Tech. Conducts mock interviews and helps plan long-term tech careers.', available: ['Tue 9PM', 'Sat 5PM'], price: '₹300/session', verified: true },
];

const EVENTS = [
  { id: 1, title: 'How I Got Into Google', speaker: 'Dr. Meera Krishnan', date: 'Apr 25, 2026', time: '7:00 PM IST', attendees: 234, type: 'Webinar' },
  { id: 2, title: 'Mock Interview Marathon', speaker: 'Ananya Sharma', date: 'Apr 28, 2026', time: '6:00 PM IST', attendees: 156, type: 'Workshop' },
  { id: 3, title: 'Startup 101: From Idea to MVP', speaker: 'Karthik Reddy', date: 'May 2, 2026', time: '8:00 PM IST', attendees: 189, type: 'Masterclass' },
  { id: 4, title: 'PhD Application Bootcamp', speaker: 'Priya Nair', date: 'May 5, 2026', time: '10:00 AM IST', attendees: 98, type: 'Workshop' },
];

export default function AlumniNetworkPage() {
  const [tab, setTab] = useState('mentors');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showBooking, setShowBooking] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const expertiseList = ['All', ...new Set(ALUMNI.flatMap(a => a.expertise))];
  const filteredAlumni = ALUMNI.filter(a =>
    (filter === 'All' || a.expertise.includes(filter)) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Connect & Grow</div>
      <h2 className="sec-title">🎓 Alumni Mentorship Network</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: '🎓', value: '850+', label: 'Verified Alumni' },
          { icon: '🤝', value: '5,200+', label: 'Sessions Done' },
          { icon: '🏢', value: '120+', label: 'Companies' },
          { icon: '⭐', value: '4.81', label: 'Avg Rating' },
        ].map((s, i) => (
          <div key={i} className="glass" style={{ padding: '1rem', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--blue2)' }}>{s.value}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'mentors', icon: '👨‍🏫', label: 'Find Mentors' }, { id: 'events', icon: '📅', label: 'Upcoming Events' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '.6rem 1.2rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', background: tab === t.id ? 'linear-gradient(135deg,var(--blue),var(--purple))' : 'var(--glass)', color: tab === t.id ? '#fff' : 'var(--muted)', fontSize: '.85rem', transition: 'all .3s' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Mentors */}
      {tab === 'mentors' && (
        <div>
          <div style={{ display: 'flex', gap: '.8rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name or company..."
              style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.6rem 1rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', width: '250px' }} />
          </div>
          <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {expertiseList.map(e => (
              <button key={e} onClick={() => setFilter(e)}
                style={{ padding: '.4rem .8rem', borderRadius: '50px', border: 'none', background: filter === e ? 'rgba(59,130,246,.3)' : 'var(--glass)', color: filter === e ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.75rem', fontFamily: 'inherit' }}>
                {e}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
            {filteredAlumni.map(alum => (
              <div key={alum.id} className="glass" style={{ borderRadius: '18px', overflow: 'hidden', transition: 'all .3s' }}>
                <div style={{ padding: '1.2rem 1.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,.08), rgba(139,92,246,.06))', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', position: 'relative' }}>
                    {alum.avatar}
                    {alum.verified && <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--blue)', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.55rem', border: '2px solid var(--bg)' }}>✓</div>}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '.95rem', fontWeight: 700 }}>{alum.name}</h3>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{alum.role} @ {alum.company}</div>
                    <div style={{ fontSize: '.7rem', color: 'var(--blue2)' }}>{alum.uni} · Batch {alum.batch}</div>
                  </div>
                </div>

                <div style={{ padding: '1.2rem 1.5rem' }}>
                  <p style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '.8rem' }}>{alum.bio}</p>

                  <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {alum.expertise.map(e => <span key={e} style={{ fontSize: '.68rem', padding: '.2rem .5rem', borderRadius: '4px', background: 'rgba(139,92,246,.12)', color: 'var(--purple)', fontWeight: 600 }}>{e}</span>)}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.78rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                    <span>⭐ {alum.rating} · {alum.sessions} sessions</span>
                    <span style={{ fontWeight: 700, color: alum.price === 'Free' ? 'var(--green)' : 'var(--blue2)' }}>{alum.price}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button className="btn btn-grad" style={{ flex: 1, padding: '.6rem', fontSize: '.82rem' }}
                      onClick={() => setShowBooking(alum)}>
                      📅 Book Session
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '.6rem .8rem', fontSize: '.82rem' }}
                      onClick={() => setSelectedMentor(selectedMentor?.id === alum.id ? null : alum)}>
                      👁️
                    </button>
                  </div>

                  {selectedMentor?.id === alum.id && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--gb)' }}>
                      <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted2)', marginBottom: '.5rem', textTransform: 'uppercase' }}>Available Slots</div>
                      <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                        {alum.available.map(s => <span key={s} style={{ fontSize: '.72rem', padding: '.3rem .6rem', borderRadius: '6px', background: 'rgba(16,185,129,.1)', color: 'var(--green)', border: '1px solid rgba(16,185,129,.2)' }}>{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events */}
      {tab === 'events' && (
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '800px' }}>
          {EVENTS.map(ev => (
            <div key={ev.id} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid var(--blue)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.3rem' }}>
                  <span style={{ fontSize: '.65rem', padding: '.2rem .5rem', borderRadius: '4px', background: 'rgba(139,92,246,.15)', color: 'var(--purple)', fontWeight: 700 }}>{ev.type}</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{ev.title}</h3>
                </div>
                <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>🗣️ {ev.speaker} · 📅 {ev.date} · ⏰ {ev.time}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--blue2)', marginTop: '.3rem' }}>👥 {ev.attendees} registered</div>
              </div>
              {registeredEvents.includes(ev.id) ? (
                <span style={{ fontSize: '.85rem', color: 'var(--green)', fontWeight: 700 }}>✅ Registered</span>
              ) : (
                <button className="btn btn-grad" style={{ padding: '.6rem 1.2rem', fontSize: '.82rem' }}
                  onClick={() => { setRegisteredEvents(p => [...p, ev.id]); if(window.ssSound) window.ssSound('success'); }}>
                  🎟️ Register
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }} onClick={() => setShowBooking(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg)', border: '1px solid var(--gb)', borderRadius: '24px', padding: '2.5rem', maxWidth: '500px', width: '90%' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>{showBooking.avatar}</div>
              <h3>{showBooking.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>{showBooking.role} @ {showBooking.company}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Select Time Slot</label>
              <select style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }}>
                {showBooking.available.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Session Type</label>
              <select style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }}>
                <option>☕ Coffee Chat (30 min)</option>
                <option>🎯 Mock Interview (45 min)</option>
                <option>📋 Resume Review (30 min)</option>
                <option>💼 Career Guidance (60 min)</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>What would you like to discuss?</label>
              <textarea placeholder="Brief description of your goals..."
                style={{ width: '100%', minHeight: '80px', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
            <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => { setShowBooking(null); if(window.ssSound) window.ssSound('success'); }}>
              ✅ Book Session {showBooking.price !== 'Free' ? `(${showBooking.price})` : '(Free)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
