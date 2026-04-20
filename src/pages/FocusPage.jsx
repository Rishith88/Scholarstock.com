import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FocusPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('work'); // work | break | long-break
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);
  
  const MODES = {
    work: { min: 25, label: 'Deep Work', color: 'var(--blue)', icon: '🧠' },
    break: { min: 5, label: 'Short Break', color: 'var(--green)', icon: '☕' },
    'long-break': { min: 15, label: 'Long Break', color: 'var(--purple)', icon: '🌅' }
  };

  const playSound = (type) => window.ssSound?.(type);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    playSound('success');
    if (mode === 'work') {
      const nextCycles = cycles + 1;
      setCycles(nextCycles);
      if (nextCycles % 4 === 0) switchMode('long-break');
      else switchMode('break');
    } else {
      switchMode('work');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].min * 60);
    setIsActive(false);
    playSound('toggle');
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    playSound('click');
  };

  const resetTimer = () => {
    setTimeLeft(MODES[mode].min * 60);
    setIsActive(false);
    playSound('click');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // YouTube IDs for Lo-Fi channels
  const LofiChannels = [
    { id: 'jfKfPfyJRdk', name: 'Lofi Girl - Study Beat' },
    { id: '4xDzrJKXOOY', name: 'Synthwave Radio' },
    { id: 'tfVvpxmU_7A', name: 'Ambient Rain' },
  ];
  const [activeChannel, setActiveChannel] = useState(LofiChannels[0]);

  return (
    <div className="sec focus-mode-container" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Peak Productivity</div>
      <h2 className="sec-title">✨ Focus Center</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        
        {/* Left Side: Timer & Controls */}
        <div className="focus-card glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '30px', position: 'relative', overflow: 'hidden' }}>
          <div className="focus-visuals">
             <div className="focus-glow" style={{ background: MODES[mode].color }}></div>
          </div>
          
          <div className="focus-mode-selector" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            {Object.entries(MODES).map(([key, m]) => (
              <button 
                key={key} 
                className={`focus-tab ${mode === key ? 'active' : ''}`}
                onClick={() => switchMode(key)}
                style={{ 
                   background: mode === key ? m.color : 'var(--glass)',
                   color: mode === key ? 'white' : 'var(--muted)',
                   border: 'none', padding: '0.6rem 1.2rem', borderRadius: '50px',
                   cursor: 'pointer', transition: 'all 0.3s', fontWeight: 700
                }}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          <div className="timer-display" style={{ 
            fontSize: '8rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", 
            margin: '2rem 0', color: 'var(--white)', textShadow: `0 10px 40px ${MODES[mode].color}44`
          }}>
            {formatTime(timeLeft)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <button className="btn btn-grad" onClick={toggleTimer} style={{ minWidth: '160px', fontSize: '1.2rem' }}>
              {isActive ? '⏸ Pause' : '▶ Start Focus'}
            </button>
            <button className="btn btn-ghost" onClick={resetTimer} style={{ width: '60px', height: '60px', padding: 0, borderRadius: '50%' }}>
              🔄
            </button>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--muted2)' }}>
            Cycles completed: <strong style={{ color: 'var(--blue2)' }}>{cycles}</strong>
          </div>
        </div>

        {/* Right Side: Music & Ambient */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🎵 Ambient Hub</h4>
            <div style={{ borderRadius: '15px', overflow: 'hidden', height: '180px', background: '#000' }}>
               <iframe 
                width="100%" height="100%" 
                src={`https://www.youtube.com/embed/${activeChannel.id}?autoplay=1&mute=0`} 
                title="Study Music" frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {LofiChannels.map(ch => (
                <button 
                  key={ch.id} 
                  onClick={() => { setActiveChannel(ch); playSound('click'); }}
                  style={{ 
                    textAlign: 'left', padding: '0.8rem', borderRadius: '10px', 
                    background: activeChannel.id === ch.id ? 'var(--gb)' : 'transparent',
                    border: '1px solid var(--gb)', color: activeChannel.id === ch.id ? 'var(--blue2)' : 'var(--muted)',
                    cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'
                  }}
                >
                  {activeChannel.id === ch.id ? '🔊' : '📁'} {ch.name}
                </button>
              ))}
            </div>
          </div>

          <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
            <h4 style={{ marginBottom: '0.8rem' }}>🎯 Today's Intent</h4>
            <textarea 
              placeholder="What are you mastering today?" 
              style={{ 
                width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--gb)', 
                borderRadius: '10px', padding: '1rem', color: 'var(--white)', height: '100px',
                fontFamily: 'inherit', resize: 'none', fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

      </div>

      <style>{`
        .focus-mode-container { animation: fadeIn 0.8s ease-out; }
        .focus-glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 300px; height: 300px; border-radius: 50%; filter: blur(100px); opacity: 0.15;
          z-index: 0; transition: background 0.5s;
        }
        .timer-display { position: relative; z-index: 1; }
        .focus-tab.active { box-shadow: 0 0 20px rgba(59,130,246,0.2); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
