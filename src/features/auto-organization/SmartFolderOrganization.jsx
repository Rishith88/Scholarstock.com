import { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import API_URL from '../../config';

const DIFFICULTY_COLORS = { Easy: 'var(--green)', Medium: 'var(--gold)', Hard: 'var(--red)' };

const MOCK_MATERIALS = [
  { _id: '1', title: 'JEE Physics - Mechanics', examCategory: 'JEE', subcategory: 'Physics', subject: 'Mechanics', difficulty: 'Hard', tags: [] },
  { _id: '2', title: 'NEET Biology - Cell Division', examCategory: 'NEET', subcategory: 'Biology', subject: 'Cell Biology', difficulty: 'Medium', tags: [] },
  { _id: '3', title: 'UPSC History Notes', examCategory: 'UPSC', subcategory: 'History', subject: 'Modern India', difficulty: 'Medium', tags: [] },
  { _id: '4', title: 'JEE Chemistry - Organic', examCategory: 'JEE', subcategory: 'Chemistry', subject: 'Organic Chemistry', difficulty: 'Hard', tags: [] },
  { _id: '5', title: 'SSC Math - Algebra', examCategory: 'SSC', subcategory: 'Mathematics', subject: 'Algebra', difficulty: 'Easy', tags: [] },
];

export default function SmartFolderOrganization() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [materials, setMaterials] = useState(MOCK_MATERIALS);
  const [organizing, setOrganizing] = useState(false);
  const [organized, setOrganized] = useState(false);
  const [folders, setFolders] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [view, setView] = useState('folders'); // folders | list
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  const authH = useCallback(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }), [token]);

  const autoOrganize = async () => {
    setOrganizing(true);
    try {
      // Simulate AI categorization
      await new Promise(r => setTimeout(r, 1800));

      const grouped = {};
      materials.forEach(mat => {
        const key = mat.examCategory || 'Uncategorized';
        if (!grouped[key]) grouped[key] = { name: key, emoji: getExamEmoji(key), materials: [], subfolders: {} };
        const sub = mat.subcategory || 'General';
        if (!grouped[key].subfolders[sub]) grouped[key].subfolders[sub] = [];
        grouped[key].subfolders[sub].push(mat);
        grouped[key].materials.push(mat);
      });

      // Add AI-suggested tags
      const tagged = materials.map(m => ({
        ...m,
        tags: generateTags(m),
        aiSuggested: true,
      }));
      setMaterials(tagged);
      setFolders(grouped);
      setOrganized(true);
      showToast('Materials organized by AI!', 'success');
    } catch {
      showToast('Organization failed', 'error');
    } finally {
      setOrganizing(false);
    }
  };

  const getExamEmoji = (exam) => {
    const map = { JEE: '⚗️', NEET: '🧬', UPSC: '🏛️', SSC: '📊', GATE: '🔧', CAT: '📈', IELTS: '🌍', default: '📚' };
    return map[exam] || map.default;
  };

  const generateTags = (mat) => {
    const tags = [mat.examCategory, mat.subcategory, mat.difficulty].filter(Boolean);
    if (mat.title.toLowerCase().includes('formula')) tags.push('formulas');
    if (mat.title.toLowerCase().includes('notes')) tags.push('notes');
    if (mat.title.toLowerCase().includes('previous') || mat.title.toLowerCase().includes('past')) tags.push('past-papers');
    return [...new Set(tags)];
  };

  const filteredMaterials = materials.filter(m => {
    const matchSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchDiff = !filterDifficulty || m.difficulty === filterDifficulty;
    return matchSearch && matchDiff;
  });

  const folderMaterials = selectedFolder ? (folders[selectedFolder]?.materials || []) : [];

  return (
    <div className="sfo-wrap">
      <div className="sfo-header">
        <div>
          <h2 className="sfo-title">📂 Smart Folder Organization</h2>
          <p className="sfo-sub">AI automatically sorts, tags and categorizes every document into subjects, topics and difficulty levels</p>
        </div>
        <button className="sfo-organize-btn" onClick={autoOrganize} disabled={organizing}>
          {organizing ? '🤖 Organizing...' : organized ? '🔄 Re-organize' : '🤖 Auto-Organize with AI'}
        </button>
      </div>

      {organizing && (
        <div className="sfo-progress-card">
          <div style={{ fontSize: '1.5rem', marginBottom: '.8rem' }}>🤖</div>
          <div style={{ fontWeight: 700, marginBottom: '.5rem' }}>AI is analyzing your materials...</div>
          <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginBottom: '1rem' }}>Detecting subjects, topics, difficulty levels and generating smart tags</div>
          <div className="sfo-progress-bar"><div className="sfo-progress-fill" style={{ animation: 'shimmer 1.5s infinite' }} /></div>
        </div>
      )}

      {/* View Toggle + Search */}
      <div className="sfo-controls">
        <div className="sfo-view-tabs">
          <button className={`sfo-view-tab ${view === 'folders' ? 'active' : ''}`} onClick={() => { setView('folders'); setSelectedFolder(null); }}>📁 Folders</button>
          <button className={`sfo-view-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>📋 All Materials</button>
        </div>
        <div style={{ display: 'flex', gap: '.7rem', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <input className="sfo-search" placeholder="Search materials or tags..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <select className="sfo-filter" value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)}>
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {view === 'folders' && !selectedFolder && (
        <div>
          {!organized ? (
            <div className="sfo-empty">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <h3>Let AI organize your materials</h3>
              <p style={{ color: 'var(--muted)', marginTop: '.5rem' }}>Click "Auto-Organize with AI" to automatically sort all your materials into smart folders</p>
            </div>
          ) : (
            <div className="sfo-folders-grid">
              {Object.entries(folders).map(([key, folder]) => (
                <div key={key} className="sfo-folder-card" onClick={() => setSelectedFolder(key)}>
                  <div className="sfo-folder-icon">{folder.emoji}</div>
                  <div className="sfo-folder-name">{folder.name}</div>
                  <div className="sfo-folder-count">{folder.materials.length} materials</div>
                  <div className="sfo-folder-subs">
                    {Object.keys(folder.subfolders).slice(0, 3).map(sub => (
                      <span key={sub} className="sfo-sub-chip">{sub}</span>
                    ))}
                    {Object.keys(folder.subfolders).length > 3 && <span className="sfo-sub-chip">+{Object.keys(folder.subfolders).length - 3}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'folders' && selectedFolder && (
        <div>
          <button className="sfo-back-btn" onClick={() => setSelectedFolder(null)}>← {selectedFolder}</button>
          <div className="sfo-materials-list">
            {folderMaterials.map(mat => <MaterialRow key={mat._id} mat={mat} />)}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="sfo-materials-list">
          {filteredMaterials.length === 0 ? (
            <div className="sfo-empty"><p>No materials match your search.</p></div>
          ) : filteredMaterials.map(mat => <MaterialRow key={mat._id} mat={mat} />)}
        </div>
      )}
    </div>
  );
}

function MaterialRow({ mat }) {
  return (
    <div className="sfo-material-row">
      <div className="sfo-material-icon">📄</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: '.3rem' }}>
          {mat.title}
          {mat.aiSuggested && <span className="sfo-ai-badge">🤖 AI Tagged</span>}
        </div>
        <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginBottom: '.4rem' }}>{mat.examCategory} • {mat.subcategory}</div>
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
          {mat.tags?.map(tag => <span key={tag} className="sfo-tag">{tag}</span>)}
        </div>
      </div>
      {mat.difficulty && (
        <span className="sfo-difficulty-badge" style={{ color: DIFFICULTY_COLORS[mat.difficulty] || 'var(--muted)' }}>
          {mat.difficulty}
        </span>
      )}
    </div>
  );
}
