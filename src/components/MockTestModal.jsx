import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

export default function MockTestModal({ isOpen, onClose, category = 'General Knowledge', subcategory = 'General' }) {
  const { token } = useAuth();
  const toast = useToast();

  const [screen, setScreen] = useState('setup'); // setup, loading, test, result
  const [qCount, setQCount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [timePerQ, setTimePerQ] = useState(60);
  const [qType, setQType] = useState('mcq');

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Timer logic
  useEffect(() => {
    if (screen !== 'test' || submitted || totalTime === 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, submitted, totalTime]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setScreen('setup');
      setQuestions([]);
      setCurrentQ(0);
      setAnswers({});
      setSubmitted(false);
    }
  }, [isOpen]);

  async function generateTest() {
    setScreen('loading');
    try {
      const response = await fetch(`${API_URL}/api/mocktest/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ category, subcategory, qCount, difficulty, qType })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions);

      const tt = timePerQ > 0 ? qCount * timePerQ : 0;
      setTotalTime(tt);
      setTimeLeft(tt);
      setAnswers({});
      setCurrentQ(0);
      setSubmitted(false);
      setScreen('test');

    } catch (err) {
      console.warn(err);
      toast('Failed to generate mock test. Please check API settings.', 'error');
      setScreen('setup');
    }
  }

  function handleSelect(i) {
    if (submitted) return;
    setAnswers({ ...answers, [currentQ]: i });
  }

  function handleSubmit() {
    setSubmitted(true);
    setScreen('result');
  }

  function formatTime(secs) {
    if (totalTime === 0) return '∞';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  if (!isOpen) return null;

  return (
    <div className="mock-modal on" onClick={(e) => e.target.className.includes('mock-modal') && onClose()}>
      <div className="mock-box" onClick={e => e.stopPropagation()}>
        <div className="mock-header">
          <h3>🧪 Mock Test</h3>
          <div className={`mock-timer ${timeLeft > 0 && timeLeft <= totalTime * 0.25 ? 'danger' : ''}`}>{screen === 'test' ? formatTime(timeLeft) : '--:--'}</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1, flexShrink: 0 }}>✕</button>
        </div>

        <div className="mock-body">
          {screen === 'setup' && (
            <div className="mock-setup">
              <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '1.5rem' }}>Configure your mock test for <strong style={{ color: 'var(--white)' }}>{category} — {subcategory}</strong></p>
              <div className="mock-setup-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '.5rem' }}>Number of Questions</label>
                  <select style={selectStyle} value={qCount} onChange={e => setQCount(parseInt(e.target.value))}>
                    <option value={5}>5 Questions (Quick)</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions (Full)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '.5rem' }}>Difficulty</label>
                  <select style={selectStyle} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '.5rem' }}>Time per Question</label>
                  <select style={selectStyle} value={timePerQ} onChange={e => setTimePerQ(parseInt(e.target.value))}>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={90}>90 seconds</option>
                    <option value={120}>2 minutes</option>
                    <option value={0}>No timer</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '.5rem' }}>Question Type</label>
                  <select style={selectStyle} value={qType} onChange={e => setQType(e.target.value)}>
                    <option value="mcq">Multiple Choice (MCQ)</option>
                    <option value="truefalse">True / False</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-grad" style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '1.5rem' }} onClick={generateTest}>
                🚀 Generate & Start Test
              </button>
            </div>
          )}

          {screen === 'loading' && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem' }}>Generating your test...</div>
              <div style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Claude AI is creating {qCount} {difficulty} questions on {subcategory}</div>
              <div className="mock-loading-dots" style={{ marginTop: '1rem' }}><span>●</span><span>●</span><span>●</span></div>
            </div>
          )}

          {screen === 'test' && questions.length > 0 && (
            <div>
              <div className="mock-progress" style={{ background: 'var(--gb)', height: '4px', borderRadius: '4px', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--blue)', width: `${(currentQ / questions.length) * 100}%`, height: '100%', transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: '.8rem', color: 'var(--blue2)', fontWeight: 700, marginBottom: '.5rem' }}>Question {currentQ + 1} of {questions.length}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5, marginBottom: '1.5rem' }}>{questions[currentQ].question}</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                {questions[currentQ].options.map((opt, i) => (
                  <div key={i} onClick={() => handleSelect(i)} style={{ padding: '1rem', border: `1px solid ${answers[currentQ] === i ? 'var(--blue)' : 'var(--gb)'}`, borderRadius: '10px', background: answers[currentQ] === i ? 'rgba(59,130,246,.1)' : 'var(--glass)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: answers[currentQ] === i ? 'var(--blue)' : 'var(--gb)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 700 }}>{['A','B','C','D'][i]}</div>
                    <span style={{ flex: 1, color: 'var(--white)' }}>{opt}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <button className="btn btn-ghost" onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}>← Prev</button>
                <div style={{ display: 'flex', gap: '.4rem' }}>
                  {questions.map((_, i) => (
                    <div key={i} onClick={() => setCurrentQ(i)} style={{ width: '24px', height: '24px', borderRadius: '4px', background: currentQ === i ? 'var(--blue)' : answers[i] !== undefined ? 'var(--gb)' : 'transparent', border: currentQ === i ? 'none' : '1px solid var(--gb)', color: currentQ === i ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', cursor: 'pointer' }}>{i + 1}</div>
                  ))}
                </div>
                {currentQ === questions.length - 1 ? (
                  <button className="btn btn-grad" onClick={handleSubmit}>Submit ✓</button>
                ) : (
                  <button className="btn btn-grad" onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}>Next →</button>
                )}
              </div>
            </div>
          )}

          {screen === 'result' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '.9rem', color: 'var(--muted)', marginBottom: '.3rem' }}>Your Score</div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--blue2)' }}>{Math.round((Object.values(answers).filter((a, i) => a === questions[i].correct).length / questions.length) * 100)}%</div>
                <div style={{ color: 'var(--muted)' }}>{Object.values(answers).filter((a, i) => a === questions[i].correct).length} out of {questions.length} correct</div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button className="btn btn-grad" style={{ flex: 1 }} onClick={generateTest}>🔄 Retry Test</button>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setScreen('setup')}>⚙️ New Settings</button>
              </div>

              <div style={{ borderTop: '1px solid var(--gb)', paddingTop: '1.5rem' }}>
                <div style={{ fontWeight: 800, marginBottom: '1rem' }}>📝 Answer Review</div>
                {questions.map((q, i) => {
                  const isCorrect = answers[i] === q.correct;
                  const isSkipped = answers[i] === undefined;
                  return (
                    <div key={i} style={{ background: isCorrect ? 'rgba(16,185,129,.05)' : isSkipped ? 'var(--glass)' : 'rgba(239,68,68,.05)', border: `1px solid ${isCorrect ? 'rgba(16,185,129,.3)' : isSkipped ? 'var(--gb)' : 'rgba(239,68,68,.3)'}`, borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '.5rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '.9rem' }}>Q{i + 1}. {q.question}</div>
                        <div style={{ fontWeight: 700, fontSize: '.75rem', color: isCorrect ? 'var(--green)' : isSkipped ? 'var(--muted)' : 'var(--red)', flexShrink: 0 }}>{isCorrect ? '✅ Correct' : isSkipped ? '⏭ Skipped' : '❌ Wrong'}</div>
                      </div>
                      {!isCorrect && !isSkipped && <div style={{ fontSize: '.8rem', color: 'var(--red)', marginBottom: '.3rem' }}>Your answer: {q.options[answers[i]]}</div>}
                      <div style={{ fontSize: '.8rem', color: 'var(--green)', marginBottom: '.8rem' }}>Correct answers: {q.options[q.correct]}</div>
                      {q.explanation && <div style={{ fontSize: '.8rem', color: 'var(--muted)', background: 'rgba(255,255,255,.05)', padding: '.8rem', borderRadius: '8px' }}>💡 {q.explanation}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const selectStyle = {
  width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '8px', padding: '.7rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none'
};
