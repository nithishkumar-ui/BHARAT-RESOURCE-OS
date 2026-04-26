import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

const tabs = ['Trends', 'Comparison', 'SDG Mapping', 'Efficiency', 'Forecast'];

const trendData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i],
  education: 800 + Math.random() * 400,
  health: 600 + Math.random() * 300,
  defence: 2000 + Math.random() * 500,
  infra: 1200 + Math.random() * 600,
}));

const comparisonData = [
  { sector: 'Education', fy23: 1050, fy24: 1126, fy25: 1250 },
  { sector: 'Health', fy23: 820, fy24: 893, fy25: 985 },
  { sector: 'Defence', fy23: 5600, fy24: 5930, fy25: 6250 },
  { sector: 'Agriculture', fy23: 1100, fy24: 1251, fy25: 1400 },
  { sector: 'Railways', fy23: 2200, fy24: 2550, fy25: 2800 },
  { sector: 'Rural Dev', fy23: 1600, fy24: 1782, fy25: 1950 },
];

const sdgData = [
  { name: 'No Poverty', value: 18, color: '#e5243b' },
  { name: 'Zero Hunger', value: 14, color: '#dda63a' },
  { name: 'Good Health', value: 12, color: '#4c9f38' },
  { name: 'Education', value: 16, color: '#c5192d' },
  { name: 'Clean Water', value: 8, color: '#26bde2' },
  { name: 'Industry', value: 10, color: '#fd6925' },
  { name: 'Climate', value: 7, color: '#3f7e44' },
  { name: 'Peace', value: 15, color: '#00689d' },
];

const efficiencyRadar = [
  { metric: 'Speed', value: 85 },
  { metric: 'Accuracy', value: 92 },
  { metric: 'Coverage', value: 78 },
  { metric: 'Equity', value: 88 },
  { metric: 'Transparency', value: 95 },
  { metric: 'Impact', value: 82 },
];

const forecastData = Array.from({ length: 8 }, (_, i) => ({
  quarter: `Q${i + 1}`,
  actual: i < 4 ? 3500 + Math.random() * 1500 : undefined,
  predicted: 3800 + i * 200 + Math.random() * 500,
  lower: 3200 + i * 180,
  upper: 4400 + i * 220,
}));

export default function Analytics() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Tab Bar */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: 4,
          background: 'var(--color-bg-card)',
          borderRadius: 12,
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === i ? 'var(--color-saffron)' : 'transparent',
              color: activeTab === i ? '#0a0a0f' : 'var(--color-text-secondary)',
              fontSize: 13,
              fontWeight: activeTab === i ? 700 : 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {activeTab === 0 && (
          <div className="card-base">
            <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Sector Spending Trends</h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 20 }}>Monthly allocation trends across key sectors (₹ Cr)</p>
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="gEdu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a73e8" stopOpacity={0.3} /><stop offset="100%" stopColor="#1a73e8" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gHlth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00c853" stopOpacity={0.3} /><stop offset="100%" stopColor="#00c853" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gDef" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff6b00" stopOpacity={0.3} /><stop offset="100%" stopColor="#ff6b00" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gInf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9c27b0" stopOpacity={0.3} /><stop offset="100%" stopColor="#9c27b0" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                <XAxis dataKey="month" tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
                <YAxis tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
                <Tooltip contentStyle={{ background: '#16161e', border: '1px solid #2a2a35', borderRadius: 10, fontSize: 12 }} />
                <Area type="monotone" dataKey="education" stroke="#1a73e8" fill="url(#gEdu)" strokeWidth={2} name="Education" />
                <Area type="monotone" dataKey="health" stroke="#00c853" fill="url(#gHlth)" strokeWidth={2} name="Health" />
                <Area type="monotone" dataKey="defence" stroke="#ff6b00" fill="url(#gDef)" strokeWidth={2} name="Defence" />
                <Area type="monotone" dataKey="infra" stroke="#9c27b0" fill="url(#gInf)" strokeWidth={2} name="Infra" />
                <Legend wrapperStyle={{ fontSize: 12, color: '#8a8a9a' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 1 && (
          <div className="card-base">
            <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Year-over-Year Comparison</h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 20 }}>FY23 vs FY24 vs FY25 allocation (₹ Cr)</p>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={comparisonData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                <XAxis dataKey="sector" tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
                <YAxis tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
                <Tooltip contentStyle={{ background: '#16161e', border: '1px solid #2a2a35', borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="fy23" fill="#555566" radius={[4, 4, 0, 0]} name="FY23" />
                <Bar dataKey="fy24" fill="#1a73e8" radius={[4, 4, 0, 0]} name="FY24" />
                <Bar dataKey="fy25" fill="#ff6b00" radius={[4, 4, 0, 0]} name="FY25" />
                <Legend wrapperStyle={{ fontSize: 12, color: '#8a8a9a' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card-base">
              <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>SDG Goal Alignment</h3>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={sdgData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {sdgData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#16161e', border: '1px solid #2a2a35', borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card-base" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>SDG Budget Mapping</h3>
              {sdgData.map((s) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, flex: 1 }}>{s.name}</span>
                  <div style={{ width: 120, height: 6, borderRadius: 3, background: 'var(--color-bg-void)', overflow: 'hidden' }}>
                    <div style={{ width: `${s.value * 5}%`, height: '100%', background: s.color, borderRadius: 3 }} />
                  </div>
                  <span className="font-mono" style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 32, textAlign: 'right' }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="card-base" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>System Efficiency Metrics</h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 20 }}>Overall platform performance assessment</p>
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={efficiencyRadar}>
                <PolarGrid stroke="#2a2a35" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#8a8a9a', fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fill: '#555', fontSize: 9 }} domain={[0, 100]} />
                <Radar name="Score" dataKey="value" stroke="#ff6b00" fill="#ff6b00" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 4 && (
          <div className="card-base">
            <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Budget Forecast</h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 20 }}>AI-predicted allocation trend with confidence intervals</p>
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                <XAxis dataKey="quarter" tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
                <YAxis tick={{ fill: '#8a8a9a', fontSize: 11 }} axisLine={{ stroke: '#2a2a35' }} />
                <Tooltip contentStyle={{ background: '#16161e', border: '1px solid #2a2a35', borderRadius: 10, fontSize: 12 }} />
                <Line type="monotone" dataKey="actual" stroke="#00c853" strokeWidth={2.5} dot={{ fill: '#00c853', r: 4 }} name="Actual" connectNulls={false} />
                <Line type="monotone" dataKey="predicted" stroke="#ff6b00" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: '#ff6b00', r: 3 }} name="Predicted" />
                <Line type="monotone" dataKey="upper" stroke="#ff6b0040" strokeWidth={1} dot={false} name="Upper Bound" />
                <Line type="monotone" dataKey="lower" stroke="#ff6b0040" strokeWidth={1} dot={false} name="Lower Bound" />
                <Legend wrapperStyle={{ fontSize: 12, color: '#8a8a9a' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </div>
  );
}
