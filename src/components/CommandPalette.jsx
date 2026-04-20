import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const COMMANDS = [
  { id: 'home', label: 'Go to Home', category: 'Navigation', action: () => window.location.href = '/' },
  { id: 'browse', label: 'Browse Materials', category: 'Navigation', action: () => window.location.href = '/browse' },
  { id: 'flashcards', label: 'Flashcards', category: 'Navigation', action: () => window.location.href = '/flashcards' },
  { id: 'study-rooms', label: 'Study Rooms', category: 'Navigation', action: () => window.location.href = '/study-rooms' },
  { id: 'dashboard', label: 'Dashboard', category: 'Navigation', action: () => window.location.href = '/dashboard' },
  { id: 'library', label: 'Library', category: 'Navigation', action: () => window.location.href = '/library' },
  { id: 'profile', label: 'Profile', category: 'Navigation', action: () => window.location.href = '/profile' },
  { id: 'cart', label: 'Shopping Cart', category: 'Navigation', action: () => window.location.href = '/cart' },
  { id: 'settings', label: 'Settings', category: 'Navigation', action: () => window.location.href = '/settings' },
  { id: 'theme-toggle', label: 'Toggle Dark Mode', category: 'Settings', action: () => document.documentElement.classList.toggle('dark') },
  { id: 'logout', label: 'Logout', category: 'Account', action: () => localStorage.removeItem('token') },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(COMMANDS);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIdx(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const results = COMMANDS.filter(cmd =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(results);
    setSelectedIdx(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIdx]) {
        filtered[selectedIdx].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-modal" onClick={e => e.stopPropagation()}>
        <div className="cmd-input-wrap">
          <span className="cmd-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            placeholder="Type a command..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="cmd-results">
          {filtered.length === 0 ? (
            <div className="cmd-empty">No commands found</div>
          ) : (
            filtered.map((cmd, idx) => (
              <div
                key={cmd.id}
                className={`cmd-item ${idx === selectedIdx ? 'selected' : ''}`}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
              >
                <div className="cmd-item-label">{cmd.label}</div>
                <div className="cmd-item-category">{cmd.category}</div>
              </div>
            ))
          )}
        </div>

        <div className="cmd-footer">
          <span>↑↓ Navigate</span>
          <span>Enter Execute</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
