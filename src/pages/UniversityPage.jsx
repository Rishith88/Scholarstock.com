import { useState } from 'react';
import UniversityCourseSync from '../features/course-sync/UniversityCourseSync';
import UniversityMarketplace from '../features/marketplace/UniversityMarketplace';
import UniversityAccessSystem from '../features/marketplace/UniversityAccessSystem';

const TABS = [
  { id: 'sync', label: '📚 Course Sync' },
  { id: 'marketplace', label: '🏛️ Marketplace' },
  { id: 'access', label: '🛡️ Access System' },
];

export default function UniversityPage() {
  const [activeTab, setActiveTab] = useState('sync');

  return (
    <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh' }}>
      {/* Page Tab Bar */}
      <div style={{
        display: 'flex',
        gap: '.3rem',
        padding: '1.2rem 2rem .5rem',
        borderBottom: '1px solid var(--gb)',
        background: 'var(--glass)',
        backdropFilter: 'blur(20px)',
        flexWrap: 'wrap',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: activeTab === t.id ? 'linear-gradient(135deg,var(--blue),var(--purple))' : 'transparent',
              border: activeTab === t.id ? 'none' : '1px solid var(--gb)',
              color: activeTab === t.id ? '#fff' : 'var(--muted)',
              padding: '.55rem 1.3rem',
              borderRadius: '10px',
              fontSize: '.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all .2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'sync' && <UniversityCourseSync />}
      {activeTab === 'marketplace' && <UniversityMarketplace />}
      {activeTab === 'access' && <UniversityAccessSystem />}
    </div>
  );
}
