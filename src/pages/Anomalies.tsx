import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ShieldAlert,
  TrendingDown,
  Eye,
  ChevronDown,
  MapPin,
  IndianRupee,
  Activity,
  ArrowUpRight,
  Loader2,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ScanSearch,
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
import { detectAnomalies, type AnomalyResult } from '../lib/gemini';
import { useAllocationStore } from '../store/allocationStore';

const severityConfig = {
  critical: { color: '#ff1744', bg: 'rgba(255,23,68,0.08)', icon: ShieldAlert },
  high: { color: '#ff6b00', bg: 'rgba(255,107,0,0.08)', icon: AlertTriangle },
  medium: { color: '#ffc107', bg: 'rgba(255,193,7,0.08)', icon: TrendingDown },
  low: { color: '#1a73e8', bg: 'rgba(26,115,232,0.08)', icon: Activity },
};

// Sample fiscal data to analyze when no upload data is present
const sampleFiscalData = [
  { ministry: 'Rural Development', state: 'Jharkhand', scheme: 'MGNREGA', allocated: 1200, spent: 4280, quarter: 'Q3' },
  { ministry: 'Housing', state: 'Odisha', scheme: 'PMAY-G', allocated: 800, spent: 828, beneficiaries: 1420, quarter: 'Q2' },
  { ministry: 'Education', state: 'Kerala', scheme: 'Samagra Shiksha', allocated: 350, spent: 119, quarter: 'Q4' },
  { ministry: 'Rural Development', state: 'Bihar', scheme: 'PMGSY', allocated: 950, spent: 741, lastMonthSpend: 580, quarter: 'Q4' },
  { ministry: 'Roads', state: 'Uttar Pradesh', scheme: 'PMGSY', allocated: 400, spent: 840, costPerKm: 85, nationalAvgPerKm: 42, quarter: 'Q3' },
  { ministry: 'Sanitation', state: 'Multiple', scheme: 'SBM Phase 2', allocated: 500, spent: 225, urbanUtilization: 45, ruralUtilization: 110, quarter: 'Q3' },
  { ministry: 'Agriculture', state: 'Maharashtra', scheme: 'PM-KISAN', allocated: 650, spent: 680, duplicateEntries: 89, quarter: 'Q2' },
  { ministry: 'Health', state: 'Rajasthan', scheme: 'Ayushman Bharat', allocated: 300, spent: 45, quarter: 'Q4' },
];

export default function Anomalies() {
  const [filter, setFilter] = useState<'all' | AnomalyResult['severity']>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { anomalies, setAnomalies, uploadedData } = useAllocationStore();

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);

    try {
      // Use uploaded data if available, otherwise use sample fiscal data
      const dataToAnalyze = uploadedData.length > 0
        ? uploadedData.slice(0, 50)
        : sampleFiscalData;

      const results = await detectAnomalies(dataToAnalyze as Record<string, unknown>[]);
      setAnomalies(results);
      setScanComplete(true);
    } catch (err) {
      console.error('Gemini anomaly detection failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'AI scan failed. Please check your API key and try again.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const filtered =
    filter === 'all'
      ? anomalies
      : anomalies.filter((a) => a.severity === filter);

  const stats = {
    total: anomalies.length,
    critical: anomalies.filter((a) => a.severity === 'critical').length,
    open: anomalies.length, // All AI-detected are "open" by default
    totalAmount: anomalies.reduce((s, a) => s + a.amount, 0),
  };

  const chartData = anomalies.reduce(
    (acc, a) => {
      const type = a.type;
      if (type === 'overspend') acc[0].count++;
      else if (type === 'underspend') acc[1].count++;
      else if (type === 'duplicate') acc[2].count++;
      else acc[3].count++;
      return acc;
    },
    [
      { name: 'Overspend', count: 0, fill: '#ff1744' },
      { name: 'Underspend', count: 0, fill: '#ffc107' },
      { name: 'Duplicate', count: 0, fill: '#1a73e8' },
      { name: 'Pattern', count: 0, fill: '#b388ff' },
    ]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* AI Scanner Bar */}
      <div
        className="card-base"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-glow))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ScanSearch size={22} color="#0a0a0f" />
          </div>
          <div>
            <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>
              AI Forensic Scanner
            </h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              {scanComplete
                ? `Gemini detected ${anomalies.length} anomalies`
                : 'Powered by Gemini 2.0 Flash — Analyze fiscal data for irregularities'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {scanComplete && (
            <span
              style={{
                fontSize: 10,
                padding: '4px 10px',
                borderRadius: 6,
                background: 'rgba(0,200,83,0.1)',
                color: '#00c853',
                fontWeight: 600,
              }}
            >
              ✓ Scan Complete
            </span>
          )}
          <button
            onClick={handleScan}
            disabled={isScanning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              borderRadius: 10,
              border: 'none',
              background: isScanning
                ? 'var(--color-bg-elevated)'
                : 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-glow))',
              color: isScanning ? 'var(--color-text-muted)' : '#0a0a0f',
              fontSize: 13,
              fontWeight: 700,
              cursor: isScanning ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-display)',
            }}
          >
            {isScanning ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin-slow 1s linear infinite' }} />
                Scanning...
              </>
            ) : scanComplete ? (
              <>
                <RefreshCw size={16} /> Re-scan
              </>
            ) : (
              <>
                <Sparkles size={16} /> Run AI Scan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-base"
            style={{
              padding: '12px 20px',
              borderColor: 'rgba(255,23,68,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <AlertCircle size={18} color="#ff1744" />
            <span style={{ fontSize: 13, color: '#ff1744' }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-scan state */}
      {!scanComplete && !isScanning && (
        <div
          className="card-base"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: 350,
          }}
        >
          <ShieldAlert
            size={56}
            color="var(--color-text-muted)"
            style={{ marginBottom: 20, opacity: 0.3 }}
          />
          <h3
            className="font-display"
            style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-muted)' }}
          >
            Ready to Scan
          </h3>
          <p
            style={{
              fontSize: 13,
              color: 'var(--color-text-muted)',
              maxWidth: 400,
              marginTop: 8,
              lineHeight: 1.6,
            }}
          >
            Click <strong>"Run AI Scan"</strong> to analyze government fiscal data for
            overspending, duplicates, suspicious patterns, and underspending using
            Gemini AI.
          </p>
          {uploadedData.length > 0 && (
            <div
              style={{
                marginTop: 16,
                padding: '6px 14px',
                borderRadius: 6,
                background: 'rgba(0,200,83,0.1)',
                fontSize: 11,
                color: '#00c853',
                fontWeight: 600,
              }}
            >
              ✓ Uploaded data available ({uploadedData.length} rows)
            </div>
          )}
        </div>
      )}

      {/* Loading animation */}
      {isScanning && (
        <div
          className="card-base"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: 350,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #ff1744, #ff6b00)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              animation: 'pulse 1.5s ease infinite',
            }}
          >
            <ScanSearch size={36} color="#fff" />
          </div>
          <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700 }}>
            Gemini AI Scanning...
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 360, marginTop: 8 }}>
            Analyzing fiscal data for irregularities, overspending patterns, duplicate
            disbursements, and under-utilization of funds.
          </p>
          <div style={{ marginTop: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#ff1744',
                  animation: `pulse 1.2s ease infinite ${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {scanComplete && anomalies.length > 0 && (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Anomalies', value: stats.total, icon: AlertTriangle, color: '#ff6b00' },
              { label: 'Critical', value: stats.critical, icon: ShieldAlert, color: '#ff1744' },
              { label: 'Open Cases', value: stats.open, icon: Eye, color: '#ffc107' },
              {
                label: 'Amount Flagged',
                value: `₹${stats.totalAmount} Cr`,
                icon: IndianRupee,
                color: '#1a73e8',
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-base"
                  style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} color={stat.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      {stat.label}
                    </div>
                    <div className="font-display" style={{ fontSize: 24, fontWeight: 800 }}>
                      {stat.value}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Chart + List */}
          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 20 }}>
            {/* Chart */}
            <div className="card-base">
              <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                Anomaly Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                  <XAxis dataKey="name" tick={{ fill: '#8a8a9a', fontSize: 10 }} axisLine={{ stroke: '#2a2a35' }} />
                  <YAxis tick={{ fill: '#8a8a9a', fontSize: 10 }} axisLine={{ stroke: '#2a2a35' }} />
                  <Tooltip
                    contentStyle={{
                      background: '#16161e',
                      border: '1px solid #2a2a35',
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />
                  <Bar dataKey="count" fill="#ff6b00" name="Count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <rect key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Filter */}
              <div style={{ display: 'flex', gap: 4, marginTop: 16, flexWrap: 'wrap' }}>
                {(['all', 'critical', 'high', 'medium', 'low'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 6,
                      border: 'none',
                      background:
                        filter === f
                          ? f === 'all'
                            ? 'var(--color-saffron)'
                            : severityConfig[f].bg
                          : 'var(--color-bg-void)',
                      color:
                        filter === f
                          ? f === 'all'
                            ? '#0a0a0f'
                            : severityConfig[f].color
                          : 'var(--color-text-muted)',
                      fontSize: 11,
                      fontWeight: filter === f ? 700 : 400,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Anomaly List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((anomaly, i) => {
                const config = severityConfig[anomaly.severity];
                const Icon = config.icon;
                const isExpanded = expandedId === anomaly.id;
                return (
                  <motion.div
                    key={anomaly.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="card-base"
                    style={{
                      padding: 0,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      borderLeft: `3px solid ${config.color}`,
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : anomaly.id)}
                  >
                    <div
                      style={{
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: config.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} color={config.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <h4
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {anomaly.title}
                          </h4>
                          <span
                            style={{
                              fontSize: 9,
                              padding: '2px 6px',
                              borderRadius: 3,
                              background: config.bg,
                              color: config.color,
                              textTransform: 'uppercase',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {anomaly.severity}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: 16,
                            fontSize: 11,
                            color: 'var(--color-text-muted)',
                            marginTop: 4,
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={11} /> {anomaly.region}
                          </span>
                          <span>₹{anomaly.amount} Cr</span>
                          {anomaly.deviation !== 0 && (
                            <span
                              style={{
                                color: anomaly.deviation > 0 ? '#ff1744' : '#ffc107',
                              }}
                            >
                              {anomaly.deviation > 0 ? '+' : ''}
                              {anomaly.deviation}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: 10,
                            padding: '3px 8px',
                            borderRadius: 4,
                            background: 'rgba(255,107,0,0.1)',
                            color: 'var(--color-saffron)',
                          }}
                        >
                          AI Detected
                        </span>
                        <ChevronDown
                          size={16}
                          color="var(--color-text-muted)"
                          style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'none',
                            transition: '0.2s',
                          }}
                        />
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        style={{
                          padding: '0 20px 16px',
                          borderTop: '1px solid var(--color-border-subtle)',
                        }}
                      >
                        <p
                          style={{
                            fontSize: 13,
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.7,
                            marginTop: 12,
                          }}
                        >
                          {anomaly.description}
                        </p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                          <button
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '6px 14px',
                              borderRadius: 6,
                              border: 'none',
                              background: 'rgba(255,107,0,0.1)',
                              color: 'var(--color-saffron)',
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <Eye size={13} /> Investigate
                          </button>
                          <button
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '6px 14px',
                              borderRadius: 6,
                              border: '1px solid var(--color-border-subtle)',
                              background: 'transparent',
                              color: 'var(--color-text-muted)',
                              fontSize: 11,
                              cursor: 'pointer',
                            }}
                          >
                            <ArrowUpRight size={13} /> Escalate
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
