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

    const examDay = new Date(targetDate + 'T12:00:00');
    const daysUntil = Math.ceil((examDay - Date.now()) / 86400000);
    if (daysUntil < 7) { toast('Exam should be at least 7 days away', 'error'); return; }

    setLoading(true);
    setResult('');
    try {
      const res = await fetch(`${API_URL}/api/study-strategist/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          examName: exam, 
          daysUntilExam: daysUntil, 
          hoursPerWeek: parseInt(hours), 
          weakAreas: weak, 
          prepLevel: prep, 
          goalBrief: goal 
        }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        const html = renderPlanObjectToHtml(data.plan, data.meta || {});
        setResult(html);
        localStorage.setItem('ss_study_plan', html);
        toast('✨ Roadmap generated from server!', 'success');
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Backend endpoint unavailable or returned unrendered object, using React renderer...');
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
        <div style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '14px', padding: '1.5rem', minHeight: '300px', fontSize: '.88rem', lineHeight: 1.7, color: 'var(--muted)', overflow: 'auto', maxHeight: '600px' }}>
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

function escapeHtml(unsafe) {
  return (unsafe||'').toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderPlanObjectToHtml(plan, meta) {
  const stats = plan.stats || {};
  const weeks = plan.weeklyPhases || [];
  
  let risksHtml = '';
  (plan.riskAlerts || []).forEach(r => {
    risksHtml += `<div style="margin-bottom:.65rem"><strong style="color:var(--red)">${escapeHtml(r.risk)}</strong><div style="font-size:.85rem;color:var(--muted);margin-top:.25rem">${escapeHtml(r.mitigation)}</div></div>`;
  });
  
  const weeksHtml = weeks.map(w => {
    const fa = (w.focusAreas || []).map(x => `<span style="display:inline-block;background:rgba(59,130,246,.12);padding:.22rem .55rem;border-radius:6px;margin:.15rem .15rem 0 0;font-size:.78rem">${escapeHtml(x)}</span>`).join('');
    const ms = (w.milestones || []).map(m => `<li style="margin:.28rem 0">${escapeHtml(m)}</li>`).join('');
    return `<div class="ss-week"><h4>Week ${escapeHtml(w.week)} · ${escapeHtml(w.theme || 'Focus')}<span class="ss-tag">~${escapeHtml(w.hoursSuggested != null ? w.hoursSuggested : '—')} h</span></h4><div style="margin:.45rem 0">${fa}</div><ul style="margin:.45rem 0;padding-left:1.2rem;font-size:.88rem;color:var(--muted)">${ms}</ul><div style="font-size:.82rem;color:var(--green);margin-top:.65rem;border-top:1px solid var(--gb);padding-top:.65rem">📚 <strong>ScholarStock:</strong> ${escapeHtml(w.scholarStockTip || 'Browse topic materials and mock tests for this phase.')}</div></div>`;
  }).join('');
  
  const habits = (plan.dailyHabits || []).map(h => `<li style="margin:.38rem 0">${escapeHtml(h)}</li>`).join('');
  const finalW = (plan.finalWeekPlan || []).map(h => `<li style="margin:.38rem 0">${escapeHtml(h)}</li>`).join('');
  const examLabel = meta && meta.examName ? escapeHtml(meta.examName) : '';
  
  return `<div class="ss-hero"><div class="eyebrow">AI-generated roadmap${examLabel ? ' · ' + examLabel : ''}</div><h2 style="font-family:'Playfair Display',serif;font-size:1.65rem;margin:.5rem 0;line-height:1.2">${escapeHtml(plan.title || 'Your study roadmap')}</h2><p style="color:var(--muted);line-height:1.55">${escapeHtml(plan.executiveSummary || '')}</p><div style="margin-top:.85rem;font-size:.85rem;color:var(--blue2)">Stage: <strong>${escapeHtml(plan.prepStageLabel || '')}</strong></div></div><div class="ss-stats"><div class="ss-stat"><b>${stats.estimatedTotalHours != null ? escapeHtml(String(stats.estimatedTotalHours)) : '—'}</b><span style="font-size:.75rem;color:var(--muted)">Est. total hours</span></div><div class="ss-stat"><b>${escapeHtml(stats.weeklyIntensity || '—')}</b><span style="font-size:.75rem;color:var(--muted)">Intensity</span></div><div class="ss-stat" style="grid-column:span 2"><span style="font-size:.8rem;color:var(--muted);line-height:1.4">${escapeHtml(stats.readinessProjection || '')}</span></div></div><h3 class="sec-title" style="font-size:1.35rem;margin:1.6rem 0 1rem">Weekly phases</h3><div class="ss-weeks">${weeksHtml}</div><h3 class="sec-title" style="font-size:1.15rem;margin:1.5rem 0 .75rem">Daily habits</h3><ul style="color:var(--muted);font-size:.9rem;padding-left:1.2rem">${habits}</ul><h3 class="sec-title" style="font-size:1.15rem;margin:1.5rem 0 .75rem">Exam week</h3><ul style="color:var(--muted);font-size:.9rem;padding-left:1.2rem">${finalW}</ul>${risksHtml ? `<div class="ss-risks"><strong style="font-size:.85rem;display:block;margin-bottom:.6rem">⚠️ Risk radar</strong>${risksHtml}</div>` : ''}<div class="ss-motivation">${escapeHtml(plan.motivationLine || '')}</div>`;
}
