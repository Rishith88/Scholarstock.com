import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

export default function PdfViewerModal({ isOpen, onClose, materialId, title, subcategory, examCategory }) {
  const { token } = useAuth();
  
  const [doubtPanelOpen, setDoubtPanelOpen] = useState(false);
  const [doubtMessages, setDoubtMessages] = useState([
    { role: 'ai', text: `Hi! I'm your AI Doubt Solver. Select any question by drawing a circle around it, and I will give you full step-by-step explanation!` }
  ]);
  const [doubtInput, setDoubtInput] = useState('');
  const [isDoubtLoading, setIsDoubtLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(100);
  const messagesEndRef = useRef(null);

  // Circle selection system
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [processingSelection, setProcessingSelection] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'j' || e.key === 'J') { setCurrentPage(p => Math.min(p + 1, totalPages)); }
      if (e.key === 'k' || e.key === 'K') { setCurrentPage(p => Math.max(p - 1, 1)); }
      if (e.key === '+' || e.key === '=') { setZoom(z => Math.min(z + 10, 200)); }
      if (e.key === '-') { setZoom(z => Math.max(z - 10, 50)); }
      if (e.key === 'f' || e.key === 'F') { iframeRef.current?.requestFullscreen?.(); }
      if (e.key === 'Escape') { onClose(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalPages, onClose]);

  // Circle selection with touch support
  const handleMouseDown = useCallback((e) => {
    if (!selectionMode) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSelectionStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsSelecting(true);
  }, [selectionMode]);

  const handleTouchStart = useCallback((e) => {
    if (!selectionMode) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setSelectionStart({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
    setIsSelecting(true);
  }, [selectionMode]);

  const handleMouseMove = useCallback((e) => {
    if (!isSelecting) return;
    const rect = containerRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    if (canvasRef.current && selectionStart) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const radius = Math.sqrt(Math.pow(endX - selectionStart.x, 2) + Math.pow(endY - selectionStart.y, 2));
      ctx.beginPath();
      ctx.arc(selectionStart.x, selectionStart.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      const gradient = ctx.createRadialGradient(selectionStart.x, selectionStart.y, 0, selectionStart.x, selectionStart.y, radius);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [isSelecting, selectionStart]);

  const handleTouchMove = useCallback((e) => {
    if (!isSelecting) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const endX = touch.clientX - rect.left;
    const endY = touch.clientY - rect.top;
    
    if (canvasRef.current && selectionStart) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const radius = Math.sqrt(Math.pow(endX - selectionStart.x, 2) + Math.pow(endY - selectionStart.y, 2));
      ctx.beginPath();
      ctx.arc(selectionStart.x, selectionStart.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }, [isSelecting, selectionStart]);

  const handleMouseUp = useCallback(async (e) => {
    if (!isSelecting) return;
    setIsSelecting(false);
    
    const rect = containerRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    const radius = Math.sqrt(Math.pow(endX - selectionStart.x, 2) + Math.pow(endY - selectionStart.y, 2));
    
    if (radius < 15) {
      setSelectionStart(null);
      return;
    }

    setProcessingSelection(true);
    
    try {
      const blob = await new Promise(resolve => canvasRef.current.toBlob(resolve, 'image/png'));
      const formData = new FormData();
      formData.append('image', blob);
      formData.append('examCategory', examCategory);
      formData.append('subcategory', subcategory);
      
      const ocrResponse = await fetch(`${API_URL}/api/doubt/ocr`, {
        method: 'POST',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: formData
      });
      
      const ocrData = await ocrResponse.json();
      
      if (ocrData.success && ocrData.text) {
        setDoubtPanelOpen(true);
        setDoubtMessages(prev => [...prev, { role: 'user', text: `Question selected:\n\n> ${ocrData.text.substring(0, 800)}` }]);
        
        setIsDoubtLoading(true);
        const solveResponse = await fetch(`${API_URL}/api/doubt/solve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
          body: JSON.stringify({ question: ocrData.text, examCategory, subcategory, material: title })
        });
        
        const solveData = await solveResponse.json();
        if (solveData.success && solveData.answer) {
          setDoubtMessages(prev => [...prev, { role: 'ai', parsed: solveData.answer }]);
        }
      }
    } catch (err) {
      console.error('Selection error:', err);
    } finally {
      setProcessingSelection(false);
      setSelectionMode(false);
      setSelectionStart(null);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [isSelecting, selectionStart, examCategory, subcategory, title, token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [doubtMessages]);

  useEffect(() => {
    if (isOpen) {
      setDoubtPanelOpen(false);
      setDoubtInput('');
      // Add history entry so browser back button closes the modal
      window.history.pushState({ pdfViewer: true }, '');
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePopState = () => {
      if (isOpen) {
        onClose();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, onClose]);

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
        {parsed.explanation && <div><strong style={{ display: 'block', marginBottom: '.5rem' }}>≡ƒÆí Explanation</strong>{parsed.explanation}</div>}
        {parsed.steps?.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <strong style={{ display: 'block', marginBottom: '.5rem' }}>≡ƒôï Step-by-step</strong>
            {parsed.steps.map((s, i) => <div key={i} style={{ marginBottom: '.3rem', fontSize: '.85rem' }}><strong>Step {i+1}:</strong> {s}</div>)}
          </div>
        )}
        {parsed.tip && (
          <div style={{ marginTop: '1rem', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.2)', borderRadius: '6px', padding: '.7rem', fontSize: '.85rem', color: 'var(--gold)' }}>
            <strong>≡ƒÆí Exam Tip:</strong> {parsed.tip}
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
            <div className="pdf-controls">
              <div className="pdf-page-nav">
                <button className="pdf-zoom-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} title="Previous page (K)">←</button>
                <input type="number" className="pdf-page-input" value={currentPage} onChange={(e) => setCurrentPage(Math.max(1, Math.min(parseInt(e.target.value) || 1, totalPages)))} title="Go to page" />
                <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>/ {totalPages || '?'}</span>
                <button className="pdf-zoom-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} title="Next page (J)">→</button>
              </div>
              <div className="pdf-zoom-controls">
                <button className="pdf-zoom-btn" onClick={() => setZoom(z => Math.max(z - 10, 50))} title="Zoom out (-)">−</button>
                <span style={{ fontSize: '.8rem', color: 'var(--muted)', minWidth: '40px', textAlign: 'center' }}>{zoom}%</span>
                <button className="pdf-zoom-btn" onClick={() => setZoom(z => Math.min(z + 10, 200))} title="Zoom in (+)">+</button>
              </div>
              <button className="pdf-zoom-btn" onClick={() => iframeRef.current?.requestFullscreen?.()} title="Fullscreen (F)">⛶</button>
              <button onClick={onClose} title="Close (Esc)">✕</button>
            </div>
          </div>
          
          <div 
            ref={containerRef}
            style={{ 
              flex: 1, 
              position: 'relative', 
              background: '#f8fafc', 
              height: 'calc(100vh - 120px)',
              cursor: selectionMode ? 'crosshair' : 'default',
              overflow: 'auto'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsSelecting(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
             <iframe 
               ref={iframeRef}
               src={`${API_URL}/api/materials/${materialId}/stream?token=${token}#toolbar=0&navpanes=0&scrollbar=1&disabletoolbar=1&page=${currentPage}`}
               style={{ width: '100%', height: '100%', border: 'none', pointerEvents: selectionMode ? 'none' : 'auto', transform: `scale(${zoom/100})`, transformOrigin: 'top left' }}
               title="PDF Viewer"
               onContextMenu={(e) => e.preventDefault()}
             />
            
            <canvas 
              ref={canvasRef}
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                pointerEvents: selectionMode ? 'auto' : 'none',
                zIndex: 5
              }}
            />
            
            <button 
              onClick={() => {
                setSelectionMode(!selectionMode);
                if (canvasRef.current) {
                  canvasRef.current.width = containerRef.current?.offsetWidth || window.innerWidth;
                  canvasRef.current.height = containerRef.current?.offsetHeight || window.innerHeight;
                }
              }}
              style={{ 
                position: 'absolute', 
                bottom: '30px', 
                right: selectionMode ? '210px' : '30px', 
                background: selectionMode ? '#10b981' : '#8b5cf6', 
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '0.8rem 1.5rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: `0 4px 12px ${selectionMode ? 'rgba(16, 185, 129, 0.4)' : 'rgba(139, 92, 246, 0.4)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                zIndex: 10,
                animation: selectionMode ? 'pulse 1s infinite' : 'none'
              }}
              disabled={processingSelection}
              title="Circle a question to get help"
            >
              {processingSelection ? '⏳ Analyzing...' : selectionMode ? '✓ Selecting' : '⭕ Circle Question'}
            </button>
            
            <button 
              onClick={() => setDoubtPanelOpen(true)}
              style={{ 
                position: 'absolute', 
                bottom: '30px', 
                right: '30px', 
                background: '#3b82f6', 
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '0.8rem 1.5rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                display: doubtPanelOpen ? 'none' : 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                zIndex: 10
              }}
              title="Ask a doubt"
            >
              ❓ Ask Doubt
            </button>
          </div>
        </div>
      </div>

      {/* AI Doubt Solver Panel */}
      <div className={`doubt-overlay ${doubtPanelOpen ? 'open' : ''}`} onClick={() => setDoubtPanelOpen(false)} style={{ zIndex: 10000 }} />
      <div className={`doubt-panel ${doubtPanelOpen ? 'open' : ''}`} style={{ zIndex: 10001 }}>
        <div className="doubt-context-bar">📚 {examCategory} • {subcategory}</div>
        <div className="doubt-panel-header">
          <h3>❓ AI Doubt Solver</h3>
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
    </>
  );
}