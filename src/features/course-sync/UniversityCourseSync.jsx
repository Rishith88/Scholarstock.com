import { useState } from 'react';
import API_URL from '../../config';
import { useAuth } from '../../context/AuthContext';

const POPULAR_UNIS = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur',
  'BITS Pilani', 'NIT Trichy', 'Delhi University', 'Mumbai University',
  'MIT', 'Stanford University', 'Harvard University', 'Oxford University',
];

export default function UniversityCourseSync() {
  const { token } = useAuth();
  const [universityName, setUniversityName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncedCourses, setSyncedCourses] = useState([
    { id: 1, name: 'Calculus I', code: 'MATH 101', university: 'IIT Bombay', items: 127, lastSync: '2 hours ago' },
    { id: 2, name: 'Engineering Physics', code: 'PHY 201', university: 'IIT Delhi', items: 94, lastSync: '1 day ago' },
  ]);

  const handleSync = async (e) => {
    e.preventDefault();
    if (!universityName || !courseCode) return;
    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 250));
      setSyncProgress(i);
    }

    setSyncedCourses(prev => [...prev, {
      id: Date.now(),
      name: `${courseCode.toUpperCase()} Course`,
      code: courseCode.toUpperCase(),
      university: universityName,
      items: Math.floor(Math.random() * 150) + 30,
      lastSync: 'Just now',
    }]);

    setIsSyncing(false);
    setUniversityName('');
    setCourseCode('');
  };

  return (
    <div className="ucs-wrap">
      {/* Header */}
      <div className="ucs-header">
        <div>
          <h2 className="ucs-title">📚 University Course Sync</h2>
          <p className="ucs-sub">Auto-import syllabi, lecture slides, assignments and due dates by entering your university + course code</p>
        </div>
      </div>

      {/* Sync Form */}
      <div className="ucs-form-card">
        <form onSubmit={handleSync}>
          <div className="ucs-form-row">
            <div className="ucs-form-group" style={{ flex: 2 }}>
              <label className="ucs-label">University Name</label>
              <input
                className="ucs-input"
                value={universityName}
                onChange={e => setUniversityName(e.target.value)}
                placeholder="e.g. IIT Bombay, MIT, Oxford..."
                disabled={isSyncing}
                required
              />
            </div>
            <div className="ucs-form-group" style={{ flex: 1 }}>
              <label className="ucs-label">Course Code</label>
              <input
                className="ucs-input"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                placeholder="e.g. CS101"
                disabled={isSyncing}
                required
              />
            </div>
            <button type="submit" className="ucs-sync-btn" disabled={isSyncing || !universityName || !courseCode}>
              {isSyncing ? '⟳ Syncing...' : '🔄 Sync'}
            </button>
          </div>

          {isSyncing && (
            <div className="ucs-progress-wrap">
              <div className="ucs-progress-bar">
                <div className="ucs-progress-fill" style={{ width: `${syncProgress}%` }} />
              </div>
              <span className="ucs-progress-label">Syncing course materials... {syncProgress}%</span>
            </div>
          )}
        </form>
      </div>

      {/* Popular Universities */}
      <div className="ucs-section">
        <div className="ucs-section-label">Popular Universities</div>
        <div className="ucs-chips">
          {POPULAR_UNIS.map(uni => (
            <button key={uni} className="ucs-chip" onClick={() => setUniversityName(uni)}>{uni}</button>
          ))}
        </div>
      </div>

      {/* Synced Courses */}
      <div className="ucs-section">
        <div className="ucs-section-label">Synced Courses ({syncedCourses.length})</div>
        <div className="ucs-courses-list">
          {syncedCourses.map(course => (
            <div key={course.id} className="ucs-course-card">
              <div className="ucs-course-icon">🎓</div>
              <div className="ucs-course-info">
                <div className="ucs-course-name">
                  {course.name}
                  <span className="ucs-code-badge">{course.code}</span>
                  <span className="ucs-synced-badge">✓ Synced</span>
                </div>
                <div className="ucs-course-uni">{course.university}</div>
                <div className="ucs-course-meta">
                  <span>📄 {course.items} materials</span>
                  <span>🕐 {course.lastSync}</span>
                </div>
              </div>
              <button className="ucs-view-btn">View →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
