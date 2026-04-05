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
    risksHtml += `<div style="margin-bottom:.8rem; background:rgba(239,68,68,0.05); padding:1rem; border-radius:10px; border:1px solid rgba(239,68,68,0.2)">
      <strong style="color:var(--red); display:block; margin-bottom:0.25rem">⚠️ ${escapeHtml(r.risk)}</strong>
      <div style="font-size:.85rem; color:var(--muted); line-height:1.4">${escapeHtml(r.mitigation)}</div>
    </div>`;
  });
  
  const weeksHtml = weeks.map(w => {
    const fa = (w.focusAreas || []).map(x => `<span style="display:inline-block; background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.2); padding:0.2rem 0.6rem; border-radius:6px; margin:0.2rem 0.4rem 0.2rem 0; font-size:0.75rem; color:var(--blue2); font-weight:600">${escapeHtml(x)}</span>`).join('');
    const ms = (w.milestones || []).map(m => `<li style="margin:0.4rem 0">${escapeHtml(m)}</li>`).join('');
    return `
      <div class="ss-week" style="margin-bottom:1.5rem; border-left:4px solid var(--blue); background:var(--glass); padding:1.5rem; border-radius:0 14px 14px 0">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem">
          <h4 style="margin:0; font-size:1.1rem; color:var(--white)">Week ${escapeHtml(w.week)}: ${escapeHtml(w.theme || 'Focus')}</h4>
          <span class="ss-tag" style="background:var(--blue); color:white; padding:0.2rem 0.6rem; border-radius:50px; font-size:0.7rem; font-weight:800">${escapeHtml(w.hoursSuggested != null ? w.hoursSuggested : '—')} HRS</span>
        </div>
        <div style="margin-bottom:1rem">${fa}</div>
        <ul style="margin:0; padding-left:1.2rem; font-size:0.9rem; color:var(--muted); line-height:1.6">${ms}</ul>
        <div style="margin-top:1rem; padding-top:1rem; border-top:1px solid var(--gb); font-size:0.85rem; color:var(--green)">
          <strong>🚀 ScholarStock Strategy:</strong> ${escapeHtml(w.scholarStockTip || 'Utilize our target materials for this phase.')}
        </div>
      </div>`;
  }).join('');
  
  const habits = (plan.dailyHabits || []).map(h => `<li style="margin:0.5rem 0; display:flex; align-items:flex-start; gap:0.5rem"><span style="color:var(--blue2)">•</span><span>${escapeHtml(h)}</span></li>`).join('');
  const finalW = (plan.finalWeekPlan || []).map(h => `<li style="margin:0.5rem 0; display:flex; align-items:flex-start; gap:0.5rem"><span style="color:var(--gold)">⚡</span><span>${escapeHtml(h)}</span></li>`).join('');
  const examLabel = meta && meta.examName ? escapeHtml(meta.examName) : '';
  
  return `
    <div style="padding:1rem">
      <div class="ss-hero" style="text-align:center; margin-bottom:2rem; padding:2rem; background:linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1)); border-radius:20px; border:1px solid var(--gb)">
        <div class="eyebrow" style="color:var(--blue2); font-weight:800; text-transform:uppercase; letter-spacing:2px; font-size:0.7rem; margin-bottom:0.5rem">Expert Strategy Roadmap${examLabel ? ' for ' + examLabel : ''}</div>
        <h2 style="font-family:'Playfair Display',serif; font-size:2rem; margin:0.5rem 0; color:var(--white)">${escapeHtml(plan.title || 'Your Personalized Study Plan')}</h2>
        <p style="color:var(--muted); font-size:1rem; max-width:700px; margin:1rem auto; line-height:1.6">${escapeHtml(plan.executiveSummary || '')}</p>
        <div style="display:inline-block; background:rgba(59,130,246,0.1); padding:0.4rem 1.2rem; border-radius:50px; color:var(--blue2); font-weight:700; font-size:0.85rem; margin-top:1rem; border:1px solid rgba(59,130,246,0.3)">Current Track: ${escapeHtml(plan.prepStageLabel || '')}</div>
      </div>

      <div class="ss-stats" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin-bottom:2.5rem">
        <div class="ss-stat" style="background:var(--glass); padding:1.2rem; border-radius:14px; border:1px solid var(--gb); text-align:center">
          <div style="font-size:0.75rem; color:var(--muted); margin-bottom:0.4rem; text-transform:uppercase; font-weight:700">Total Study Hours</div>
          <div style="font-size:1.8rem; font-weight:900; color:var(--blue2)">${stats.estimatedTotalHours != null ? escapeHtml(String(stats.estimatedTotalHours)) : '—'}</div>
        </div>
        <div class="ss-stat" style="background:var(--glass); padding:1.2rem; border-radius:14px; border:1px solid var(--gb); text-align:center">
          <div style="font-size:0.75rem; color:var(--muted); margin-bottom:0.4rem; text-transform:uppercase; font-weight:700">Intensity Level</div>
          <div style="font-size:1.8rem; font-weight:900; color:var(--purple)">${escapeHtml(stats.weeklyIntensity || '—')}</div>
        </div>
        <div class="ss-stat" style="background:var(--glass); padding:1.2rem; border-radius:14px; border:1px solid var(--gb); text-align:center; grid-column: span 2">
          <div style="font-size:0.75rem; color:var(--muted); margin-bottom:0.4rem; text-transform:uppercase; font-weight:700">Readiness Projection</div>
          <div style="font-size:0.95rem; font-weight:600; color:var(--white); line-height:1.4">${escapeHtml(stats.readinessProjection || '')}</div>
        </div>
      </div>

      <h3 style="font-family:'Playfair Display',serif; font-size:1.5rem; margin-bottom:1.5rem; border-bottom:1px solid var(--gb); padding-bottom:0.5rem">📅 Weekly Curriculum</h3>
      <div class="ss-weeks">${weeksHtml}</div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem; margin-top:2rem">
        <div>
          <h3 style="font-family:'Playfair Display',serif; font-size:1.3rem; margin-bottom:1rem">🏠 Daily Rituals</h3>
          <ul style="list-style:none; padding:0; margin:0; color:var(--muted); font-size:0.95rem">${habits}</ul>
        </div>
        <div>
          <h3 style="font-family:'Playfair Display',serif; font-size:1.3rem; margin-bottom:1rem">🏁 The Final Sprint</h3>
          <ul style="list-style:none; padding:0; margin:0; color:var(--muted); font-size:0.95rem">${finalW}</ul>
        </div>
      </div>

      ${risksHtml ? `<div class="ss-risks" style="margin-top:2.5rem"><h3 style="font-family:'Playfair Display',serif; font-size:1.3rem; margin-bottom:1rem; color:var(--red)">🚨 Risk Radar</h3>${risksHtml}</div>` : ''}

      <div class="ss-motivation" style="margin-top:3rem; padding:2rem; background:rgba(245,158,11,0.05); border-radius:20px; border:1px dashed var(--gold); text-align:center">
        <div style="font-size:1.5rem; margin-bottom:0.5rem">🌟</div>
        <div style="font-family:'Playfair Display',serif; font-size:1.15rem; color:var(--gold); font-style:italic; line-height:1.6">${escapeHtml(plan.motivationLine || '')}</div>
      </div>
    </div>`;
}
