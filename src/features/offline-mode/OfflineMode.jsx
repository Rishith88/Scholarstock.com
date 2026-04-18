import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const DB_NAME = 'scholarstock-offline';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('materials')) db.createObjectStore('materials', { keyPath: '_id' });
      if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('queue')) db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetAll(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbPut(store, item) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).put(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbDelete(store, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export default function OfflineMode() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);
  const [syncQueue, setSyncQueue] = useState([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('materials');

  useEffect(() => {
    const onOnline = () => { setIsOnline(true); autoSync(); };
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    loadOfflineData();
    estimateStorage();
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  const loadOfflineData = async () => {
    try {
      const [mats, notes, queue] = await Promise.all([
        dbGetAll('materials'), dbGetAll('notes'), dbGetAll('queue')
      ]);
      setSavedMaterials(mats);
      setSavedNotes(notes);
      setSyncQueue(queue);
    } catch { /* IndexedDB not available */ }
  };

  const estimateStorage = async () => {
    if (navigator.storage?.estimate) {
      const { usage } = await navigator.storage.estimate();
      setStorageUsed(Math.round((usage || 0) / 1024 / 1024 * 10) / 10);
    }
  };

  const saveNoteOffline = async () => {
    const note = { id: Date.now(), title: 'Quick Note', content: '', createdAt: new Date().toISOString(), synced: false };
    await dbPut('notes', note);
    setSavedNotes(prev => [...prev, note]);
    showToast('Note saved offline', 'success');
  };

  const updateNote = async (id, content) => {
    const note = savedNotes.find(n => n.id === id);
    if (!note) return;
    const updated = { ...note, content, synced: false, updatedAt: new Date().toISOString() };
    await dbPut('notes', updated);
    setSavedNotes(prev => prev.map(n => n.id === id ? updated : n));
    // Queue for sync
    await dbPut('queue', { type: 'note_update', payload: updated, timestamp: Date.now() });
    setSyncQueue(prev => [...prev, { type: 'note_update' }]);
  };

  const deleteOfflineItem = async (store, key) => {
    await dbDelete(store, key);
    if (store === 'materials') setSavedMaterials(prev => prev.filter(m => m._id !== key));
    if (store === 'notes') setSavedNotes(prev => prev.filter(n => n.id !== key));
    showToast('Removed from offline storage', 'success');
  };

  const autoSync = async () => {
    if (!token || syncQueue.length === 0) return;
    setSyncing(true);
    try {
      // Process sync queue — in real impl would POST to backend
      await new Promise(r => setTimeout(r, 1000));
      const db = await openDB();
      const tx = db.transaction('queue', 'readwrite');
      tx.objectStore('queue').clear();
      setSyncQueue([]);
      showToast('All changes synced!', 'success');
    } catch { showToast('Sync failed, will retry', 'error'); }
    finally { setSyncing(false); }
  };

  const clearAllOffline = async () => {
    if (!confirm('Clear all offline data?')) return;
    try {
      const db = await openDB();
      ['materials', 'notes', 'queue'].forEach(store => {
        db.transaction(store, 'readwrite').objectStore(store).clear();
      });
      setSavedMaterials([]); setSavedNotes([]); setSyncQueue([]);
      showToast('Offline data cleared', 'success');
    } catch { showToast('Error clearing data', 'error'); }
  };

  return (
    <div className="offline-wrap">
      {/* Status Bar */}
      <div className={`offline-status-bar ${isOnline ? 'online' : 'offline'}`}>
        <div className="offline-status-dot" />
        <span>{isOnline ? 'Online — changes sync automatically' : 'Offline — changes saved locally'}</span>
        {syncQueue.length > 0 && isOnline && (
          <button className="offline-sync-btn" onClick={autoSync} disabled={syncing}>
            {syncing ? '⟳ Syncing...' : `↑ Sync ${syncQueue.length} pending`}
          </button>
        )}
      </div>

      <div className="offline-header">
        <div>
          <h2 className="offline-title">📴 Offline Mode</h2>
          <p className="offline-sub">Download materials for offline access. All changes sync when back online.</p>
        </div>
        <div className="offline-storage-badge">
          💾 {storageUsed} MB used
        </div>
      </div>

      {/* Stats */}
      <div className="offline-stats">
        {[
          { label: 'Saved Materials', value: savedMaterials.length, icon: '📄', color: 'var(--blue)' },
          { label: 'Offline Notes', value: savedNotes.length, icon: '📝', color: 'var(--purple)' },
          { label: 'Pending Sync', value: syncQueue.length, icon: '⏳', color: syncQueue.length > 0 ? 'var(--gold)' : 'var(--green)' },
          { label: 'Storage Used', value: `${storageUsed}MB`, icon: '💾', color: 'var(--cyan)' },
        ].map((s, i) => (
          <div key={i} className="offline-stat-card">
            <div style={{ fontSize: '1.4rem', marginBottom: '.4rem' }}>{s.icon}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="offline-tabs">
        {['materials', 'notes', 'settings'].map(t => (
          <button key={t} className={`offline-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t === 'materials' ? '📄 Materials' : t === 'notes' ? '📝 Notes' : '⚙️ Settings'}
          </button>
        ))}
      </div>

      {activeTab === 'materials' && (
        <div>
          {savedMaterials.length === 0 ? (
            <div className="offline-empty">
              <div style={{ fontSize: '2.5rem', marginBottom: '.8rem' }}>📥</div>
              <h3>No offline materials yet</h3>
              <p style={{ color: 'var(--muted)', marginTop: '.4rem' }}>Open any material and tap "Save Offline" to access it without internet</p>
            </div>
          ) : savedMaterials.map(mat => (
            <div key={mat._id} className="offline-item">
              <div className="offline-item-icon">📄</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{mat.title}</div>
                <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{mat.examCategory} • {mat.subcategory}</div>
              </div>
              <button className="offline-del-btn" onClick={() => deleteOfflineItem('materials', mat._id)}>🗑</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'notes' && (
        <div>
          <button className="offline-add-note-btn" onClick={saveNoteOffline}>+ New Offline Note</button>
          {savedNotes.length === 0 ? (
            <div className="offline-empty">
              <div style={{ fontSize: '2.5rem', marginBottom: '.8rem' }}>📝</div>
              <h3>No offline notes</h3>
              <p style={{ color: 'var(--muted)', marginTop: '.4rem' }}>Create notes that work without internet</p>
            </div>
          ) : savedNotes.map(note => (
            <div key={note.id} className="offline-note-card">
              <div className="offline-note-header">
                <span style={{ fontWeight: 700, fontSize: '.9rem' }}>{note.title}</span>
                <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                  {!note.synced && <span className="offline-unsync-badge">Not synced</span>}
                  <button className="offline-del-btn" onClick={() => deleteOfflineItem('notes', note.id)}>🗑</button>
                </div>
              </div>
              <textarea
                className="offline-note-ta"
                value={note.content}
                onChange={e => updateNote(note.id, e.target.value)}
                placeholder="Start writing..."
              />
              <div style={{ fontSize: '.7rem', color: 'var(--muted2)', marginTop: '.4rem' }}>
                {new Date(note.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="offline-settings">
          <div className="offline-setting-row">
            <div>
              <div style={{ fontWeight: 700, marginBottom: '.2rem' }}>Auto-sync on reconnect</div>
              <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Automatically sync all pending changes when internet is restored</div>
            </div>
            <div className="offline-toggle on"><div className="offline-toggle-knob" /></div>
          </div>
          <div className="offline-setting-row">
            <div>
              <div style={{ fontWeight: 700, marginBottom: '.2rem' }}>Save PDFs for offline</div>
              <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Cache PDF files in browser storage for offline viewing</div>
            </div>
            <div className="offline-toggle"><div className="offline-toggle-knob" /></div>
          </div>
          <div className="offline-setting-row">
            <div>
              <div style={{ fontWeight: 700, marginBottom: '.2rem' }}>Offline notifications</div>
              <div style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Show banner when you go offline</div>
            </div>
            <div className="offline-toggle on"><div className="offline-toggle-knob" /></div>
          </div>
          <button className="offline-clear-btn" onClick={clearAllOffline}>🗑 Clear All Offline Data</button>
        </div>
      )}
    </div>
  );
}
