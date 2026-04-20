import React, { useState } from 'react';
import { Box, Container, Card, Typography, Button, FormControlLabel, Switch, Divider, Alert, Snackbar, Tabs, Tab, Grid, Slider, Select, MenuItem, TextField } from '@mui/material';
import { Settings, Globe, Eye, Bell, Lock, Palette, Accessibility, Download, Trash2, Shield, Zap, Database, Volume2, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext';

const SettingsPage = () => {
  const { t, language, setLanguage, LANGUAGES } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // BASIC SETTINGS
  const [basicSettings, setBasicSettings] = useState({
    autoSave: true,
    autoSaveInterval: 30,
    notifications: true,
    emailNotifications: false,
    pushNotifications: true,
    soundEnabled: true,
    soundVolume: 70,
  });

  // APPEARANCE SETTINGS
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: false,
    compactView: false,
    theme: 'default',
    fontSize: 'medium',
    sidebarPosition: 'left',
  });

  // ACCESSIBILITY SETTINGS
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    dyslexicFont: false,
    screenReaderMode: false,
    keyboardNavigation: true,
    focusIndicators: true,
  });

  // PRIVACY & SECURITY
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'friends',
    dataCollection: false,
    analyticsTracking: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    rememberDevice: true,
  });

  // STUDY PREFERENCES
  const [studySettings, setStudySettings] = useState({
    studyReminders: true,
    reminderTime: '09:00',
    dailyGoal: 120,
    breakInterval: 25,
    breakDuration: 5,
    focusMode: false,
    distractionBlocker: false,
  });

  // OFFLINE & SYNC
  const [offlineSettings, setOfflineSettings] = useState({
    offlineMode: true,
    autoSync: true,
    syncOnWifi: true,
    syncInterval: 15,
    maxOfflineStorage: 500,
    autoDownload: false,
  });

  // ADVANCED SETTINGS
  const [advancedSettings, setAdvancedSettings] = useState({
    cacheSize: 'medium',
    apiTimeout: 30,
    debugMode: false,
    experimentalFeatures: false,
    customCSS: false,
    performanceMode: false,
    logLevel: 'info',
  });

  // Handlers
  const handleBasicChange = (key, value) => {
    setBasicSettings(prev => ({ ...prev, [key]: value }));
    setSnackbar({ open: true, message: `${key} updated!`, severity: 'success' });
  };

  const handleAppearanceChange = (key, value) => {
    setAppearanceSettings(prev => ({ ...prev, [key]: value }));
    setSnackbar({ open: true, message: `${key} updated!`, severity: 'success' });
  };

  const handleAccessibilityChange = (key, value) => {
    setAccessibilitySettings(prev => ({ ...prev, [key]: value }));
    setSnackbar({ open: true, message: `${key} updated!`, severity: 'success' });
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
    setSnackbar({ open: true, message: `${key} updated!`, severity: 'success' });
  };

  const handleStudyChange = (key, value) => {
    setStudySettings(prev => ({ ...prev, [key]: value }));
    setSnackbar({ open: true, message: `${key} updated!`, severity: 'success' });
  };

  const handleOfflineChange = (key, value) => {
    setOfflineSettings(prev => ({ ...prev, [key]: value }));
    setSnackbar({ open: true, message: `${key} updated!`, severity: 'success' });
  };

  const handleAdvancedChange = (key, value) => {
    setAdvancedSettings(prev => ({ ...prev, [key]: value }));
    setSnackbar({ open: true, message: `${key} updated!`, severity: 'success' });
  };

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setSnackbar({ open: true, message: t('languageChanged'), severity: 'success' });
  };

  const handleClearCache = () => {
    localStorage.clear();
    setSnackbar({ open: true, message: 'Cache cleared successfully!', severity: 'success' });
  };

  const handleExportSettings = () => {
    const settingsData = {
      language,
      basicSettings,
      appearanceSettings,
      accessibilitySettings,
      privacySettings,
      studySettings,
      offlineSettings,
      advancedSettings,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scholarstock-settings.json';
    link.click();
    setSnackbar({ open: true, message: 'Settings exported!', severity: 'success' });
  };

  const SettingCard = ({ title, description, children }) => (
    <Card sx={{ p: 3, mb: 2, background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{title}</Typography>
      {description && <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>{description}</Typography>}
      {children}
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', pt: 12, pb: 8, background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))' }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Settings size={32} style={{ color: '#8b5cf6' }} />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{t('settingsTitle')}</Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Customize your Scholarstock experience with comprehensive settings for language, appearance, accessibility, privacy, study preferences, offline mode, and advanced options.
            </Typography>
          </Box>

          <Tabs 
            value={activeTab} 
            onChange={(e, val) => setActiveTab(val)}
            sx={{ mb: 4, borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<Globe size={18} />} label="Language" iconPosition="start" />
            <Tab icon={<Zap size={18} />} label="Basic" iconPosition="start" />
            <Tab icon={<Palette size={18} />} label="Appearance" iconPosition="start" />
            <Tab icon={<Accessibility size={18} />} label="Accessibility" iconPosition="start" />
            <Tab icon={<Bell size={18} />} label="Notifications" iconPosition="start" />
            <Tab icon={<Shield size={18} />} label="Privacy" iconPosition="start" />
            <Tab icon={<Eye size={18} />} label="Study" iconPosition="start" />
            <Tab icon={<Wifi size={18} />} label="Offline" iconPosition="start" />
            <Tab icon={<Lock size={18} />} label="Advanced" iconPosition="start" />
          </Tabs>

          {/* TAB 0: LANGUAGE */}
          {activeTab === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SettingCard title="🌍 Select Language" description="Choose from 100+ languages including all 22 official Indian languages">
                <Grid container spacing={2}>
                  {LANGUAGES.map((lang) => (
                    <Grid item xs={12} sm={6} md={4} key={lang.code}>
                      <Button
                        fullWidth
                        variant={language === lang.code ? 'contained' : 'outlined'}
                        onClick={() => handleLanguageChange(lang.code)}
                        sx={{
                          justifyContent: 'flex-start',
                          p: 2,
                          textAlign: 'left',
                          background: language === lang.code ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : 'transparent',
                          border: language === lang.code ? 'none' : '1px solid rgba(139, 92, 246, 0.3)',
                        }}
                      >
                        <Box sx={{ mr: 2, fontSize: 24 }}>{lang.flag}</Box>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{lang.native}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>{lang.name}</Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </SettingCard>
            </motion.div>
          )}

          {/* TAB 1: BASIC SETTINGS */}
          {activeTab === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SettingCard title="💾 Auto-Save" description="Automatically save your work">
                <FormControlLabel
                  control={<Switch checked={basicSettings.autoSave} onChange={(e) => handleBasicChange('autoSave', e.target.checked)} />}
                  label="Enable Auto-Save"
                />
                {basicSettings.autoSave && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Save every {basicSettings.autoSaveInterval} seconds</Typography>
                    <Slider value={basicSettings.autoSaveInterval} onChange={(e, val) => handleBasicChange('autoSaveInterval', val)} min={10} max={120} step={10} />
                  </Box>
                )}
              </SettingCard>

              <SettingCard title="🔔 Notifications" description="Control how you receive notifications">
                <FormControlLabel
                  control={<Switch checked={basicSettings.notifications} onChange={(e) => handleBasicChange('notifications', e.target.checked)} />}
                  label="Enable Notifications"
                />
                <FormControlLabel
                  control={<Switch checked={basicSettings.emailNotifications} onChange={(e) => handleBasicChange('emailNotifications', e.target.checked)} />}
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={<Switch checked={basicSettings.pushNotifications} onChange={(e) => handleBasicChange('pushNotifications', e.target.checked)} />}
                  label="Push Notifications"
                />
              </SettingCard>

              <SettingCard title="🔊 Sound" description="Control sound effects and volume">
                <FormControlLabel
                  control={<Switch checked={basicSettings.soundEnabled} onChange={(e) => handleBasicChange('soundEnabled', e.target.checked)} />}
                  label="Enable Sound"
                />
                {basicSettings.soundEnabled && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>Volume: {basicSettings.soundVolume}%</Typography>
                    <Slider value={basicSettings.soundVolume} onChange={(e, val) => handleBasicChange('soundVolume', val)} min={0} max={100} step={10} />
                  </Box>
                )}
              </SettingCard>
            </motion.div>
          )}

          {/* TAB 2: APPEARANCE */}
          {activeTab === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SettingCard title="🎨 Theme" description="Customize the look and feel">
                <FormControlLabel
                  control={<Switch checked={appearanceSettings.darkMode} onChange={(e) => handleAppearanceChange('darkMode', e.target.checked)} />}
                  label="Dark Mode"
                />
                <FormControlLabel
                  control={<Switch checked={appearanceSettings.compactView} onChange={(e) => handleAppearanceChange('compactView', e.target.checked)} />}
                  label="Compact View"
                />
              </SettingCard>

              <SettingCard title="📐 Layout" description="Adjust layout preferences">
                <Typography variant="body2" sx={{ mb: 1 }}>Font Size</Typography>
                <Select value={appearanceSettings.fontSize} onChange={(e) => handleAppearanceChange('fontSize', e.target.value)} fullWidth sx={{ mb: 2 }}>
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </Select>

                <Typography variant="body2" sx={{ mb: 1 }}>Sidebar Position</Typography>
                <Select value={appearanceSettings.sidebarPosition} onChange={(e) => handleAppearanceChange('sidebarPosition', e.target.value)} fullWidth>
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </Select>
              </SettingCard>
            </motion.div>
          )}

          {/* TAB 3: ACCESSIBILITY */}
          {activeTab === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SettingCard title="♿ Visual Accessibility">
                <FormControlLabel
                  control={<Switch checked={accessibilitySettings.largeText} onChange={(e) => handleAccessibilityChange('largeText', e.target.checked)} />}
                  label="Large Text Mode"
                />
                <FormControlLabel
                  control={<Switch checked={accessibilitySettings.highContrast} onChange={(e) => handleAccessibilityChange('highContrast', e.target.checked)} />}
                  label="High Contrast Mode"
                />
                <FormControlLabel
                  control={<Switch checked={accessibilitySettings.dyslexicFont} onChange={(e) => handleAccessibilityChange('dyslexicFont', e.target.checked)} />}
                  label="OpenDyslexic Font"
                />
              </SettingCard>

              <SettingCard title="⌨️ Navigation & Input">
                <FormControlLabel
                  control={<Switch checked={accessibilitySettings.keyboardNavigation} onChange={(e) => handleAccessibilityChange('keyboardNavigation', e.target.checked)} />}
                  label="Keyboard Navigation"
                />
                <FormControlLabel
                  control={<Switch checked={accessibilitySettings.focusIndicators} onChange={(e) => handleAccessibilityChange('focusIndicators', e.target.checked)} />}
                  label="Focus Indicators"
                />
                <FormControlLabel
                  control={<Switch checked={accessibilitySettings.screenReaderMode} onChange={(e) => handleAccessibilityChange('screenReaderMode', e.target.checked)} />}
                  label="Screen Reader Mode"
                />
              </SettingCard>

              <SettingCard title="🎬 Motion">
                <FormControlLabel
                  control={<Switch checked={accessibilitySettings.reducedMotion} onChange={(e) => handleAccessibilityChange('reducedMotion', e.target.checked)} />}
                  label="Reduce Animations"
                />
              </SettingCard>
            </motion.div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SettingCard title="📬 Notification Types">
                <FormControlLabel control={<Switch defaultChecked />} label="Study Reminders" />
                <FormControlLabel control={<Switch defaultChecked />} label="Deadline Alerts" />
                <FormControlLabel control={<Switch defaultChecked />} label="Community Updates" />
                <FormControlLabel control={<Switch />} label="Marketing Emails" />
              </SettingCard>
            </motion.div>
          )}

          {/* TAB 5: PRIVACY & SECURITY */}
          {activeTab === 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SettingCard title="🔒 Privacy">
                <Typography variant="body2" sx={{ mb: 1 }}>Profile Visibility</Typography>
                <Select value={privacySettings.profileVisibility} onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)} fullWidth sx={{ mb: 2 }}>
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="friends">Friends Only</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>

                <FormControlLabel
                  control={<Switch checked={privacySettings.dataCollection} onChange={(e) => handlePrivacyChange('dataCollection', e.target.checked)} />}
                  label="Allow Data Collection for Improvements"
                />
                <FormControlLabel
                  control={<Switch checked={privacySettings.analyticsTracking} onChange={(e) => handlePrivacyChange('analyticsTracking', e.target.checked)} />}
                  label="Analytics Tracking"
                />
              </SettingCard>

              <SettingCard title="🔐 Security">
                <FormControlLabel
                  control={<Switch checked={privacySettings.twoFactorAuth} onChange={(e) => handlePrivacyChange('twoFactorAuth', e.target.checked)} />}
                  label="Two-Factor Authentication"
                />
                <FormControlLabel
                  control={<Switch checked={privacySettings.rememberDevice} onChange={(e) => handlePrivacyChange('rememberDevice', e.target.checked)} />}
                  label="Remember This Device"
                />

                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Session Timeout (minutes)</Typography>
                <Slider value={privacySettings.sessionTimeout} onChange={(e, val) => handlePrivacyChange('sessionTimeout', val)} min={5} max={120} step={5} />
              </SettingCard>
            </motion.div>
          )}

          {/* TAB 6: STUDY PREFERENCES */}
          {activeTab === 6 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SettingCard title="📚 Study Goals">
                <FormControlLabel
                  control={<Switch checked={studySettings.studyReminders} onChange={(e) => handleStudyChange('studyReminders', e.target.checked)} />}
                  label="Daily Study Reminders"
                />
                {studySettings.studyReminders && (
                  <TextField type="time" value={studySettings.reminderTime} onChange={(e) => handleStudyChange('reminderTime', e.target.value)} sx={{ mt: 2 }} />
                )}

                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Daily Study Goal (minutes)</Typography>
                <Slider value={studySettings.dailyGoal} onChange={(e, val) => handleStudyChange('dailyGoal', val)} min={30} max={480} step={30} />
              </SettingCard>

              <SettingCard title="⏱️ Pomodoro Settings">
                <Typography variant="body2" sx={{ mb: 1 }}>Focus Interval (minutes)</Typography>
                <Slider value={studySettings.breakInterval} onChange={(e, val) => handleStudyChange('breakInterval', val)} min={15} max={60} step={5} />

                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Break Duration (minutes)</Typography>
                <Slider value={studySettings.breakDuration} onChange={(e, val) => handleStudyChange('breakDuration', val)} min={1} max={30} step={1} />
              </SettingCard>

              <SettingCard title="🎯 Focus Mode">
                <FormControlLabel
                  control={<Switch checked={studySettings.focusMode} onChange={(e) => handleStudyChange('focusMode', e.target.checked)} />}
                  label="Enable Focus Mode"
                />
                <FormControlLabel
                  control={<Switch checked={studySettings.distractionBlocker} onChange={(e) => handleStudyChange('distractionBlocker', e.target.checked)} />}
                  label="Block Distracting Websites"
                />
              </SettingCard>
            </motion.div>
          )}

          {/* TAB 7: OFFLINE & SYNC */}
          {activeTab === 7 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SettingCard title="📴 Offline Mode">
                <FormControlLabel
                  control={<Switch checked={offlineSettings.offlineMode} onChange={(e) => handleOfflineChange('offlineMode', e.target.checked)} />}
                  label="Enable Offline Mode"
                />
                <FormControlLabel
                  control={<Switch checked={offlineSettings.autoDownload} onChange={(e) => handleOfflineChange('autoDownload', e.target.checked)} />}
                  label="Auto-Download Materials"
                />
              </SettingCard>

              <SettingCard title="🔄 Sync Settings">
                <FormControlLabel
                  control={<Switch checked={offlineSettings.autoSync} onChange={(e) => handleOfflineChange('autoSync', e.target.checked)} />}
                  label="Auto-Sync"
                />
                <FormControlLabel
                  control={<Switch checked={offlineSettings.syncOnWifi} onChange={(e) => handleOfflineChange('syncOnWifi', e.target.checked)} />}
                  label="Sync Only on WiFi"
                />

                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Sync Interval (minutes)</Typography>
                <Slider value={offlineSettings.syncInterval} onChange={(e, val) => handleOfflineChange('syncInterval', val)} min={5} max={60} step={5} />

                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Max Offline Storage (MB)</Typography>
                <Slider value={offlineSettings.maxOfflineStorage} onChange={(e, val) => handleOfflineChange('maxOfflineStorage', val)} min={100} max={1000} step={100} />
              </SettingCard>
            </motion.div>
          )}

          {/* TAB 8: ADVANCED */}
          {activeTab === 8 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                ⚠️ Advanced settings are for experienced users. Incorrect changes may affect performance.
              </Alert>

              <SettingCard title="⚙️ Performance">
                <Typography variant="body2" sx={{ mb: 1 }}>Cache Size</Typography>
                <Select value={advancedSettings.cacheSize} onChange={(e) => handleAdvancedChange('cacheSize', e.target.value)} fullWidth sx={{ mb: 2 }}>
                  <MenuItem value="small">Small (100MB)</MenuItem>
                  <MenuItem value="medium">Medium (500MB)</MenuItem>
                  <MenuItem value="large">Large (1GB)</MenuItem>
                </Select>

                <Typography variant="body2" sx={{ mb: 1 }}>API Timeout (seconds)</Typography>
                <Slider value={advancedSettings.apiTimeout} onChange={(e, val) => handleAdvancedChange('apiTimeout', val)} min={10} max={120} step={10} />

                <FormControlLabel
                  control={<Switch checked={advancedSettings.performanceMode} onChange={(e) => handleAdvancedChange('performanceMode', e.target.checked)} />}
                  label="Performance Mode (Reduced Features)"
                />
              </SettingCard>

              <SettingCard title="🧪 Experimental">
                <FormControlLabel
                  control={<Switch checked={advancedSettings.experimentalFeatures} onChange={(e) => handleAdvancedChange('experimentalFeatures', e.target.checked)} />}
                  label="Enable Experimental Features"
                />
                <FormControlLabel
                  control={<Switch checked={advancedSettings.debugMode} onChange={(e) => handleAdvancedChange('debugMode', e.target.checked)} />}
                  label="Debug Mode"
                />
              </SettingCard>

              <SettingCard title="📊 Logging">
                <Typography variant="body2" sx={{ mb: 1 }}>Log Level</Typography>
                <Select value={advancedSettings.logLevel} onChange={(e) => handleAdvancedChange('logLevel', e.target.value)} fullWidth>
                  <MenuItem value="error">Error Only</MenuItem>
                  <MenuItem value="warn">Warnings</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="debug">Debug</MenuItem>
                </Select>
              </SettingCard>

              <SettingCard title="💾 Data Management">
                <Button variant="outlined" startIcon={<Download size={18} />} onClick={handleExportSettings} fullWidth sx={{ mb: 2 }}>
                  Export All Settings
                </Button>
                <Button variant="outlined" color="error" startIcon={<Trash2 size={18} />} onClick={handleClearCache} fullWidth>
                  Clear Cache & Local Data
                </Button>
              </SettingCard>
            </motion.div>
          )}
        </motion.div>
      </Container>

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

export default SettingsPage;
