import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_URL from '../config';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState(token ? 'verifying' : 'error');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (data.success) setStatus('success');
        else setStatus('error');
      } catch {
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-box" style={{ textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
            <h2 className="auth-title">Verifying...</h2>
            <p className="auth-sub">Please wait while we verify your email address.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
            <h2 className="auth-title">Email Verified!</h2>
            <p className="auth-sub">Your email has been successfully verified. You can now access all features.</p>
            <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => navigate('/login')}>Go to Login</button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>❌</div>
            <h2 className="auth-title">Link Invalid</h2>
            <p className="auth-sub">This verification link is invalid or has expired.</p>
            <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => navigate('/signup')}>Back to Signup</button>
          </>
        )}
      </div>
    </div>
  );
}
