import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Chip, Avatar, Button, Switch, FormControlLabel, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Tabs, Tab } from '@mui/material';
import { GraduationCap, Shield, User, Lock, Settings, DollarSign, Users, FileText, Eye, Edit, Trash2, Plus, Search, CheckCircle, XCircle, MoreVertical, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const InstitutionManagementPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [institutions, setInstitutions] = useState([
    {
      id: 1,
      name: 'Massachusetts Institute of Technology',
      domain: 'mit.edu',
      status: 'active',
      verified: true,
      studentCount: 1420,
      materialCount: 892,
      totalRevenue: 12450,
      adminEmail: 'admin@mit.edu',
      createdAt: '2026-03-01',
      settings: {
        domainAutoAccess: true,
        freeAccessForStudents: true,
        guestAccessAllowed: true,
        revenueSplitUniversity: 70,
        revenueSplitUploader: 20,
        revenueSplitPlatform: 10
      }
    },
    {
      id: 2,
      name: 'Stanford University',
      domain: 'stanford.edu',
      status: 'active',
      verified: true,
      studentCount: 1105,
      materialCount: 756,
      totalRevenue: 9820,
      adminEmail: 'admin@stanford.edu',
      createdAt: '2026-03-05',
      settings: {
        domainAutoAccess: true,
        freeAccessForStudents: true,
        guestAccessAllowed: true,
        revenueSplitUniversity: 70,
        revenueSplitUploader: 20,
        revenueSplitPlatform: 10
      }
    },
    {
      id: 3,
      name: 'University of California Berkeley',
      domain: 'berkeley.edu',
      status: 'pending',
      verified: false,
      studentCount: 0,
      materialCount: 0,
      totalRevenue: 0,
      adminEmail: 'request@berkeley.edu',
      createdAt: '2026-04-15',
      settings: {
        domainAutoAccess: false,
        freeAccessForStudents: false,
        guestAccessAllowed: true,
        revenueSplitUniversity: 60,
        revenueSplitUploader: 25,
        revenueSplitPlatform: 15
      }
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
            Institution Management
          </Typography>
          <Button variant="contained" startIcon={<Plus size={18} />} sx={{
            bgcolor: '#8b5cf6',
            '&:hover': { bgcolor: '#7c3aed' }
          }}>
            Add New Institution
          </Button>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Full control panel for all university institutions. Super admin only.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        {[
          { label: 'Total Institutions', value: institutions.length, icon: <GraduationCap size={18} />, color: '#3b82f6' },
          { label: 'Verified Active', value: institutions.filter(i => i.verified && i.status === 'active').length, icon: <Shield size={18} />, color: '#10b981' },
          { label: 'Pending Requests', value: institutions.filter(i => i.status === 'pending').length, icon: <Clock size={18} />, color: '#f59e0b' },
          { label: 'Total Students', value: institutions.reduce((sum, i) => sum + i.studentCount, 0).toLocaleString(), icon: <Users size={18} />, color: '#8b5cf6' },
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
        <Tab label="All Institutions" />
        <Tab label="Pending Approvals" />
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
          placeholder="Search institutions by name, domain or email..."
          variant="standard"
          sx={{
            '& .MuiInput-underline:before, & .MuiInput-underline:after, & .MuiInput-underline:hover:before': { borderBottom: 'none' },
            '& .MuiInputBase-input': { color: 'white', fontSize: 14, py: 0.5 }
          }}
        />
      </Paper>

      {/* Institutions Table */}
      <TableContainer component={Paper} sx={{
        flex: 1,
        bgcolor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 3,
        overflow: 'auto'
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Institution</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Domain</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Students</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Materials</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Revenue</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Status</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institutions.map((inst, index) => (
              <motion.tr
                key={inst.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                style={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}
              >
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#3b82f6', width: 36, height: 36, fontSize: 12, fontWeight: 700 }}>
                      {inst.name.match(/\b(\w)/g).slice(0, 2).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                        {inst.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {inst.adminEmail}
                      </Typography>
                    </Box>
                    {inst.verified && (
                      <Chip label="Verified" size="small" sx={{
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        color: '#34d399',
                        height: 20,
                        '& .MuiChip-label': { px: 0.7, fontSize: 10 }
                      }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#60a5fa' }}>
                  @{inst.domain}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}>
                  {inst.studentCount.toLocaleString()}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}>
                  {inst.materialCount}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}>
                  ${inst.totalRevenue.toLocaleString()}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Chip
                    label={inst.status.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: inst.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : inst.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: inst.status === 'active' ? '#34d399' : inst.status === 'pending' ? '#fbbf24' : '#f87171',
                      height: 22
                    }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      <Eye size={16} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      <Edit size={16} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Institution Settings Modal will be implemented next */}

    </Box>
  );
};

export default InstitutionManagementPanel;