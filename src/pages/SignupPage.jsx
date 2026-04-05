import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralOpt, setReferralOpt] = useState('none');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const referredBy = referralOpt === 'yes' ? referralCode.trim().toLowerCase() : '';
    try {
      const result = await signup(name, email, password, referredBy);
      if (result.success) {
        toast(result.referred ? 'Account created! Referral applied 🎉' : 'Account created! Welcome 🎉', 'success');
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Network error');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Join thousands of students studying smarter</p>
        {error && <div className="auth-error on">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Referred by <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
            <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '.4rem', cursor: 'pointer', padding: '.6rem 1rem', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '8px', flex: 1 }}>
                <input type="radio" name="ref" value="none" checked={referralOpt === 'none'} onChange={() => setReferralOpt('none')} /> None
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '.4rem', cursor: 'pointer', padding: '.6rem 1rem', background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.3)', borderRadius: '8px', flex: 1 }}>
                <input type="radio" name="ref" value="yes" checked={referralOpt === 'yes'} onChange={() => setReferralOpt('yes')} /> I was referred
              </label>
            </div>
            {referralOpt === 'yes' && (
              <input
                type="text"
                placeholder="Enter their username"
                value={referralCode}
                onChange={e => setReferralCode(e.target.value.toLowerCase().replace(/\s/g, ''))}
              />
            )}
          </div>
          <button type="submit" className="btn btn-grad" style={{ width: '100%' }}>Create Account</button>
        </form>
        <div className="auth-link">
          Already have an account? <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
}
