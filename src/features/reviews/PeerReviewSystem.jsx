import React, { useState } from 'react';
import { Box, Typography, Card, Avatar, Rating, Button, TextField, Chip, Divider, Alert, Snackbar, Tabs, Tab, FormControlLabel, Switch } from '@mui/material';
import { ThumbsUp, ThumbsDown, MessageSquare, Flag, CheckCircle, Send, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../contexts/LanguageContext';

const PeerReviewSystem = () => {
  const { t, language, setLanguage, LANGUAGES } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const [reviews, setReviews] = useState([
    { id: 1, user: 'Rahul Sharma', avatar: 'RS', rating: 5, text: 'Excellent material, very well explained all concepts.', helpful: 127, verified: true, date: '2 days ago', userVote: null, replies: [] },
    { id: 2, user: 'Priya Patel', avatar: 'PP', rating: 4, text: 'Good notes, would love more examples on integration.', helpful: 89, verified: true, date: '5 days ago', userVote: null, replies: [] },
    { id: 3, user: 'Arjun Mehta', avatar: 'AM', rating: 5, text: 'Best study material I have found for JEE. Saved me months of preparation.', helpful: 245, verified: true, date: '1 week ago', userVote: null, replies: [] },
  ]);

  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [activeReply, setActiveReply] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmitReview() {
    if (!newRating || newReview.trim().length < 10) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newReviewObj = {
        id: Date.now(),
        user: 'You',
        avatar: 'YO',
        rating: newRating,
        text: newReview,
        helpful: 0,
        verified: true,
        date: 'Just now',
        userVote: null,
        replies: []
      };

      setReviews([newReviewObj, ...reviews]);
      setNewReview('');
      setNewRating(0);
      setIsSubmitting(false);
      setSnackbar({ open: true, message: t('reviewPosted'), severity: 'success' });
    }, 800);
  }

  function handleVote(reviewId, voteType) {
    setReviews(reviews.map(review => {
      if (review.id !== reviewId) return review;
      
      let helpfulCount = review.helpful;
      let currentVote = review.userVote;

      if (currentVote === 'up') helpfulCount--;
      if (currentVote === 'down') helpfulCount++;

      if (currentVote !== voteType) {
        if (voteType === 'up') helpfulCount++;
        if (voteType === 'down') helpfulCount--;
        currentVote = voteType;
      } else {
        currentVote = null;
      }

      return { ...review, helpful: helpfulCount, userVote: currentVote };
    }));
  }

  function handleAddReply(reviewId) {
    if (replyText.trim().length < 3) return;
    
    setReviews(reviews.map(review => {
      if (review.id !== reviewId) return review;
      return {
        ...review,
        replies: [...review.replies, { user: 'You', text: replyText }]
      };
    }));
    
    setReplyText('');
    setActiveReply(null);
    setSnackbar({ open: true, message: t('replyPosted'), severity: 'success' });
  }

  function handleReport(reviewId) {
    setSnackbar({ open: true, message: t('reviewReported'), severity: 'info' });
  }

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      
      <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ mb: 3 }}>
        <Tab icon={<MessageSquare size={18} />} label={t('peerReviewTitle')} />
        <Tab icon={<Globe size={18} />} label={t('navbarSettings')} />
      </Tabs>

      {/* REVIEWS TAB */}
      {activeTab === 0 && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>💬 {t('peerReviewTitle')}</Typography>

          <Card sx={{ p: 3, mb: 3, background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{t('writeReview')}</Typography>
            <Rating value={newRating} onChange={(e, val) => setNewRating(val)} size="large" sx={{ mb: 2 }} />
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={t('reviewPlaceholder')}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button 
              variant="contained" 
              sx={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
              onClick={handleSubmitReview}
              disabled={!newRating || newReview.trim().length < 10 || isSubmitting}
              startIcon={<Send size={16} />}
            >
              {isSubmitting ? t('submitting') : t('submitButton')}
            </Button>
          </Card>

          <Divider sx={{ mb: 3 }} />

          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card sx={{ p: 3, mb: 2, background: 'rgba(255,255,255,0.03)' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#8b5cf6' }}>{review.avatar}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 700 }}>{review.user}</Typography>
                      {review.verified && <Chip icon={<CheckCircle size={12} />} label={t('verifiedPurchase')} size="small" color="success" variant="outlined" />}
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{review.date}</Typography>
                    </Box>
                    <Rating value={review.rating} size="small" readOnly />
                  </Box>
                </Box>

                <Typography sx={{ mb: 2, lineHeight: 1.6 }}>{review.text}</Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button 
                    size="small" 
                    startIcon={<ThumbsUp size={14} />}
                    onClick={() => handleVote(review.id, 'up')}
                    color={review.userVote === 'up' ? 'success' : 'inherit'}
                    variant={review.userVote === 'up' ? 'outlined' : 'text'}
                  >
                    {review.helpful} {t('helpful')}
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<ThumbsDown size={14} />}
                    onClick={() => handleVote(review.id, 'down')}
                    color={review.userVote === 'down' ? 'error' : 'inherit'}
                    variant={review.userVote === 'down' ? 'outlined' : 'text'}
                  >
                    {t('notHelpful')}
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<MessageSquare size={14} />}
                    onClick={() => setActiveReply(activeReply === review.id ? null : review.id)}
                    color={activeReply === review.id ? 'primary' : 'inherit'}
                  >
                    {t('replyButton')} {review.replies.length > 0 && `(${review.replies.length})`}
                  </Button>
                  <Button size="small" startIcon={<Flag size={14} />} sx={{ ml: 'auto' }} onClick={() => handleReport(review.id)}>
                    {t('reportButton')}
                  </Button>
                </Box>

                {activeReply === review.id && (
                  <Box sx={{ mt: 2, ml: 4, p: 2, background: 'rgba(139, 92, 246, 0.05)', borderRadius: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button size="small" onClick={() => setActiveReply(null)}>{t('cancel')}</Button>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => handleAddReply(review.id)}
                        disabled={replyText.trim().length < 3}
                      >
                        {t('save')}
                      </Button>
                    </Box>
                  </Box>
                )}

                {review.replies.length > 0 && (
                  <Box sx={{ mt: 2, ml: 4 }}>
                    {review.replies.map((reply, idx) => (
                      <Box key={idx} sx={{ py: 1, borderLeft: '2px solid #8b5cf6', pl: 2, mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{reply.user}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{reply.text}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Card>
            </motion.div>
          ))}
        </>
      )}

      {/* GLOBAL SETTINGS TAB */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>⚙️ {t('settingsTitle')}</Typography>
          
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{t('languageSetting')}</Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>{t('selectLanguage')}</Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 2 }}>
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? 'contained' : 'outlined'}
                  onClick={() => {
                    setLanguage(lang.code);
                    setSnackbar({ open: true, message: t('languageChanged'), severity: 'success' });
                  }}
                  sx={{ justifyContent: 'flex-start', p: 2, textAlign: 'left' }}
                >
                  <Box sx={{ mr: 2, fontSize: 24 }}>{lang.flag}</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{lang.native}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>{lang.name}</Typography>
                  </Box>
                </Button>
              ))}
            </Box>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{t('accessibility')}</Typography>
            <FormControlLabel control={<Switch defaultChecked />} label={t('autoSave')} />
            <FormControlLabel control={<Switch defaultChecked />} label={t('notifications')} />
            <FormControlLabel control={<Switch />} label={t('darkMode')} />
            <FormControlLabel control={<Switch />} label={t('compactView')} />
            <FormControlLabel control={<Switch />} label={t('reducedMotion')} />
          </Card>
        </Box>
      )}

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({...snackbar, open: false})}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PeerReviewSystem;