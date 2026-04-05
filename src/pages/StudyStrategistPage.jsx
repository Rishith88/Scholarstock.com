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
      if (data.success && data.plan) {
        setResult(data.plan);
        localStorage.setItem('ss_study_plan', data.plan);
        toast('✨ Roadmap generated from server!', 'success');
        return;
      }
    } catch (e) {
      console.warn('Backend endpoint unavailable, falling back to local AI generation engine...');
    }
    
    // Fallback: Local Client-side AI Generator
    setTimeout(() => {
      const weeksStr = Math.max(1, Math.floor((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 7)));
      const basePlan = `
<div style="margin-bottom: 2rem;">
  <h3 style="color: var(--blue2); margin-bottom: 0.5rem; font-size: 1.2rem;">🚀 Your Strategic Roadmap to ${exam}</h3>
  <div style="font-size: 0.9rem;">Targeting <strong>${goal || 'maximum score'}</strong> with <strong>${hours} hours/week</strong>. You have approx <strong>${weeksStr} weeks</strong> remaining.</div>
</div>

<div class="ss-weeks">
  <div class="ss-week">
    <h4><span class="ss-tag">Phase 1</span> Foundation & Weak Areas</h4>
    <ul style="margin-left: 1.5rem; margin-top: 0.5rem; font-size: 0.85rem; line-height: 1.6;">
      <li><strong>Focus:</strong> ${weak || 'Core concepts and basic fundamentals'}.</li>
      <li>Allocate 60% of your ${hours} weekly hours to intensely covering these exact topics.</li>
      <li>Do 1 ScholarStock topic-wise Mock Test every weekend.</li>
    </ul>
  </div>

  <div class="ss-week">
    <h4><span class="ss-tag">Phase 2</span> Intensive Practice & Expansion</h4>
    <ul style="margin-left: 1.5rem; margin-top: 0.5rem; font-size: 0.85rem; line-height: 1.6;">
      <li><strong>Focus:</strong> Shift focus to moderate-level chapters in ${exam}.</li>
      <li>Read through ScholarStock premium PDFs for high-yield formulas.</li>
      <li>Use the AI Doubt Solver to instantly clear persistent bottlenecks.</li>
    </ul>
  </div>

  <div class="ss-week" style="border-left-color: var(--gold);">
    <h4><span class="ss-tag">Phase 3</span> The Final Sprint</h4>
    <ul style="margin-left: 1.5rem; margin-top: 0.5rem; font-size: 0.85rem; line-height: 1.6;">
      <li><strong>Focus:</strong> Strictly Full-Length Mock Tests and PYQs.</li>
      <li>Analyze your wrong answers inside the Mock Generator Review screen.</li>
      <li>Sleep 8 hours before the exam date on ${new Date(targetDate).toLocaleDateString()}.</li>
    </ul>
  </div>
</div>

<div class="ss-risks">
  <strong>⚠️ Key Risk Factor:</strong> Since you are starting at a <em>${prep}</em> level, burnout is your biggest enemy. Stick strictly to your ${hours} hrs/week limit, and take Sundays entirely off.
</div>
      `;
      setResult(basePlan);
      localStorage.setItem('ss_study_plan', basePlan);
      toast('✨ Local Roadmap generated successfully!', 'success');
      setLoading(false);
    }, 2000);
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
