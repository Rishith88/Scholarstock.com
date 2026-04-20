import { useState } from 'react';

const LABS = [
  { id: 1, name: 'Chemistry: Titration Lab', icon: '🧪', subject: 'Chemistry', difficulty: 'Intermediate', duration: '45 min', rating: 4.8, students: 12400, description: 'Perform acid-base titrations to determine unknown concentrations. Includes pH indicators and volumetric analysis.', modules: ['Safety Briefing', 'Equipment Setup', 'Titration Process', 'Data Analysis', 'Lab Report'], color: '#10b981' },
  { id: 2, name: 'Physics: Projectile Motion', icon: '🎯', subject: 'Physics', difficulty: 'Beginner', duration: '30 min', rating: 4.9, students: 18200, description: 'Launch projectiles at different angles and measure trajectory, range, and impact velocity in a simulated environment.', modules: ['Theory Review', 'Launch Setup', 'Data Collection', 'Graph Analysis', 'Challenge Mode'], color: '#3b82f6' },
  { id: 3, name: 'Biology: Cell Division (Mitosis)', icon: '🔬', subject: 'Biology', difficulty: 'Intermediate', duration: '40 min', rating: 4.7, students: 9800, description: 'Observe and interact with 3D cell division animation. Identify phases and manipulate chromosomes in real-time.', modules: ['Cell Structure', 'Prophase', 'Metaphase', 'Anaphase & Telophase', 'Quiz'], color: '#8b5cf6' },
  { id: 4, name: 'Anatomy: Heart Dissection', icon: '🫀', subject: 'Biology', difficulty: 'Advanced', duration: '60 min', rating: 4.9, students: 7600, description: 'Virtual heart dissection with layer-by-layer anatomy exploration. Trace blood flow through all four chambers.', modules: ['External Anatomy', 'Internal Chambers', 'Valves & Vessels', 'Blood Flow Sim', 'Assessment'], color: '#ef4444' },
  { id: 5, name: 'Electronics: Circuit Builder', icon: '⚡', subject: 'Engineering', difficulty: 'Beginner', duration: '35 min', rating: 4.6, students: 11300, description: 'Build and test circuits with resistors, capacitors, LEDs, and transistors. Ohm\'s law verification included.', modules: ['Component ID', 'Series Circuits', 'Parallel Circuits', 'Measurement', 'Free Build'], color: '#f59e0b' },
  { id: 6, name: 'Organic Chemistry: Synthesis', icon: '⚗️', subject: 'Chemistry', difficulty: 'Advanced', duration: '55 min', rating: 4.5, students: 5400, description: 'Plan and execute multi-step organic synthesis reactions. Practice retrosynthetic analysis and mechanism drawing.', modules: ['Retrosynthesis', 'Reagent Selection', 'Reaction Setup', 'Purification', 'Spectral Analysis'], color: '#06b6d4' },
  { id: 7, name: 'Astronomy: Solar System', icon: '🪐', subject: 'Physics', difficulty: 'Beginner', duration: '25 min', rating: 4.8, students: 21500, description: 'Explore a scale model of the solar system. Compare planetary sizes, orbits, and atmospheric compositions.', modules: ['Inner Planets', 'Outer Planets', 'Moons & Asteroids', 'Orbital Mechanics', 'Quiz'], color: '#6366f1' },
  { id: 8, name: 'Genetics: DNA Extraction', icon: '🧬', subject: 'Biology', difficulty: 'Intermediate', duration: '50 min', rating: 4.7, students: 8900, description: 'Perform virtual DNA extraction from strawberry cells. Visualize double helix structure and run gel electrophoresis.', modules: ['Cell Lysis', 'DNA Isolation', 'Precipitation', 'Gel Electrophoresis', 'Analysis'], color: '#ec4899' },
];

const SUBJECTS = ['All', 'Chemistry', 'Physics', 'Biology', 'Engineering'];

export default function VRLabsPage() {
  const [selectedLab, setSelectedLab] = useState(null);
  const [filter, setFilter] = useState('All');
  const [activeModule, setActiveModule] = useState(0);
  const [labStarted, setLabStarted] = useState(false);
  const [progress, setProgress] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = LABS.filter(l => (filter === 'All' || l.subject === filter) && l.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const startLab = (lab) => {
    setSelectedLab(lab);
    setLabStarted(true);
    setActiveModule(0);
    if(window.ssSound) window.ssSound('open');
  };

  const completeModule = () => {
    const labId = selectedLab.id;
    const newProgress = { ...progress, [labId]: (progress[labId] || 0) + 1 };
    setProgress(newProgress);
    if (activeModule < selectedLab.modules.length - 1) {
      setActiveModule(a => a + 1);
      if(window.ssSound) window.ssSound('success');
    } else {
      if(window.ssSound) window.ssSound('success');
    }
  };

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Immersive Learning</div>
      <h2 className="sec-title">🥽 VR Interactive Labs</h2>

      {!labStarted ? (
        <>
          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { icon: '🧪', value: `${LABS.length}`, label: 'Labs Available' },
              { icon: '👨‍🔬', value: '105K+', label: 'Students Enrolled' },
              { icon: '⭐', value: '4.74', label: 'Avg Rating' },
              { icon: '🏆', value: `${Object.keys(progress).length}`, label: 'Labs Completed' },
            ].map((s, i) => (
              <div key={i} className="glass" style={{ padding: '1.2rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '.3rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--blue2)', fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                <div style={{ fontSize: '.72rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '.8rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="🔍 Search labs..."
              style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.6rem 1rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', width: '220px' }} />
            {SUBJECTS.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{ padding: '.5rem 1rem', borderRadius: '8px', border: 'none', background: filter === s ? 'rgba(59,130,246,.3)' : 'var(--glass)', color: filter === s ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.82rem', fontFamily: 'inherit' }}>
                {s}
              </button>
            ))}
          </div>

          {/* Lab Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
            {filtered.map(lab => (
              <div key={lab.id} className="glass" style={{ borderRadius: '18px', overflow: 'hidden', transition: 'all .3s', cursor: 'pointer' }}
                onClick={() => setSelectedLab(selectedLab?.id === lab.id ? null : lab)}>
                {/* Lab Header */}
                <div style={{ height: '120px', background: `linear-gradient(135deg, ${lab.color}22, ${lab.color}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.3))' }}>{lab.icon}</div>
                  <div style={{ position: 'absolute', top: '.8rem', right: '.8rem', fontSize: '.68rem', background: lab.difficulty === 'Advanced' ? 'rgba(239,68,68,.2)' : lab.difficulty === 'Intermediate' ? 'rgba(245,158,11,.2)' : 'rgba(16,185,129,.2)', color: lab.difficulty === 'Advanced' ? 'var(--red)' : lab.difficulty === 'Intermediate' ? 'var(--gold)' : 'var(--green)', padding: '.25rem .7rem', borderRadius: '50px', fontWeight: 700 }}>
                    {lab.difficulty}
                  </div>
                  {progress[lab.id] >= lab.modules.length && (
                    <div style={{ position: 'absolute', top: '.8rem', left: '.8rem', background: 'rgba(16,185,129,.9)', color: '#fff', padding: '.2rem .6rem', borderRadius: '50px', fontSize: '.68rem', fontWeight: 700 }}>✓ Completed</div>
                  )}
                </div>

                <div style={{ padding: '1.2rem 1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '.3rem' }}>{lab.name}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.8rem' }}>
                    <span>⏱ {lab.duration}</span>
                    <span>⭐ {lab.rating}</span>
                    <span>👥 {lab.students.toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem' }}>{lab.description}</p>

                  {selectedLab?.id === lab.id && (
                    <div>
                      <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '.5rem' }}>Modules</div>
                      {lab.modules.map((m, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.4rem 0', fontSize: '.82rem' }}>
                          <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: (progress[lab.id] || 0) > i ? 'var(--green)' : 'var(--glass)', border: '1px solid var(--gb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', fontWeight: 700, color: (progress[lab.id] || 0) > i ? '#fff' : 'var(--muted)' }}>
                            {(progress[lab.id] || 0) > i ? '✓' : i + 1}
                          </span>
                          <span style={{ color: (progress[lab.id] || 0) > i ? 'var(--green)' : 'var(--white)' }}>{m}</span>
                        </div>
                      ))}
                      <button className="btn btn-grad" onClick={(e) => { e.stopPropagation(); startLab(lab); }} style={{ width: '100%', marginTop: '1rem', fontSize: '.9rem' }}>
                        🚀 {progress[lab.id] ? 'Continue Lab' : 'Start Lab'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Active Lab View */
        <div>
          <button className="btn btn-ghost" onClick={() => { setLabStarted(false); setSelectedLab(null); }} style={{ marginBottom: '1.5rem' }}>← Back to Labs</button>
          <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            {/* Lab Header */}
            <div style={{ height: '200px', background: `linear-gradient(135deg, ${selectedLab.color}33, ${selectedLab.color}66)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ fontSize: '6rem', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,.4))' }}>{selectedLab.icon}</div>
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,.5)' }}>{selectedLab.name}</h2>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ padding: '1.5rem 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem', fontSize: '.8rem' }}>
                <span style={{ color: 'var(--muted)' }}>Module {activeModule + 1} of {selectedLab.modules.length}</span>
                <span style={{ color: 'var(--blue2)', fontWeight: 700 }}>{Math.round((activeModule / selectedLab.modules.length) * 100)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(activeModule / selectedLab.modules.length) * 100}%`, background: `linear-gradient(90deg, ${selectedLab.color}, var(--purple))`, borderRadius: '3px', transition: 'width .5s ease' }} />
              </div>

              {/* Module Steps */}
              <div style={{ display: 'flex', gap: '.5rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
                {selectedLab.modules.map((m, i) => (
                  <button key={i} onClick={() => setActiveModule(i)}
                    style={{ padding: '.5rem 1rem', borderRadius: '8px', border: 'none', background: i === activeModule ? selectedLab.color : i < activeModule ? 'rgba(16,185,129,.2)' : 'var(--glass)', color: i === activeModule ? '#fff' : i < activeModule ? 'var(--green)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.78rem', fontFamily: 'inherit' }}>
                    {i < activeModule ? '✓' : ''} {m}
                  </button>
                ))}
              </div>

              {/* Simulation Area */}
              <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: '16px', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid var(--gb)', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${selectedLab.color}15, transparent 70%)` }} />
                <div style={{ fontSize: '5rem', marginBottom: '1rem', position: 'relative', animation: 'float 3s ease-in-out infinite' }}>{selectedLab.icon}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '.5rem', position: 'relative' }}>{selectedLab.modules[activeModule]}</h3>
                <p style={{ fontSize: '.85rem', color: 'var(--muted)', textAlign: 'center', maxWidth: '400px', position: 'relative' }}>Interactive 3D simulation loading... Interact with the virtual lab equipment above.</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-ghost" onClick={() => setActiveModule(a => Math.max(0, a - 1))} disabled={activeModule === 0} style={{ opacity: activeModule === 0 ? .4 : 1 }}>
                  ← Previous
                </button>
                <button className="btn btn-grad" onClick={completeModule}>
                  {activeModule === selectedLab.modules.length - 1 ? '🏆 Complete Lab' : 'Next Module →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
      `}</style>
    </div>
  );
}
