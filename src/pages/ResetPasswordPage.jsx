import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return showToast('Passwords do not match', 'error');
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Password reset successful!', 'success');
        navigate('/login');
      } else {
        showToast(data.message || 'Reset failed', 'error');
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
        <h2 className="auth-title">Set New Password</h2>
        <p className="auth-sub">Choose a strong password you'll remember.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-grad" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Updating...' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
