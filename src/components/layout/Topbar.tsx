import { Bell, Search, ChevronDown, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import CommandPalette from '../CommandPalette';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Command Center',
  '/upload': 'Data Ingestion',
  '/allocation': 'AI Allocation Engine',
  '/geo': 'Geo Strategic View',
  '/analytics': 'Analytics Hub',
  '/approvals': 'Approval Pipeline',
  '/anomalies': 'Anomaly Detection',
  '/reports': 'Report Generator',
  '/transparency': 'Public Transparency',
};

export default function Topbar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const title = pageTitles[location.pathname] || 'BHARAT ResourceOS';
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMinistryOpen, setIsMinistryOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const ministryRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (ministryRef.current && !ministryRef.current.contains(event.target as Node)) {
        setIsMinistryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      style={{
        height: 64,
        background: 'rgba(17, 17, 24, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Page Title */}
      <div>
        <h2
          className="font-display"
          style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}
        >
          {title}
        </h2>
        <div
          className="font-mono"
          style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: -2, letterSpacing: 1 }}
        >
          FY 2025-26 • LIVE
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Search */}
        <div
          onClick={() => setIsSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 14px',
            borderRadius: 8,
            border: '1px solid var(--color-border-subtle)',
            background: 'rgba(255,255,255,0.02)',
            cursor: 'pointer',
          }}
        >
          <Search size={14} color="var(--color-text-muted)" />
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Search...</span>
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              color: 'var(--color-text-muted)',
              padding: '2px 6px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 4,
              marginLeft: 16,
            }}
          >
            ⌘K
          </span>
        </div>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid var(--color-border-subtle)',
              background: isNotificationsOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            <Bell size={16} color="var(--color-text-secondary)" />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--color-saffron)',
              }}
            />
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 320,
                background: 'rgba(17, 17, 24, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 12,
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                zIndex: 50,
              }}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Notifications</span>
                <span style={{ fontSize: 11, color: 'var(--color-saffron)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {[
                  { icon: <AlertCircle size={14} color="#EF4444" />, title: 'Anomaly Detected', desc: 'Unusual spending pattern in Ministry of Defence.', time: '2m ago' },
                  { icon: <CheckCircle2 size={14} color="#10B981" />, title: 'Plan Approved', desc: 'Maharashtra infrastructure plan approved.', time: '1h ago' },
                  { icon: <Clock size={14} color="#F59E0B" />, title: 'Pending Review', desc: '3 new allocation requests need your review.', time: '3h ago' },
                ].map((n, i) => (
                  <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.02)', display: 'flex', gap: 12, cursor: 'pointer', transition: 'background 0.2s' }} className="hover-bg-subtle">
                    <div style={{ marginTop: 2 }}>{n.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, color: '#fff', marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{n.desc}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontFamily: 'monospace' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 12, color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                View all notifications
              </div>
            </div>
          )}
        </div>

        {/* Ministry Selector */}
        <div ref={ministryRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setIsMinistryOpen(!isMinistryOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--color-border-subtle)',
              background: isMinistryOpen ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {user?.ministry || 'All Ministries'}
            </span>
            <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: isMinistryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>

          {/* Ministry Dropdown */}
          {isMinistryOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 240,
                background: 'rgba(17, 17, 24, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 12,
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                zIndex: 50,
                padding: 6,
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Select View</div>
              {['All Ministries', 'Ministry of Finance', 'Ministry of Defence', 'Ministry of Education', 'Ministry of Health'].map((min) => (
                <div
                  key={min}
                  onClick={() => setIsMinistryOpen(false)}
                  style={{
                    padding: '8px 10px',
                    fontSize: 13,
                    color: (user?.ministry || 'All Ministries') === min ? '#fff' : 'rgba(255,255,255,0.7)',
                    background: (user?.ministry || 'All Ministries') === min ? 'rgba(255,255,255,0.05)' : 'transparent',
                    borderRadius: 6,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  className="hover-bg-subtle"
                >
                  {min}
                  {(user?.ministry || 'All Ministries') === min && <CheckCircle2 size={14} color="var(--color-saffron)" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
