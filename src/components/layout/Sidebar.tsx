import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  BrainCircuit,
  Globe2,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  LogOut,
  Hexagon,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'minister', 'analyst'] },
  { to: '/upload', icon: Upload, label: 'Data Upload', roles: ['admin', 'analyst'] },
  { to: '/allocation', icon: BrainCircuit, label: 'AI Allocation', roles: ['admin', 'minister'] },
  { to: '/geo', icon: Globe2, label: 'Geo View', roles: ['admin', 'minister', 'analyst'] },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin', 'minister', 'analyst'] },
  { to: '/approvals', icon: CheckCircle2, label: 'Approvals', roles: ['admin', 'minister'] },
  { to: '/anomalies', icon: AlertTriangle, label: 'Anomalies', roles: ['admin', 'analyst'] },
  { to: '/reports', icon: FileText, label: 'Reports', roles: ['admin', 'minister', 'analyst'] },
  { to: '/transparency', icon: Eye, label: 'Transparency', roles: ['admin', 'public'] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const role = user?.role || 'public';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      style={{
        width: 260,
        minHeight: '100vh',
        background: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '0 24px 28px',
          borderBottom: '1px solid var(--color-border-subtle)',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-glow))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Hexagon size={22} color="#0a0a0f" strokeWidth={2.5} />
          </div>
          <div>
            <h1
              className="font-display"
              style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}
            >
              BHARAT
            </h1>
            <span
              className="font-mono"
              style={{ fontSize: 10, color: 'var(--color-saffron)', letterSpacing: 2, textTransform: 'uppercase' }}
            >
              ResourceOS
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  position: 'relative',
                  background: isActive ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: 20,
                      borderRadius: 4,
                      background: 'var(--color-saffron)',
                    }}
                  />
                )}
                <Icon
                  size={18}
                  style={{
                    color: isActive ? 'var(--color-saffron)' : 'var(--color-text-secondary)',
                    transition: 'color 0.2s',
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    transition: 'color 0.2s',
                  }}
                >
                  {item.label}
                </span>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--color-border-subtle)',
          marginTop: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-chakra-blue), var(--color-chakra-glow))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {user?.displayName || 'Guest'}
            </div>
            <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
              {user?.role?.toUpperCase() || 'PUBLIC'}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid var(--color-border-subtle)',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            fontSize: 12,
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-red-alert)';
            (e.currentTarget as HTMLElement).style.color = 'var(--color-red-alert)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-subtle)';
            (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
          }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
