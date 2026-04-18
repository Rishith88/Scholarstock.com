import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import API_URL from '../../config';

export default function CollaborativeStudyRooms() {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [view, setView] = useState('list');
  const [rooms, setRooms] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('public');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', subject: '', isPrivate: false, maxMembers: 10 });
  const [showJoin, setShowJoin] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const messagesEndRef = useRef(null);
  const [notes, setNotes] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);
  const notesTimer = useRef(null);
  const [activePanel, setActivePanel] = useState('chat');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#3b82f6');
  const [drawSize, setDrawSize] = useState(3);
  const lastPos = useRef(null);
  const pollRef = useRef(null);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  const fetchRooms = useCallback(async () => {
    if (!token) {
      console.warn('No token available for study rooms - user must log in first');
      return;
    }
    try {
      const headers = authHeaders();
      console.log('Fetching rooms with token:', token.substring(0, 20) + '...');
      
      const [pubRes, myRes] = await Promise.all([
        fetch(`${API_URL}/api/study-rooms?search=${encodeURIComponent(search)}`, { headers }),
        fetch(`${API_URL}/api/study-rooms/my`, { headers }),
      ]);
      
      if (!pubRes.ok) {
        console.error('Public rooms fetch failed:', pubRes.status, pubRes.statusText);
        if (pubRes.status === 401) {
          showToast('Session expired. Please log in again.', 'error');
          return;
        }
        showToast(`Failed to load rooms: ${pubRes.status}`, 'error');
        return;
      }
      if (!myRes.ok) {
        console.error('My rooms fetch failed:', myRes.status, myRes.statusText);
        showToast(`Failed to load your rooms: ${myRes.status}`, 'error');
        return;
      }
      
      const pubData = await pubRes.json();
      const myData = await myRes.json();
      if (pubData.success) setRooms(pubData.rooms || []);
      if (myData.success) setMyRooms(myData.rooms || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      showToast('Error loading rooms: ' + err.message, 'error');
    }
  }, [token, search, authHeaders, showToast]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const pollRoom = useCallback(async () => {
    if (!activeRoom?._id || !token) return;
    try {
      const res = await fetch(`${API_URL}/api/study-rooms/${activeRoom._id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setMessages(data.room.messages?.slice(-50) || []);
        setNotes(data.room.sharedNotes || '');
        setActiveRoom(prev => ({ ...prev, members: data.room.members }));
      }
    } catch { /* silent */ }
  }, [activeRoom?._id, token, authHeaders]);

  useEffect(() => {
    if (view === 'room') pollRef.current = setInterval(pollRoom, 3000);
    return () => clearInterval(pollRef.current);
  }, [view, pollRoom]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const enterRoom = useCallback(async (room) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/study-rooms/${room._id}`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setActiveRoom(data.room);
        setMessages(data.room.messages?.slice(-50) || []);
        setNotes(data.room.sharedNotes || '');
        setView('room');
      } else showToast(data.message || 'Cannot enter room', 'error');
    } catch (err) {
      console.error('Error entering room:', err);
      showToast('Connection error: ' + err.message, 'error');
    }
    finally { setLoading(false); }
  }, [authHeaders, showToast]);

  const createRoom = useCallback(async (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;
    if (!token) {
      showToast('You must be logged in to create a room', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/study-rooms`, { 
        method: 'POST', 
        headers: authHeaders(), 
        body: JSON.stringify(createForm) 
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        showToast(errorData.message || `Failed to create room (${res.status})`, 'error');
        console.error('Create room failed:', res.status, errorData);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      if (data.success) {
        showToast('Room created!', 'success');
        setShowCreate(false);
        setCreateForm({ name: '', description: '', subject: '', isPrivate: false, maxMembers: 10 });
        await enterRoom(data.room);
      } else showToast(data.message || 'Failed to create room', 'error');
    } catch (err) {
      console.error('Create room error:', err);
      showToast('Connection error: ' + err.message, 'error');
    }
    finally { setLoading(false); }
  }, [token, createForm, authHeaders, showToast, enterRoom]);

  const joinByCode = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/study-rooms/join`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ inviteCode: inviteCode.trim().toUpperCase() }) });
      const data = await res.json();
      if (data.success) { 
        showToast('Joined!', 'success'); 
        setShowJoin(false); 
        setInviteCode(''); 
        await enterRoom(data.room); 
      }
      else showToast(data.message || 'Invalid code', 'error');
    } catch (err) {
      console.error('Join by code error:', err);
      showToast('Connection error: ' + err.message, 'error');
    }
    finally { setLoading(false); }
  }, [inviteCode, authHeaders, showToast, enterRoom]);

  const joinRoom = useCallback(async (room) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/study-rooms/${room._id}/join`, { method: 'POST', headers: authHeaders() });
      const data = await res.json();
      if (data.success) await enterRoom(room);
      else showToast(data.message || 'Failed to join', 'error');
    } catch (err) {
      console.error('Join room error:', err);
      showToast('Connection error: ' + err.message, 'error');
    }
    finally { setLoading(false); }
  }, [authHeaders, showToast, enterRoom]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || sendingMsg) return;
    const text = chatInput.trim();
    setChatInput('');
    setSendingMsg(true);
    try {
      const res = await fetch(`${API_URL}/api/study-rooms/${activeRoom._id}/message`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ text }) });
      const data = await res.json();
      if (data.success) setMessages(prev => [...prev, data.message]);
    } catch { /* silent */ }
    finally { setSendingMsg(false); }
  };

  const handleNotesChange = (val) => {
    setNotes(val);
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(async () => {
      setNotesSaving(true);
      try { await fetch(`${API_URL}/api/study-rooms/${activeRoom._id}/notes`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ notes: val }) }); }
      catch { /* silent */ }
      finally { setNotesSaving(false); }
    }, 1200);
  };

  const leaveRoom = async () => {
    try { await fetch(`${API_URL}/api/study-rooms/${activeRoom._id}/leave`, { method: 'DELETE', headers: authHeaders() }); }
    catch { /* silent */ }
    clearInterval(pollRef.current);
    setView('list'); setActiveRoom(null); setMessages([]);
    fetchRooms();
  };

  const startDraw = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(x, y);
    ctx.strokeStyle = drawColor; ctx.lineWidth = drawSize; ctx.lineCap = 'round'; ctx.stroke();
    lastPos.current = { x, y };
  };
  const stopDraw = () => setIsDrawing(false);
  const clearCanvas = () => canvasRef.current?.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

  const isMember = (room) => room?.members?.some(m => m.userId?.toString() === user?._id?.toString());
  const displayedRooms = tab === 'my' ? myRooms : rooms;

  if (!token) return (
    <div className="sr-empty"><div style={{ fontSize: '3rem' }}>🔒</div><h3>Login to access Study Rooms</h3></div>
  );

  if (view === 'room' && activeRoom) return (
    <div className="sr-room">
      <div className="sr-room-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="sr-back-btn" onClick={leaveRoom}>← Leave</button>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{activeRoom.name}</div>
            <div style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{activeRoom.members?.length || 0} members{activeRoom.isPrivate && ' • 🔒 Private'}</div>
          </div>
        </div>
        {activeRoom.inviteCode && (
          <div className="sr-invite-badge" onClick={() => { navigator.clipboard?.writeText(activeRoom.inviteCode); showToast('Code copied!', 'success'); }}>
            🔗 {activeRoom.inviteCode}
          </div>
        )}
      </div>

      <div className="sr-panel-tabs">
        {['chat', 'notes', 'whiteboard', 'members'].map(p => (
          <button key={p} className={`sr-panel-tab ${activePanel === p ? 'active' : ''}`} onClick={() => setActivePanel(p)}>
            {p === 'chat' ? '💬' : p === 'notes' ? '📝' : p === 'whiteboard' ? '🎨' : '👥'} {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {activePanel === 'chat' && (
        <div className="sr-chat">
          <div className="sr-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`sr-msg ${msg.type === 'system' ? 'system' : msg.userId?.toString() === user?._id?.toString() ? 'mine' : 'theirs'}`}>
                {msg.type !== 'system' && <div className="sr-msg-name">{msg.userId?.toString() === user?._id?.toString() ? 'You' : msg.userName}</div>}
                <div className="sr-msg-bubble">{msg.text}</div>
                {msg.type !== 'system' && <div className="sr-msg-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="sr-chat-input" onSubmit={sendMessage}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." disabled={sendingMsg} />
            <button type="submit" disabled={sendingMsg || !chatInput.trim()}>Send</button>
          </form>
        </div>
      )}

      {activePanel === 'notes' && (
        <div className="sr-notes-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.8rem' }}>
            <span style={{ fontSize: '.8rem', color: 'var(--muted)', fontWeight: 600 }}>📝 Shared Notes</span>
            {notesSaving && <span style={{ fontSize: '.75rem', color: 'var(--blue2)' }}>Saving...</span>}
          </div>
          <textarea className="sr-notes-ta" value={notes} onChange={e => handleNotesChange(e.target.value)} placeholder="Start typing shared notes..." />
        </div>
      )}

      {activePanel === 'whiteboard' && (
        <div className="sr-whiteboard">
          <div className="sr-wb-toolbar">
            {['#3b82f6','#10b981','#f59e0b','#ef4444','#a855f7','#ffffff','#000000'].map(c => (
              <button key={c} className={`sr-wb-color ${drawColor === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setDrawColor(c)} />
            ))}
            <select className="sr-wb-size" value={drawSize} onChange={e => setDrawSize(Number(e.target.value))}>
              {[2,4,8,14,20].map(s => <option key={s} value={s}>{s}px</option>)}
            </select>
            <button className="sr-wb-clear" onClick={clearCanvas}>Clear</button>
          </div>
          <canvas ref={canvasRef} className="sr-canvas" width={800} height={500}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} />
        </div>
      )}

      {activePanel === 'members' && (
        <div className="sr-members-panel">
          <div style={{ marginBottom: '1rem', fontSize: '.85rem', color: 'var(--muted)' }}>{activeRoom.members?.length || 0} / {activeRoom.maxMembers} members</div>
          {activeRoom.members?.map((m, i) => (
            <div key={i} className="sr-member-row">
              <div className="sr-member-avatar">{m.userName?.[0]?.toUpperCase() || '?'}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{m.userId?.toString() === user?._id?.toString() ? 'You' : m.userName}</div>
                <div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{m.role}</div>
              </div>
              <div className={`sr-online-dot ${m.isOnline ? 'online' : ''}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="sr-list">
      <div className="sr-list-header">
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '.3rem' }}>� Collaborative Study Rooms</h2>
          <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Real-time study rooms with shared notes, whiteboard & chat</p>
        </div>
        <div style={{ display: 'flex', gap: '.7rem' }}>
          <button className="sr-btn-outline" onClick={() => setShowJoin(true)}>🔗 Join by Code</button>
          <button className="sr-btn-primary" onClick={() => setShowCreate(true)}>+ Create Room</button>
        </div>
      </div>

      <div className="sr-controls">
        <div className="sr-tabs">
          <button className={`sr-tab ${tab === 'public' ? 'active' : ''}`} onClick={() => setTab('public')}>Public Rooms</button>
          <button className={`sr-tab ${tab === 'my' ? 'active' : ''}`} onClick={() => setTab('my')}>My Rooms</button>
        </div>
        <input className="sr-search" placeholder="Search rooms..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="sr-grid">
        {displayedRooms.length === 0 ? (
          <div className="sr-empty">
            <div style={{ fontSize: '2.5rem', marginBottom: '.8rem' }}>🏠</div>
            <p>{tab === 'my' ? "You haven't joined any rooms yet." : 'No public rooms found.'}</p>
            <button className="sr-btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowCreate(true)}>Create the first one</button>
          </div>
        ) : displayedRooms.map(room => (
          <div key={room._id} className="sr-card">
            <div className="sr-card-top">
              <div className="sr-card-icon">{room.isPrivate ? '🔒' : '🌐'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '.2rem' }}>{room.name}</div>
                {room.subject && <div style={{ fontSize: '.75rem', color: 'var(--blue2)' }}>{room.subject}</div>}
              </div>
              <div className="sr-member-count">👥 {room.members?.length || 0}/{room.maxMembers}</div>
            </div>
            {room.description && <p className="sr-card-desc">{room.description}</p>}
            <div className="sr-card-meta">
              <span>by {room.createdByName}</span>
              <span>{new Date(room.lastActivity).toLocaleDateString()}</span>
            </div>
            <div className="sr-card-actions">
              {isMember(room)
                ? <button className="sr-btn-primary" onClick={() => enterRoom(room)} disabled={loading}>Enter Room</button>
                : <button className="sr-btn-outline" onClick={() => joinRoom(room)} disabled={loading}>Join</button>}
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="sr-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="sr-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Create Study Room</h3>
            <form onSubmit={createRoom}>
              <div className="sr-form-group"><label>Room Name *</label><input value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. JEE Physics Group" required /></div>
              <div className="sr-form-group"><label>Description</label><input value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} placeholder="What will you study?" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="sr-form-group"><label>Subject</label><input value={createForm.subject} onChange={e => setCreateForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Physics" /></div>
                <div className="sr-form-group"><label>Max Members</label><input type="number" min={2} max={50} value={createForm.maxMembers} onChange={e => setCreateForm(p => ({ ...p, maxMembers: Number(e.target.value) }))} /></div>
              </div>
              <div className="sr-form-group"><label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer' }}><input type="checkbox" checked={createForm.isPrivate} onChange={e => setCreateForm(p => ({ ...p, isPrivate: e.target.checked }))} />Private room (invite code only)</label></div>
              <div style={{ display: 'flex', gap: '.8rem', marginTop: '1.5rem' }}>
                <button type="button" className="sr-btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="sr-btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Room'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJoin && (
        <div className="sr-modal-overlay" onClick={() => setShowJoin(false)}>
          <div className="sr-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Join by Invite Code</h3>
            <form onSubmit={joinByCode}>
              <div className="sr-form-group"><label>Invite Code</label><input value={inviteCode} onChange={e => setInviteCode(e.target.value.toUpperCase())} placeholder="e.g. A1B2C3D4" maxLength={8} style={{ letterSpacing: '3px', fontWeight: 700, fontSize: '1.1rem' }} required /></div>
              <div style={{ display: 'flex', gap: '.8rem', marginTop: '1.5rem' }}>
                <button type="button" className="sr-btn-outline" onClick={() => setShowJoin(false)}>Cancel</button>
                <button type="submit" className="sr-btn-primary" disabled={loading}>{loading ? 'Joining...' : 'Join Room'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
