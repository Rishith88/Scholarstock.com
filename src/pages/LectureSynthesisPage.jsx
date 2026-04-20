import { useState, useRef } from 'react';

const SAMPLE_PODCASTS = [
  { id: 1, title: 'Introduction to Neural Networks', subject: 'Computer Science', duration: '12 min', icon: '🧠', speakers: 2, status: 'ready', description: 'A conversational deep-dive into how neurons, layers, and backpropagation work.' },
  { id: 2, title: 'The French Revolution: Causes & Effects', subject: 'History', duration: '18 min', icon: '🏛️', speakers: 3, status: 'ready', description: 'A lively debate-style discussion of the revolution from multiple perspectives.' },
  { id: 3, title: 'Organic Chemistry: Reaction Mechanisms', subject: 'Chemistry', duration: '15 min', icon: '⚗️', speakers: 2, status: 'ready', description: 'Two chemists explain SN1, SN2, E1, and E2 reactions with memorable analogies.' },
  { id: 4, title: 'Macroeconomics: GDP & Fiscal Policy', subject: 'Economics', duration: '20 min', icon: '📈', speakers: 2, status: 'ready', description: 'An engaging conversation about how governments manage economies.' },
];

const VOICES = [
  { id: 'professor', name: 'Professor', icon: '👨‍🏫', desc: 'Authoritative, detailed explanations' },
  { id: 'student', name: 'Curious Student', icon: '🧑‍🎓', desc: 'Asks clarifying questions' },
  { id: 'expert', name: 'Industry Expert', icon: '👩‍💼', desc: 'Real-world applications' },
  { id: 'comedian', name: 'Fun Narrator', icon: '🎭', desc: 'Makes learning entertaining' },
];

const FORMATS = [
  { id: 'lecture', name: 'Lecture Style', icon: '🎓', desc: 'Single speaker, in-depth' },
  { id: 'conversation', name: 'Conversation', icon: '💬', desc: 'Two speakers discussing' },
  { id: 'debate', name: 'Debate', icon: '⚔️', desc: 'Multiple viewpoints clash' },
  { id: 'interview', name: 'Interview', icon: '🎙️', desc: 'Q&A with an expert' },
  { id: 'storytelling', name: 'Story Mode', icon: '📖', desc: 'Narrative-driven learning' },
];

export default function LectureSynthesisPage() {
  const [tab, setTab] = useState('generate');
  const [inputText, setInputText] = useState('');
  const [selectedVoices, setSelectedVoices] = useState(['professor', 'student']);
  const [format, setFormat] = useState('conversation');
  const [duration, setDuration] = useState('10');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);

  const toggleVoice = (v) => setSelectedVoices(prev => prev.includes(v) ? prev.filter(x => x !== v) : prev.length < 3 ? [...prev, v] : prev);

  const handleGenerate = () => {
    if (inputText.trim().length < 30) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerated({
        title: 'Your Custom Podcast',
        duration: `${duration} min`,
        speakers: selectedVoices.length,
        format: FORMATS.find(f => f.id === format)?.name,
        segments: [
          { time: '0:00', speaker: 'Professor', text: 'Welcome to today\'s episode. We\'re going to explore a fascinating topic...' },
          { time: '1:30', speaker: 'Student', text: 'That\'s really interesting! Can you explain how that works in practice?' },
          { time: '3:45', speaker: 'Professor', text: 'Great question. Let me break this down with an analogy...' },
          { time: '6:20', speaker: 'Student', text: 'So if I understand correctly, this means that...' },
          { time: '8:00', speaker: 'Professor', text: 'Exactly! And the implications of this are quite profound...' },
          { time: '9:30', speaker: 'Both', text: 'Summary and key takeaways for your exam preparation.' },
        ]
      });
      setGenerating(false);
      setTab('library');
      if(window.ssSound) window.ssSound('success');
    }, 3500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setInputText(ev.target.result);
    reader.readAsText(file);
  };

  const togglePlay = (id) => {
    if (playing === id) { setPlaying(null); } 
    else { setPlaying(id); setProgress(0); if(window.ssSound) window.ssSound('click'); }
  };

  return (
    <div className="sec page-enter" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Listen & Learn</div>
      <h2 className="sec-title">🎙️ AI Podcast & Lecture Synthesizer</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ id: 'generate', icon: '✨', label: 'Generate New' }, { id: 'library', icon: '📚', label: 'My Library' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '.6rem 1.2rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', background: tab === t.id ? 'linear-gradient(135deg,var(--blue),var(--purple))' : 'var(--glass)', color: tab === t.id ? '#fff' : 'var(--muted)', fontSize: '.85rem', transition: 'all .3s' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Generate Tab */}
      {tab === 'generate' && (
        <div style={{ maxWidth: '900px' }}>
          {/* Input */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>📄 Source Material</h3>
              <div style={{ display: 'flex', gap: '.5rem' }}>
                <input ref={fileRef} type="file" accept=".txt,.md,.pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
                <button onClick={() => fileRef.current.click()} style={{ padding: '.4rem .8rem', borderRadius: '8px', border: '1px solid var(--gb)', background: 'var(--glass)', color: 'var(--muted)', cursor: 'pointer', fontSize: '.78rem', fontWeight: 600, fontFamily: 'inherit' }}>📎 Upload File</button>
              </div>
            </div>
            <textarea value={inputText} onChange={e => setInputText(e.target.value)}
              placeholder="Paste your lecture notes, PDF content, or study material here... (min 30 characters)"
              style={{ width: '100%', minHeight: '180px', background: 'rgba(255,255,255,.04)', border: '1px solid var(--gb)', borderRadius: '14px', padding: '1.2rem', color: 'var(--white)', fontSize: '.9rem', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.7, resize: 'vertical', outline: 'none' }} />
            <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.5rem' }}>{inputText.split(/\s+/).filter(Boolean).length} words</div>
          </div>

          {/* Format Selection */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>🎬 Podcast Format</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '.8rem' }}>
              {FORMATS.map(f => (
                <button key={f.id} onClick={() => setFormat(f.id)}
                  style={{ padding: '1rem', borderRadius: '14px', border: format === f.id ? '2px solid var(--blue)' : '1px solid var(--gb)', background: format === f.id ? 'rgba(59,130,246,.12)' : 'var(--glass)', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', color: 'var(--white)', transition: 'all .2s' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '.3rem' }}>{f.icon}</div>
                  <div style={{ fontSize: '.8rem', fontWeight: 700 }}>{f.name}</div>
                  <div style={{ fontSize: '.65rem', color: 'var(--muted)' }}>{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selection */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>🗣️ AI Speakers <span style={{ fontSize: '.75rem', color: 'var(--muted)', fontWeight: 400 }}>(Select up to 3)</span></h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '.8rem' }}>
              {VOICES.map(v => (
                <button key={v.id} onClick={() => toggleVoice(v.id)}
                  style={{ padding: '1rem', borderRadius: '14px', border: selectedVoices.includes(v.id) ? '2px solid var(--purple)' : '1px solid var(--gb)', background: selectedVoices.includes(v.id) ? 'rgba(139,92,246,.12)' : 'var(--glass)', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', color: 'var(--white)', transition: 'all .2s' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '.3rem' }}>{v.icon}</div>
                  <div style={{ fontSize: '.82rem', fontWeight: 700 }}>{v.name}</div>
                  <div style={{ fontSize: '.65rem', color: 'var(--muted)' }}>{v.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700 }}>⏱ Duration:</span>
            {['5', '10', '15', '20', '30'].map(d => (
              <button key={d} onClick={() => setDuration(d)}
                style={{ padding: '.5rem 1rem', borderRadius: '50px', border: 'none', background: duration === d ? 'rgba(59,130,246,.3)' : 'var(--glass)', color: duration === d ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 700, fontSize: '.85rem', fontFamily: 'inherit' }}>
                {d} min
              </button>
            ))}
          </div>

          <button className="btn btn-grad" onClick={handleGenerate} disabled={inputText.trim().length < 30 || generating}
            style={{ width: '100%', opacity: inputText.trim().length < 30 ? .5 : 1, fontSize: '1.1rem', padding: '1rem' }}>
            {generating ? '🎙️ AI is Generating Your Podcast...' : '🚀 Generate AI Podcast'}
          </button>

          {generating && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <div className="mock-loading-dots"><span /><span /><span /></div>
              <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginTop: '1rem' }}>Synthesizing voices, structuring content, and mastering audio...</p>
            </div>
          )}
        </div>
      )}

      {/* Library Tab */}
      {tab === 'library' && (
        <div>
          {generated && (
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', borderLeft: '4px solid var(--green)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '.68rem', padding: '.2rem .5rem', borderRadius: '4px', background: 'rgba(16,185,129,.15)', color: 'var(--green)', fontWeight: 700, marginRight: '.5rem' }}>NEW</span>
                  <strong>{generated.title}</strong>
                </div>
                <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{generated.duration} · {generated.speakers} speakers · {generated.format}</span>
              </div>
              {/* Transcript Segments */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                {generated.segments.map((seg, i) => (
                  <div key={i} style={{ display: 'flex', gap: '.8rem', padding: '.6rem', background: 'rgba(255,255,255,.03)', borderRadius: '8px', fontSize: '.82rem' }}>
                    <span style={{ color: 'var(--blue2)', fontWeight: 700, fontFamily: 'monospace', minWidth: '40px' }}>{seg.time}</span>
                    <span style={{ color: 'var(--purple)', fontWeight: 700, minWidth: '70px' }}>{seg.speaker}</span>
                    <span style={{ color: 'var(--muted)' }}>{seg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
            {SAMPLE_PODCASTS.map(pod => (
              <div key={pod.id} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', transition: 'all .3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '55px', height: '55px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(59,130,246,.2), rgba(139,92,246,.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>{pod.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: '.2rem' }}>{pod.title}</h3>
                    <div style={{ display: 'flex', gap: '.8rem', fontSize: '.72rem', color: 'var(--muted)' }}>
                      <span>{pod.subject}</span>
                      <span>⏱ {pod.duration}</span>
                      <span>🗣️ {pod.speakers} speakers</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '.8rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem' }}>{pod.description}</p>

                {/* Player */}
                <div style={{ background: 'rgba(0,0,0,.2)', borderRadius: '10px', padding: '.8rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => togglePlay(pod.id)}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--purple))', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {playing === pod.id ? '⏸' : '▶'}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: playing === pod.id ? '35%' : '0%', background: 'linear-gradient(90deg, var(--blue), var(--purple))', borderRadius: '2px', transition: 'width .3s' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '.72rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{pod.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
