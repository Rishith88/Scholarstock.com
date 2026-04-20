import { useState } from 'react';

const GIGS = [
  { id: 1, title: 'Logo Design for College Club', seller: 'Kavya R.', avatar: '🎨', uni: 'NID Ahmedabad', category: 'Graphics', price: '₹500', rating: 4.9, reviews: 67, delivery: '2 days', tags: ['Logo', 'Branding', 'Vector'], featured: true, description: 'Professional minimalist logo design with 3 concepts and unlimited revisions.' },
  { id: 2, title: 'Python Assignment Help', seller: 'Arjun S.', avatar: '💻', uni: 'IIT Madras', category: 'Coding', price: '₹800', rating: 4.8, reviews: 143, delivery: '1 day', tags: ['Python', 'Data Science', 'ML'], featured: true, description: 'Expert Python programming help including data analysis, ML models, and automation scripts.' },
  { id: 3, title: 'Resume & CV Design', seller: 'Priya M.', avatar: '📄', uni: 'NIFT Delhi', category: 'Writing', price: '₹350', rating: 4.7, reviews: 89, delivery: '1 day', tags: ['Resume', 'ATS-Friendly', 'Design'], featured: false, description: 'ATS-optimized resume design that gets you noticed. Includes LinkedIn optimization.' },
  { id: 4, title: 'Video Editing (YouTube/Reels)', seller: 'Rohan K.', avatar: '🎬', uni: 'FTII Pune', category: 'Video', price: '₹1,200', rating: 4.9, reviews: 52, delivery: '3 days', tags: ['Editing', 'Motion Graphics', 'Color Grade'], featured: true, description: 'Cinematic video editing with color grading, transitions, and motion graphics.' },
  { id: 5, title: 'Math Tutoring (Calculus)', seller: 'Sneha P.', avatar: '🧮', uni: 'ISI Kolkata', category: 'Tutoring', price: '₹200/hr', rating: 5.0, reviews: 201, delivery: 'Live', tags: ['Calculus', 'Linear Algebra', 'Real Analysis'], featured: false, description: 'One-on-one math tutoring. Concepts explained from scratch with practice problems.' },
  { id: 6, title: 'Presentation Design (PPT)', seller: 'Ananya D.', avatar: '📊', uni: 'MICA', category: 'Graphics', price: '₹600', rating: 4.6, reviews: 78, delivery: '2 days', tags: ['PowerPoint', 'Keynote', 'Pitch Deck'], featured: false, description: 'Stunning presentation designs for academic projects, pitches, and conferences.' },
  { id: 7, title: 'React/Next.js Web Development', seller: 'Vikram T.', avatar: '🌐', uni: 'BITS Pilani', category: 'Coding', price: '₹2,500', rating: 4.8, reviews: 34, delivery: '5 days', tags: ['React', 'Next.js', 'Full Stack'], featured: true, description: 'Full-stack web application development with modern frameworks and responsive design.' },
  { id: 8, title: 'Research Paper Proofreading', seller: 'Emma L.', avatar: '📝', uni: 'Oxford', category: 'Writing', price: '₹400', rating: 4.7, reviews: 112, delivery: '2 days', tags: ['Academic', 'APA/MLA', 'Grammar'], featured: false, description: 'Thorough proofreading and editing of academic papers with citation format checking.' },
  { id: 9, title: '3D CAD Modeling', seller: 'Raj B.', avatar: '🏗️', uni: 'IIT Kharagpur', category: 'Engineering', price: '₹1,500', rating: 4.5, reviews: 28, delivery: '4 days', tags: ['SolidWorks', 'AutoCAD', '3D Print'], featured: false, description: 'Professional 3D modeling for engineering projects, prototypes, and 3D printing.' },
  { id: 10, title: 'Social Media Marketing Plan', seller: 'Zara K.', avatar: '📱', uni: 'XLRI', category: 'Marketing', price: '₹700', rating: 4.6, reviews: 45, delivery: '3 days', tags: ['Instagram', 'Strategy', 'Content'], featured: false, description: 'Complete social media strategy including content calendar, hashtag research, and analytics setup.' },
];

const CATEGORIES = ['All', 'Graphics', 'Coding', 'Writing', 'Video', 'Tutoring', 'Engineering', 'Marketing'];

export default function FreelanceMarketPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedGig, setSelectedGig] = useState(null);
  const [showPostGig, setShowPostGig] = useState(false);
  const [gigForm, setGigForm] = useState({ title: '', category: 'Graphics', price: '', delivery: '', description: '' });

  const filtered = GIGS
    .filter(g => (filter === 'All' || g.category === filter) && (g.title.toLowerCase().includes(search.toLowerCase()) || g.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))))
    .sort((a, b) => sortBy === 'featured' ? (b.featured ? 1 : 0) - (a.featured ? 1 : 0) : sortBy === 'price' ? parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, '')) : b.rating - a.rating);

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Student Services</div>
      <h2 className="sec-title">💼 Freelance Marketplace</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: '💼', value: '4,200+', label: 'Active Gigs' },
          { icon: '👩‍🎓', value: '1,800+', label: 'Student Sellers' },
          { icon: '⭐', value: '4.76', label: 'Avg Rating' },
          { icon: '✅', value: '28K+', label: 'Orders Done' },
        ].map((s, i) => (
          <div key={i} className="glass" style={{ padding: '1rem', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--blue2)' }}>{s.value}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '.8rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search gigs or skills..."
          style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.6rem 1rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', flex: 1, minWidth: '200px' }} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.6rem 1rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit' }}>
          <option value="featured">⭐ Featured</option>
          <option value="price">💰 Price: Low→High</option>
          <option value="rating">⭐ Top Rated</option>
        </select>
        <button className="btn btn-grad" onClick={() => setShowPostGig(true)} style={{ padding: '.6rem 1.2rem', fontSize: '.85rem' }}>
          ➕ Post a Gig
        </button>
      </div>

      <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: '.4rem .8rem', borderRadius: '50px', border: 'none', background: filter === c ? 'rgba(59,130,246,.3)' : 'var(--glass)', color: filter === c ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.75rem', fontFamily: 'inherit' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Gig Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
        {filtered.map(gig => (
          <div key={gig.id} className="glass" style={{ borderRadius: '16px', overflow: 'hidden', transition: 'all .3s', cursor: 'pointer' }}
            onClick={() => setSelectedGig(selectedGig?.id === gig.id ? null : gig)}>
            {/* Gig Header */}
            <div style={{ height: '80px', background: `linear-gradient(135deg, rgba(59,130,246,.15), rgba(139,92,246,.1))`, display: 'flex', alignItems: 'center', padding: '0 1.2rem', gap: '1rem', position: 'relative' }}>
              {gig.featured && <div style={{ position: 'absolute', top: '.5rem', right: '.5rem', fontSize: '.6rem', padding: '.2rem .5rem', borderRadius: '50px', background: 'rgba(245,158,11,.2)', color: 'var(--gold)', fontWeight: 700 }}>⭐ Featured</div>}
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{gig.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{gig.seller}</div>
                <div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{gig.uni}</div>
              </div>
            </div>

            <div style={{ padding: '1.2rem 1.5rem' }}>
              <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: '.5rem', lineHeight: 1.4 }}>{gig.title}</h3>
              <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '.8rem' }}>
                {gig.tags.map(t => <span key={t} style={{ fontSize: '.65rem', padding: '.15rem .4rem', borderRadius: '4px', background: 'rgba(139,92,246,.1)', color: 'var(--purple)', fontWeight: 600 }}>{t}</span>)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.8rem' }}>
                <span>⭐ {gig.rating} ({gig.reviews})</span>
                <span>⏱ {gig.delivery}</span>
              </div>

              {selectedGig?.id === gig.id && (
                <div style={{ marginBottom: '1rem', paddingTop: '.8rem', borderTop: '1px solid var(--gb)' }}>
                  <p style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>{gig.description}</p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--green)' }}>{gig.price}</span>
                <button className="btn btn-grad" onClick={e => { e.stopPropagation(); if(window.ssSound) window.ssSound('click'); }} style={{ padding: '.5rem 1rem', fontSize: '.8rem' }}>
                  📨 Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Gig Modal */}
      {showPostGig && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }} onClick={() => setShowPostGig(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg)', border: '1px solid var(--gb)', borderRadius: '24px', padding: '2.5rem', maxWidth: '550px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>➕ Post Your Gig</h3>
            {[
              { label: 'Gig Title', key: 'title', placeholder: 'e.g., Professional Logo Design' },
              { label: 'Price (₹)', key: 'price', placeholder: 'e.g., 500', type: 'number' },
              { label: 'Delivery Time', key: 'delivery', placeholder: 'e.g., 2 days' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>{f.label}</label>
                <input value={gigForm[f.key]} onChange={e => setGigForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} type={f.type || 'text'}
                  style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }} />
              </div>
            ))}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Category</label>
              <select value={gigForm.category} onChange={e => setGigForm(p => ({ ...p, category: e.target.value }))}
                style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit' }}>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Description</label>
              <textarea value={gigForm.description} onChange={e => setGigForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your service in detail..."
                style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem 1rem', color: 'var(--white)', fontSize: '.9rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
            <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => { setShowPostGig(false); if(window.ssSound) window.ssSound('success'); }}>🚀 Publish Gig</button>
          </div>
        </div>
      )}
    </div>
  );
}
