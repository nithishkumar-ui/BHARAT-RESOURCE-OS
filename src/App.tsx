import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { seedInitialData } from './lib/firestoreService';
import AppShell from './components/layout/AppShell';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Allocation from './pages/Allocation';
import GeoView from './pages/GeoView';
import Analytics from './pages/Analytics';
import Approvals from './pages/Approvals';
import Anomalies from './pages/Anomalies';
import Reports from './pages/Reports';
import Transparency from './pages/Transparency';

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading spinner while Firebase checks auth state
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-void)',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: '3px solid rgba(255,107,0,0.15)',
            borderTopColor: 'var(--color-saffron)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, fontFamily: 'var(--font-body)' }}>
          Verifying session...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  // Seed Firestore with sample data when first authenticated user logs in
  useEffect(() => {
    if (isAuthenticated) {
      seedInitialData().catch(console.error);
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes inside AppShell */}
        <Route
          element={
            <RouteGuard>
              <AppShell />
            </RouteGuard>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/allocation" element={<Allocation />} />
          <Route path="/geo" element={<GeoView />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/anomalies" element={<Anomalies />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/transparency" element={<Transparency />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
