import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

export default function StudyStrategistPage() {
  const { isLoggedIn, token } = useAuth();
  const toast = useToast();
  const [exam, setExam] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [hours, setHours] = useState('14');
  const [prep, setPrep] = useState('intermediate');
  const [weak, setWeak] = useState('');
  const [goal, setGoal] = useState('');
  const [result, setResult] = useState(() => localStorage.getItem('ss_study_plan') || '');
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!isLoggedIn) { toast('Please login first', 'error'); return; }
    if (!exam.trim()) { toast('Enter your target exam', 'error'); return; }
    if (!targetDate) { toast('Select exam date', 'error'); return; }

    setLoading(true);
    setResult('');
    try {
      const res = await fetch(`${API_URL}/api/study-strategist/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ exam, targetDate, hoursPerWeek: parseInt(hours), prepLevel: prep, weakTopics: weak, goal }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.plan);
        localStorage.setItem('ss_study_plan', data.plan);
        toast('✨ Roadmap generated!', 'success');
      } else {
        toast(data.message || 'Failed to generate', 'error');
      }
    } catch (e) {
      toast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  }

  function clearPlan() {
    localStorage.removeItem('ss_study_plan');
    setResult('');
    toast('Plan cleared');
  }

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Adaptive intelligence</div>
      <h2 className="sec-title">🎯 AI Study Strategist</h2>
      <p style={{ color: 'var(--muted)', maxWidth: '640px', marginBottom: '1.5rem', lineHeight: 1.55 }}>
        A personalized multi-week roadmap built for <strong>your</strong> exam date, hours per week, and weak areas — including ScholarStock-specific study moves. Powered by the same AI stack as our doubt solver.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Result section */}
        <div style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '14px', padding: '1.5rem', minHeight: '300px', whiteSpace: 'pre-wrap', fontSize: '.88rem', lineHeight: 1.7, color: 'var(--muted)', overflow: 'auto', maxHeight: '600px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
              <div style={{ fontWeight: 700, marginBottom: '.5rem' }}>Generating your roadmap...</div>
              <div style={{ color: 'var(--muted)', fontSize: '.85rem' }}>This may take 15-30 seconds</div>
            </div>
          ) : result ? (
            <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br>') }} />
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Your roadmap will appear here. Fill the form and generate — or restore your last plan from this device.</p>
          )}
        </div>

        {/* Form */}
        <div style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Target exam</label>
              <input style={inputStyle} placeholder="e.g. JEE Main 2026" value={exam} onChange={e => setExam(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Exam date</label>
              <input type="date" style={inputStyle} value={targetDate} onChange={e => setTargetDate(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Hours per week</label>
              <select style={inputStyle} value={hours} onChange={e => setHours(e.target.value)}>
                {[7,10,14,21,28,40].map(h => <option key={h} value={h}>{h} hrs / week</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Prep level</label>
              <select style={inputStyle} value={prep} onChange={e => setPrep(e.target.value)}>
                <option value="beginner">Beginner — starting fresh</option>
                <option value="intermediate">Intermediate — some syllabus done</option>
                <option value="advanced">Advanced — mostly done</option>
                <option value="revision">Revision mode — exam soon</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Weak topics / concerns</label>
            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="e.g. Rotational mechanics, organic reactions..." value={weak} onChange={e => setWeak(e.target.value)} />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--muted2)', display: 'block', marginBottom: '.4rem' }}>Goal (optional)</label>
            <input style={inputStyle} placeholder="e.g. 99 percentile" value={goal} onChange={e => setGoal(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            <button className="btn btn-grad" onClick={generate} disabled={loading}>✨ Generate my roadmap</button>
            <button className="btn btn-ghost" onClick={clearPlan}>Clear saved plan</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '8px',
  padding: '.7rem 1rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit',
};
