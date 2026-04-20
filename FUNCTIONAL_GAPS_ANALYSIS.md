# Functional Gaps Analysis - ScholarStock Platform

## Overview
This document identifies functional gaps in the implemented features compared to the requirements specification. These are NOT errors or bugs, but missing features and incomplete implementations that need to be added.

---

## Feature 3: University Course Sync

### Current Implementation Status: 60% Complete

**What's Working:**
- Frontend UI with university selection and course code input
- Progress indicator during sync
- Display of synced courses list
- Popular universities quick-select chips

**Functional Gaps:**

1. **No Backend Integration**
   - Frontend is calling simulated sync (fake progress bar)
   - No actual API call to `/api/course-sync` endpoint
   - No real university/course data fetching
   - Missing: `POST /api/course-sync/sync` endpoint

2. **Missing University Database**
   - No University model created
   - No course data stored in database
   - No syllabus mapping to existing materials
   - Missing: University model with fields: universityId, name, location, affiliatedBoard, courses[]

3. **Missing CourseSyncRecord Model**
   - No tracking of sync history
   - No idempotent re-sync logic
   - Missing: CourseSyncRecord model with fields: userId, universityId, courseCode, syncedAt, topicCount, matchedMaterialIds, taskIdsCreated

4. **No Task Creation from Assignments**
   - Requirement 3.4: "When a syllabus contains assignment due dates, create corresponding Task records"
   - Currently not implemented

5. **No Rate Limiting**
   - Requirement 3.10: "Enforce a rate limit of 20 requests per User per hour"
   - Not implemented

6. **No Subscription-Based Limits**
   - Requirement 3.11: "Unlimited syncs for subscribed users, 3 per month for free users"
   - Not implemented

7. **No Caching for Offline**
   - Requirement 3.7: "Return cached version if external source unavailable"
   - Not implemented

8. **No Material Matching**
   - Requirement 3.3: "Map syllabus topics to matching Materials using keyword overlap"
   - Not implemented

---

## Feature 4: Collaborative Study Rooms

### Current Implementation Status: 70% Complete

**What's Working:**
- Backend API fully implemented with all CRUD operations
- Room creation with invite codes
- Member management (join/leave)
- Chat messaging system
- Shared notes synchronization
- Annotations (highlight/comment/drawing)
- Whiteboard state persistence
- Page synchronization for co-browsing

**Functional Gaps:**

1. **No Real-Time WebSocket Support**
   - Current implementation uses REST polling
   - Requirement 4.2: "Broadcast join event within 500ms"
   - Requirement 4.5: "Broadcast strokes with latency under 100ms"
   - Missing: WebSocket server for real-time updates

2. **No Operational Transformation / CRDT**
   - Requirement 4.6: "Synchronize note content using operational transformation or CRDT"
   - Currently using simple last-write-wins (not conflict-free)

3. **No WebRTC Voice Channel**
   - Requirement 4.7: "Establish peer-to-peer audio connection using WebRTC"
   - Not implemented

4. **No Reconnection Logic**
   - Requirement 4.9: "Attempt reconnection for up to 30 seconds"
   - Not implemented

5. **Frontend Missing Real-Time UI**
   - CollaborativeStudyRooms.jsx is a stub component
   - No actual room creation/joining UI
   - No chat interface
   - No whiteboard drawing canvas
   - No shared notes editor

6. **No Annotation Persistence Model**
   - Requirement 4.13: "Annotation model with specific fields"
   - Annotations stored in StudyRoom.annotations array (not separate collection)
   - Missing: Dedicated Annotation model

7. **No SharedNote Model**
   - Requirement 4.14: "SharedNote model with fields: noteId, roomId, content, lastEditedBy, lastEditedAt, version"
   - Currently stored as string in StudyRoom.sharedNotes

---

## Feature 5: Spaced Repetition System

### Current Implementation Status: 85% Complete

**What's Working:**
- SM-2 algorithm fully implemented
- Flashcard CRUD operations
- Deck management
- Review queue with due date sorting
- Auto-generation from text
- Statistics tracking (accuracy, total reviews)
- Bulk card import

**Functional Gaps:**

1. **No Browser Notifications**
   - Requirement 5.10: "Send browser notification if not reviewed for 7+ days"
   - Not implemented

2. **No Anki Export (.apkg)**
   - Requirement 5.14: "Export Deck as Anki-compatible .apkg file"
   - Not implemented

3. **No LaTeX Formula Support**
   - Requirement 5.5: "Accept optional LaTeX formula"
   - Flashcard model has latexFormula field but frontend doesn't support rendering
   - Missing: LaTeX rendering in review UI

4. **No Image Support in Flashcards**
   - Requirement 5.5: "Accept optional image URL"
   - Model supports imageUrl but frontend doesn't display images

5. **No Rate Limiting**
   - Requirement 5.11: "Enforce rate limit of 200 review submissions per User per hour"
   - Not implemented

6. **Frontend UI Missing**
   - SpacedRepetition.jsx is a stub component
   - No flashcard review interface
   - No deck creation/management UI
   - No statistics dashboard

7. **No Motivational Messages**
   - Requirement 5.9: "Display motivational message when no cards due"
   - Not implemented

---

## Feature 6: Offline Mode with Full Sync

### Current Implementation Status: 40% Complete

**What's Working:**
- IndexedDB database setup
- Basic offline storage functions (dbPut, dbGet, dbDelete)
- Offline indicator in navigation

**Functional Gaps:**

1. **No PDF Download to IndexedDB**
   - Requirement 6.1: "Download PDF to IndexedDB"
   - Not implemented

2. **No Sync Queue Management**
   - Requirement 6.3: "Queue changes with timestamp and operation type"
   - Not implemented

3. **No Conflict Resolution**
   - Requirement 6.5: "Apply last-write-wins strategy with timestamp"
   - Not implemented

4. **No Automatic Sync on Reconnection**
   - Requirement 6.4: "Process sync queue within 60 seconds of reconnection"
   - Not implemented

5. **No ServiceWorker Registration**
   - Requirement 6.8: "Register ServiceWorker for caching static assets"
   - Not implemented

6. **No Storage Quota Management**
   - Requirement 6.9: "Support downloading up to 500 Materials"
   - Requirement 6.10: "Pause if storage falls below 100 MB"
   - Not implemented

7. **No Sync Status API**
   - Requirement 6.11: "Expose GET /api/sync/status endpoint"
   - Not implemented

8. **No PWA Installation**
   - Requirement 6.13: "Support PWA installation on Chrome, Edge, Safari"
   - Missing: manifest.json, PWA configuration

9. **Frontend UI Missing**
   - OfflineMode.jsx is mostly stub
   - No download management UI
   - No sync status display
   - No conflict resolution UI

---

## Feature 7: Custom Study Dashboard

### Current Implementation Status: 50% Complete

**What's Working:**
- Dashboard component structure
- Widget type definitions
- Basic layout concept

**Functional Gaps:**

1. **No Drag-and-Drop**
   - Requirement 7.2: "Persist new layout when User drags Widget"
   - Not implemented

2. **No Widget Persistence**
   - Requirement 7.2: "Persist layout within 2 seconds"
   - No DashboardLayout model
   - No backend API for saving layouts

3. **No Widget Data Loading**
   - Requirement 7.5: "Load saved layout and render with live data within 3 seconds"
   - Widgets don't fetch real data

4. **Missing Widget Implementations:**
   - UpcomingDeadlines Widget - not fetching Tasks
   - StudyStats Widget - not calculating study hours
   - RecentDocuments Widget - not fetching Materials
   - TodoList Widget - not integrated with Task API
   - ProgressTracker Widget - not fetching CourseSyncRecords
   - FlashcardDue Widget - not fetching due flashcards
   - StudyStreak Widget - not calculating streaks
   - ExamCountdown Widget - not implemented

5. **No Default Layout**
   - Requirement 7.11: "Render default layout if no saved layout"
   - Not implemented

6. **No DashboardLayout Model**
   - Missing: DashboardLayout model with fields: userId, widgets[], updatedAt

7. **No Widget Add/Remove**
   - Requirement 7.3 & 7.4: "Add/remove widgets from layout"
   - Not implemented

---

## Feature 8: Keyboard-First Navigation

### Current Implementation Status: 75% Complete

**What's Working:**
- Global keyboard shortcuts hook (useKeyboardShortcuts)
- Shortcut overlay with help display
- Two-key sequences (g + key)
- Navigation shortcuts (g h, g b, g f, g r, g d, g l, g p, g c)
- Search focus (/)
- Escape to close modals
- Shortcut help toggle (?)

**Functional Gaps:**

1. **No Command Palette**
   - Requirement 8.2: "Open CommandPalette when User presses Cmd+K or Ctrl+K"
   - Not implemented

2. **No Real-Time Filtering**
   - Requirement 8.3: "Filter available actions in real time as User types"
   - CommandPalette doesn't exist

3. **No PDF Viewer Shortcuts**
   - Requirement 8.6: "Support J/K for next/previous page, +/- for zoom, F for fullscreen"
   - Not implemented

4. **No Flashcard Shortcuts**
   - Requirement 8.7: "Support N to create new Flashcard, Space to flip"
   - Not implemented

5. **No Custom Shortcut Overrides**
   - Requirement 8.9: "Persist custom shortcut overrides in localStorage"
   - Not implemented

6. **No Shortcuts API Endpoint**
   - Requirement 8.10: "Expose /api/shortcuts endpoint returning shortcut manifest"
   - Not implemented

7. **No Keyboard-Only Navigation**
   - Requirement 8.12: "Shortcut overlay accessible via keyboard alone (Tab, Escape)"
   - Not fully implemented

8. **Missing Shortcuts:**
   - No "?" to display shortcuts (only toggle)
   - No vim-style navigation mentioned in requirements

---

## Summary Table

| Feature | Status | Critical Gaps |
|---------|--------|----------------|
| 3. University Course Sync | 60% | Backend API, University model, Material matching, Task creation |
| 4. Collaborative Study Rooms | 70% | WebSocket real-time, WebRTC voice, CRDT, Frontend UI |
| 5. Spaced Repetition | 85% | Notifications, Anki export, LaTeX rendering, Frontend UI |
| 6. Offline Mode | 40% | PDF download, Sync queue, ServiceWorker, PWA, Frontend UI |
| 7. Custom Dashboard | 50% | Drag-drop, Widget data, Persistence, DashboardLayout model |
| 8. Keyboard Navigation | 75% | Command Palette, PDF shortcuts, Flashcard shortcuts, API endpoint |

---

## Priority Recommendations

### High Priority (Blocking Core Functionality)
1. **Feature 4**: Implement WebSocket for real-time study rooms
2. **Feature 5**: Create frontend UI for flashcard review
3. **Feature 7**: Implement drag-drop and widget persistence
4. **Feature 3**: Create backend API for course sync

### Medium Priority (Important Features)
1. **Feature 6**: Implement offline sync queue and conflict resolution
2. **Feature 8**: Add Command Palette
3. **Feature 5**: Add browser notifications

### Low Priority (Nice-to-Have)
1. **Feature 4**: WebRTC voice channel
2. **Feature 5**: Anki export
3. **Feature 6**: PWA installation

---

## Next Steps

1. Review this analysis with the team
2. Prioritize which gaps to address first
3. Create implementation tasks for each gap
4. Assign developers to each feature
5. Set deadlines for completion
