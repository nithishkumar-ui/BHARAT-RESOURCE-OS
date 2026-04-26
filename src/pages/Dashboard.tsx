import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Building2,
  Users,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const kpiData = [
  { title: 'Total Budget', value: '₹45.03L Cr', change: '+8.2%', up: true, icon: IndianRupee, color: '#ff6b00' },
  { title: 'Allocated', value: '₹38.76L Cr', change: '86.1%', up: true, icon: Building2, color: '#1a73e8' },
  { title: 'Beneficiaries', value: '142.8 Cr', change: '+12.4%', up: true, icon: Users, color: '#00c853' },
  { title: 'Anomalies', value: '23', change: '-15%', up: false, icon: AlertTriangle, color: '#ff1744' },
];

const allocationTrend = [
  { month: 'Apr', allocation: 3200, utilization: 2800 },
  { month: 'May', allocation: 3400, utilization: 3100 },
  { month: 'Jun', allocation: 3100, utilization: 2900 },
  { month: 'Jul', allocation: 3600, utilization: 3300 },
  { month: 'Aug', allocation: 3800, utilization: 3500 },
  { month: 'Sep', allocation: 4100, utilization: 3700 },
  { month: 'Oct', allocation: 4300, utilization: 3900 },
  { month: 'Nov', allocation: 4500, utilization: 4100 },
  { month: 'Dec', allocation: 4200, utilization: 3800 },
  { month: 'Jan', allocation: 4600, utilization: 4200 },
  { month: 'Feb', allocation: 4800, utilization: 4400 },
  { month: 'Mar', allocation: 5000, utilization: 4600 },
];

const ministryData = [
  { name: 'Defence', value: 5930, color: '#ff6b00' },
  { name: 'Education', value: 1126, color: '#1a73e8' },
  { name: 'Health', value: 893, color: '#00c853' },
  { name: 'Agriculture', value: 1251, color: '#ffc107' },
  { name: 'Railways', value: 2550, color: '#9c27b0' },
  { name: 'Rural Dev.', value: 1782, color: '#ff1744' },
  { name: 'Others', value: 8500, color: '#555566' },
];

const statePerformance = [
  { state: 'Maharashtra', allocated: 4200, utilized: 3780, rate: 90, status: 'Excellent' },
  { state: 'Uttar Pradesh', allocated: 5100, utilized: 3825, rate: 75, status: 'Good' },
  { state: 'Tamil Nadu', allocated: 2800, utilized: 2660, rate: 95, status: 'Excellent' },
  { state: 'Karnataka', allocated: 2400, utilized: 2160, rate: 90, status: 'Excellent' },
  { state: 'Bihar', allocated: 3200, utilized: 2080, rate: 65, status: 'Needs Attention' },
  { state: 'Rajasthan', allocated: 2600, utilized: 2210, rate: 85, status: 'Good' },
  { state: 'West Bengal', allocated: 2900, utilized: 2320, rate: 80, status: 'Good' },
];

const sectorBars = [
  { sector: 'Education', fy24: 1126, fy25: 1250 },
  { sector: 'Health', fy24: 893, fy25: 985 },
  { sector: 'Defence', fy24: 5930, fy25: 6250 },
  { sector: 'Infra', fy24: 3200, fy25: 3800 },
  { sector: 'Agri', fy24: 1251, fy25: 1400 },
  { sector: 'Rural', fy24: 1782, fy25: 1950 },
];

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpiData.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-base"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>{kpi.title}</div>
                <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)' }}>
                  {kpi.value}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: kpi.up ? 'var(--color-green-accent)' : 'var(--color-red-alert)',
                  }}
                >
                  {kpi.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {kpi.change}
                </div>
              </div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `${kpi.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} style={{ color: kpi.color }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Allocation vs Utilization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card-base"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>Allocation vs Utilization</h3>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>FY 2025-26 Monthly Trend (₹ Cr)</p>
            </div>
            <div
              className="font-mono"
              style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: 'rgba(0,200,83,0.1)', color: '#00c853' }}
            >
              LIVE
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={allocationTrend}>
              <defs>
                <linearGradient id="gradAlloc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6b00" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ff6b00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradUtil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a73e8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#1a73e8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis dataKey="month" tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
              <YAxis tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
              <Tooltip
                contentStyle={{ background: '#16161e', border: '1px solid #2a2a35', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: '#f0f0f5' }}
              />
              <Area type="monotone" dataKey="allocation" stroke="#ff6b00" fill="url(#gradAlloc)" strokeWidth={2} name="Allocation" />
              <Area type="monotone" dataKey="utilization" stroke="#1a73e8" fill="url(#gradUtil)" strokeWidth={2} name="Utilization" />
              <Legend wrapperStyle={{ fontSize: 12, color: '#8a8a9a' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Ministry Donut */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card-base"
        >
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            Ministry Distribution
          </h3>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>Top ministries by allocation</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={ministryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {ministryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#16161e', border: '1px solid #2a2a35', borderRadius: 10, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {ministryData.slice(0, 5).map((m) => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: m.color }} />
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{m.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sector Comparison + State Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Sector YoY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card-base"
        >
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            Sector Comparison
          </h3>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>FY24 vs FY25 (₹ Cr)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sectorBars} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis dataKey="sector" tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
              <YAxis tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
              <Tooltip
                contentStyle={{ background: '#16161e', border: '1px solid #2a2a35', borderRadius: 10, fontSize: 12 }}
              />
              <Bar dataKey="fy24" fill="#555566" radius={[4, 4, 0, 0]} name="FY24" />
              <Bar dataKey="fy25" fill="#ff6b00" radius={[4, 4, 0, 0]} name="FY25" />
              <Legend wrapperStyle={{ fontSize: 12, color: '#8a8a9a' }} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* State Performance Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="card-base"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          <div style={{ padding: '20px 24px 12px' }}>
            <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              State Performance
            </h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Utilization rate by state</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  {['State', 'Allocated', 'Utilized', 'Rate', 'Status'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {statePerformance.map((row) => (
                  <tr
                    key={row.state}
                    style={{ borderBottom: '1px solid rgba(42,42,53,0.5)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 500 }}>{row.state}</td>
                    <td className="font-mono" style={{ padding: '10px 16px', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      ₹{row.allocated} Cr
                    </td>
                    <td className="font-mono" style={{ padding: '10px 16px', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      ₹{row.utilized} Cr
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 48,
                            height: 4,
                            borderRadius: 2,
                            background: 'var(--color-bg-elevated)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${row.rate}%`,
                              height: '100%',
                              borderRadius: 2,
                              background: row.rate >= 90 ? '#00c853' : row.rate >= 75 ? '#ffc107' : '#ff1744',
                            }}
                          />
                        </div>
                        <span className="font-mono" style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                          {row.rate}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background:
                            row.status === 'Excellent'
                              ? 'rgba(0,200,83,0.1)'
                              : row.status === 'Good'
                              ? 'rgba(255,193,7,0.1)'
                              : 'rgba(255,23,68,0.1)',
                          color:
                            row.status === 'Excellent'
                              ? '#00c853'
                              : row.status === 'Good'
                              ? '#ffc107'
                              : '#ff1744',
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              fontSize: 12,
              color: 'var(--color-saffron)',
              fontWeight: 600,
            }}
          >
            View All States <ArrowUpRight size={14} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
