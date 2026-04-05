import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ReviewsModal({ isOpen, onClose, materialId, title, avgStars }) {
  const { isLoggedIn, user } = useAuth();
  const toast = useToast();

  const [reviews, setReviews] = useState([]);
  const [selectedStars, setSelectedStars] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (isOpen && materialId) {
      const stored = JSON.parse(localStorage.getItem(`ss_reviews_${materialId}`) || '[]');
      setReviews(stored);
      setSelectedStars(0);
      setReviewText('');
    }
  }, [isOpen, materialId]);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1) : avgStars || 4.5;

  function submitReview() {
    if (!selectedStars) { toast('Please select a star rating', 'error'); return; }
    
    const review = {
      stars: selectedStars,
      text: reviewText.trim(),
      name: user ? user.name.split(' ')[0] : 'Student',
      date: new Date().toISOString()
    };
    
    const newReviews = [...reviews];
    const existing = newReviews.findIndex(r => r.name === review.name);
    if (existing > -1) newReviews[existing] = review;
    else newReviews.push(review);
    
    localStorage.setItem(`ss_reviews_${materialId}`, JSON.stringify(newReviews));
    setReviews(newReviews);
    setSelectedStars(0);
    setReviewText('');
    toast('✅ Review submitted! Thanks!', 'success');
  }

  if (!isOpen) return null;

  return (
    <div className="reviews-modal on" onClick={(e) => e.target.className.includes('reviews-modal') && onClose()}>
      <div className="reviews-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{title} Reviews</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>

        <div className="avg-rating" style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '1.2rem', background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '12px', padding: '1rem' }}>
          <div className="avg-big" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--gold)' }}>{avg}</div>
          <div>
            <div style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>{'⭐'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '.2rem' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {isLoggedIn ? (
          <div style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '12px', padding: '1rem', marginBottom: '1.2rem' }}>
            <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: '.8rem' }}>Write a Review</div>
            <div className="star-select" style={{ display: 'flex', gap: '.3rem', fontSize: '1.5rem', cursor: 'pointer', margin: '.5rem 0' }}>
              {[1,2,3,4,5].map(n => (
                <span key={n} onClick={() => setSelectedStars(n)} style={{ opacity: n <= selectedStars ? 1 : 0.4, transition: 'opacity .15s' }}>⭐</span>
              ))}
            </div>
            <textarea 
              style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid var(--gb)', borderRadius: '8px', padding: '.8rem', color: 'var(--white)', fontSize: '.85rem', outline: 'none', resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }} 
              placeholder="Share your thoughts about this material..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
            />
            <button className="btn btn-grad" style={{ width: '100%', marginTop: '.8rem', padding: '.7rem' }} onClick={submitReview}>Submit Review</button>
          </div>
        ) : (
          <div style={{ background: 'rgba(59,130,246,.08)', border: '1px solid rgba(59,130,246,.2)', borderRadius: '10px', padding: '.8rem', marginBottom: '1.2rem', textAlign: 'center', fontSize: '.85rem', color: 'var(--muted)' }}>
            <span style={{ color: 'var(--blue2)', cursor: 'pointer', fontWeight: 600 }}>Login</span> to write a review
          </div>
        )}

        <div>
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No reviews yet — be the first!</div>
          ) : (
             [...reviews].reverse().map((r, i) => (
              <div key={i} className="review-item" style={{ background: 'var(--glass)', border: '1px solid var(--gb)', borderRadius: '10px', padding: '1rem', marginBottom: '.8rem' }}>
                <div style={{ color: 'var(--gold)', fontSize: '1rem', marginBottom: '.3rem' }}>{'⭐'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                {r.text && <div style={{ fontSize: '.85rem', color: 'var(--muted)', lineHeight: 1.5 }}>{r.text}</div>}
                <div style={{ fontSize: '.75rem', color: 'var(--muted2)', marginTop: '.4rem' }}>— {r.name} · {new Date(r.date).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
