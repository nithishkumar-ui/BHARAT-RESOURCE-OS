import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Users, Building2, TrendingUp, Briefcase,
  BookOpen, HeartPulse, Cpu, Landmark, CheckCircle2, Clock, AlertCircle,
  ChevronRight, BarChart3,
} from 'lucide-react';
import type { StateDetail } from '../lib/stateData';

function getHeatColor(heat: number): string {
  if (heat >= 0.9) return '#00c853';
  if (heat >= 0.75) return '#ffc107';
  if (heat >= 0.6) return '#ff6b00';
  return '#ff1744';
}

const statusConfig = {
  approved: { icon: CheckCircle2, color: '#00c853', label: 'Approved' },
  pending: { icon: Clock, color: '#ffc107', label: 'Pending' },
  'in-review': { icon: AlertCircle, color: '#1a73e8', label: 'In Review' },
} as const;

export default function StateDetailPanel({
  state,
  onClose,
}: {
  state: StateDetail | null;
  onClose: () => void;
}) {
  if (!state) return null;

  const totalAllocated = state.budgetBreakdown.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = state.budgetBreakdown.reduce((s, b) => s + b.spent, 0);
  const overallUtil = Math.round((totalSpent / totalAllocated) * 100);
  const approvedCount = state.approvedPlans.filter(p => p.status === 'approved').length;
  const totalPlanAmount = state.approvedPlans.reduce((s, p) => s + p.amount, 0);

  const analyticsItems = [
    { label: 'GDP Growth', value: `${state.analytics.gdpGrowth}%`, icon: TrendingUp, color: '#00c853' },
    { label: 'Employment', value: `${state.analytics.employmentRate}%`, icon: Briefcase, color: '#ff6b00' },
    { label: 'Literacy', value: `${state.analytics.literacyRate}%`, icon: BookOpen, color: '#1a73e8' },
    { label: 'Health Index', value: `${state.analytics.healthIndex}%`, icon: HeartPulse, color: '#ff1744' },
    { label: 'Infrastructure', value: `${state.analytics.infraScore}%`, icon: Building2, color: '#ffc107' },
    { label: 'Digital Access', value: `${state.analytics.digitalPenetration}%`, icon: Cpu, color: '#9c27b0' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="state-panel-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        }}
      />
      <motion.div
        key="state-panel"
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 101,
          width: 520, maxWidth: '95vw',
          background: 'var(--color-bg-surface)',
          borderLeft: '1px solid var(--color-border-subtle)',
          overflowY: 'auto', overflowX: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border-subtle)',
          background: `linear-gradient(135deg, ${getHeatColor(state.heat)}10, transparent)`,
          position: 'sticky', top: 0, zIndex: 2,
          backdropFilter: 'blur(16px)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: getHeatColor(state.heat),
                boxShadow: `0 0 12px ${getHeatColor(state.heat)}80`,
              }} />
              <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{state.name}</h2>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} /> {state.capital}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={12} /> {state.population}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Landmark size={12} /> {state.districts} Districts
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)',
            borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--color-text-secondary)',
          }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Key Metrics Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Total Budget', value: `₹${state.budget} Cr`, color: 'var(--color-saffron)' },
              { label: 'Utilization', value: `${overallUtil}%`, color: getHeatColor(state.heat) },
              { label: 'Plans Approved', value: `${approvedCount}/${state.approvedPlans.length}`, color: '#00c853' },
            ].map(m => (
              <div key={m.label} style={{
                background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)',
                borderRadius: 12, padding: '14px 16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>{m.label}</div>
                <div className="font-mono" style={{ fontSize: 20, fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Analytics Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <BarChart3 size={16} color="var(--color-saffron)" />
              <span style={{ fontSize: 14, fontWeight: 700 }}>State Analytics</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {analyticsItems.map(a => {
                const Icon = a.icon;
                const val = parseFloat(a.value);
                return (
                  <div key={a.label} style={{
                    background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)',
                    borderRadius: 10, padding: 14,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <Icon size={14} color={a.color} />
                      <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{a.label}</span>
                    </div>
                    <div className="font-mono" style={{ fontSize: 18, fontWeight: 700, color: a.color, marginBottom: 6 }}>{a.value}</div>
                    <div style={{
                      height: 4, borderRadius: 2, background: 'var(--color-bg-elevated)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${Math.min(val, 100)}%`, height: '100%', borderRadius: 2,
                        background: a.color,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget Breakdown */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Landmark size={16} color="var(--color-chakra-glow)" />
                <span style={{ fontSize: 14, fontWeight: 700 }}>Budget Breakdown</span>
              </div>
              <span className="font-mono" style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                ₹{totalSpent} / ₹{totalAllocated} Cr
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {state.budgetBreakdown.map(b => {
                const pct = Math.round((b.spent / b.allocated) * 100);
                return (
                  <div key={b.sector} style={{
                    background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)',
                    borderRadius: 10, padding: '12px 16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.color }} />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{b.sector}</span>
                      </div>
                      <span className="font-mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                        ₹{b.spent} / ₹{b.allocated} Cr
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        flex: 1, height: 6, borderRadius: 3, background: 'var(--color-bg-elevated)',
                        overflow: 'hidden',
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          style={{ height: '100%', borderRadius: 3, background: b.color }}
                        />
                      </div>
                      <span className="font-mono" style={{
                        fontSize: 11, fontWeight: 700, minWidth: 38, textAlign: 'right',
                        color: pct >= 85 ? '#00c853' : pct >= 60 ? '#ffc107' : '#ff1744',
                      }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approved Plans */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} color="#00c853" />
                <span style={{ fontSize: 14, fontWeight: 700 }}>Plans & Projects</span>
              </div>
              <span className="font-mono" style={{ fontSize: 12, color: 'var(--color-saffron)' }}>
                ₹{totalPlanAmount} Cr Total
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {state.approvedPlans.map(plan => {
                const cfg = statusConfig[plan.status];
                const StatusIcon = cfg.icon;
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)',
                      borderRadius: 10, padding: '14px 16px',
                      cursor: 'pointer', transition: 'border-color 0.2s',
                    }}
                    whileHover={{ borderColor: `${cfg.color}44` }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{plan.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                          {plan.ministry} • {plan.id}
                        </div>
                      </div>
                      <ChevronRight size={14} color="var(--color-text-muted)" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <StatusIcon size={14} color={cfg.color} />
                        <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className="font-mono" style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                          {plan.date}
                        </span>
                        <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-saffron)' }}>
                          ₹{plan.amount} Cr
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer spacer */}
          <div style={{ height: 20 }} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
