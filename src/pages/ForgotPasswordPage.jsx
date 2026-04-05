import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        showToast('Reset link sent to your email!', 'success');
      } else {
        showToast(data.message || 'Error occurred', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-sub">Enter your email and we'll send you a link to reset your password.</p>
        
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>If an account exists for {email}, you will receive a password reset link shortly.</p>
            <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => navigate('/login')}>Back to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="your@email.com"
              />
            </div>
            <button type="submit" className="btn btn-grad" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="auth-link">
              Remembered? <button onClick={() => navigate('/login')}>Back to login</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
