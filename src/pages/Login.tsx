import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Hexagon, ArrowRight, Eye, EyeOff, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { useAuthStore, demoLogin } from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, signupWithEmail, error, clearError, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      if (isSignup) {
        await signupWithEmail(email, password, displayName);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/dashboard');
    } catch {
      // error is already set in the store
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch {
      // error is already set in the store
    }
  };

  const handleDemoLogin = () => {
    demoLogin();
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--color-bg-void)',
      }}
    >
      {/* Left Panel — Visual */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, var(--color-bg-void), var(--color-bg-surface))',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,107,0,0.06) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 70%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 48 }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-glow))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: '0 8px 40px rgba(255,107,0,0.25)',
            }}
          >
            <Hexagon size={40} color="#0a0a0f" strokeWidth={2} />
          </div>
          <h2 className="font-display" style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
            <span style={{ color: 'var(--color-text-primary)' }}>BHARAT </span>
            <span className="gradient-saffron">ResourceOS</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', maxWidth: 400, lineHeight: 1.7 }}>
            AI-powered fiscal intelligence for transparent government resource allocation
          </p>

          <div style={{ marginTop: 48, display: 'flex', gap: 24, justifyContent: 'center' }}>
            {[
              { val: '₹45L Cr', lbl: 'Budget' },
              { val: '36', lbl: 'States' },
              { val: '94', lbl: 'Ministries' },
            ].map((s) => (
              <div key={s.lbl} style={{ textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-saffron)' }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Form */}
      <div
        style={{
          width: 480,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 48,
          background: 'var(--color-bg-surface)',
          borderLeft: '1px solid var(--color-border-subtle)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="font-display" style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
            {isSignup ? 'Create Account' : 'Welcome back'}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 36 }}>
            {isSignup ? 'Register to access the command center' : 'Sign in to access the command center'}
          </p>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '12px 24px',
              borderRadius: 12,
              border: '1px solid var(--color-border-subtle)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--color-text-primary)',
              fontSize: 14,
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s',
              marginBottom: 20,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-saffron)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,107,0,0.05)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-subtle)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '4px 0 20px' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border-subtle)' }} />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border-subtle)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Display Name (signup only) */}
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: 20 }}
              >
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <UserPlus size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Dr. Ananya Sharma"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 40px',
                      borderRadius: 10,
                      border: '1px solid var(--color-border-subtle)',
                      background: 'var(--color-bg-void)',
                      color: 'var(--color-text-primary)',
                      fontSize: 14,
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      fontFamily: 'var(--font-body)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-saffron)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-subtle)')}
                  />
                </div>
              </motion.div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                Official Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gov.in"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    borderRadius: 10,
                    border: '1px solid var(--color-border-subtle)',
                    background: 'var(--color-bg-void)',
                    color: 'var(--color-text-primary)',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-saffron)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-subtle)')}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? 'Min 6 characters' : 'Enter password'}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 40px',
                    borderRadius: 10,
                    border: '1px solid var(--color-border-subtle)',
                    background: 'var(--color-bg-void)',
                    color: 'var(--color-text-primary)',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-saffron)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-subtle)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '14px 24px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-glow))',
                color: '#0a0a0f',
                fontSize: 15,
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-display)',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 18, height: 18, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0a0a0f', borderRadius: '50%' }}
                  />
                  {isSignup ? 'Creating Account...' : 'Authenticating...'}
                </>
              ) : (
                <>
                  {isSignup ? <UserPlus size={18} /> : <LogIn size={18} />}
                  {isSignup ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              onClick={() => { setIsSignup(!isSignup); clearError(); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-saffron)',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border-subtle)' }} />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>DEMO</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border-subtle)' }} />
          </div>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            style={{
              width: '100%',
              padding: '12px 24px',
              borderRadius: 12,
              border: '1px solid var(--color-border-subtle)',
              background: 'rgba(255,255,255,0.02)',
              color: 'var(--color-text-secondary)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-chakra-blue)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-subtle)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
            }}
          >
            Launch Demo Mode (Admin)
          </button>

          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 24 }}>
            Protected by Firebase Auth • End-to-end encrypted
          </p>
        </motion.div>
      </div>
    </div>
  );
}
