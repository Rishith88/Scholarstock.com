import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

export default function PdfViewerModal({ isOpen, onClose, materialId, title, subcategory, examCategory }) {
  const { token } = useAuth();
  
  const [doubtPanelOpen, setDoubtPanelOpen] = useState(false);
  const [doubtMessages, setDoubtMessages] = useState([
    { role: 'ai', text: `≡ƒæï Hi! I'm your AI Doubt Solver. ≡ƒÄ» Select any question by drawing a circle around it, and I will give you full step-by-step explanation!` }
  ]);
  const [doubtInput, setDoubtInput] = useState('');
  const [isDoubtLoading, setIsDoubtLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ≡ƒÄ» CIRCLE SELECTION SYSTEM
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [processingSelection, setProcessingSelection] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // ≡ƒÄ» CIRCLE DOUBT SOLVER - CORE LOGIC
  const handleMouseDown = useCallback((e) => {
    if (!selectionMode) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSelectionStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsSelecting(true);
  }, [selectionMode]);

  const handleMouseMove = useCallback((e) => {
    if (!isSelecting) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSelectionEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    
    if (canvasRef.current && selectionStart) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const radius = Math.sqrt(
        Math.pow((e.clientX - rect.left) - selectionStart.x, 2) + 
        Math.pow((e.clientY - rect.top) - selectionStart.y, 2)
      );
      
      // Draw beautiful selection circle
      ctx.beginPath();
      ctx.arc(selectionStart.x, selectionStart.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Fill with glow effect
      const gradient = ctx.createRadialGradient(
        selectionStart.x, selectionStart.y, 0,
        selectionStart.x, selectionStart.y, radius
      );
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [isSelecting, selectionStart]);

  const handleMouseUp = useCallback(async (e) => {
    if (!isSelecting) return;
    setIsSelecting(false);
    
    const rect = containerRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    const radius = Math.sqrt(
      Math.pow(endX - selectionStart.x, 2) + 
      Math.pow(endY - selectionStart.y, 2)
    );
    
    if (radius < 15) {
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    setSelectedRegion({
      x: selectionStart.x,
      y: selectionStart.y,
      radius,
      width: rect.width,
      height: rect.height
    });
    
    setProcessingSelection(true);
    
    try {
      // Capture viewport
      const captureCanvas = document.createElement('canvas');
      captureCanvas.width = rect.width;
      captureCanvas.height = rect.height;
      const captureCtx = captureCanvas.getContext('2d');
      
      // Capture the region
      const iframe = document.querySelector('iframe[title="PDF Viewer"]');
      if (iframe) {
        const iframeWin = iframe.contentWindow || iframe.contentDocument.defaultView;
        captureCtx.drawWindow(iframeWin, 0, 0, rect.width, rect.height, 'rgb(255,255,255)');
      }
      
      // Extract selected area
      const regionCanvas = document.createElement('canvas');
      const regionSize = Math.ceil(radius * 2);
      regionCanvas.width = regionSize;
      regionCanvas.height = regionSize;
      const regionCtx = regionCanvas.getContext('2d');
      
      regionCtx.drawImage(
        captureCanvas, 
        Math.max(0, selectionStart.x - radius), 
        Math.max(0, selectionStart.y - radius),
        regionSize,
        regionSize,
        0,
        0,
        regionSize,
        regionSize
      );
      
      // Send to OCR
      const blob = await new Promise(resolve => regionCanvas.toBlob(resolve, 'image/png'));
      const formData = new FormData();
      formData.append('image', blob);
      formData.append('examCategory', examCategory);
      formData.append('subcategory', subcategory);
      
      const ocrResponse = await fetch(`${API_URL}/api/doubt/ocr`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });
      
      const ocrData = await ocrResponse.json();
      
      if (ocrData.success && ocrData.text) {
        setDoubtPanelOpen(true);
        setDoubtMessages(prev => [
          ...prev,
          { 
            role: 'user', 
            text: `≡ƒô╖ Question selected:\n\n> ${ocrData.text.substring(0, 800)}${ocrData.text.length > 800 ? '...' : ''}` 
          }
        ]);
        
        // Auto solve
        setIsDoubtLoading(true);
        const solveResponse = await fetch(`${API_URL}/api/doubt/solve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            question: ocrData.text,
            examCategory,
            subcategory,
            material: title
          })
        });
        
        const solveData = await solveResponse.json();
        
        if (solveData.success && solveData.answer) {
          setDoubtMessages(prev => [...prev, { role: 'ai', parsed: solveData.answer }]);
        } else {
          setDoubtMessages(prev => [...prev, { 
            role: 'error', 
            text: 'Could not solve this question. Please try typing it.' 
          }]);
        }
      }
      
    } catch (err) {
      console.error('Selection error:', err);
    } finally {
      setProcessingSelection(false);
      setSelectionMode(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      setSelectedRegion(null);
      
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
            <div style={{ fontWeight: 700, fontSize: '.9rem' }}>≡ƒôä {title}</div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <button className="pdf-doubt-btn" style={{ color: '#fff', background: 'var(--blue)', border: 'none', borderRadius: '6px', padding: '.4rem .8rem', fontWeight: 700, cursor: 'pointer', fontSize: '.85rem' }} onClick={() => setDoubtPanelOpen(o => !o)}>
                ≡ƒºá Ask Doubt
              </button>
              <button onClick={onClose}>Γ£ò</button>
            </div>
          </div>
          
          <div 
            ref={containerRef}
            style={{ 
              flex: 1, 
              position: 'relative', 
              background: '#f8fafc', 
              height: 'calc(100vh - 120px)',
              cursor: selectionMode ? 'crosshair' : 'default'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsSelecting(false)}
          >
             <iframe 
               src={`${API_URL}/api/materials/${materialId}/stream?token=${token}#toolbar=0&navpanes=0&scrollbar=1&disabletoolbar=1`}
               style={{ width: '100%', height: '100%', border: 'none', pointerEvents: selectionMode ? 'none' : 'auto' }}
               title="PDF Viewer"
               onContextMenu={(e) => e.preventDefault()}
             />
            
            {/* Selection Canvas Overlay */}
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
            
            {/* ≡ƒÄ» SELECTION MODE BUTTON */}
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
            >
              {processingSelection ? '≡ƒöì Analyzing...' : selectionMode ? 'Γ£à Selecting' : '≡ƒÄ» Circle Question'}
            </button>
            
            {/* Overlay button to ask doubt */}
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
            >
              ≡ƒºá Ask Doubt
            </button>
          </div>
        </div>
      </div>

      {/* AI Doubt Solver Panel */}
      <div className={`doubt-overlay ${doubtPanelOpen ? 'open' : ''}`} onClick={() => setDoubtPanelOpen(false)} style={{ zIndex: 10000 }} />
      <div className={`doubt-panel ${doubtPanelOpen ? 'open' : ''}`} style={{ zIndex: 10001 }}>
        <div className="doubt-context-bar">≡ƒôÜ {examCategory} ΓÇó {subcategory}</div>
        <div className="doubt-panel-header">
          <h3>≡ƒºá AI Doubt Solver</h3>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setDoubtPanelOpen(false)}>Γ£ò</button>
        </div>
        
        <div className="doubt-messages">
          {doubtMessages.map((msg, i) => (
            <div key={i} className={`doubt-msg ${msg.role === 'user' ? 'user' : 'ai'}`}>
              {msg.role === 'error' ? <div style={{ color: 'var(--red)' }}>ΓÜá∩╕Å {msg.text}</div> : msg.parsed ? renderAiMessage(msg.parsed) : msg.text}
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
              Γ₧ñ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}