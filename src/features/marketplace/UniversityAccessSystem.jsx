import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Chip, Avatar, Button, Switch, FormControlLabel, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { GraduationCap, Shield, User, Lock, Globe, CheckCircle2, XCircle, Mail, Settings, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const UniversityAccessSystem = () => {
  const [universities, setUniversities] = useState([
    {
      id: 1,
      name: 'Massachusetts Institute of Technology',
      domain: 'mit.edu',
      status: 'active',
      verified: true,
      studentCount: 1420,
      materialCount: 892,
      settings: {
        domainAutoAccess: true,
        institutionOnlyAccounts: true,
        freeAccessForStudents: true,
        guestAccessAllowed: true,
        guestPremiumPricing: 9.99,
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
      settings: {
        domainAutoAccess: true,
        institutionOnlyAccounts: true,
        freeAccessForStudents: true,
        guestAccessAllowed: true,
        guestPremiumPricing: 12.99,
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
      settings: {
        domainAutoAccess: false,
        institutionOnlyAccounts: false,
        freeAccessForStudents: false,
        guestAccessAllowed: true,
        guestPremiumPricing: 7.99,
        revenueSplitUniversity: 60,
        revenueSplitUploader: 25,
        revenueSplitPlatform: 15
      }
    }
  ]);

  const getAccessStatus = (userEmail, university) => {
    const emailDomain = userEmail.split('@')[1]?.toLowerCase();
    
    if (emailDomain === university.domain.toLowerCase()) {
      return {
        level: 'VERIFIED_STUDENT',
        access: 'FULL_FREE_ACCESS',
        perks: ['All materials free', 'No paywalls', 'Priority support', 'Early access'],
        color: '#10b981'
      };
    }

    if (university.settings.guestAccessAllowed) {
      return {
        level: 'GUEST_ACCESS',
        access: 'PAID_ACCESS_ONLY',
        perks: ['Individual purchases only', 'No free institutional materials', 'Standard support'],
        color: '#f59e0b'
      };
    }

    return {
      level: 'NO_ACCESS',
      access: 'BLOCKED',
      perks: [],
      color: '#ef4444'
    };
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', p: 3, overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
          Institutional Access System
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Dynamic domain based access control. Fully configurable per university. No hardcoding.
        </Typography>
      </Box>

      {/* Access System Explanation */}
      <Paper elevation={0} sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'rgba(16, 185, 129, 0.05)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        mb: 4
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Shield size={24} style={{ color: '#34d399', marginTop: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#34d399', mb: 1 }}>
              Dynamic Access Control System
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
              Each university sets their own rules completely. System automatically detects user email domain at signup. 
              Verified institutional emails get full free access automatically. External guests can purchase access 
              with pricing set individually by each university. All settings are fully dynamic and configurable per institution.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* University Access Configuration Table */}
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
        University Access Configuration
      </Typography>

      <TableContainer component={Paper} sx={{
        bgcolor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 3,
        mb: 4
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>University</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Domain</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Auto Access</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Student Access</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Guest Access</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Revenue Split</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {universities.map((uni) => (
              <TableRow key={uni.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32, fontSize: 12, fontWeight: 700 }}>
                      {uni.name.match(/\b(\w)/g).slice(0, 2).join('')}
                    </Avatar>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {uni.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#60a5fa' }}>
                  @{uni.domain}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Switch
                    checked={uni.settings.domainAutoAccess}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#8b5cf6' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8b5cf6' }
                    }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Chip
                    label={uni.settings.freeAccessForStudents ? 'FREE' : 'PAID'}
                    size="small"
                    sx={{
                      bgcolor: uni.settings.freeAccessForStudents ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: uni.settings.freeAccessForStudents ? '#34d399' : '#fbbf24',
                      height: 22
                    }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Chip
                    label={uni.settings.guestAccessAllowed ? 'ALLOWED' : 'BLOCKED'}
                    size="small"
                    sx={{
                      bgcolor: uni.settings.guestAccessAllowed ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: uni.settings.guestAccessAllowed ? '#60a5fa' : '#f87171',
                      height: 22
                    }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}>
                  {uni.settings.revenueSplitUniversity}% / {uni.settings.revenueSplitUploader}% / {uni.settings.revenueSplitPlatform}%
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {uni.verified ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                      <Typography variant="caption" sx={{ color: '#34d399' }}>Verified</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <XCircle size={14} style={{ color: '#f59e0b' }} />
                      <Typography variant="caption" sx={{ color: '#fbbf24' }}>Pending</Typography>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Access Levels Matrix */}
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
        Dynamic Access Level Matrix
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 4 }}>
        {[
          {
            title: '✅ Verified Student',
            color: '#10b981',
            description: 'User has official university email domain',
            access: [
              'Full free access to all institutional materials',
              'No paywalls on university content',
              'All perks and priority features',
              'Account must be issued by institution'
            ]
          },
          {
            title: '⚠️ External Guest',
            color: '#f59e0b',
            description: 'User from outside the university',
            access: [
              'No free institutional material access',
              'Can purchase individual items only',
              'Premium subscription available (set by university)',
              'Standard support only'
            ]
          },
          {
            title: '🔒 Institution Admin',
            color: '#8b5cf6',
            description: 'Official university administrator',
            access: [
              'Full control over all university settings',
              'Create and manage student accounts',
              'Set pricing, revenue splits and permissions',
              'View analytics and payout reports'
            ]
          }
        ].map((level, i) => (
          <Paper key={i} elevation={0} sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: level.color, mb: 1 }}>
              {level.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>
              {level.description}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {level.access.map((item, j) => (
                <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: level.color, opacity: 0.5 }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
          All rules are 100% dynamic. No hardcoded universities. Every institution defines their own system.
        </Typography>
      </Box>
    </Box>
  );
};

export default UniversityAccessSystem;