import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Chip, Avatar, Button, CircularProgress, Divider, List, ListItem, ListItemText, ListItemAvatar, Tabs, Tab } from '@mui/material';
import { GraduationCap, DollarSign, Users, FileText, TrendingUp, Clock, CheckCircle2, ChevronRight, Search, Plus, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const UniversityMarketplace = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const universityStats = [
    { name: 'MIT', earnings: 12450, students: 1420, materials: 892 },
    { name: 'Stanford', earnings: 9820, students: 1105, materials: 756 },
    { name: 'Berkeley', earnings: 7650, students: 890, materials: 621 },
    { name: 'CMU', earnings: 6210, students: 712, materials: 543 },
    { name: 'Harvard', earnings: 5890, students: 645, materials: 489 },
  ];

  const universities = [
    { id: 1, name: 'Massachusetts Institute of Technology', code: 'MIT', students: 1420, materials: 892, revenue: '$12,450', verified: true, rating: 4.9 },
    { id: 2, name: 'Stanford University', code: 'STAN', students: 1105, materials: 756, revenue: '$9,820', verified: true, rating: 4.8 },
    { id: 3, name: 'University of California Berkeley', code: 'UCB', students: 890, materials: 621, revenue: '$7,650', verified: true, rating: 4.7 },
    { id: 4, name: 'Carnegie Mellon University', code: 'CMU', students: 712, materials: 543, revenue: '$6,210', verified: false, rating: 4.6 },
    { id: 5, name: 'Harvard University', code: 'HARV', students: 645, materials: 489, revenue: '$5,890', verified: true, rating: 4.8 },
  ];

  const earningsData = universityStats.map(u => ({ name: u.name, value: u.earnings }));

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
            University Marketplace
          </Typography>
          <Button variant="contained" startIcon={<Plus size={18} />} sx={{
            bgcolor: '#8b5cf6',
            '&:hover': { bgcolor: '#7c3aed' }
          }}>
            Add University
          </Button>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Community driven university platform. Students earn commission by uploading study materials
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        {[
          { label: 'Total Universities', value: '127', icon: <GraduationCap size={18} />, color: '#3b82f6' },
          { label: 'Active Students', value: '18,420', icon: <Users size={18} />, color: '#10b981' },
          { label: 'Total Materials', value: '24,981', icon: <FileText size={18} />, color: '#f59e0b' },
          { label: 'Total Payouts', value: '$156,840', icon: <DollarSign size={18} />, color: '#8b5cf6' },
        ].map((stat, i) => (
          <Paper key={i} elevation={0} sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Box sx={{ color: stat.color }}>{stat.icon}</Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                {stat.label}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
              {stat.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3, minHeight: 40, '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', minHeight: 40 }, '& .Mui-selected': { color: '#8b5cf6' }, '& .MuiTabs-indicator': { bgcolor: '#8b5cf6' } }}>
        <Tab label="Universities" />
        <Tab label="Top Earners" />
        <Tab label="Analytics" />
      </Tabs>

      {/* Search */}
      <Paper elevation={0} sx={{
        p: 1.5,
        borderRadius: 3,
        bgcolor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Search size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
        <TextField
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search universities..."
          variant="standard"
          sx={{
            '& .MuiInput-underline:before, & .MuiInput-underline:after, & .MuiInput-underline:hover:before': { borderBottom: 'none' },
            '& .MuiInputBase-input': { color: 'white', fontSize: 14, py: 0.5 }
          }}
        />
      </Paper>

      {activeTab === 0 && (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <List>
            {universities.map((uni, index) => (
              <motion.div
                key={uni.id}
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
                      <Avatar sx={{ bgcolor: '#3b82f6', fontSize: 14, fontWeight: 700 }}>
                        {uni.code}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                            {uni.name}
                          </Typography>
                          {uni.verified && (
                            <Chip label="Verified" size="small" sx={{
                              bgcolor: 'rgba(16, 185, 129, 0.1)',
                              color: '#34d399',
                              height: 20,
                              '& .MuiChip-label': { px: 0.7, fontSize: 10 }
                            }} />
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{uni.rating}</Typography>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <>
                          <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Users size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                {uni.students.toLocaleString()} students
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <FileText size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                {uni.materials.toLocaleString()} materials
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <DollarSign size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                {uni.revenue} revenue
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
      )}

      {activeTab === 2 && (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>Top Earning Universities</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData} layout="vertical">
                  <XAxis type="number" stroke="rgba(255,255,255,0.3)" />
                  <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.5)" width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8, color: 'white' }}
                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default UniversityMarketplace;