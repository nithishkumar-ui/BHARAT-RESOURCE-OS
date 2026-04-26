import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Search,
  TrendingUp,
  IndianRupee,
  Building2,
  MapPin,
  ArrowUpRight,
  ExternalLink,
  BarChart3,
  Shield,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const publicStats = [
  { label: 'Total Budget FY25', value: '₹48.2 Lakh Cr', icon: IndianRupee, color: '#ff6b00' },
  { label: 'Ministries Covered', value: '52', icon: Building2, color: '#1a73e8' },
  { label: 'States Tracked', value: '28 + 8 UT', icon: MapPin, color: '#00c853' },
  { label: 'Transparency Score', value: '94/100', icon: Shield, color: '#9c27b0' },
];

const topAllocations = [
  { ministry: 'Defence', amount: 593000 },
  { ministry: 'Railways', amount: 255000 },
  { ministry: 'Rural Development', amount: 178200 },
  { ministry: 'Agriculture', amount: 125100 },
  { ministry: 'Education', amount: 112600 },
  { ministry: 'Health & FW', amount: 89300 },
  { ministry: 'Home Affairs', amount: 85000 },
  { ministry: 'IT & Electronics', amount: 52400 },
].map((d) => ({ ...d, amount: Math.round(d.amount / 100) }));

const recentUpdates = [
  { title: 'FY25 Q3 Budget Released', date: '18 Apr 2025', type: 'Release' },
  { title: 'MGNREGA Additional Allocation', date: '15 Apr 2025', type: 'Amendment' },
  { title: 'PM-KISAN Fund Transfer', date: '12 Apr 2025', type: 'Transfer' },
  { title: 'Railway Capital Expenditure', date: '10 Apr 2025', type: 'Release' },
  { title: 'Education Cess Utilization Report', date: '8 Apr 2025', type: 'Report' },
];

export default function Transparency() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(255,107,0,0.05), rgba(26,115,232,0.05))',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <Globe size={28} color="var(--color-saffron)" />
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800 }}>
            Public Transparency Portal
          </h1>
        </div>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto 24px' }}>
          Real-time budget allocation data for the Government of India. Every rupee tracked, every decision transparent.
        </p>

        {/* Search */}
        <div
          style={{
            display: 'flex',
            maxWidth: 480,
            margin: '0 auto',
            borderRadius: 12,
            border: '1px solid var(--color-border-subtle)',
            background: 'var(--color-bg-card)',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px' }}>
            <Search size={18} color="var(--color-text-muted)" />
          </div>
          <input
            type="text"
            placeholder="Search ministry, scheme, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-primary)',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'var(--color-saffron)',
              color: '#0a0a0f',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {publicStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-base"
              style={{ textAlign: 'center', padding: '24px 16px' }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `${stat.color}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <Icon size={22} color={stat.color} />
              </div>
              <div className="font-display" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart + Updates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        {/* Bar Chart */}
        <div className="card-base">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>Top Ministry Allocations</h3>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>FY25 Union Budget (₹ Crore)</p>
            </div>
            <BarChart3 size={18} color="var(--color-text-muted)" />
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={topAllocations} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis type="number" tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
              <YAxis type="category" dataKey="ministry" width={120} tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
              <Tooltip contentStyle={{ background: '#16161e', border: '1px solid #2a2a35', borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="amount" fill="#ff6b00" radius={[0, 6, 6, 0]} name="₹ Cr" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Updates */}
        <div className="card-base" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>Recent Updates</h3>
          </div>
          {recentUpdates.map((update, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 20px',
                borderBottom: i < recentUpdates.length - 1 ? '1px solid rgba(42,42,53,0.5)' : 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background:
                    update.type === 'Release'
                      ? '#00c853'
                      : update.type === 'Amendment'
                      ? '#ffc107'
                      : update.type === 'Transfer'
                      ? '#1a73e8'
                      : '#9c27b0',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{update.title}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {update.date} • {update.type}
                </div>
              </div>
              <ExternalLink size={14} color="var(--color-text-muted)" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div
        className="card-base"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 28px',
          background: 'linear-gradient(135deg, rgba(255,107,0,0.06), rgba(26,115,232,0.06))',
        }}
      >
        <div>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            Open Data API
          </h3>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Access budget allocation data programmatically via our REST API
          </p>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid var(--color-saffron)',
            background: 'rgba(255,107,0,0.08)',
            color: 'var(--color-saffron)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          View API Docs <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
