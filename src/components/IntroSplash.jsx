import { useEffect, useRef, useState } from 'react';

// ── Web Audio sound engine ──
function createSoundEngine() {
  let ctx = null;
  const getCtx = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  };

  const play = (freq, start, dur, vol = 0.08, type = 'sine') => {
    try {
      const c = getCtx();
      const o = c.createOscillator();
      const g = c.createGain();
      const rev = c.createConvolver ? null : null; // skip reverb for perf
      o.type = type;
      o.connect(g);
      g.connect(c.destination);
      o.frequency.setValueAtTime(freq, c.currentTime + start);
      g.gain.setValueAtTime(0, c.currentTime + start);
      g.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
      o.start(c.currentTime + start);
      o.stop(c.currentTime + start + dur + 0.05);
    } catch (e) {}
  };

  return {
    intro() {
      // Epic intro fanfare — rising arpeggio + bass hit
      const notes = [261, 329, 392, 523, 659, 784, 1047];
      notes.forEach((f, i) => play(f, i * 0.07, 0.3, 0.05 + i * 0.005));
      // Bass thud
      play(80, 0, 0.4, 0.12, 'triangle');
      play(60, 0.05, 0.5, 0.08, 'triangle');
      // Shimmer
      [2093, 2637, 3136].forEach((f, i) => play(f, 0.4 + i * 0.06, 0.2, 0.02));
    },
    whoosh() {
      try {
        const c = getCtx();
        const buf = c.createBuffer(1, c.sampleRate * 0.4, c.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        const src = c.createBufferSource();
        const filt = c.createBiquadFilter();
        const g = c.createGain();
        src.buffer = buf;
        filt.type = 'bandpass';
        filt.frequency.setValueAtTime(200, c.currentTime);
        filt.frequency.exponentialRampToValueAtTime(4000, c.currentTime + 0.4);
        filt.Q.value = 0.5;
        src.connect(filt); filt.connect(g); g.connect(c.destination);
        g.gain.setValueAtTime(0.15, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
        src.start(); src.stop(c.currentTime + 0.4);
      } catch (e) {}
    },
    click() { play(600, 0, 0.08, 0.06); play(400, 0.04, 0.06, 0.04); },
    hover() { play(900, 0, 0.04, 0.02); },
    success() { [523, 659, 784, 1047].forEach((f, i) => play(f, i * 0.08, 0.2, 0.05)); },
    nav() { play(440, 0, 0.06, 0.03); play(550, 0.04, 0.08, 0.03); },
  };
}

export const sound = createSoundEngine();

// ── Particle canvas ──
function ParticleCanvas({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.5,
      r: Math.random() * 3 + 1,
      alpha: Math.random(),
      color: ['#3b82f6', '#8b5cf6', '#06b6d4', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 5)],
      life: Math.random(),
      decay: Math.random() * 0.008 + 0.003,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.life = 1;
          p.vy = -(Math.random() * 2 + 0.5);
          p.vx = (Math.random() - 0.5) * 1.5;
        }
        ctx.save();
        ctx.globalAlpha = p.life * 0.8;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}

// ── Main splash component ──
export default function IntroSplash({ onDone }) {
  const [phase, setPhase] = useState('enter'); // enter → text → exit
  const [lettersDone, setLettersDone] = useState(false);
  const hasPlayed = useRef(false);

  const letters = 'ScholarStock'.split('');

  useEffect(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;

    // Phase 1: particles + whoosh
    sound.whoosh();
    setTimeout(() => sound.intro(), 200);

    // Phase 2: letters done
    setTimeout(() => setLettersDone(true), 1400);

    // Phase 3: exit
    setTimeout(() => setPhase('exit'), 2400);

    // Phase 4: unmount
    setTimeout(() => onDone(), 3000);
  }, []);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'radial-gradient(ellipse at center, #0a1628 0%, #020817 70%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
        animation: phase === 'exit' ? 'splashExit .6s cubic-bezier(.4,0,.2,1) forwards' : 'splashEnter .4s ease forwards',
      }}
    >
      <style>{`
        @keyframes splashEnter { from{opacity:0} to{opacity:1} }
        @keyframes splashExit { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(1.08)} }
        @keyframes letterDrop {
          0%{opacity:0;transform:translateY(-60px) rotateX(90deg) scale(.5)}
          60%{transform:translateY(8px) rotateX(-10deg) scale(1.05)}
          100%{opacity:1;transform:translateY(0) rotateX(0) scale(1)}
        }
        @keyframes glowPulse {
          0%,100%{text-shadow:0 0 20px rgba(59,130,246,.6),0 0 60px rgba(139,92,246,.3)}
          50%{text-shadow:0 0 40px rgba(59,130,246,.9),0 0 100px rgba(139,92,246,.6),0 0 140px rgba(6,182,212,.3)}
        }
        @keyframes taglineIn {
          from{opacity:0;transform:translateY(20px) scale(.9)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes ringPulse {
          0%{transform:scale(.8);opacity:.8}
          100%{transform:scale(2.5);opacity:0}
        }
        @keyframes orbSpin {
          from{transform:rotate(0deg) translateX(120px) rotate(0deg)}
          to{transform:rotate(360deg) translateX(120px) rotate(-360deg)}
        }
      `}</style>

      <ParticleCanvas active />

      {/* Pulsing rings */}
      {[0, 0.3, 0.6].map((delay, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 300, height: 300,
          borderRadius: '50%',
          border: '1px solid rgba(59,130,246,.3)',
          animation: `ringPulse 2s ${delay}s ease-out infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Orbiting dots */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 8, height: 8,
          borderRadius: '50%',
          background: ['#3b82f6','#8b5cf6','#06b6d4','#60a5fa','#a78bfa'][i],
          boxShadow: `0 0 12px ${['#3b82f6','#8b5cf6','#06b6d4','#60a5fa','#a78bfa'][i]}`,
          animation: `orbSpin ${2 + i * 0.3}s ${i * 0.2}s linear infinite`,
          transformOrigin: '0 0',
          left: '50%', top: '50%',
          transform: `rotate(${deg}deg) translateX(120px)`,
        }} />
      ))}

      {/* Logo letters */}
      <div style={{
        display: 'flex', gap: '2px',
        perspective: '600px',
        marginBottom: '1.5rem',
      }}>
        {letters.map((l, i) => (
          <span key={i} style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 900,
            background: i < 7
              ? 'linear-gradient(135deg, #fff 0%, #60a5fa 50%, #a78bfa 100%)'
              : 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: 0,
            display: 'inline-block',
            animation: `letterDrop .5s cubic-bezier(.34,1.56,.64,1) ${i * 0.06 + 0.2}s forwards`,
            ...(lettersDone ? { animation: `letterDrop .5s cubic-bezier(.34,1.56,.64,1) ${i * 0.06 + 0.2}s forwards, glowPulse 2s ease-in-out infinite` } : {}),
          }}>
            {l}
          </span>
        ))}
      </div>

      {/* Tagline */}
      <div style={{
        color: 'rgba(148,163,184,.9)',
        fontSize: 'clamp(.9rem, 2.5vw, 1.1rem)',
        fontWeight: 500,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        opacity: 0,
        animation: 'taglineIn .6s ease 1.2s forwards',
      }}>
        Study Smarter · Pay Less
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 3,
        background: 'linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, #06b6d4, transparent)',
        animation: 'taglineIn .4s ease .8s forwards',
        opacity: 0,
      }} />
    </div>
  );
}
