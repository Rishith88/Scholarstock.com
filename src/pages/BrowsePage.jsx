import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import PdfViewerModal from '../components/PdfViewerModal';
import API_URL from '../config';

export default function BrowsePage() {
  const { categories } = useData();
  const { isLoggedIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSubcat, setSelectedSubcat] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('popular');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfMaterial, setPdfMaterial] = useState(null);

  function handleOpenPdf(m) {
    console.log('Opening PDF:', m.title, m._id);
    const isFree = m.pricePerDay === 0 || m.isFreeResource;
    if (!isLoggedIn && !isFree) { toast('Please login first', 'error'); navigate('/login'); return; }
    setPdfMaterial(m);
    setPdfModalOpen(true);
    console.log('Modal should be open now');
  }

  function handleRent(m) {
    if (!isLoggedIn) { toast('Please login first', 'error'); navigate('/login'); return; }
    navigate(`/pricing-plans?material=${m._id}&title=${encodeURIComponent(m.title)}`);
  }

  const subcats = selectedCat && categories[selectedCat] ? categories[selectedCat] : [];

  useEffect(() => {
    setPage(1); // Reset to page 1 on filter change
  }, [selectedCat, selectedSubcat, typeFilter, sortFilter, searchTerm]);

  useEffect(() => {
    async function loadMaterials() {
      setLoading(true);
      try {
        let url = `${API_URL}/api/materials?page=${page}&limit=12&`;
        if (selectedCat) url += `category=${encodeURIComponent(selectedCat)}&`;
        if (selectedSubcat) url += `subcategory=${encodeURIComponent(selectedSubcat)}&`;
        if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
        if (typeFilter) url += `type=${typeFilter}&`;
        url += `sort=${sortFilter}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setMaterials(data.materials || []);
          setTotalPages(data.pagination?.pages || 1);
        } else {
          setMaterials([]);
        }
      } catch {
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    }
    loadMaterials();
  }, [selectedCat, selectedSubcat, typeFilter, sortFilter, page, searchTerm]);

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <h2 className="sec-title">Browse Study Materials</h2>

      <div className="filter-bar">
        <div className="search-wrap" style={{ flex: 1, minWidth: '250px' }}>
          <input 
            type="text" 
            placeholder="Search by title, subject or tags..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '.75rem 1rem', 
              borderRadius: '10px', 
              border: '1px solid var(--gb)', 
              background: 'var(--glass)',
              color: 'var(--white)'
            }}
          />
        </div>

        <select value={selectedCat} onChange={e => { setSelectedCat(e.target.value); setSelectedSubcat(''); }}>
          <option value="">All Categories</option>
          {categories && typeof categories === 'object' && Object.keys(categories).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select value={selectedSubcat} onChange={e => setSelectedSubcat(e.target.value)} disabled={!selectedCat}>
          <option value="">{selectedCat ? 'All Subcategories' : 'Select Category First'}</option>
          {subcats.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="notes">Notes</option>
          <option value="pyq">PYQ</option>
          <option value="book">Books</option>
          <option value="guide">Guides</option>
        </select>

        <select value={sortFilter} onChange={e => setSortFilter(e.target.value)}>
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>⏳ Loading materials...</div>
      ) : (
        <div className="doc-grid">
          {materials.length > 0 ? materials.map(m => {
            const isFree = m.pricePerDay === 0 || m.isFreeResource;
            return (
              <div key={m._id} className="doc-card">
                <div className="doc-top">
                  <span className="tag tbl">{m.examLabel}</span>
                  <div className="doc-rating">⭐ {m.stars || 4.5}</div>
                </div>
                <div className="doc-title">{m.title}</div>
                {m.subcategory && <span className="subcat-badge">📂 {m.subcategory}</span>}
                <div className="doc-meta">
                  <span>📄 {m.pages} pages</span>
                  <span>📚 {m.type}</span>
                </div>
                <div className="doc-price">
                  {isFree
                    ? <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.2rem' }}>FREE</span>
                    : <>₹{m.pricePerDay}<span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>/day</span></>
                  }
                </div>
                <button className="btn btn-grad" style={{ width: '100%', padding: '.7rem' }}
                  onClick={() => isFree || m.isRented ? handleOpenPdf(m) : handleRent(m)}>
                  {isFree ? 'View Free' : m.isRented ? '📖 Read Now' : 'Rent Now'}
                </button>
              </div>
            );
          }) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>📚</div>
              <h3 style={{ color: 'var(--white)', marginBottom: '.5rem' }}>No materials found</h3>
              <p style={{ color: 'var(--muted)' }}>Try adjusting your search or filters to find what you're looking for.</p>
              {(searchTerm || selectedCat || typeFilter) && (
                <button 
                  className="btn btn-ghost" 
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCat('');
                    setSelectedSubcat('');
                    setTypeFilter('');
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem', alignItems: 'center' }}>
          <button 
            className="btn btn-ghost" 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
          >
            ← Previous
          </button>
          <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
            Page <strong>{page}</strong> of {totalPages}
          </span>
          <button 
            className="btn btn-ghost" 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        materialId={pdfMaterial?._id}
        title={pdfMaterial?.title}
        subcategory={pdfMaterial?.subcategory}
        examCategory={pdfMaterial?.examCategory || pdfMaterial?.category}
      />
    </div>
  );
}

