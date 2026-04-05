import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GUIDE_STEPS = [
  {
    msg: `👋 <strong>Welcome to ScholarStock!</strong><br><br>I'm your personal guide. I'll walk you through everything in about 60 seconds. You can skip anytime.<br><br>ScholarStock lets you <strong>rent study materials</strong> for 100+ competitive exams — JEE, NEET, UPSC, CAT, GRE and more — at a fraction of the cost of buying them.`,
    highlight: null,
    scrollTo: null,
    nav: null,
  },
  {
    msg: `📚 <strong>Browse Exam Categories</strong><br><br>The home page shows all <strong>exam categories</strong>. Use the search bar to quickly find your exam — type "JEE", "NEET", "UPSC" or anything else.`,
    highlight: 'categoryGrid',
    scrollTo: 'categoryGrid',
    nav: '/',
  },
  {
    msg: `📂 <strong>Subcategories inside each Exam</strong><br><br>Click any exam card to see its subcategories — Physics, Chemistry, Maths, Previous Year Papers, Mock Tests and more.<br><br>Every exam also has a <span style="color:var(--green);font-weight:700">Free Resources</span> section — completely free, no account needed!`,
    highlight: null,
    scrollTo: null,
    nav: null,
  },
  {
    msg: `📦 <strong>Bundle Plans</strong><br><br>When you click <strong>⚡ Buy</strong> on a subcategory, you see 10 plans. Each one unlocks <em>all materials</em> inside that subcategory for the chosen duration:<br><br>1 Day ₹19 · 2 Days ₹35 · 3 Days ₹49 · 5 Days ₹79<br>⭐ 1 Week ₹99 · 10 Days ₹129 · 2 Weeks ₹159 · 3 Weeks ₹199<br>💎 1 Month ₹249 · 2 Months ₹399`,
    highlight: null,
    scrollTo: null,
    nav: '/pricing-plans',
  },
  {
    msg: `📄 <strong>Individual Plans</strong><br><br>When you click <strong>Rent Now</strong> on a single material from the Browse page, you see 10 plans. Rent just one PDF or book at a much lower price:<br><br>1 Day ₹5 · 2 Days ₹9 · 3 Days ₹13 · 5 Days ₹19<br>⭐ 1 Week ₹29 · 10 Days ₹39 · 2 Weeks ₹49 · 3 Weeks ₹69<br>💎 1 Month ₹89 · 2 Months ₹149`,
    highlight: null,
    scrollTo: null,
    nav: null,
  },
  {
    msg: `🛒 <strong>Shopping Cart</strong><br><br>Add multiple subcategories to your cart and pay for everything at once. Choose from:<br><br>📱 UPI &nbsp;·&nbsp; 💳 Card &nbsp;·&nbsp; 🏦 Net Banking &nbsp;·&nbsp; 👛 Wallet<br><br>Your wallet balance from referrals can also be used as a discount at checkout!`,
    highlight: null,
    scrollTo: null,
    nav: '/',
  },
  {
    msg: `📖 <strong>Your Library</strong><br><br>After renting, all your subcategories appear in <strong>📚 Library</strong>. Open any subcategory to browse and read its PDFs instantly in the browser — no download required, and no print/copy option to protect content.<br><br>You'll see a countdown of days remaining for each rental.`,
    highlight: null,
    scrollTo: null,
    nav: null,
  },
  {
    msg: `🎁 <strong>Referral Program — Earn Free Credits!</strong><br><br>Share your <strong>username</strong> with friends. When they sign up using your username and make rentals, you earn <strong>₹20 cashback</strong> to your wallet every 3 rentals they make.<br><br>Check your earnings in <strong>👤 Profile → Referral History</strong>.`,
    highlight: null,
    scrollTo: null,
    nav: null,
  },
  {
    msg: `🤖 <strong>AI Chatbot</strong><br><br>See the <strong>💬 button</strong> at the bottom right? That's your ScholarStock AI assistant — ask it anything about finding materials, study tips, exam strategies, or how the platform works.`,
    highlight: null,
    scrollTo: null,
    nav: null,
  },
  {
    msg: `✅ <strong>You're all set!</strong><br><br>Here's a quick recap:<br>• 🔍 Search your exam on the home page<br>• 📂 Pick a subcategory & choose a plan<br>• 🛒 Add to cart or buy directly<br>• 📖 Read in your Library<br>• 🎁 Refer friends & earn wallet credits<br><br><strong>Create a free account to get started!</strong>`,
    highlight: null,
    scrollTo: null,
    nav: '/',
    lastStep: true,
  },
];

export default function GuideBot() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Show guide if not logged in AND not seen before
    const seen = localStorage.getItem('guideShown');
    if (isLoggedIn || seen) return;
    const timer = setTimeout(() => setActive(true), 1200);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  const current = GUIDE_STEPS[step];

  function next() {
    if (step < GUIDE_STEPS.length - 1) {
      const nextStep = GUIDE_STEPS[step + 1];
      if (nextStep.nav) navigate(nextStep.nav);
      if (nextStep.scrollTo) {
        setTimeout(() => {
          const el = document.getElementById(nextStep.scrollTo);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
      setStep(s => s + 1);
    }
  }

  function prev() {
    if (step > 0) {
      const prevStep = GUIDE_STEPS[step - 1];
      if (prevStep.nav) navigate(prevStep.nav);
      setStep(s => s - 1);
    }
  }

  function skip() {
    setActive(false);
    localStorage.setItem('guideShown', '1');
  }

  function finish() {
    skip();
    navigate('/signup');
  }

  if (!active) return null;

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none',
        background: 'rgba(0,0,0,.3)',
      }} />

      {/* Guide Bot Panel */}
      <div style={{
        position: 'fixed', zIndex: 100000, bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        width: 'min(520px, 92vw)', pointerEvents: 'all',
      }}>
        <div style={{
          background: 'rgba(2,8,23,.98)', border: '2px solid var(--blue)', borderRadius: '20px',
          padding: '1.5rem 1.8rem', boxShadow: '0 20px 60px rgba(59,130,246,.4)',
          backdropFilter: 'blur(20px)', position: 'relative',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--blue),var(--purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', flexShrink: 0, animation: 'float 3s ease-in-out infinite',
            }}>🎓</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--white)' }}>ScholarStock Guide</div>
              <div style={{ fontSize: '.7rem', color: 'var(--blue2)', fontWeight: 600 }}>● Your personal tour guide</div>
            </div>
            <button onClick={skip} style={{
              marginLeft: 'auto', background: 'transparent', border: '1px solid var(--gb)',
              color: 'var(--muted)', padding: '.3rem .8rem', borderRadius: '6px',
              cursor: 'pointer', fontSize: '.75rem', fontFamily: 'inherit',
            }}>Skip Tour</button>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1rem', justifyContent: 'center' }}>
            {GUIDE_STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? '20px' : '8px', height: '8px', borderRadius: '50px',
                background: i === step ? 'var(--blue)' : i < step ? 'rgba(59,130,246,.4)' : 'var(--gb)',
                transition: 'all .3s',
              }} />
            ))}
          </div>

          {/* Message */}
          <div
            style={{
              fontSize: '.95rem', lineHeight: 1.6, color: 'var(--white)',
              marginBottom: '1.3rem', minHeight: '60px',
            }}
            dangerouslySetInnerHTML={{ __html: current.msg }}
          />

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '.8rem' }}>
            {step > 0 && (
              <button onClick={prev} style={{
                background: 'transparent', border: '1px solid var(--gb)', color: 'var(--muted)',
                padding: '.7rem 1.4rem', borderRadius: '10px', cursor: 'pointer',
                fontWeight: 600, fontSize: '.85rem', fontFamily: 'inherit',
              }}>← Back</button>
            )}
            <button
              onClick={current.lastStep ? finish : next}
              style={{
                flex: 1, background: 'linear-gradient(135deg,var(--blue),var(--purple))',
                border: 'none', color: '#fff', padding: '.7rem 1.4rem', borderRadius: '10px',
                cursor: 'pointer', fontWeight: 700, fontSize: '.9rem', fontFamily: 'inherit',
              }}>
              {current.lastStep ? '🚀 Create Free Account' : 'Got it! →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
