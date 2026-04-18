import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Avatar, Chip, Divider, Tooltip } from '@mui/material';
import { Send, Bot, User, Sparkles, FileText, Lightbulb, BookOpen, Copy, ThumbUp, ThumbDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAiAssistantStore } from '../../../../Scholarstock-backend-/studify-backend/routes/useAiAssistantStore';

const AiStudyAssistant = () => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, isLoading, sendMessage, clearChat } = useAiAssistantStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const quickActions = [
    { icon: <FileText size={16} />, label: 'Explain this document', action: 'explain' },
    { icon: <Lightbulb size={16} />, label: 'Create flashcards', action: 'flashcards' },
    { icon: <BookOpen size={16} />, label: 'Generate quiz', action: 'quiz' },
    { icon: <Sparkles size={16} />, label: 'Summarize chapter', action: 'summarize' },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar sx={{ bgcolor: '#8b5cf6', width: 48, height: 48 }}>
            <Bot size={24} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              Scholar AI Assistant
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Your personal study tutor
            </Typography>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
          {quickActions.map((action) => (
            <Chip
              key={action.action}
              icon={action.icon}
              label={action.label}
              onClick={() => setInputValue(action.label)}
              sx={{
                bgcolor: 'rgba(139, 92, 246, 0.1)',
                color: '#a78bfa',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.2)' }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {message.role === 'assistant' && (
                <Avatar sx={{ bgcolor: '#8b5cf6', width: 32, height: 32, mt: 0.5 }}>
                  <Bot size={16} />
                </Avatar>
              )}

              <Paper
                elevation={0}
                sx={{
                  maxWidth: '75%',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: message.role === 'user' ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                  color: message.role === 'user' ? 'white' : 'rgba(255,255,255,0.9)'
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                  {message.content}
                </Typography>

                {message.role === 'assistant' && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Tooltip title="Copy">
                      <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        <Copy size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Helpful">
                      <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        <ThumbUp size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Not helpful">
                      <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        <ThumbDown size={14} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Paper>

              {message.role === 'user' && (
                <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32, mt: 0.5 }}>
                  <User size={16} />
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#8b5cf6', width: 32, height: 32 }}>
              <Bot size={16} />
            </Avatar>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#8b5cf6'
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 3, borderTop: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about your study materials..."
              variant="outlined"
              multiline
              maxRows={4}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderRadius: 3,
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
                }
              }}
            />
            <IconButton
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              sx={{
                bgcolor: '#8b5cf6',
                color: 'white',
                width: 48,
                height: 48,
                borderRadius: 3,
                '&:hover': { bgcolor: '#7c3aed' },
                '&:disabled': { bgcolor: 'rgba(139, 92, 246, 0.3)', color: 'rgba(255,255,255,0.3)' }
              }}
            >
              <Send size={20} />
            </IconButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AiStudyAssistant;