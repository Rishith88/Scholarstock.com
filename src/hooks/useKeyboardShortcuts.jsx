import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SHORTCUTS = [
  { key: 'Cmd+K', description: 'Open command palette', action: 'command' },
  { key: 'Ctrl+K', description: 'Open command palette', action: 'command' },
  { key: 'g h', description: 'Go to Home', action: 'navigate', path: '/' },
  { key: 'g b', description: 'Go to Browse', action: 'navigate', path: '/browse' },
  { key: 'g f', description: 'Go to Flashcards', action: 'navigate', path: '/flashcards' },
  { key: 'g r', description: 'Go to Study Rooms', action: 'navigate', path: '/study-rooms' },
  { key: 'g d', description: 'Go to Dashboard', action: 'navigate', path: '/dashboard' },
  { key: 'g l', description: 'Go to Library', action: 'navigate', path: '/library' },
  { key: 'g p', description: 'Go to Profile', action: 'navigate', path: '/profile' },
  { key: 'g c', description: 'Go to Cart', action: 'navigate', path: '/cart' },
  { key: 'j', description: 'Next PDF page', action: 'pdf', target: 'nextPage' },
  { key: 'k', description: 'Previous PDF page', action: 'pdf', target: 'prevPage' },
  { key: '+', description: 'Zoom in PDF', action: 'pdf', target: 'zoomIn' },
  { key: '-', description: 'Zoom out PDF', action: 'pdf', target: 'zoomOut' },
  { key: 'f', description: 'PDF fullscreen', action: 'pdf', target: 'fullscreen' },
  { key: 'n', description: 'New flashcard', action: 'flashcard', target: 'new' },
  { key: 'Space', description: 'Flip flashcard', action: 'flashcard', target: 'flip' },
  { key: '?', description: 'Show shortcuts', action: 'help' },
  { key: 'Escape', description: 'Close modal / Go back', action: 'escape' },
  { key: '/', description: 'Focus search', action: 'search' },
];

export function useKeyboardShortcuts(onCommandPalette) {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [pendingKey, setPendingKey] = useState('');
  const pendingTimer = { current: null };

  const handleKey = useCallback((e) => {
    // Command Palette (Cmd+K or Ctrl+K)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      onCommandPalette?.();
      return;
    }

    // Don't trigger when typing in inputs
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key;

    if (key === '?') { setShowHelp(h => !h); return; }
    if (key === 'Escape') { setShowHelp(false); return; }
    if (key === '/') {
      e.preventDefault();
      document.querySelector('input[type="search"], .autocomplete-input, input[placeholder*="search" i]')?.focus();
      return;
    }

    // PDF shortcuts
    const pdfViewer = document.querySelector('[data-pdf-viewer]');
    if (pdfViewer) {
      if (key === 'j') {
        e.preventDefault();
        pdfViewer.dispatchEvent(new CustomEvent('pdf-next-page'));
        return;
      }
      if (key === 'k') {
        e.preventDefault();
        pdfViewer.dispatchEvent(new CustomEvent('pdf-prev-page'));
        return;
      }
      if (key === '+') {
        e.preventDefault();
        pdfViewer.dispatchEvent(new CustomEvent('pdf-zoom-in'));
        return;
      }
      if (key === '-') {
        e.preventDefault();
        pdfViewer.dispatchEvent(new CustomEvent('pdf-zoom-out'));
        return;
      }
      if (key === 'f') {
        e.preventDefault();
        pdfViewer.dispatchEvent(new CustomEvent('pdf-fullscreen'));
        return;
      }
    }

    // Flashcard shortcuts
    const flashcardArea = document.querySelector('[data-flashcard-area]');
    if (flashcardArea) {
      if (key === 'n') {
        e.preventDefault();
        flashcardArea.dispatchEvent(new CustomEvent('flashcard-new'));
        return;
      }
      if (key === ' ') {
        e.preventDefault();
        flashcardArea.dispatchEvent(new CustomEvent('flashcard-flip'));
        return;
      }
    }

    // Two-key sequences (g + key)
    if (pendingKey === 'g') {
      clearTimeout(pendingTimer.current);
      setPendingKey('');
      const shortcut = SHORTCUTS.find(s => s.key === `g ${key}`);
      if (shortcut?.action === 'navigate') navigate(shortcut.path);
      return;
    }

    if (key === 'g') {
      setPendingKey('g');
      pendingTimer.current = setTimeout(() => setPendingKey(''), 1500);
    }
  }, [navigate, pendingKey, onCommandPalette]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return { showHelp, setShowHelp, shortcuts: SHORTCUTS, pendingKey };
}

export function KeyboardShortcutsHelp({ show, onClose }) {
  if (!show) return null;
  return (
    <div className="kb-overlay" onClick={onClose}>
      <div className="kb-modal" onClick={e => e.stopPropagation()}>
        <div className="kb-header">
          <h3>⌨️ Keyboard Shortcuts</h3>
          <button className="kb-close" onClick={onClose}>✕</button>
        </div>
        <div className="kb-list">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="kb-item">
              <kbd className="kb-key">{s.key}</kbd>
              <span className="kb-desc">{s.description}</span>
            </div>
          ))}
        </div>
        <div className="kb-footer">Press <kbd className="kb-key">?</kbd> anytime to toggle this panel</div>
      </div>
    </div>
  );
}
