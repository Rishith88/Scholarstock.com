import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

// Unit conversion tables
const CONV_UNITS = {
  length:{m:1,km:1000,cm:.01,mm:.001,mi:1609.344,yd:.9144,ft:.3048,in:.0254,'nm':1e-9,'μm':1e-6,'nautical mi':1852},
  mass:{kg:1,g:.001,mg:1e-6,lb:.453592,oz:.0283495,t:1000,'μg':1e-9,'st':6.35029},
  area:{'m²':1,'km²':1e6,'cm²':1e-4,'mm²':1e-6,'ft²':.0929,'in²':6.452e-4,'acre':4046.86,'hectare':10000},
  volume:{'L':1,'mL':.001,'m³':1000,'cm³':.001,'ft³':28.3168,'in³':.0163871,'gal(US)':3.78541,'fl oz(US)':.0295735},
  speed:{'m/s':1,'km/h':1/3.6,'mph':0.44704,'knot':0.514444,'ft/s':0.3048},
  time:{s:1,ms:.001,'μs':1e-6,min:60,h:3600,day:86400,week:604800,year:31557600},
  energy:{J:1,kJ:1000,cal:4.184,kcal:4184,'Wh':3600,'kWh':3.6e6,eV:1.602e-19,BTU:1055.06},
  pressure:{Pa:1,kPa:1000,MPa:1e6,bar:100000,atm:101325,mmHg:133.322,psi:6894.76},
  data:{B:1,KB:1024,MB:1048576,GB:1073741824,TB:1.099511627776e12,bit:0.125},
  temperature:{}
};
const TEMP_UNITS = ['°C','°F','K','°R'];

// Scientific calculator buttons
const SCI_BUTTONS = [
  ['sin(','cos(','tan(','π','('],
  ['asin(','acos(','atan(','e',')'],
  ['log(','ln(','sqrt(','^','fact('],
  ['7','8','9','/','AC'],
  ['4','5','6','*','DEL'],
  ['1','2','3','-','Ans'],
  ['0','.','=','+',''],
];

export default function CalculatorPage() {
  const { isLoggedIn, token } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('scientific');
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('0');
  const [calcDeg, setCalcDeg] = useState(true);
  const [history, setHistory] = useState([]);
  const [calcAns, setCalcAns] = useState(0);

  // Unit converter
  const [convCat, setConvCat] = useState('length');
  const [convFrom, setConvFrom] = useState('m');
  const [convTo, setConvTo] = useState('km');
  const [convVal, setConvVal] = useState('1');

  // Stats
  const [statsInput, setStatsInput] = useState('');
  const [statsResult, setStatsResult] = useState(null);

  // Equation
  const [eqType, setEqType] = useState('quadratic');
  const [eqCoeffs, setEqCoeffs] = useState({ a: '1', b: '0', c: '-4', d: '0', a1: '2', b1: '3', c1: '7', a2: '1', b2: '-1', c2: '1' });
  const [eqResult, setEqResult] = useState('');

  // Base converter
  const [baseType, setBaseType] = useState('10');
  const [baseInput, setBaseInput] = useState('');
  const [baseResult, setBaseResult] = useState({});

  // AI
  const [aiText, setAiText] = useState('');
  const [showAi, setShowAi] = useState(false);

  // Calculator functions
  function calcInput(v) { setExpr(prev => prev + v); }
  function calcDel() { setExpr(prev => prev.slice(0, -1)); }
  function calcClear() { setExpr(''); setResult('0'); }

  function calcEquals() {
    try {
      let e = expr;
      e = e.replace(/π/g, 'Math.PI').replace(/\be\b/g, 'Math.E');
      e = e.replace(/Ans/g, String(calcAns));
      e = e.replace(/sin\(/g, calcDeg ? 'Math.sin(d2r(' : 'Math.sin(');
      e = e.replace(/cos\(/g, calcDeg ? 'Math.cos(d2r(' : 'Math.cos(');
      e = e.replace(/tan\(/g, calcDeg ? 'Math.tan(d2r(' : 'Math.tan(');
      e = e.replace(/asin\(/g, calcDeg ? 'r2d(Math.asin(' : 'Math.asin(');
      e = e.replace(/acos\(/g, calcDeg ? 'r2d(Math.acos(' : 'Math.acos(');
      e = e.replace(/atan\(/g, calcDeg ? 'r2d(Math.atan(' : 'Math.atan(');
      e = e.replace(/log\(/g, 'Math.log10(');
      e = e.replace(/ln\(/g, 'Math.log(');
      e = e.replace(/sqrt\(/g, 'Math.sqrt(');
      e = e.replace(/abs\(/g, 'Math.abs(');
      e = e.replace(/fact\(([^)]+)\)/g, (m, n) => `calcFactorial(${n})`);
      e = e.replace(/\^/g, '**');

      const res = Function(`
        function d2r(x){return x*Math.PI/180;}
        function r2d(x){return x*180/Math.PI;}
        function calcFactorial(n){n=Math.round(n);if(n<0)return NaN;if(n===0||n===1)return 1;let r=1;for(let i=2;i<=n;i++)r*=i;return r;}
        return ${e};
      `)();

      const fmt = formatNum(res);
      setResult(fmt);
      setHistory(prev => [{ expr, result: fmt }, ...prev].slice(0, 50));
      setCalcAns(res);
      setExpr('');
    } catch {
      setResult('Error');
    }
  }

  function formatNum(n) {
    if (isNaN(n) || !isFinite(n)) return 'Error';
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
    if (Math.abs(n) > 1e10 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(6);
    return parseFloat(n.toPrecision(12)).toString();
  }

  // Unit converter - compute result directly during render
  const convResultComputed = (() => {
    const cat = convCat;
    const val = parseFloat(convVal) || 0;
    if (cat === 'temperature') {
      let celsius;
      if (convFrom === '°C') celsius = val;
      else if (convFrom === '°F') celsius = (val - 32) * 5 / 9;
      else if (convFrom === 'K') celsius = val - 273.15;
      else celsius = (val - 491.67) * 5 / 9;
      let r;
      if (convTo === '°C') r = celsius;
      else if (convTo === '°F') r = celsius * 9 / 5 + 32;
      else if (convTo === 'K') r = celsius + 273.15;
      else r = (celsius + 273.15) * 9 / 5;
      return `${formatNum(r)} ${convTo}`;
    } else {
      const tbl = CONV_UNITS[cat];
      if (tbl && tbl[convFrom] && tbl[convTo]) {
        return `${formatNum(val * tbl[convFrom] / tbl[convTo])} ${convTo}`;
      }
      return '';
    }
  })();

  // Update units when category changes - use layout effect to avoid cascading renders
  useEffect(() => {
    const units = convCat === 'temperature' ? TEMP_UNITS : Object.keys(CONV_UNITS[convCat] || {});
    if (units.length && (!units.includes(convFrom) || !units.includes(convTo))) {
      // Schedule state updates for next tick to avoid synchronous setState
      const timeoutId = setTimeout(() => {
        setConvFrom(units[0]);
        setConvTo(units[1] || units[0]);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [convCat, convFrom, convTo]);

  // Statistics
  function calcStats() {
    const nums = statsInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    if (!nums.length) { setStatsResult(null); return; }
    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const sorted = [...nums].sort((a, b) => a - b);
    const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
    const variance = nums.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
    const stddev = Math.sqrt(variance);
    const range = sorted[n - 1] - sorted[0];
    setStatsResult({ n, sum: formatNum(sum), mean: formatNum(mean), median: formatNum(median), stddev: formatNum(stddev), variance: formatNum(variance), range: formatNum(range), min: sorted[0], max: sorted[n - 1] });
  }

  // Equation solver
  function solveEquation() {
    const g = k => parseFloat(eqCoeffs[k]) || 0;
    const fmt = v => parseFloat(v.toPrecision(8)).toString();
    if (eqType === 'linear') {
      const a = g('a'), b = g('b');
      if (a === 0) { setEqResult(b === 0 ? 'Infinite solutions' : 'No solution'); return; }
      setEqResult(`x = ${fmt(-b / a)}`);
    } else if (eqType === 'quadratic') {
      const a = g('a'), b = g('b'), c = g('c');
      if (a === 0) { setEqResult('Not quadratic (a=0)'); return; }
      const disc = b * b - 4 * a * c;
      if (disc > 0) setEqResult(`x₁ = ${fmt((-b + Math.sqrt(disc)) / (2 * a))}\nx₂ = ${fmt((-b - Math.sqrt(disc)) / (2 * a))}\nDiscriminant = ${fmt(disc)}`);
      else if (disc === 0) setEqResult(`x = ${fmt(-b / (2 * a))}\nDouble root`);
      else setEqResult(`Complex roots:\nx₁ = ${fmt(-b / (2 * a))} + ${fmt(Math.sqrt(-disc) / (2 * a))}i\nx₂ = ${fmt(-b / (2 * a))} - ${fmt(Math.sqrt(-disc) / (2 * a))}i`);
    } else if (eqType === 'simultaneous') {
      const a1 = g('a1'), b1 = g('b1'), c1 = g('c1'), a2 = g('a2'), b2 = g('b2'), c2 = g('c2');
      const det = a1 * b2 - a2 * b1;
      if (Math.abs(det) < 1e-12) { setEqResult('No unique solution'); return; }
      setEqResult(`x = ${fmt((c1 * b2 - c2 * b1) / det)}\ny = ${fmt((a1 * c2 - a2 * c1) / det)}`);
    }
  }

  // Base converter
  function doBaseConvert() {
    const base = parseInt(baseType);
    const raw = baseInput.trim().toUpperCase();
    if (!raw) { setBaseResult({}); return; }
    try {
      const dec = parseInt(raw, base);
      if (isNaN(dec)) { setBaseResult({ error: 'Invalid' }); return; }
      setBaseResult({ dec, bin: dec.toString(2), oct: dec.toString(8), hex: dec.toString(16).toUpperCase() });
    } catch { setBaseResult({ error: 'Error' }); }
  }

  // AI Explain
  async function aiExplain() {
    if (!isLoggedIn) { toast('Login required', 'error'); return; }
    let problem = expr.trim();
    if (!problem && history.length) problem = `Explain: ${history[0].expr} = ${history[0].result}`;
    if (!problem) { toast('Enter an expression first', 'error'); return; }
    setShowAi(true);
    setAiText('⏳ Asking AI...');
    try {
      const res = await fetch(`${API_URL}/api/calculator/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ problem, history: [] }),
      });
      const data = await res.json();
      if (data.success) { setAiText(data.result); toast('AI ready', 'success'); }
      else setAiText(data.error || 'Failed');
    } catch (e) { setAiText(e.message); }
  }

  const convUnits = convCat === 'temperature' ? TEMP_UNITS : Object.keys(CONV_UNITS[convCat] || {});
  const is = { ...inputStyle };

  const TABS = [
    { id: 'scientific', icon: '🔬', label: 'Scientific' },
    { id: 'converter', icon: '🔄', label: 'Converter' },
    { id: 'stats', icon: '📊', label: 'Statistics' },
    { id: 'equation', icon: '📐', label: 'Equations' },
    { id: 'base', icon: '💻', label: 'Base Conv' },
  ];

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <h2 className="sec-title">🧮 Scientific Calculator</h2>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '.5rem 1rem', borderRadius: '8px', border: 'none', background: tab === t.id ? 'rgba(59,130,246,.3)' : 'rgba(139,92,246,.15)', color: tab === t.id ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.82rem', fontFamily: 'inherit' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Scientific */}
      {tab === 'scientific' && (
        <div style={{ maxWidth: '500px' }}>
          <div style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '14px', padding: '1.2rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
              <button onClick={() => setCalcDeg(d => !d)} style={{ background: 'rgba(59,130,246,.15)', border: 'none', color: 'var(--blue2)', padding: '.3rem .6rem', borderRadius: '4px', fontSize: '.7rem', fontWeight: 700, cursor: 'pointer' }}>{calcDeg ? 'DEG' : 'RAD'}</button>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '.85rem', minHeight: '1.5rem', wordBreak: 'break-all' }}>{expr || ' '}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, textAlign: 'right', color: 'var(--blue2)', fontFamily: 'monospace' }}>{result}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '.4rem' }}>
            {SCI_BUTTONS.flat().filter(Boolean).map((btn, i) => (
              <button key={i} onClick={() => {
                if (btn === 'AC') calcClear();
                else if (btn === 'DEL') calcDel();
                else if (btn === '=') calcEquals();
                else calcInput(btn);
              }}
                style={{ padding: '.65rem', borderRadius: '8px', border: 'none', background: btn === '=' ? 'linear-gradient(135deg,var(--blue),var(--purple))' : btn === 'AC' ? 'rgba(239,68,68,.2)' : 'var(--glass)', color: btn === '=' ? '#fff' : btn === 'AC' ? 'var(--red)' : 'var(--white)', cursor: 'pointer', fontWeight: 700, fontSize: '.85rem', fontFamily: 'inherit' }}>
                {btn}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '.5rem', marginTop: '.8rem' }}>
            <button className="btn btn-ghost" style={{ flex: 1, padding: '.6rem', fontSize: '.8rem' }} onClick={aiExplain}>🧠 Explain with AI</button>
          </div>

          {showAi && (
            <div style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '1rem', marginTop: '.8rem', whiteSpace: 'pre-wrap', fontSize: '.82rem', color: 'var(--muted)', maxHeight: '300px', overflow: 'auto' }}>
              {aiText}
              <button onClick={() => setShowAi(false)} style={{ marginTop: '.5rem', background: 'transparent', border: '1px solid var(--gb)', color: 'var(--muted)', padding: '.3rem .8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '.75rem' }}>Close</button>
            </div>
          )}

          {history.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--muted2)', marginBottom: '.5rem' }}>History</div>
              {history.slice(0, 10).map((h, i) => (
                <div key={i} onClick={() => { setExpr(h.result); setResult(h.result); }}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '.4rem .6rem', background: 'var(--glass)', borderRadius: '6px', marginBottom: '.3rem', cursor: 'pointer', fontSize: '.8rem' }}>
                  <span style={{ color: 'var(--muted)' }}>{h.expr}</span>
                  <span style={{ color: 'var(--blue2)' }}>{h.result}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Unit Converter */}
      {tab === 'converter' && (
        <div style={{ maxWidth: '500px' }}>
          <select style={is} value={convCat} onChange={e => setConvCat(e.target.value)}>
            {['length','mass','area','volume','speed','time','energy','pressure','data','temperature'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '.5rem', alignItems: 'center', marginTop: '1rem' }}>
            <div>
              <input style={is} type="number" value={convVal} onChange={e => setConvVal(e.target.value)} />
              <select style={{ ...is, marginTop: '.5rem' }} value={convFrom} onChange={e => setConvFrom(e.target.value)}>
                {convUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <button onClick={() => { const t = convFrom; setConvFrom(convTo); setConvTo(t); }} style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--blue2)' }}>⇄</button>
            <div>
              <div style={{ ...is, padding: '.8rem 1rem', background: 'rgba(59,130,246,.1)', borderColor: 'rgba(59,130,246,.3)', fontWeight: 700, color: 'var(--blue2)' }}>{convResultComputed}</div>
              <select style={{ ...is, marginTop: '.5rem' }} value={convTo} onChange={e => setConvTo(e.target.value)}>
                {convUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {tab === 'stats' && (
        <div style={{ maxWidth: '600px' }}>
          <textarea style={{ ...is, minHeight: '80px' }} placeholder="Enter numbers separated by commas or spaces" value={statsInput} onChange={e => setStatsInput(e.target.value)} />
          <button className="btn btn-grad" style={{ marginTop: '.8rem', width: '100%' }} onClick={calcStats}>Calculate Statistics</button>
          {statsResult && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '.8rem', marginTop: '1rem' }}>
              {Object.entries(statsResult).map(([k, v]) => (
                <div key={k} style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>{k}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--blue2)' }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Equation Solver */}
      {tab === 'equation' && (
        <div style={{ maxWidth: '500px' }}>
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['linear', 'quadratic', 'simultaneous'].map(t => (
              <button key={t} onClick={() => setEqType(t)}
                style={{ padding: '.5rem 1rem', borderRadius: '8px', border: 'none', background: eqType === t ? 'rgba(59,130,246,.3)' : 'rgba(139,92,246,.15)', color: eqType === t ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '.82rem', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ fontFamily: 'monospace', color: 'var(--blue2)', marginBottom: '.8rem' }}>
            {eqType === 'linear' ? 'a·x + b = 0' : eqType === 'quadratic' ? 'a·x² + b·x + c = 0' : 'a₁x + b₁y = c₁  |  a₂x + b₂y = c₂'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: eqType === 'simultaneous' ? 'repeat(3, 1fr)' : `repeat(${eqType === 'linear' ? 2 : 3}, 1fr)`, gap: '.8rem' }}>
            {(eqType === 'linear' ? ['a', 'b'] : eqType === 'quadratic' ? ['a', 'b', 'c'] : ['a1', 'b1', 'c1', 'a2', 'b2', 'c2']).map(k => (
              <div key={k}>
                <label style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{k}</label>
                <input style={is} value={eqCoeffs[k] || ''} onChange={e => setEqCoeffs(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
          </div>
          <button className="btn btn-grad" style={{ width: '100%', marginTop: '.8rem' }} onClick={solveEquation}>Solve</button>
          {eqResult && <pre style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '1rem', marginTop: '.8rem', color: 'var(--blue2)', fontSize: '.9rem', whiteSpace: 'pre-wrap' }}>{eqResult}</pre>}
        </div>
      )}

      {/* Base Converter */}
      {tab === 'base' && (
        <div style={{ maxWidth: '500px' }}>
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
            <select style={is} value={baseType} onChange={e => setBaseType(e.target.value)}>
              <option value="10">Decimal (10)</option>
              <option value="2">Binary (2)</option>
              <option value="8">Octal (8)</option>
              <option value="16">Hex (16)</option>
            </select>
            <input style={{ ...is, flex: 1 }} placeholder="Enter number" value={baseInput} onChange={e => { setBaseInput(e.target.value); }} />
            <button className="btn btn-grad" onClick={doBaseConvert}>Convert</button>
          </div>
          {baseResult.dec !== undefined && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem' }}>
              {[{ l: 'Decimal', v: baseResult.dec }, { l: 'Binary', v: baseResult.bin }, { l: 'Octal', v: baseResult.oct }, { l: 'Hex', v: baseResult.hex }].map(b => (
                <div key={b.l} style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '.8rem' }}>
                  <div style={{ fontSize: '.7rem', color: 'var(--muted)', fontWeight: 700 }}>{b.l}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--blue2)', wordBreak: 'break-all' }}>{b.v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '8px',
  padding: '.7rem 1rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit',
};
