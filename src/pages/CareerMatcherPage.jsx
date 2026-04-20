import { useState } from 'react';

const INDUSTRIES = ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Engineering', 'Design', 'Legal', 'Science', 'Media'];
const SKILLS = ['Python', 'JavaScript', 'Data Analysis', 'Machine Learning', 'UI/UX Design', 'Project Management', 'Writing', 'Research', 'Public Speaking', 'Leadership', 'SQL', 'Excel', 'Figma', 'React', 'Cloud Computing'];

const MOCK_MATCHES = [
  { id: 1, title: 'AI Research Intern', company: 'DeepMind Labs', location: 'Remote', type: 'Internship', salary: '$3,500/mo', match: 96, logo: '🧠', skills: ['Python', 'Machine Learning', 'Research'], deadline: '15 days left', description: 'Work on cutting-edge neural architecture search and reinforcement learning projects.', perks: ['Mentorship', 'Conference Budget', 'Flexible Hours'] },
  { id: 2, title: 'Full-Stack Developer', company: 'TechNova Startup', location: 'Bangalore, IN', type: 'Part-time', salary: '₹45,000/mo', match: 91, logo: '🚀', skills: ['JavaScript', 'React', 'SQL'], deadline: '8 days left', description: 'Build scalable web applications for our education platform serving 100K+ users.', perks: ['Equity Options', 'Remote OK', 'Learning Budget'] },
  { id: 3, title: 'Data Science Fellow', company: 'Stanford AI Lab', location: 'Stanford, CA', type: 'Research', salary: '$4,200/mo', match: 88, logo: '🎓', skills: ['Python', 'Data Analysis', 'Machine Learning'], deadline: '22 days left', description: 'Contribute to published research in natural language processing and computer vision.', perks: ['Publication Credit', 'Lab Access', 'Housing'] },
  { id: 4, title: 'UX Design Intern', company: 'Canva', location: 'Sydney, AU', type: 'Internship', salary: 'AU$3,800/mo', match: 85, logo: '🎨', skills: ['UI/UX Design', 'Figma', 'Research'], deadline: '12 days left', description: 'Design intuitive interfaces for creative tools used by millions worldwide.', perks: ['Design Mentorship', 'Team Events', 'Swag'] },
  { id: 5, title: 'Cloud Engineering Intern', company: 'AWS', location: 'Seattle, WA', type: 'Internship', salary: '$5,000/mo', match: 82, logo: '☁️', skills: ['Cloud Computing', 'Python', 'SQL'], deadline: '30 days left', description: 'Help build and optimize cloud infrastructure serving enterprise customers.', perks: ['Relocation', 'Return Offer', 'Hackathons'] },
  { id: 6, title: 'Marketing Analyst', company: 'HubSpot', location: 'Remote', type: 'Part-time', salary: '$2,800/mo', match: 79, logo: '📈', skills: ['Data Analysis', 'Excel', 'Writing'], deadline: '5 days left', description: 'Analyze campaign performance data and create optimization strategies.', perks: ['Certification', 'Flexible Schedule', 'Mentorship'] },
  { id: 7, title: 'Research Assistant', company: 'MIT Media Lab', location: 'Cambridge, MA', type: 'Research', salary: '$3,000/mo', match: 76, logo: '🔬', skills: ['Research', 'Python', 'Data Analysis'], deadline: '18 days left', description: 'Assist professors in groundbreaking research on human-computer interaction.', perks: ['Co-authorship', 'Lab Resources', 'Courses'] },
  { id: 8, title: 'Product Manager Intern', company: 'Notion', location: 'San Francisco, CA', type: 'Internship', salary: '$4,500/mo', match: 73, logo: '📋', skills: ['Project Management', 'Data Analysis', 'Writing'], deadline: '10 days left', description: 'Drive feature development for one of the fastest-growing productivity tools.', perks: ['PM Mentorship', 'Team Dinners', 'Return Offer'] },
];

const CAREER_PATHS = [
  { title: 'Software Engineer', growth: '+25%', avgSalary: '$120K', demand: 'Very High', icon: '💻' },
  { title: 'Data Scientist', growth: '+36%', avgSalary: '$130K', demand: 'Very High', icon: '📊' },
  { title: 'Product Manager', growth: '+12%', avgSalary: '$140K', demand: 'High', icon: '🎯' },
  { title: 'UX Researcher', growth: '+18%', avgSalary: '$95K', demand: 'High', icon: '🔍' },
];

export default function CareerMatcherPage() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('3');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [savedJobs, setSavedJobs] = useState([]);

  const toggleSkill = (s) => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleIndustry = (i) => setSelectedIndustries(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const toggleSave = (id) => setSavedJobs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleMatch = () => {
    if (selectedSkills.length < 2) return;
    setLoading(true);
    setTimeout(() => { setShowResults(true); setLoading(false); if(window.ssSound) window.ssSound('success'); }, 2200);
  };

  const filtered = filterType === 'all' ? MOCK_MATCHES : MOCK_MATCHES.filter(m => m.type.toLowerCase().includes(filterType));

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">AI Career Intelligence</div>
      <h2 className="sec-title">🎯 Career & Internship Matcher</h2>

      {!showResults ? (
        <div style={{ maxWidth: '900px' }}>
          {/* Profile Setup */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>👤 Your Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Major / Field of Study</label>
                <input value={major} onChange={e => setMajor(e.target.value)} placeholder="e.g., Computer Science"
                  style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Year of Study</label>
                <select value={year} onChange={e => setYear(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }}>
                  {['1', '2', '3', '4', '5+'].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>🛠️ Your Skills <span style={{ fontSize: '.75rem', color: 'var(--muted)', fontWeight: 400 }}>(Select at least 2)</span></h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
              {SKILLS.map(s => (
                <button key={s} onClick={() => toggleSkill(s)}
                  style={{
                    padding: '.5rem 1rem', borderRadius: '50px', border: selectedSkills.includes(s) ? '2px solid var(--blue)' : '1px solid var(--gb)',
                    background: selectedSkills.includes(s) ? 'rgba(59,130,246,.2)' : 'var(--glass)',
                    color: selectedSkills.includes(s) ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.82rem', fontFamily: 'inherit', transition: 'all .2s'
                  }}>
                  {selectedSkills.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>🏢 Preferred Industries</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
              {INDUSTRIES.map(i => (
                <button key={i} onClick={() => toggleIndustry(i)}
                  style={{
                    padding: '.5rem 1rem', borderRadius: '50px', border: selectedIndustries.includes(i) ? '2px solid var(--purple)' : '1px solid var(--gb)',
                    background: selectedIndustries.includes(i) ? 'rgba(168,85,247,.2)' : 'var(--glass)',
                    color: selectedIndustries.includes(i) ? 'var(--purple)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.82rem', fontFamily: 'inherit', transition: 'all .2s'
                  }}>
                  {i}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-grad" onClick={handleMatch} disabled={selectedSkills.length < 2 || loading}
            style={{ width: '100%', opacity: selectedSkills.length < 2 ? .5 : 1 }}>
            {loading ? '🔄 AI Matching in Progress...' : '🚀 Find My Matches'}
          </button>

          {loading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <div className="mock-loading-dots"><span /><span /><span /></div>
              <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Analyzing your profile against 10,000+ opportunities...</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button className="btn btn-ghost" onClick={() => setShowResults(false)} style={{ marginBottom: '1.5rem' }}>← Edit Profile</button>

          {/* Career Paths Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {CAREER_PATHS.map((c, i) => (
              <div key={i} className="glass" style={{ padding: '1.2rem', borderRadius: '14px', textAlign: 'center', borderTop: '3px solid var(--blue)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: '.3rem' }}>{c.title}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--green)', fontWeight: 700 }}>Growth: {c.growth}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>Avg: {c.avgSalary}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[{ id: 'all', label: 'All' }, { id: 'internship', label: 'Internships' }, { id: 'part', label: 'Part-Time' }, { id: 'research', label: 'Research' }].map(f => (
              <button key={f.id} onClick={() => setFilterType(f.id)}
                style={{ padding: '.5rem 1rem', borderRadius: '8px', border: 'none', background: filterType === f.id ? 'rgba(59,130,246,.3)' : 'var(--glass)', color: filterType === f.id ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.82rem', fontFamily: 'inherit' }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Job Cards */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filtered.map(job => (
              <div key={job.id} className="glass" onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                style={{ padding: '1.5rem', borderRadius: '16px', cursor: 'pointer', borderLeft: `4px solid ${job.match >= 90 ? 'var(--green)' : job.match >= 80 ? 'var(--blue)' : 'var(--gold)'}`, transition: 'all .3s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                    <div style={{ fontSize: '2.5rem', width: '55px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.05)', borderRadius: '14px' }}>{job.logo}</div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '.2rem' }}>{job.title}</h3>
                      <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>{job.company} · {job.location}</div>
                      <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '.7rem', padding: '.2rem .6rem', borderRadius: '50px', background: 'rgba(59,130,246,.15)', color: 'var(--blue2)', fontWeight: 600 }}>{job.type}</span>
                        <span style={{ fontSize: '.7rem', padding: '.2rem .6rem', borderRadius: '50px', background: 'rgba(16,185,129,.15)', color: 'var(--green)', fontWeight: 600 }}>{job.salary}</span>
                        <span style={{ fontSize: '.7rem', padding: '.2rem .6rem', borderRadius: '50px', background: 'rgba(245,158,11,.15)', color: 'var(--gold)', fontWeight: 600 }}>⏰ {job.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.5rem' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", color: job.match >= 90 ? 'var(--green)' : job.match >= 80 ? 'var(--blue2)' : 'var(--gold)' }}>{job.match}%</div>
                    <span style={{ fontSize: '.68rem', color: 'var(--muted)' }}>Match</span>
                    <button onClick={(e) => { e.stopPropagation(); toggleSave(job.id); if(window.ssSound) window.ssSound('click'); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                      {savedJobs.includes(job.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>

                {selectedJob?.id === job.id && (
                  <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--gb)' }}>
                    <p style={{ fontSize: '.88rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1rem' }}>{job.description}</p>
                    <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--muted2)' }}>Required:</span>
                      {job.skills.map(s => <span key={s} style={{ fontSize: '.72rem', padding: '.2rem .5rem', borderRadius: '4px', background: selectedSkills.includes(s) ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.1)', color: selectedSkills.includes(s) ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{selectedSkills.includes(s) ? '✓' : '✗'} {s}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--muted2)' }}>Perks:</span>
                      {job.perks.map(p => <span key={p} style={{ fontSize: '.72rem', padding: '.2rem .5rem', borderRadius: '4px', background: 'rgba(139,92,246,.1)', color: 'var(--purple)' }}>✨ {p}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: '.8rem', marginTop: '1rem' }}>
                      <button className="btn btn-grad" style={{ padding: '.7rem 1.5rem', fontSize: '.85rem' }}>📨 Apply Now</button>
                      <button className="btn btn-ghost" style={{ padding: '.7rem 1.5rem', fontSize: '.85rem' }}>📝 Cover Letter AI</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
