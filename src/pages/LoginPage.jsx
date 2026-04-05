import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        toast('Login successful!', 'success');
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
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-sub">Login to access your study materials</p>
        {error && <div className="auth-error on">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <div style={{ textAlign: 'right', marginTop: '.4rem' }}>
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')} 
                style={{ fontSize: '.75rem', color: 'var(--blue2)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Forgot Password?
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-grad" style={{ width: '100%', marginTop: '.5rem' }}>Login</button>
        </form>
        <div className="auth-link">
          Don't have an account? <button onClick={() => navigate('/signup')}>Sign up</button>
        </div>
      </div>
    </div>
  );
}
