import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import API_URL from '../../config';

const DECK_COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899'];
const DECK_EMOJIS = ['📚','🧠','⚡','🎯','🔬','📐','🌍','💡','🏆','🎨'];

const QUALITY_LABELS = [
  { q: 0, label: 'Blackout', color: '#ef4444', desc: 'Complete blank' },
  { q: 1, label: 'Wrong', color: '#f97316', desc: 'Wrong, remembered after' },
  { q: 2, label: 'Hard', color: '#f59e0b', desc: 'Wrong but close' },
  { q: 3, label: 'Good', color: '#84cc16', desc: 'Correct with effort' },
  { q: 4, label: 'Easy', color: '#10b981', desc: 'Correct with hesitation' },
  { q: 5, label: 'Perfect', color: '#06b6d4', desc: 'Instant recall' },
];

export default function SpacedRepetition() {
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const [view, setView] = useState('decks'); // decks | study | cards | create-deck | add-card
  const [decks, setDecks] = useState([]);
  const [stats, setStats] = useState({ totalCards: 0, dueCards: 0, deckCount: 0, totalReviews: 0, accuracy: 0 });
  const [loading, setLoading] = useState(false);

  // Active deck/study state
  const [activeDeck, setActiveDeck] = useState(null);
  const [deckCards, setDeckCards] = useState([]);
  const [studyQueue, setStudyQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [sessionDone, setSessionDone] = useState(false);

  // Forms
  const [deckForm, setDeckForm] = useState({ name: '', description: '', subject: '', color: '#3b82f6', emoji: '📚' });
  const [cardForm, setCardForm] = useState({ front: '', back: '', hint: '' });
  const [bulkText, setBulkText] = useState('');
  const [addMode, setAddMode] = useState('single'); // single | bulk

  const authH = useCallback(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }), [token]);

  const fetchDecks = useCallback(async () => {
    if (!token) return;
    try {
      const [dRes, sRes] = await Promise.all([
        fetch(`${API_URL}/api/flashcards/decks`, { headers: authH() }),
        fetch(`${API_URL}/api/flashcards/stats`, { headers: authH() }),
      ]);
      const dData = await dRes.json();
      const sData = await sRes.json();
      if (dData.success) setDecks(dData.decks);
      if (sData.success) setStats(sData.stats);
    } catch { /* silent */ }
  }, [token, authH]);

  useEffect(() => { fetchDecks(); }, [fetchDecks]);

  // ── Create deck ──
  const createDeck = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/flashcards/decks`, { method: 'POST', headers: authH(), body: JSON.stringify(deckForm) });
      const data = await res.json();
      if (data.success) {
        showToast('Deck created!', 'success');
        setDeckForm({ name: '', description: '', subject: '', color: '#3b82f6', emoji: '📚' });
        setView('decks');
        fetchDecks();
      } else showToast(data.message, 'error');
    } catch { showToast('Error creating deck', 'error'); }
    finally { setLoading(false); }
  };

  // ── Open deck ──
  const openDeck = async (deck) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/flashcards/decks/${deck._id}/cards`, { headers: authH() });
      const data = await res.json();
      if (data.success) {
        setActiveDeck(deck);
        setDeckCards(data.cards);
        setView('cards');
      }
    } catch { showToast('Error loading deck', 'error'); }
    finally { setLoading(false); }
  };

  // ── Start study session ──
  const startStudy = async (deck) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/flashcards/due?deckId=${deck._id}`, { headers: authH() });
      const data = await res.json();
      if (data.success) {
        if (data.cards.length === 0) {
          showToast('No cards due for review! Come back later.', 'success');
          setLoading(false);
          return;
        }
        setActiveDeck(deck);
        setStudyQueue(data.cards);
        setCurrentIdx(0);
        setFlipped(false);
        setSessionStats({ correct: 0, incorrect: 0, total: data.cards.length });
        setSessionDone(false);
        setView('study');
      }
    } catch { showToast('Error loading cards', 'error'); }
    finally { setLoading(false); }
  };

  // ── Review card ──
  const reviewCard = async (quality) => {
    const card = studyQueue[currentIdx];
    try {
      await fetch(`${API_URL}/api/flashcards/${card._id}/review`, {
        method: 'POST', headers: authH(), body: JSON.stringify({ quality }),
      });
    } catch { /* silent */ }

    setSessionStats(prev => ({
      ...prev,
      correct: quality >= 3 ? prev.correct + 1 : prev.correct,
      incorrect: quality < 3 ? prev.incorrect + 1 : prev.incorrect,
    }));

    if (currentIdx + 1 >= studyQueue.length) {
      setSessionDone(true);
      fetchDecks();
    } else {
      setCurrentIdx(i => i + 1);
      setFlipped(false);
    }
  };

  // ── Add card ──
  const addCard = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (addMode === 'bulk') {
        const lines = bulkText.trim().split('\n').filter(l => l.includes('|'));
        const cards = lines.map(l => { const [front, back, hint] = l.split('|'); return { front: front?.trim(), back: back?.trim(), hint: hint?.trim() || '' }; }).filter(c => c.front && c.back);
        if (cards.length === 0) { showToast('No valid cards found. Use format: Front | Back', 'error'); setLoading(false); return; }
        const res = await fetch(`${API_URL}/api/flashcards/bulk`, { method: 'POST', headers: authH(), body: JSON.stringify({ deckId: activeDeck._id, cards }) });
        const data = await res.json();
        if (data.success) { showToast(`Added ${data.count} cards!`, 'success'); setBulkText(''); openDeck(activeDeck); }
      } else {
        const res = await fetch(`${API_URL}/api/flashcards/decks/${activeDeck._id}/cards`, { method: 'POST', headers: authH(), body: JSON.stringify(cardForm) });
        const data = await res.json();
        if (data.success) { showToast('Card added!', 'success'); setCardForm({ front: '', back: '', hint: '' }); openDeck(activeDeck); }
      }
    } catch { showToast('Error adding card', 'error'); }
    finally { setLoading(false); }
  };

  // ── Delete deck ──
  const deleteDeck = async (deckId) => {
    if (!confirm('Delete this deck and all its cards?')) return;
    try {
      await fetch(`${API_URL}/api/flashcards/decks/${deckId}`, { method: 'DELETE', headers: authH() });
      showToast('Deck deleted', 'success');
      fetchDecks();
    } catch { showToast('Error deleting deck', 'error'); }
  };

  if (!token) return (
    <div className="srs-empty"><div style={{ fontSize: '3rem' }}>🔒</div><h3>Login to use Flashcards</h3></div>
  );

  // ── STUDY VIEW ──
  if (view === 'study') {
    if (sessionDone) return (
      <div className="srs-session-done">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.8rem', marginBottom: '.5rem' }}>Session Complete!</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>{activeDeck.name}</p>
        <div className="srs-session-stats">
          <div className="srs-session-stat"><div className="srs-session-val" style={{ color: 'var(--green)' }}>{sessionStats.correct}</div><div>Correct</div></div>
          <div className="srs-session-stat"><div className="srs-session-val" style={{ color: 'var(--red)' }}>{sessionStats.incorrect}</div><div>Incorrect</div></div>
          <div className="srs-session-stat"><div className="srs-session-val" style={{ color: 'var(--blue2)' }}>{Math.round((sessionStats.correct / sessionStats.total) * 100)}%</div><div>Accuracy</div></div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button className="srs-btn-outline" onClick={() => { setView('decks'); setActiveDeck(null); }}>Back to Decks</button>
          <button className="srs-btn-primary" onClick={() => startStudy(activeDeck)}>Study Again</button>
        </div>
      </div>
    );

    const card = studyQueue[currentIdx];
    const progress = ((currentIdx) / studyQueue.length) * 100;

    return (
      <div className="srs-study-wrap">
        <div className="srs-study-header">
          <button className="srs-back-btn" onClick={() => { setView('decks'); setActiveDeck(null); }}>← Exit</button>
          <div style={{ flex: 1 }}>
            <div className="srs-study-progress-bar"><div className="srs-study-progress-fill" style={{ width: `${progress}%` }} /></div>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.3rem', textAlign: 'center' }}>{currentIdx + 1} / {studyQueue.length}</div>
          </div>
          <div style={{ fontSize: '.85rem', color: 'var(--muted)', minWidth: '80px', textAlign: 'right' }}>
            ✅ {sessionStats.correct} &nbsp; ❌ {sessionStats.incorrect}
          </div>
        </div>

        <div className="srs-card-area">
          <div className={`srs-flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
            <div className="srs-card-inner">
              <div className="srs-card-front">
                <div className="srs-card-side-label">QUESTION</div>
                <div className="srs-card-text">{card.front}</div>
                {card.hint && !flipped && <div className="srs-card-hint">💡 {card.hint}</div>}
                <div className="srs-card-tap">Tap to reveal answer</div>
              </div>
              <div className="srs-card-back">
                <div className="srs-card-side-label">ANSWER</div>
                <div className="srs-card-text">{card.back}</div>
              </div>
            </div>
          </div>

          {flipped && (
            <div className="srs-quality-row">
              <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '.82rem', marginBottom: '.8rem' }}>How well did you know this?</p>
              <div className="srs-quality-btns">
                {QUALITY_LABELS.map(({ q, label, color, desc }) => (
                  <button key={q} className="srs-quality-btn" style={{ '--qcolor': color }} onClick={() => reviewCard(q)}>
                    <span className="srs-q-label">{label}</span>
                    <span className="srs-q-desc">{desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── CARDS VIEW ──
  if (view === 'cards') return (
    <div className="srs-wrap">
      <div className="srs-deck-header">
        <button className="srs-back-btn" onClick={() => { setView('decks'); setActiveDeck(null); }}>← Decks</button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>{activeDeck.emoji} {activeDeck.name}</h2>
          <div style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{deckCards.length} cards</div>
        </div>
        <div style={{ display: 'flex', gap: '.7rem' }}>
          <button className="srs-btn-outline" onClick={() => setView('add-card')}>+ Add Cards</button>
          <button className="srs-btn-primary" onClick={() => startStudy(activeDeck)}>Study Now</button>
        </div>
      </div>

      {deckCards.length === 0 ? (
        <div className="srs-empty">
          <div style={{ fontSize: '2.5rem', marginBottom: '.8rem' }}>🃏</div>
          <p>No cards yet. Add your first card!</p>
          <button className="srs-btn-primary" style={{ marginTop: '1rem' }} onClick={() => setView('add-card')}>Add Cards</button>
        </div>
      ) : (
        <div className="srs-cards-grid">
          {deckCards.map(card => (
            <div key={card._id} className="srs-card-item">
              <div className="srs-card-item-front">{card.front}</div>
              <div className="srs-card-item-divider">↓</div>
              <div className="srs-card-item-back">{card.back}</div>
              <div className="srs-card-item-meta">
                <span>Reviews: {card.totalReviews}</span>
                <span>Due: {new Date(card.dueDate).toLocaleDateString()}</span>
                <span style={{ color: card.easeFactor >= 2.5 ? 'var(--green)' : 'var(--gold)' }}>EF: {card.easeFactor.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── ADD CARD VIEW ──
  if (view === 'add-card') return (
    <div className="srs-wrap">
      <div className="srs-deck-header">
        <button className="srs-back-btn" onClick={() => setView('cards')}>← Back</button>
        <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>Add Cards to {activeDeck.emoji} {activeDeck.name}</h2>
      </div>

      <div className="srs-add-tabs">
        <button className={`srs-add-tab ${addMode === 'single' ? 'active' : ''}`} onClick={() => setAddMode('single')}>Single Card</button>
        <button className={`srs-add-tab ${addMode === 'bulk' ? 'active' : ''}`} onClick={() => setAddMode('bulk')}>Bulk Import</button>
      </div>

      <form onSubmit={addCard} className="srs-add-form">
        {addMode === 'single' ? (
          <>
            <div className="srs-form-group">
              <label className="srs-label">Front (Question)</label>
              <textarea className="srs-textarea" value={cardForm.front} onChange={e => setCardForm(p => ({ ...p, front: e.target.value }))} placeholder="What is Newton's Second Law?" required rows={3} />
            </div>
            <div className="srs-form-group">
              <label className="srs-label">Back (Answer)</label>
              <textarea className="srs-textarea" value={cardForm.back} onChange={e => setCardForm(p => ({ ...p, back: e.target.value }))} placeholder="F = ma (Force = mass × acceleration)" required rows={3} />
            </div>
            <div className="srs-form-group">
              <label className="srs-label">Hint (optional)</label>
              <input className="srs-input" value={cardForm.hint} onChange={e => setCardForm(p => ({ ...p, hint: e.target.value }))} placeholder="Think about force and motion..." />
            </div>
          </>
        ) : (
          <div className="srs-form-group">
            <label className="srs-label">Bulk Import (one card per line: Front | Back | Hint)</label>
            <textarea className="srs-textarea" value={bulkText} onChange={e => setBulkText(e.target.value)} placeholder={`Newton's 2nd Law | F = ma | Think force and motion\nOhm's Law | V = IR | Voltage, current, resistance\nPythagoras | a² + b² = c² | Right triangle`} rows={10} required />
            <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.4rem' }}>Format: Front | Back | Hint (hint optional)</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="srs-btn-outline" onClick={() => setView('cards')}>Cancel</button>
          <button type="submit" className="srs-btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Cards'}</button>
        </div>
      </form>
    </div>
  );

  // ── CREATE DECK VIEW ──
  if (view === 'create-deck') return (
    <div className="srs-wrap">
      <div className="srs-deck-header">
        <button className="srs-back-btn" onClick={() => setView('decks')}>← Back</button>
        <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>Create New Deck</h2>
      </div>
      <form onSubmit={createDeck} className="srs-add-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="srs-form-group" style={{ gridColumn: '1/-1' }}>
            <label className="srs-label">Deck Name *</label>
            <input className="srs-input" value={deckForm.name} onChange={e => setDeckForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Physics Formulas" required />
          </div>
          <div className="srs-form-group">
            <label className="srs-label">Subject</label>
            <input className="srs-input" value={deckForm.subject} onChange={e => setDeckForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Physics" />
          </div>
          <div className="srs-form-group">
            <label className="srs-label">Description</label>
            <input className="srs-input" value={deckForm.description} onChange={e => setDeckForm(p => ({ ...p, description: e.target.value }))} placeholder="What's in this deck?" />
          </div>
        </div>
        <div className="srs-form-group">
          <label className="srs-label">Emoji</label>
          <div className="srs-emoji-row">{DECK_EMOJIS.map(e => <button key={e} type="button" className={`srs-emoji-btn ${deckForm.emoji === e ? 'active' : ''}`} onClick={() => setDeckForm(p => ({ ...p, emoji: e }))}>{e}</button>)}</div>
        </div>
        <div className="srs-form-group">
          <label className="srs-label">Color</label>
          <div className="srs-color-row">{DECK_COLORS.map(c => <button key={c} type="button" className={`srs-color-btn ${deckForm.color === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setDeckForm(p => ({ ...p, color: c }))} />)}</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="srs-btn-outline" onClick={() => setView('decks')}>Cancel</button>
          <button type="submit" className="srs-btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Deck'}</button>
        </div>
      </form>
    </div>
  );

  // ── DECKS VIEW (default) ──
  return (
    <div className="srs-wrap">
      {/* Header */}
      <div className="srs-header">
        <div>
          <h2 className="srs-title">🧠 Spaced Repetition</h2>
          <p className="srs-sub">SM-2 algorithm schedules reviews at the perfect time for maximum retention</p>
        </div>
        <button className="srs-btn-primary" onClick={() => setView('create-deck')}>+ New Deck</button>
      </div>

      {/* Stats */}
      <div className="srs-stats-grid">
        {[
          { label: 'Total Cards', value: stats.totalCards, icon: '🃏', color: 'var(--blue)' },
          { label: 'Due Today', value: stats.dueCards, icon: '⏰', color: stats.dueCards > 0 ? 'var(--gold)' : 'var(--green)' },
          { label: 'Total Reviews', value: stats.totalReviews, icon: '✅', color: 'var(--purple)' },
          { label: 'Accuracy', value: `${stats.accuracy}%`, icon: '🎯', color: 'var(--cyan)' },
        ].map((s, i) => (
          <div key={i} className="srs-stat-card">
            <div className="srs-stat-icon" style={{ color: s.color }}>{s.icon}</div>
            <div className="srs-stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="srs-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Due Today Banner */}
      {stats.dueCards > 0 && (
        <div className="srs-due-banner">
          <span>⏰ You have <strong>{stats.dueCards} cards</strong> due for review today!</span>
          <button className="srs-btn-primary" style={{ padding: '.5rem 1.2rem', fontSize: '.82rem' }}
            onClick={async () => {
              const res = await fetch(`${API_URL}/api/flashcards/due`, { headers: authH() });
              const data = await res.json();
              if (data.success && data.cards.length > 0) {
                setStudyQueue(data.cards);
                setCurrentIdx(0);
                setFlipped(false);
                setSessionStats({ correct: 0, incorrect: 0, total: data.cards.length });
                setSessionDone(false);
                setActiveDeck({ name: 'All Due Cards', emoji: '⏰', _id: null });
                setView('study');
              }
            }}>
            Review All
          </button>
        </div>
      )}

      {/* Decks Grid */}
      {decks.length === 0 ? (
        <div className="srs-empty">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🃏</div>
          <h3>No decks yet</h3>
          <p style={{ color: 'var(--muted)', marginTop: '.5rem' }}>Create your first flashcard deck to start studying</p>
          <button className="srs-btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setView('create-deck')}>Create First Deck</button>
        </div>
      ) : (
        <div className="srs-decks-grid">
          {decks.map(deck => (
            <div key={deck._id} className="srs-deck-card" style={{ '--deck-color': deck.color }}>
              <div className="srs-deck-top">
                <div className="srs-deck-emoji">{deck.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div className="srs-deck-name">{deck.name}</div>
                  {deck.subject && <div className="srs-deck-subject">{deck.subject}</div>}
                </div>
                {deck.dueCount > 0 && <div className="srs-due-badge">{deck.dueCount} due</div>}
              </div>
              {deck.description && <div className="srs-deck-desc">{deck.description}</div>}
              <div className="srs-deck-meta">
                <span>🃏 {deck.cardCount} cards</span>
                {deck.lastStudied && <span>Last: {new Date(deck.lastStudied).toLocaleDateString()}</span>}
              </div>
              <div className="srs-deck-actions">
                <button className="srs-deck-btn-study" onClick={() => startStudy(deck)} disabled={deck.dueCount === 0}>
                  {deck.dueCount > 0 ? `Study (${deck.dueCount})` : 'Up to date ✓'}
                </button>
                <button className="srs-deck-btn-view" onClick={() => openDeck(deck)}>View</button>
                <button className="srs-deck-btn-del" onClick={() => deleteDeck(deck._id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
