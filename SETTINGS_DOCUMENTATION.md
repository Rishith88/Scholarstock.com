# ⚙️ Comprehensive Settings Documentation

## Overview
Scholarstock now includes a complete settings system with 9 tabs covering basic, appearance, accessibility, notifications, privacy, study preferences, offline mode, and advanced options.

## Settings Tabs

### 1. 🌍 Language Settings
- **100+ Languages Supported**
- All 22 official Indian languages
- Global languages with RTL support
- Persistent storage (localStorage)
- Real-time switching

**Key Features:**
- Language selection with flags
- Native language names
- Automatic direction switching (RTL/LTR)
- Saved across sessions

---

### 2. ⚡ Basic Settings

#### Auto-Save
- **Toggle**: Enable/Disable auto-save
- **Interval**: 10-120 seconds (adjustable)
- **Default**: Enabled, 30 seconds
- **Use Case**: Prevent data loss

#### Notifications
- **Enable Notifications**: Master toggle
- **Email Notifications**: Receive via email
- **Push Notifications**: Browser push alerts
- **Default**: Enabled

#### Sound
- **Enable Sound**: Toggle sound effects
- **Volume Control**: 0-100% slider
- **Default**: Enabled, 70%
- **Use Case**: Audio feedback for actions

---

### 3. 🎨 Appearance Settings

#### Theme
- **Dark Mode**: Toggle dark/light theme
- **Compact View**: Reduce spacing
- **Default**: Light mode, normal view

#### Layout
- **Font Size**: Small, Medium, Large
- **Sidebar Position**: Left or Right
- **Default**: Medium, Left

---

### 4. ♿ Accessibility Settings

#### Visual Accessibility
- **Large Text Mode**: Increase font size
- **High Contrast Mode**: Improve visibility
- **OpenDyslexic Font**: Dyslexia-friendly typeface
- **Default**: All disabled

#### Navigation & Input
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Visible focus outlines
- **Screen Reader Mode**: Optimize for screen readers
- **Default**: Keyboard nav enabled, focus indicators enabled

#### Motion
- **Reduce Animations**: Minimize motion effects
- **Default**: Disabled
- **Use Case**: Motion sensitivity

---

### 5. 🔔 Notifications Settings

#### Notification Types
- **Study Reminders**: Daily study alerts
- **Deadline Alerts**: Upcoming deadline notifications
- **Community Updates**: Platform updates
- **Marketing Emails**: Promotional content
- **Default**: Study, Deadline, Community enabled

---

### 6. 🔒 Privacy & Security Settings

#### Privacy
- **Profile Visibility**: Public, Friends Only, Private
- **Data Collection**: Allow/Disallow
- **Analytics Tracking**: Enable/Disable
- **Default**: Friends Only, Disabled, Enabled

#### Security
- **Two-Factor Authentication**: 2FA toggle
- **Remember Device**: Auto-login on device
- **Session Timeout**: 5-120 minutes
- **Default**: 2FA disabled, Remember enabled, 30 min timeout

---

### 7. 📚 Study Preferences Settings

#### Study Goals
- **Daily Reminders**: Enable/Disable
- **Reminder Time**: Set time (HH:MM format)
- **Daily Goal**: 30-480 minutes
- **Default**: Enabled, 09:00, 120 minutes

#### Pomodoro Settings
- **Focus Interval**: 15-60 minutes
- **Break Duration**: 1-30 minutes
- **Default**: 25 min focus, 5 min break

#### Focus Mode
- **Focus Mode**: Enable/Disable
- **Distraction Blocker**: Block websites
- **Default**: Both disabled

---

### 8. 📴 Offline & Sync Settings

#### Offline Mode
- **Enable Offline Mode**: Toggle offline access
- **Auto-Download**: Automatically download materials
- **Default**: Enabled, Disabled

#### Sync Settings
- **Auto-Sync**: Automatic synchronization
- **Sync Only on WiFi**: Save mobile data
- **Sync Interval**: 5-60 minutes
- **Max Storage**: 100-1000 MB
- **Default**: Enabled, Enabled, 15 min, 500 MB

---

### 9. 🔧 Advanced Settings

#### Performance
- **Cache Size**: Small (100MB), Medium (500MB), Large (1GB)
- **API Timeout**: 10-120 seconds
- **Performance Mode**: Reduced features for speed
- **Default**: Medium, 30 sec, Disabled

#### Experimental
- **Experimental Features**: Beta features
- **Debug Mode**: Developer debugging
- **Default**: Both disabled

#### Logging
- **Log Level**: Error, Warn, Info, Debug
- **Default**: Info

#### Data Management
- **Export Settings**: Download as JSON
- **Clear Cache**: Remove all local data
- **Warning**: Clearing cache removes all settings

---

## Settings Storage

### localStorage Keys
- `scholarstock_language`: Current language code
- `scholarstock_settings`: All settings (JSON)
- `scholarstock_preferences`: User preferences

### Export Format
```json
{
  "language": "en",
  "basicSettings": { ... },
  "appearanceSettings": { ... },
  "accessibilitySettings": { ... },
  "privacySettings": { ... },
  "studySettings": { ... },
  "offlineSettings": { ... },
  "advancedSettings": { ... },
  "exportedAt": "2026-04-20T10:30:00Z"
}
```

---

## Default Settings Summary

| Category | Setting | Default |
|----------|---------|---------|
| Language | Language | English |
| Basic | Auto-Save | Enabled (30s) |
| Basic | Notifications | Enabled |
| Basic | Sound | Enabled (70%) |
| Appearance | Dark Mode | Disabled |
| Appearance | Font Size | Medium |
| Accessibility | Large Text | Disabled |
| Accessibility | High Contrast | Disabled |
| Privacy | Profile Visibility | Friends Only |
| Privacy | Session Timeout | 30 minutes |
| Study | Daily Goal | 120 minutes |
| Study | Focus Interval | 25 minutes |
| Offline | Offline Mode | Enabled |
| Offline | Max Storage | 500 MB |
| Advanced | Cache Size | Medium |
| Advanced | API Timeout | 30 seconds |

---

## Best Practices

### For Students
1. Enable study reminders for consistency
2. Set realistic daily goals
3. Use Pomodoro settings for focus
4. Enable offline mode for on-the-go studying
5. Use accessibility features if needed

### For Accessibility
1. Enable large text for vision issues
2. Use high contrast for better visibility
3. Enable screen reader mode for assistive tech
4. Use keyboard navigation exclusively
5. Enable reduced motion if sensitive

### For Performance
1. Use medium cache size for balance
2. Enable sync only on WiFi to save data
3. Set appropriate API timeout
4. Use performance mode on older devices
5. Clear cache periodically

### For Privacy
1. Set profile visibility to Friends Only
2. Enable two-factor authentication
3. Set reasonable session timeout
4. Disable analytics if privacy-conscious
5. Review data collection settings

---

## Troubleshooting

### Settings Not Saving
- Check browser localStorage is enabled
- Clear browser cache and try again
- Check browser privacy settings

### Language Not Changing
- Hard refresh browser (Ctrl+Shift+R)
- Clear localStorage and reload
- Check browser language settings

### Performance Issues
- Reduce cache size
- Enable performance mode
- Clear cache and restart
- Disable experimental features

### Accessibility Not Working
- Ensure browser supports features
- Update browser to latest version
- Check OS accessibility settings
- Try different combinations

---

## Future Enhancements

- [ ] Cloud sync for settings across devices
- [ ] Settings profiles (presets)
- [ ] Scheduled settings changes
- [ ] Settings backup to cloud
- [ ] Import settings from file
- [ ] Settings sharing with team
- [ ] Mobile app settings sync
- [ ] Advanced scheduling options

---

**Last Updated**: April 20, 2026
**Version**: 1.0.0
**Status**: Production Ready
