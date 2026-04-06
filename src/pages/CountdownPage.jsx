import { useState, useEffect } from 'react';

const EXAM_DATES = [
  {name:'JEE Mains Session 1',date:'2026-01-22',cat:'Engineering'},
  {name:'JEE Mains Session 2',date:'2026-04-05',cat:'Engineering'},
  {name:'JEE Advanced',date:'2026-05-24',cat:'Engineering'},
  {name:'BITSAT',date:'2026-05-20',cat:'Engineering'},
  {name:'VITEEE',date:'2026-04-15',cat:'Engineering'},
  {name:'SRMJEEE',date:'2026-04-10',cat:'Engineering'},
  {name:'MHT CET',date:'2026-05-02',cat:'Engineering'},
  {name:'WBJEE',date:'2026-04-19',cat:'Engineering'},
  {name:'KCET',date:'2026-04-22',cat:'Engineering'},
  {name:'COMEDK',date:'2026-05-10',cat:'Engineering'},
  {name:'KEAM',date:null,cat:'Engineering'},
  {name:'NEET UG',date:'2026-05-03',cat:'Medical'},
  {name:'NEET PG',date:'2026-06-14',cat:'Medical'},
  {name:'AIIMS PG',date:'2026-05-18',cat:'Medical'},
  {name:'JIPMER',date:'2026-06-07',cat:'Medical'},
  {name:'INI CET',date:'2026-11-01',cat:'Medical'},
  {name:'FMGE',date:'2026-06-15',cat:'Medical'},
  {name:'NEET MDS',date:null,cat:'Medical'},
  {name:'NEET SS',date:null,cat:'Medical'},
  {name:'UPSC CSE Prelims',date:'2026-05-24',cat:'Government'},
  {name:'UPSC CSE Mains',date:'2026-09-18',cat:'Government'},
  {name:'SSC CGL Tier 1',date:'2026-06-13',cat:'Government'},
  {name:'SSC CHSL',date:'2026-06-25',cat:'Government'},
  {name:'RRB NTPC',date:'2026-09-05',cat:'Government'},
  {name:'RRB Group D',date:'2026-08-10',cat:'Government'},
  {name:'CAPF AC',date:'2026-08-02',cat:'Government'},
  {name:'CDS I',date:'2026-04-05',cat:'Defence'},
  {name:'NDA I',date:'2026-04-13',cat:'Defence'},
  {name:'NDA II',date:'2026-09-06',cat:'Defence'},
  {name:'IBPS PO',date:'2026-10-04',cat:'Banking'},
  {name:'IBPS Clerk',date:'2026-08-23',cat:'Banking'},
  {name:'SBI PO',date:'2026-06-06',cat:'Banking'},
  {name:'SBI Clerk',date:'2026-07-25',cat:'Banking'},
  {name:'RBI Grade B',date:'2026-07-12',cat:'Banking'},
  {name:'IBPS RRB PO',date:null,cat:'Banking'},
  {name:'CAT',date:'2026-11-29',cat:'Management'},
  {name:'XAT',date:'2027-01-05',cat:'Management'},
  {name:'SNAP',date:'2026-12-13',cat:'Management'},
  {name:'NMAT',date:'2026-10-10',cat:'Management'},
  {name:'CMAT',date:'2026-03-22',cat:'Management'},
  {name:'MAT',date:'2026-05-17',cat:'Management'},
  {name:'IIFT',date:'2026-12-07',cat:'Management'},
  {name:'ATMA',date:null,cat:'Management'},
  {name:'GATE CS',date:'2027-02-01',cat:'GATE'},
  {name:'GATE EC',date:'2027-02-07',cat:'GATE'},
  {name:'GATE EE',date:'2027-02-08',cat:'GATE'},
  {name:'GATE ME',date:'2027-02-15',cat:'GATE'},
  {name:'GATE CE',date:'2027-02-14',cat:'GATE'},
  {name:'GATE CH',date:null,cat:'GATE'},
  {name:'GATE BT',date:null,cat:'GATE'},
  {name:'SAT',date:'2026-05-02',cat:'International'},
  {name:'ACT',date:'2026-04-18',cat:'International'},
  {name:'GRE',date:'2026-06-01',cat:'International'},
  {name:'GMAT',date:'2026-05-15',cat:'International'},
  {name:'TOEFL',date:'2026-04-11',cat:'International'},
  {name:'IELTS',date:'2026-04-18',cat:'International'},
  {name:'PTE Academic',date:'2026-04-20',cat:'International'},
  {name:'MCAT',date:'2026-05-16',cat:'International'},
  {name:'LSAT',date:'2026-06-08',cat:'International'},
  {name:'IMO (Math)',date:'2026-07-10',cat:'Olympiad'},
  {name:'IPhO (Physics)',date:'2026-07-18',cat:'Olympiad'},
  {name:'IChO (Chemistry)',date:'2026-07-22',cat:'Olympiad'},
  {name:'IBO (Biology)',date:'2026-07-14',cat:'Olympiad'},
  {name:'IOI (Informatics)',date:'2026-08-08',cat:'Olympiad'},
  {name:'IOAA (Astronomy)',date:null,cat:'Olympiad'},
  {name:'IJSO',date:null,cat:'Olympiad'},
  {name:'CFA Level 1 (Feb)',date:'2026-02-17',cat:'Finance'},
  {name:'CFA Level 1 (May)',date:'2026-05-14',cat:'Finance'},
  {name:'CA Foundation (May)',date:'2026-05-15',cat:'Finance'},
  {name:'ACCA',date:'2026-06-01',cat:'Finance'},
  {name:'CLAT',date:'2026-05-01',cat:'Law'},
  {name:'AILET',date:'2026-05-10',cat:'Law'},
  {name:'NATA',date:'2026-04-18',cat:'Design'},
  {name:'NID DAT',date:'2026-01-12',cat:'Design'},
  {name:'NIFT',date:'2026-02-08',cat:'Design'},
  {name:'CBSE Class 12',date:'2026-02-15',cat:'Boards'},
  {name:'CBSE Class 10',date:'2026-02-15',cat:'Boards'},
  {name:'ICSE Class 12',date:'2026-02-16',cat:'Boards'},
  {name:'CUET UG',date:'2026-05-08',cat:'University'},
  {name:'DUET',date:'2026-05-25',cat:'University'},
];

const CAT_COLORS = {
  Engineering:'rgba(59,130,246,.15)|var(--blue2)',Medical:'rgba(16,185,129,.15)|var(--green)',
  Government:'rgba(245,158,11,.15)|var(--gold)',Defence:'rgba(245,158,11,.15)|var(--gold)',
  Banking:'rgba(139,92,246,.15)|var(--purple)',Management:'rgba(6,182,212,.15)|var(--cyan)',
  GATE:'rgba(59,130,246,.15)|var(--blue2)',International:'rgba(239,68,68,.15)|var(--red)',
  Olympiad:'rgba(245,158,11,.15)|var(--gold)',Finance:'rgba(16,185,129,.15)|var(--green)',
  Law:'rgba(139,92,246,.15)|var(--purple)',Design:'rgba(236,72,153,.15)|#ec4899',
  Boards:'rgba(59,130,246,.15)|var(--blue2)',University:'rgba(59,130,246,.15)|var(--blue2)',
};

const FILTERS = ['All','Engineering','Medical','Government','Banking','Management','GATE','International','Olympiad','Boards'];

function fmtDate(d) {
  return new Date(d+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
}

export default function CountdownPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [pinned, setPinned] = useState(() => JSON.parse(localStorage.getItem('ss_cd_pinned') || '[]'));
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate(n => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  function togglePin(name) {
    setPinned(prev => {
      const next = prev.includes(name) ? prev.filter(n => n !== name) : [name, ...prev];
      localStorage.setItem('ss_cd_pinned', JSON.stringify(next));
      return next;
    });
  }

  let exams = EXAM_DATES.filter(e => {
    if (filter !== 'All' && e.cat !== filter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.cat.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  exams.sort((a, b) => {
    const ap = pinned.includes(a.name) ? 0 : 1;
    const bp = pinned.includes(b.name) ? 0 : 1;
    if (ap !== bp) return ap - bp;
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="sec" style={{ marginTop: '2rem' }}>
      <div className="eyebrow">Live Exam Dates</div>
      <h2 className="sec-title">⏳ Exam Countdowns</h2>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.2rem' }}>
        <input
          style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '8px', padding: '.6rem 1rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', minWidth: '200px' }}
          placeholder="🔍 Search exam..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '.4rem .8rem', borderRadius: '6px', border: '1px solid var(--gb)', background: filter === f ? 'rgba(59,130,246,.2)' : 'var(--glass)', color: filter === f ? 'var(--blue2)' : 'var(--muted)', cursor: 'pointer', fontSize: '.75rem', fontWeight: 600, fontFamily: 'inherit' }}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '1.2rem' }}>
        ⭐ Star any exam to pin it to the top &nbsp;·&nbsp; Dates updated when officially announced
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
        {exams.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>No exams found</div>}
        {exams.map(e => <CountdownCard key={e.name} exam={e} isPinned={pinned.includes(e.name)} onTogglePin={togglePin} />)}
      </div>
    </div>
  );
}

function CountdownCard({ exam, isPinned, onTogglePin }) {
  const cols = (CAT_COLORS[exam.cat] || 'rgba(255,255,255,.05)|var(--muted)').split('|');

  if (!exam.date) {
    return (
      <div style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '14px', padding: '1.2rem', opacity: .6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
          <span style={{ background: cols[0], color: cols[1], padding: '.2rem .6rem', borderRadius: '50px', fontSize: '.7rem', fontWeight: 700 }}>{exam.cat}</span>
          <button onClick={() => onTogglePin(exam.name)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: isPinned ? 'var(--gold)' : 'var(--muted)' }}>{isPinned ? '★' : '☆'}</button>
        </div>
        <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '.3rem' }}>{exam.name}</div>
        <div style={{ color: 'var(--muted)', fontSize: '.8rem' }}>📅 Date not yet announced</div>
      </div>
    );
  }

  const now = new Date();
  const examDate = new Date(exam.date + 'T00:00:00');
  const diffMs = examDate - now;

  if (diffMs <= 0) {
    return (
      <div style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '14px', padding: '1.2rem', opacity: .5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
          <span style={{ background: cols[0], color: cols[1], padding: '.2rem .6rem', borderRadius: '50px', fontSize: '.7rem', fontWeight: 700 }}>{exam.cat}</span>
          <button onClick={() => onTogglePin(exam.name)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: isPinned ? 'var(--gold)' : 'var(--muted)' }}>{isPinned ? '★' : '☆'}</button>
        </div>
        <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '.3rem' }}>{exam.name}</div>
        <div style={{ color: 'var(--muted)', fontSize: '.8rem' }}>Exam was on {fmtDate(exam.date)}</div>
      </div>
    );
  }

  const days = Math.floor(diffMs / 86400000);
  const hrs = Math.floor((diffMs % 86400000) / 3600000);
  const mins = Math.floor((diffMs % 3600000) / 60000);
  const secs = Math.floor((diffMs % 60000) / 1000);
  const urg = days <= 30 ? 'var(--red)' : days <= 90 ? 'var(--gold)' : 'var(--green)';
  const urgTxt = days <= 30 ? '🔥 Very soon!' : days <= 90 ? '⚡ Coming up' : '📅 Upcoming';

  return (
    <div style={{ background: 'var(--glass)', border: `1px solid ${isPinned ? 'rgba(245,158,11,.4)' : 'var(--gb)'}`, borderRadius: '14px', padding: '1.2rem', transition: 'all .3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
        <span style={{ background: cols[0], color: cols[1], padding: '.2rem .6rem', borderRadius: '50px', fontSize: '.7rem', fontWeight: 700 }}>{exam.cat}</span>
        <button onClick={() => onTogglePin(exam.name)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: isPinned ? 'var(--gold)' : 'var(--muted)' }}>{isPinned ? '★' : '☆'}</button>
      </div>
      <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '.3rem' }}>{exam.name}</div>
      <div style={{ color: 'var(--muted)', fontSize: '.8rem', marginBottom: '.8rem' }}>📅 {fmtDate(exam.date)}</div>
      <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center', marginBottom: '.6rem' }}>
        {[
          { v: String(days).padStart(2, '0'), l: 'Days' },
          { v: String(hrs).padStart(2, '0'), l: 'Hrs' },
          { v: String(mins).padStart(2, '0'), l: 'Min' },
          { v: String(secs).padStart(2, '0'), l: 'Sec' },
        ].map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            {i > 0 && <span style={{ color: 'var(--muted)', fontWeight: 700 }}>:</span>}
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', borderRadius: '8px', padding: '.4rem .6rem', fontWeight: 900, fontSize: '1.2rem', fontFamily: 'monospace', color: 'var(--blue2)', minWidth: '44px' }}>{b.v}</div>
              <div style={{ fontSize: '.6rem', color: 'var(--muted)', marginTop: '.2rem', textTransform: 'uppercase', fontWeight: 700 }}>{b.l}</div>
            </div>
          </div>
        ))}
      </div>
      <span style={{ fontSize: '.75rem', color: urg, fontWeight: 700 }}>{urgTxt} — {days} days left</span>
    </div>
  );
}
