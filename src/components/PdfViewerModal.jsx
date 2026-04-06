import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

export default function PdfViewerModal({ isOpen, onClose, materialId, title, subcategory, examCategory }) {
  const { token } = useAuth();
  const toast = useToast();
  
  const [doubtPanelOpen, setDoubtPanelOpen] = useState(false);
  const [doubtMessages, setDoubtMessages] = useState([
    { role: 'ai', text: `👋 Hi! I'm your AI Doubt Solver. Ask me anything about ${title || 'this material'}, and I'll give you step-by-step explanations!` }
  ]);
  const [doubtInput, setDoubtInput] = useState('');
  const [isDoubtLoading, setIsDoubtLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [doubtMessages]);

  useEffect(() => {
    if (isOpen) {
      setDoubtPanelOpen(false);
      setDoubtInput('');
    }
  }, [isOpen]);

  async function sendDoubt() {
    const text = doubtInput.trim();
    if (!text || isDoubtLoading) return;

    setDoubtInput('');
    setDoubtMessages(prev => [...prev, { role: 'user', text }]);
    setIsDoubtLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/doubt/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ question: text, examCategory, subcategory, material: title })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data.success && data.answer) {
        setDoubtMessages(prev => [...prev, { role: 'ai', parsed: data.answer }]);
      } else {
        throw new Error(data.message || 'Failed to get answer');
      }
    } catch (err) {
      setDoubtMessages(prev => [...prev, { role: 'error', text: err.message || 'Error connecting to Doubt Solver' }]);
    } finally {
      setIsDoubtLoading(false);
    }
  }

  function renderAiMessage(parsed) {
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed); } catch { return parsed; }
    }
    
    return (
      <>
        {parsed.explanation && <div><strong style={{ display: 'block', marginBottom: '.5rem' }}>💡 Explanation</strong>{parsed.explanation}</div>}
        {parsed.steps?.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <strong style={{ display: 'block', marginBottom: '.5rem' }}>📋 Step-by-step</strong>
            {parsed.steps.map((s, i) => <div key={i} style={{ marginBottom: '.3rem', fontSize: '.85rem' }}><strong>Step {i+1}:</strong> {s}</div>)}
          </div>
        )}
        {parsed.tip && (
          <div style={{ marginTop: '1rem', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.2)', borderRadius: '6px', padding: '.7rem', fontSize: '.85rem', color: 'var(--gold)' }}>
            <strong>💡 Exam Tip:</strong> {parsed.tip}
          </div>
        )}
      </>
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="pdf-viewer on" onClick={(e) => e.target.className.includes('pdf-viewer') && onClose()}>
        <div className="pdf-container" onClick={e => e.stopPropagation()}>
          <div className="pdf-header">
            <div style={{ fontWeight: 700, fontSize: '.9rem' }}>📄 {title}</div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button style={{ color: 'var(--blue2)', borderColor: 'rgba(59,130,246,.3)', background: 'rgba(59,130,246,.1)' }} onClick={() => setDoubtPanelOpen(o => !o)}>
                🧠 Ask Doubt
              </button>
              <button onClick={onClose}>✕</button>
            </div>
          </div>
          
          <div style={{ flex: 1, position: 'relative', background: '#f8fafc' }}>
            <iframe 
              src={`${API_URL}/api/materials/${materialId}/stream?token=${token}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="PDF Viewer"
              onContextMenu={(e) => e.preventDefault()}
            />sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </div>

      {/* AI Doubt Solver Panel */}
      <div className={`doubt-overlay ${doubtPanelOpen ? 'open' : ''}`} onClick={() => setDoubtPanelOpen(false)} style={{ zIndex: 10000 }} />
      <div className={`doubt-panel ${doubtPanelOpen ? 'open' : ''}`} style={{ zIndex: 10001 }}>
        <div className="doubt-context-bar">📚 {examCategory} • {subcategory}</div>
        <div className="doubt-panel-header">
          <h3>🧠 AI Doubt Solver</h3>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setDoubtPanelOpen(false)}>✕</button>
        </div>
        
        <div className="doubt-messages">
          {doubtMessages.map((msg, i) => (
            <div key={i} className={`doubt-msg ${msg.role === 'user' ? 'user' : 'ai'}`}>
              {msg.role === 'error' ? <div style={{ color: 'var(--red)' }}>⚠️ {msg.text}</div> : msg.parsed ? renderAiMessage(msg.parsed) : msg.text}
            </div>
          ))}
          {isDoubtLoading && (
            <div className="doubt-msg ai doubt-typing">
              <span/><span/><span/>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="doubt-input-area">
          <div className="doubt-input-row" style={{ display: 'flex', gap: '.5rem' }}>
            <input 
              style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '8px', padding: '.7rem 1rem', color: '#fff', outline: 'none' }}
              value={doubtInput}
              onChange={e => setDoubtInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendDoubt()}
              placeholder="Ask a doubt about this PDF..."
              disabled={isDoubtLoading}
            />
            <button 
              style={{ background: 'var(--blue)', border: 'none', color: '#fff', padding: '0 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
              onClick={sendDoubt}
              disabled={isDoubtLoading}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


 
