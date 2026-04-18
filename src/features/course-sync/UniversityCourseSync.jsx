import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Chip, Avatar, Button, CircularProgress, Divider, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { GraduationCap, Calendar, FileText, Clock, CheckCircle2, ChevronRight, Search, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UniversityCourseSync = () => {
  const [universityName, setUniversityName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncedCourses, setSyncedCourses] = useState([
    { id: 1, name: 'Calculus I', code: 'MATH 101', university: 'MIT', items: 127, lastSync: '2 hours ago', status: 'synced' },
    { id: 2, name: 'Physics Mechanics', code: 'PHY 201', university: 'Stanford', items: 94, lastSync: '1 day ago', status: 'synced' },
  ]);

  const universities = [
    'Massachusetts Institute of Technology',
    'Stanford University',
    'Harvard University',
    'University of California Berkeley',
    'Carnegie Mellon University',
    'University of Cambridge',
    'University of Oxford',
    'California Institute of Technology'
  ];

  const handleSync = async (e) => {
    e.preventDefault();
    if (!universityName || !courseCode) return;

    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 300));
      setSyncProgress(i);
    }

    setSyncedCourses(prev => [...prev, {
      id: Date.now(),
      name: `Course ${courseCode.toUpperCase()}`,
      code: courseCode.toUpperCase(),
      university: universityName,
      items: Math.floor(Math.random() * 150) + 50,
      lastSync: 'Just now',
      status: 'synced'
    }]);

    setIsSyncing(false);
    setUniversityName('');
    setCourseCode('');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
          University Course Sync
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Automatically import full course syllabi, lecture slides, assignments and due dates
        </Typography>
      </Box>

      {/* Sync Form */}
      <Paper elevation={0} sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        mb: 4
      }}>
        <form onSubmit={handleSync}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              placeholder="Enter university name"
              label="University"
              variant="outlined"
              disabled={isSyncing}
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
                }
              }}
            />
            <TextField
              fullWidth
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Course code"
              label="Course Code"
              variant="outlined"
              disabled={isSyncing}
              sx={{
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
                }
              }}
            />
            <Button
              type="submit"
              disabled={isSyncing || !universityName || !courseCode}
              variant="contained"
              sx={{
                bgcolor: '#8b5cf6',
                color: 'white',
                px: 4,
                height: 56,
                '&:hover': { bgcolor: '#7c3aed' },
                '&:disabled': { bgcolor: 'rgba(139, 92, 246, 0.3)', color: 'rgba(255,255,255,0.3)' }
              }}
            >
              {isSyncing ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <RefreshCw size={20} />}
            </Button>
          </Box>

          {/* Progress Bar */}
          <AnimatePresence>
            {isSyncing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${syncProgress}%` }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
                      borderRadius: 3
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1, display: 'block' }}>
                  Syncing course materials... {syncProgress}%
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Paper>

      {/* Quick University Suggestions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, display: 'block' }}>
          Popular universities
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {universities.map(uni => (
            <Chip
              key={uni}
              label={uni}
              onClick={() => setUniversityName(uni)}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Synced Courses List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, display: 'block' }}>
          Currently synced courses ({syncedCourses.length})
        </Typography>

        <List>
          {syncedCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Paper elevation={0} sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' }
              }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#10b981' }}>
                      <GraduationCap size={20} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                          {course.name}
                        </Typography>
                        <Chip label={course.code} size="small" sx={{
                          bgcolor: 'rgba(16, 185, 129, 0.1)',
                          color: '#34d399',
                          border: 'none',
                          height: 20,
                          '& .MuiChip-label': { px: 0.7, fontSize: 11 }
                        }} />
                        <Chip label="Synced" size="small" sx={{
                          bgcolor: 'rgba(16, 185, 129, 0.1)',
                          color: '#34d399',
                          height: 20,
                          '& .MuiChip-label': { px: 0.7, fontSize: 10 }
                        }} />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                          {course.university}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FileText size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              {course.items} materials
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Clock size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                              Last sync: {course.lastSync}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    }
                  />
                  <IconButton sx={{ color: 'rgba(255,255,255,0.3)' }}>
                    <ChevronRight size={18} />
                  </IconButton>
                </ListItem>
              </Paper>
            </motion.div>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default UniversityCourseSync;