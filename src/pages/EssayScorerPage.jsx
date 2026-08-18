import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

const RUBRICS = [
  { id: 'academic', name: 'Academic Essay', icon: '🎓', criteria: ['Thesis Clarity', 'Evidence & Support', 'Organization', 'Grammar & Style', 'Citations'] },
  { id: 'argumentative', name: 'Argumentative', icon: '⚔️', criteria: ['Claim Strength', 'Counter-Arguments', 'Logic Flow', 'Persuasiveness', 'Conclusion'] },
  { id: 'research', name: 'Research Paper', icon: '🔬', criteria: ['Literature Review', 'Methodology', 'Data Analysis', 'Discussion', 'References'] },
  { id: 'creative', name: 'Creative Writing', icon: '✍️', criteria: ['Originality', 'Voice & Tone', 'Imagery', 'Narrative Arc', 'Emotional Impact'] },
  { id: 'business', name: 'Business Report', icon: '📊', criteria: ['Executive Summary', 'Data Presentation', 'Recommendations', 'Professionalism', 'Formatting'] },
];

export default function EssayScorerPage() {
  const { token, isLoggedIn } = useAuth();
  const [essay, setEssay] = useState('');
  const [rubric, setRubric] = useState('academic');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch(`${API_URL}/api/essay-scorer/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setHistory(data.analyses);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyze = async () => {
    if (essay.trim().length < 50) return;
    if (!isLoggedIn) {
      alert('Please login to analyze essays.');
      return;
    }
    setAnalyzing(true);
    try {
      const res = await fetch(`${API_URL}/api/essay-scorer/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ essayText: essay, rubricType: rubric })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.analysis);
        setActiveTab('overview');
        if (window.ssSound) window.ssSound('success');
        fetchHistory();
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEssay(ev.target.result);
    reader.readAsText(file);
  };

  const getScoreColor = (s) => s >= 85 ? 'var(--green)' : s >= 70 ? 'var(--blue2)' : s >= 55 ? 'var(--gold)' : 'var(--red)';
  const getGradeGlow = (s) => s >= 85 ? 'rgba(16,185,129,.3)' : s >= 70 ? 'rgba(59,130,246,.3)' : s >= 55 ? 'rgba(245,158,11,.3)' : 'rgba(239,68,68,.3)';

  const TABS = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'rubric', icon: '📋', label: 'Rubric Scores' },
    { id: 'grammar', icon: '✏️', label: 'Grammar' },
    { id: 'plagiarism', icon: '🔍', label: 'Plagiarism' },
    { id: 'suggestions', icon: '💡', label: 'Suggestions' },
  ];

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">AI-Powered Analysis</div>
      <h2 className="sec-title">📝 Essay Scorer & Plagiarism Checker</h2>

      {!result ? (
        <div style={{ maxWidth: '900px' }}>
          {/* Rubric Selection */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '.8rem' }}>Select Rubric</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '.8rem' }}>
              {RUBRICS.map(r => (
                <button key={r.id} onClick={() => setRubric(r.id)}
                  style={{
                    padding: '1rem', borderRadius: '14px', border: rubric === r.id ? '2px solid var(--blue)' : '1px solid var(--gb)',
                    background: rubric === r.id ? 'rgba(59,130,246,.12)' : 'var(--glass)', cursor: 'pointer',
                    textAlign: 'center', transition: 'all .3s', fontFamily: 'inherit', color: 'var(--white)'
                  }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '.5rem' }}>{r.icon}</div>
                  <div style={{ fontSize: '.82rem', fontWeight: 700 }}>{r.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Essay Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
              <label style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '1px' }}>Paste Your Essay</label>
              <div style={{ display: 'flex', gap: '.5rem' }}>
                <input ref={fileRef} type="file" accept=".txt,.md" style={{ display: 'none' }} onChange={handleFileUpload} />
                <button onClick={() => fileRef.current.click()}
                  style={{ padding: '.4rem .8rem', borderRadius: '8px', border: '1px solid var(--gb)', background: 'var(--glass)', color: 'var(--muted)', cursor: 'pointer', fontSize: '.78rem', fontWeight: 600, fontFamily: 'inherit' }}>
                  📎 Upload File
                </button>
              </div>
            </div>
            <textarea
              value={essay} onChange={e => setEssay(e.target.value)}
              placeholder="Paste your essay here... (minimum 50 characters)"
              style={{
                width: '100%', minHeight: '300px', background: 'rgba(255,255,255,.04)', border: '1px solid var(--gb)',
                borderRadius: '14px', padding: '1.2rem', color: 'var(--white)', fontSize: '.92rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: 1.8, resize: 'vertical', outline: 'none', transition: 'border-color .3s'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.5rem', fontSize: '.78rem', color: 'var(--muted)' }}>
              <span>{essay.split(/\s+/).filter(Boolean).length} words</span>
              <span>{essay.length} characters</span>
            </div>
          </div>

          <button className="btn btn-grad" onClick={handleAnalyze}
            disabled={essay.trim().length < 50 || analyzing}
            style={{ width: '100%', opacity: essay.trim().length < 50 ? 0.5 : 1 }}>
            {analyzing ? '🔄 Analyzing with AI...' : '🚀 Score My Essay'}
          </button>

          {analyzing && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <div className="mock-loading-dots"><span /><span /><span /></div>
              <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginTop: '1rem' }}>Running AI analysis, plagiarism detection, and readability scoring...</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button className="btn btn-ghost" onClick={() => { setResult(null); setEssay(''); }} style={{ marginBottom: '2rem' }}>← Analyze Another Essay</button>

          {/* Score Hero */}
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${getGradeGlow(result.overallScore)}, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ fontSize: '5rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", color: getScoreColor(result.overallScore), position: 'relative', textShadow: `0 0 40px ${getGradeGlow(result.overallScore)}` }}>
                {result.overallScore}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: getScoreColor(result.overallScore), marginBottom: '.5rem', position: 'relative' }}>
                {result.grade}
              </div>
              <div style={{ fontSize: '.8rem', color: 'var(--muted)', position: 'relative' }}>Overall Score</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Words', value: result.wordStats.total, icon: '📝' },
                { label: 'Sentences', value: result.wordStats.sentences, icon: '📏' },
                { label: 'Readability', value: result.readability.level, icon: '📖' },
                { label: 'Plagiarism Free', value: `${result.plagiarism.score}%`, icon: '✅' },
                { label: 'Unique Words', value: result.wordStats.unique, icon: '💎' },
                { label: 'Paragraphs', value: result.wordStats.paragraphs, icon: '📄' },
              ].map((s, i) => (
                <div key={i} className="glass" style={{ padding: '1rem', borderRadius: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '.3rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--blue2)' }}>{s.value}</div>
                  <div style={{ fontSize: '.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ padding: '.55rem 1.1rem', borderRadius: '8px', border: 'none', background: activeTab === t.id ? 'rgba(59,130,246,.3)' : 'var(--glass)', color: activeTab === t.id ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.82rem', fontFamily: 'inherit' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>📊 Readability Analysis</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1rem' }}>
                {[
                  { label: 'Flesch-Kincaid Grade', value: result.readability.fleschKincaid },
                  { label: 'Avg Sentence Length', value: `${result.readability.avgSentenceLen} words` },
                  { label: 'Avg Word Length', value: `${result.readability.avgWordLen} chars` },
                  { label: 'Reading Level', value: result.readability.level },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,.04)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--blue2)', fontFamily: "'Playfair Display', serif" }}>{m.value}</div>
                    <div style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: '.3rem' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rubric Scores */}
          {activeTab === 'rubric' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.criteria.map((c, i) => (
                <div key={i} className="glass" style={{ padding: '1.2rem 1.5rem', borderRadius: '14px', borderLeft: `4px solid ${getScoreColor(c.score)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
                    <span style={{ fontWeight: 700 }}>{c.name}</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: getScoreColor(c.score), fontFamily: "'Playfair Display', serif" }}>{c.score}</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '.6rem' }}>
                    <div style={{ height: '100%', width: `${c.score}%`, background: getScoreColor(c.score), borderRadius: '3px', transition: 'width 1s ease' }} />
                  </div>
                  <p style={{ fontSize: '.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>{c.feedback}</p>
                </div>
              ))}
            </div>
          )}

          {/* Grammar */}
          {activeTab === 'grammar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {result.grammarIssues.map((g, i) => (
                <div key={i} className="glass" style={{ padding: '1rem 1.2rem', borderRadius: '10px', display: 'flex', gap: '1rem', alignItems: 'flex-start', borderLeft: `3px solid ${g.severity === 'high' ? 'var(--red)' : g.severity === 'medium' ? 'var(--gold)' : 'var(--blue2)'}` }}>
                  <div style={{ fontSize: '.7rem', fontWeight: 700, padding: '.2rem .5rem', borderRadius: '4px', background: g.severity === 'high' ? 'rgba(239,68,68,.15)' : g.severity === 'medium' ? 'rgba(245,158,11,.15)' : 'rgba(59,130,246,.15)', color: g.severity === 'high' ? 'var(--red)' : g.severity === 'medium' ? 'var(--gold)' : 'var(--blue2)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Line {g.line}
                  </div>
                  <div>
                    <div style={{ fontSize: '.85rem', fontWeight: 600, marginBottom: '.2rem' }}>{g.text}</div>
                    <span style={{ fontSize: '.7rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{g.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Plagiarism */}
          {activeTab === 'plagiarism' && (
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", color: result.plagiarism.score >= 90 ? 'var(--green)' : 'var(--red)' }}>
                  {result.plagiarism.score}%
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Original Content</div>
              </div>
              <h4 style={{ marginBottom: '.8rem', fontSize: '.85rem', color: 'var(--muted2)', textTransform: 'uppercase' }}>Flagged Sources ({result.plagiarism.flagged})</h4>
              {result.plagiarism.sources.map((s, i) => (
                <div key={i} style={{ padding: '.8rem 1rem', background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.15)', borderRadius: '8px', marginBottom: '.5rem', fontSize: '.85rem', color: 'var(--gold)' }}>
                  ⚠️ {s}
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {activeTab === 'suggestions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
              {result.suggestions.map((s, i) => (
                <div key={i} className="glass" style={{ padding: '1.2rem 1.5rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>💡</div>
                  <p style={{ fontSize: '.88rem', color: 'var(--muted)', lineHeight: 1.7 }}>{s}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .essay-scorer-container { animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
