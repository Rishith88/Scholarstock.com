import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      showToast('Message sent! We\'ll get back to you soon.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="sec" style={{ marginTop: '4rem', maxWidth: '600px' }}>
      <h1 className="sec-title">Contact Us</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Have questions? Reach out to us and we'll help you out.</p>
      
      <form onSubmit={handleSubmit} className="auth-box" style={{ width: '100%', background: 'var(--glass)', border: '1px solid var(--gb)' }}>
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            required 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            placeholder="Your name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            required 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            placeholder="your@email.com"
          />
        </div>
        <div className="form-group">
          <label>Subject</label>
          <input 
            type="text" 
            required 
            value={formData.subject} 
            onChange={e => setFormData({...formData, subject: e.target.value})} 
            placeholder="Topic"
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea 
            required 
            value={formData.message} 
            onChange={e => setFormData({...formData, message: e.target.value})} 
            placeholder="How can we help?"
            style={{ 
              width: '100%', 
              background: 'rgba(255,255,255,.05)', 
              border: '1px solid var(--gb)', 
              borderRadius: '8px', 
              padding: '.8rem 1rem', 
              color: 'var(--white)', 
              minHeight: '120px', 
              outline: 'none', 
              fontFamily: 'inherit' 
            }}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-grad" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
