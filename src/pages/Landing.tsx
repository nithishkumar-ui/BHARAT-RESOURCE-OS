import { motion } from 'framer-motion';
import { ArrowRight, Shield, BrainCircuit, Globe2, BarChart3, Zap, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import HeroOrb from '../components/three/HeroOrb';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI-Powered Allocation',
    desc: 'Gemini 2.0 Flash analyzes historical patterns to optimize fund distribution across ministries.',
    gradient: 'linear-gradient(135deg, #ff6b00, #ff8c38)',
  },
  {
    icon: Globe2,
    title: '3D Geo Intelligence',
    desc: 'Interactive India terrain map with real-time fund flow visualization and heat mapping.',
    gradient: 'linear-gradient(135deg, #1a73e8, #4a9af5)',
  },
  {
    icon: Shield,
    title: 'Anomaly Detection',
    desc: 'AI-driven forensic analysis flags suspicious spending patterns and fund leakages.',
    gradient: 'linear-gradient(135deg, #00c853, #69f0ae)',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    desc: 'Multi-dimensional analysis with SDG alignment tracking and trend forecasting.',
    gradient: 'linear-gradient(135deg, #9c27b0, #ce93d8)',
  },
  {
    icon: Lock,
    title: 'Role-Based Access',
    desc: 'Granular permissions for Ministers, Analysts, Admins, and Public transparency portals.',
    gradient: 'linear-gradient(135deg, #ffc107, #ffeb3b)',
  },
  {
    icon: Zap,
    title: 'Real-Time Pipeline',
    desc: 'Excel ingestion, validation, AI processing, and PDF report generation in one flow.',
    gradient: 'linear-gradient(135deg, #ff1744, #ff8a80)',
  },
];

const stats = [
  { value: '₹45.03L Cr', label: 'Budget Managed' },
  { value: '94', label: 'Ministries Tracked' },
  { value: '28+8', label: 'States & UTs' },
  { value: '99.7%', label: 'Allocation Accuracy' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-void)', overflow: 'hidden' }}>
      {/* ── Hero Section ── */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 3D Background */}
        <Suspense fallback={null}>
          <HeroOrb />
        </Suspense>

        {/* Radial Glow */}
        <div
          style={{
            position: 'absolute',
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 800, padding: '0 24px' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 9999,
              border: '1px solid rgba(255, 107, 0, 0.3)',
              background: 'rgba(255, 107, 0, 0.08)',
              marginBottom: 24,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c853' }} />
            <span className="font-mono" style={{ fontSize: 11, color: 'var(--color-saffron)', letterSpacing: 1.5 }}>
              GOVERNMENT OF INDIA • POWERED BY GEMINI AI
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-display"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}
          >
            <span style={{ color: 'var(--color-text-primary)' }}>BHARAT </span>
            <span className="gradient-saffron">Resource</span>
            <span style={{ color: 'var(--color-text-primary)' }}>OS</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontSize: 18, color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.7 }}
          >
            AI-powered fiscal intelligence platform for transparent, equitable, and data-driven
            government resource allocation across India.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center' }}
          >
            <button
              onClick={() => navigate('/login')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 32px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-glow))',
                color: '#0a0a0f',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(255,107,0,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              Access Platform <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/transparency')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 32px',
                borderRadius: 12,
                border: '1px solid var(--color-border-subtle)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--color-text-secondary)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-saffron)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-subtle)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
              }}
            >
              Public Dashboard
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 24,
            height: 40,
            borderRadius: 12,
            border: '2px solid var(--color-border-subtle)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 8,
          }}
        >
          <div style={{ width: 3, height: 8, borderRadius: 3, background: 'var(--color-saffron)' }} />
        </motion.div>
      </section>

      {/* ── Stats Strip ── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: 'var(--color-border-subtle)',
          borderTop: '1px solid var(--color-border-subtle)',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{
              padding: '32px 24px',
              textAlign: 'center',
              background: 'var(--color-bg-surface)',
            }}
          >
            <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-saffron)' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── Features Grid ── */}
      <section style={{ padding: '96px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2 className="font-display" style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
            Intelligent <span className="gradient-saffron">Governance</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Six pillars of AI-driven resource management for the world's largest democracy.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-base"
                style={{ cursor: 'default' }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: feat.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Icon size={22} color="#0a0a0f" />
                </div>
                <h3 className="font-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: '32px 48px',
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="font-mono" style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          © 2025 BHARAT ResourceOS • Government of India
        </span>
        <span className="font-mono" style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          Built with Gemini AI + Firebase
        </span>
      </footer>
    </div>
  );
}
