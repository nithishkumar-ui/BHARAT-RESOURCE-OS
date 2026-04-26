import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  Building2,
  Loader2,
  Clock,
  PieChart,
  BarChart3,
  Table2,
  FileSpreadsheet,
  FileDown,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import {
  generateAllocationReport,
  generateAnomalyReport,
  generateUtilizationReport,
  generateSDGReport,
  downloadRecentReport,
  type ExportFormat,
} from '../lib/pdfGenerator';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  type: 'allocation' | 'anomaly' | 'utilization' | 'sdg';
  icon: typeof PieChart;
  sections: string[];
}

const templates: ReportTemplate[] = [
  {
    id: 'alloc-summary',
    title: 'Budget Allocation Summary',
    description: 'Comprehensive ministry-wise budget allocation with AI reasoning and SDG alignment.',
    type: 'allocation',
    icon: PieChart,
    sections: ['Executive Summary', 'Ministry Allocation', 'SDG Mapping', 'AI Confidence'],
  },
  {
    id: 'anomaly-report',
    title: 'Anomaly Detection Report',
    description: 'Flagged discrepancies, severity analysis, and recommended corrective actions.',
    type: 'anomaly',
    icon: BarChart3,
    sections: ['Anomaly Overview', 'Severity Distribution', 'Regional Analysis', 'Recommendations'],
  },
  {
    id: 'util-report',
    title: 'Fund Utilization Report',
    description: 'State and district-level fund utilization rates with performance benchmarking.',
    type: 'utilization',
    icon: Table2,
    sections: ['Utilization Summary', 'State Performance', 'Under-utilized Areas', 'Action Items'],
  },
  {
    id: 'sdg-impact',
    title: 'SDG Impact Assessment',
    description: 'Assessment of budget allocation impact against UN Sustainable Development Goals.',
    type: 'sdg',
    icon: PieChart,
    sections: ['SDG Overview', 'Goal-wise Analysis', 'Gap Identification', 'Recommendations'],
  },
];

const recentReports = [
  { name: 'Q3 FY25 Allocation Summary', date: '2025-04-15', size: '2.4 MB', status: 'ready' as const },
  { name: 'Anomaly Report - March 2025', date: '2025-04-10', size: '1.8 MB', status: 'ready' as const },
  { name: 'State Utilization Q2 FY25', date: '2025-03-28', size: '3.1 MB', status: 'ready' as const },
  { name: 'SDG Alignment FY25', date: '2025-03-15', size: '1.5 MB', status: 'ready' as const },
];

const formatOptions: { value: ExportFormat; label: string; icon: typeof FileText; ext: string }[] = [
  { value: 'pdf', label: 'PDF', icon: FileText, ext: '.pdf' },
  { value: 'csv', label: 'CSV', icon: FileSpreadsheet, ext: '.csv' },
  { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, ext: '.xlsx' },
];

export default function Reports() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [selectedFY, setSelectedFY] = useState('FY25');
  const [selectedMinistry, setSelectedMinistry] = useState('All Ministries');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [formatDropdownOpen, setFormatDropdownOpen] = useState<string | null>(null);
  const [recentFormat, setRecentFormat] = useState<Record<string, ExportFormat>>({});

  const handleGenerate = async (template: ReportTemplate) => {
    setGenerating(template.id);
    try {
      // Simulate AI processing delay
      await new Promise((r) => setTimeout(r, 1500));

      switch (template.type) {
        case 'allocation':
          generateAllocationReport(
            [
              { ministry: 'Education', allocated: 112600, confidence: 0.94, reasoning: 'NEP expansion' },
              { ministry: 'Health', allocated: 89300, confidence: 0.91, reasoning: 'Ayushman Bharat' },
              { ministry: 'Defence', allocated: 593000, confidence: 0.97, reasoning: 'Modernization' },
              { ministry: 'Agriculture', allocated: 125100, confidence: 0.88, reasoning: 'PM-KISAN' },
              { ministry: 'Railways', allocated: 255000, confidence: 0.95, reasoning: 'Vande Bharat' },
            ],
            45000000000,
            selectedFormat,
          );
          break;
        case 'anomaly':
          generateAnomalyReport(selectedFormat);
          break;
        case 'utilization':
          generateUtilizationReport(selectedFormat);
          break;
        case 'sdg':
          generateSDGReport(selectedFormat);
          break;
      }

      setDownloadSuccess(template.id);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } finally {
      setGenerating(null);
    }
  };

  const handleRecentDownload = (reportName: string) => {
    const fmt = recentFormat[reportName] || 'pdf';
    downloadRecentReport(reportName, fmt);
    setDownloadSuccess(reportName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const FormatIcon = formatOptions.find((f) => f.value === selectedFormat)!.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Filters + Format Selector */}
      <div className="card-base" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={16} color="var(--color-text-muted)" />
          <select
            value={selectedFY}
            onChange={(e) => setSelectedFY(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--color-border-subtle)',
              background: 'var(--color-bg-void)',
              color: 'var(--color-text-primary)',
              fontSize: 13,
            }}
          >
            <option>FY25</option>
            <option>FY24</option>
            <option>FY23</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Building2 size={16} color="var(--color-text-muted)" />
          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--color-border-subtle)',
              background: 'var(--color-bg-void)',
              color: 'var(--color-text-primary)',
              fontSize: 13,
            }}
          >
            <option>All Ministries</option>
            <option>Education</option>
            <option>Health</option>
            <option>Defence</option>
            <option>Agriculture</option>
          </select>
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 28, background: 'var(--color-border-subtle)', margin: '0 4px' }} />

        {/* Export Format Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileDown size={16} color="var(--color-text-muted)" />
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border-subtle)' }}>
            {formatOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedFormat(opt.value)}
                style={{
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: selectedFormat === opt.value ? 700 : 500,
                  background: selectedFormat === opt.value
                    ? 'rgba(255,107,0,0.15)'
                    : 'var(--color-bg-void)',
                  color: selectedFormat === opt.value
                    ? 'var(--color-saffron)'
                    : 'var(--color-text-muted)',
                  border: 'none',
                  borderRight: opt.value !== 'xlsx' ? '1px solid var(--color-border-subtle)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <opt.icon size={12} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates */}
      <div>
        <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
          Report Templates
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {templates.map((tmpl, i) => {
            const Icon = tmpl.icon;
            const isGenerating = generating === tmpl.id;
            const isSuccess = downloadSuccess === tmpl.id;
            return (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-base"
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(255,107,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color="var(--color-saffron)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{tmpl.title}</h4>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                      {tmpl.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {tmpl.sections.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 10,
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: 'var(--color-bg-void)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Format badge + Generate button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(255,107,0,0.08)',
                      color: 'var(--color-saffron)',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {selectedFormat}
                  </span>
                  <button
                    onClick={() => handleGenerate(tmpl)}
                    disabled={isGenerating}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '10px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: isSuccess
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : isGenerating
                          ? 'var(--color-bg-elevated)'
                          : 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-glow))',
                      color: isGenerating ? 'var(--color-text-muted)' : '#0a0a0f',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isSuccess ? (
                      <>
                        <CheckCircle2 size={14} /> Downloaded!
                      </>
                    ) : isGenerating ? (
                      <>
                        <Loader2 size={14} style={{ animation: 'spin-slow 1s linear infinite' }} /> Generating...
                      </>
                    ) : (
                      <>
                        <Download size={14} /> Generate & Download
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card-base" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>Recent Reports</h3>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Click format to change • Click download to save</span>
        </div>
        {recentReports.map((report, i) => {
          const reportFmt = recentFormat[report.name] || 'pdf';
          const isSuccess = downloadSuccess === report.name;
          const showDropdown = formatDropdownOpen === report.name;

          return (
            <div
              key={report.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 24px',
                borderBottom: i < recentReports.length - 1 ? '1px solid rgba(42,42,53,0.5)' : 'none',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                setFormatDropdownOpen(null);
              }}
            >
              <FileText size={18} color="var(--color-saffron)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{report.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  {report.date} • {report.size}
                </div>
              </div>

              {report.status === 'ready' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {/* Format Picker (inline) */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setFormatDropdownOpen(showDropdown ? null : report.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '5px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--color-border-subtle)',
                        background: 'transparent',
                        color: 'var(--color-saffron)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                      }}
                    >
                      {reportFmt}
                      <ChevronDown size={10} style={{ transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'none' }} />
                    </button>
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: 4,
                            background: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border-subtle)',
                            borderRadius: 8,
                            overflow: 'hidden',
                            zIndex: 50,
                            minWidth: 100,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                          }}
                        >
                          {formatOptions.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setRecentFormat((prev) => ({ ...prev, [report.name]: opt.value }));
                                setFormatDropdownOpen(null);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                width: '100%',
                                padding: '8px 14px',
                                border: 'none',
                                background: reportFmt === opt.value ? 'rgba(255,107,0,0.1)' : 'transparent',
                                color: reportFmt === opt.value ? 'var(--color-saffron)' : 'var(--color-text-secondary)',
                                fontSize: 12,
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = reportFmt === opt.value ? 'rgba(255,107,0,0.1)' : 'transparent')}
                            >
                              <opt.icon size={13} />
                              {opt.label} ({opt.ext})
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleRecentDownload(report.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 14px',
                      borderRadius: 6,
                      border: 'none',
                      background: isSuccess
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-glow))',
                      color: '#0a0a0f',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isSuccess ? (
                      <>
                        <CheckCircle2 size={13} /> Done
                      </>
                    ) : (
                      <>
                        <Download size={13} /> Download
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    color: '#ffc107',
                  }}
                >
                  <Clock size={13} /> Generating
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
