import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload as UploadIcon,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Shield,
  Zap,
  Database,
  Sparkles,
  Loader2,
  BrainCircuit,
  Lightbulb,
} from 'lucide-react';
import { parseExcelFile, validateBudgetData, type ParseResult } from '../lib/excelParser';
import { useAllocationStore } from '../store/allocationStore';
import { analyzeUploadedData } from '../lib/gemini';

type Stage = 'idle' | 'uploading' | 'validating' | 'preview' | 'processing' | 'insights' | 'error';

interface AIInsightsData {
  insights: string[];
  suggestedMinistries: string[];
  estimatedBudget: number;
}

export default function Upload() {
  const [stage, setStage] = useState<Stage>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [aiData, setAiData] = useState<AIInsightsData | null>(null);
  const { setUploadedData, setTotalBudget, setAiInsights } = useAllocationStore();

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setStage('uploading');

    try {
      await new Promise((r) => setTimeout(r, 800));
      setStage('validating');

      const result = await parseExcelFile(file);
      await new Promise((r) => setTimeout(r, 600));

      const validation = validateBudgetData(result.rows);

      if (!validation.valid) {
        setErrors(validation.errors);
        setParseResult(result);
        setStage('error');
        return;
      }

      setParseResult(result);
      setUploadedData(result.rows, file.name);
      setStage('preview');
    } catch (err) {
      setErrors([(err as Error).message]);
      setStage('error');
    }
  }, [setUploadedData]);

  const handleProcessWithAI = async () => {
    if (!parseResult) return;
    setStage('processing');

    try {
      const result = await analyzeUploadedData(
        parseResult.headers,
        parseResult.rows as Record<string, unknown>[],
      );

      setAiData(result);
      setAiInsights(result.insights);

      if (result.estimatedBudget > 0) {
        setTotalBudget(result.estimatedBudget);
      }

      setStage('insights');
    } catch (err) {
      console.error('AI analysis failed:', err);
      setErrors([
        err instanceof Error
          ? err.message
          : 'AI analysis failed. Please check your API key and try again.',
      ]);
      setStage('error');
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const reset = () => {
    setStage('idle');
    setParseResult(null);
    setErrors([]);
    setFileName('');
    setAiData(null);
  };

  const pipelineSteps = [
    { label: 'Upload', icon: UploadIcon, done: stage !== 'idle' },
    { label: 'Validate', icon: Shield, done: ['preview', 'processing', 'insights', 'error'].includes(stage) },
    { label: 'Preview', icon: Database, done: ['preview', 'processing', 'insights'].includes(stage) },
    { label: 'AI Analyze', icon: Zap, done: stage === 'insights' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Pipeline Steps */}
      <div className="card-base" style={{ padding: '20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {pipelineSteps.map((step, i) => {
            const Icon = step.icon;
            const isActive =
              (step.label === 'Upload' && ['uploading'].includes(stage)) ||
              (step.label === 'Validate' && ['validating'].includes(stage)) ||
              (step.label === 'AI Analyze' && ['processing'].includes(stage));
            return (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: step.done
                      ? 'rgba(0,200,83,0.1)'
                      : isActive
                        ? 'rgba(255,107,0,0.1)'
                        : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${
                      step.done
                        ? 'rgba(0,200,83,0.3)'
                        : isActive
                          ? 'var(--color-saffron)'
                          : 'var(--color-border-subtle)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.done ? (
                    <CheckCircle2 size={18} color="#00c853" />
                  ) : isActive ? (
                    <Loader2
                      size={18}
                      color="var(--color-saffron)"
                      style={{ animation: 'spin-slow 1s linear infinite' }}
                    />
                  ) : (
                    <Icon size={18} color="var(--color-text-muted)" />
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: step.done || isActive ? 600 : 400,
                    color: step.done
                      ? 'var(--color-text-primary)'
                      : isActive
                        ? 'var(--color-saffron)'
                        : 'var(--color-text-muted)',
                  }}
                >
                  {step.label}
                </span>
                {i < pipelineSteps.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: step.done ? 'rgba(0,200,83,0.3)' : 'var(--color-border-subtle)',
                      marginLeft: 8,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Drop Zone / Preview / Insights */}
      <AnimatePresence mode="wait">
        {(stage === 'idle' || stage === 'uploading' || stage === 'validating') && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? 'var(--color-saffron)' : 'var(--color-border-subtle)'}`,
              borderRadius: 16,
              padding: 64,
              textAlign: 'center',
              background: dragActive ? 'rgba(255,107,0,0.03)' : 'var(--color-bg-card)',
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
          >
            {stage === 'idle' ? (
              <>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    background: 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-glow))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <FileSpreadsheet size={32} color="#0a0a0f" />
                </div>
                <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                  Drop Excel File Here
                </h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
                  Supports .xlsx and .xls files with budget allocation data
                </p>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 28px',
                    borderRadius: 10,
                    border: '1px solid var(--color-saffron)',
                    background: 'rgba(255,107,0,0.08)',
                    color: 'var(--color-saffron)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <UploadIcon size={16} /> Browse Files
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                  />
                </label>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div className="shimmer-bg" style={{ width: 64, height: 64, borderRadius: 16 }} />
                <div className="font-display" style={{ fontSize: 18, fontWeight: 600 }}>
                  {stage === 'uploading' ? 'Uploading...' : 'Validating data...'}
                </div>
                <div className="font-mono" style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {fileName}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {stage === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card-base"
            style={{ borderColor: 'rgba(255,23,68,0.3)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <AlertCircle size={20} color="#ff1744" />
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: '#ff1744' }}>
                Validation Errors
              </h3>
              <button onClick={reset} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} color="var(--color-text-muted)" />
              </button>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {errors.map((err, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 13,
                    color: 'var(--color-text-secondary)',
                    padding: '8px 12px',
                    background: 'rgba(255,23,68,0.05)',
                    borderRadius: 8,
                    borderLeft: '3px solid #ff1744',
                  }}
                >
                  {err}
                </li>
              ))}
            </ul>
            <button
              onClick={reset}
              style={{
                marginTop: 16,
                padding: '10px 20px',
                borderRadius: 8,
                border: '1px solid var(--color-border-subtle)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* AI Processing State */}
        {stage === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
                background: 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-glow))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                animation: 'pulse 1.5s ease infinite',
              }}
            >
              <BrainCircuit size={36} color="#0a0a0f" />
            </div>
            <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700 }}>
              Gemini AI Analyzing Data...
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 360, marginTop: 8 }}>
              Extracting ministries, estimating budgets, and generating fiscal insights from your uploaded data.
            </p>
            <div style={{ marginTop: 20, display: 'flex', gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--color-saffron)',
                    animation: `pulse 1.2s ease infinite ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {(stage === 'preview' || stage === 'insights') && parseResult && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* AI Insights Section */}
            {stage === 'insights' && aiData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 20 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  {/* Insights */}
                  <div className="card-base">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <Lightbulb size={16} color="var(--color-saffron)" />
                      <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700 }}>
                        AI Insights
                      </h3>
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: 9,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(0,200,83,0.1)',
                          color: '#00c853',
                          fontWeight: 600,
                        }}
                      >
                        GEMINI
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {aiData.insights.map((insight, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 12,
                            color: 'var(--color-text-secondary)',
                            padding: '8px 12px',
                            borderRadius: 8,
                            background: 'var(--color-bg-void)',
                            borderLeft: '3px solid var(--color-saffron)',
                            lineHeight: 1.5,
                          }}
                        >
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extracted Info */}
                  <div className="card-base">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <Sparkles size={16} color="var(--color-chakra-glow)" />
                      <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700 }}>
                        Extracted Data
                      </h3>
                    </div>
                    {aiData.estimatedBudget > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                          Estimated Total Budget
                        </div>
                        <div
                          className="font-display"
                          style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-saffron)' }}
                        >
                          ₹{(aiData.estimatedBudget / 10000000).toLocaleString(undefined, { maximumFractionDigits: 0 })} Cr
                        </div>
                      </div>
                    )}
                    {aiData.suggestedMinistries.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                          Detected Ministries
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {aiData.suggestedMinistries.map((m) => (
                            <span
                              key={m}
                              style={{
                                fontSize: 11,
                                padding: '4px 10px',
                                borderRadius: 6,
                                background: 'rgba(26,115,232,0.1)',
                                color: 'var(--color-chakra-glow)',
                                fontWeight: 500,
                              }}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
              {[
                { label: 'Sheet', value: parseResult.sheetName },
                { label: 'Rows', value: parseResult.totalRows.toLocaleString() },
                { label: 'Columns', value: parseResult.headers.length.toString() },
              ].map((s) => (
                <div key={s.label} className="card-base">
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                    {s.label}
                  </div>
                  <div
                    className="font-display"
                    style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-saffron)' }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Data Table */}
            <div className="card-base" style={{ padding: 0, overflow: 'hidden' }}>
              <div
                style={{
                  padding: '16px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700 }}>
                    Data Preview
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    Showing first 10 rows of {parseResult.totalRows}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={reset}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      border: '1px solid var(--color-border-subtle)',
                      background: 'transparent',
                      color: 'var(--color-text-secondary)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Re-upload
                  </button>
                  {stage === 'preview' && (
                    <button
                      onClick={handleProcessWithAI}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 20px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'linear-gradient(135deg, var(--color-saffron), var(--color-saffron-glow))',
                        color: '#0a0a0f',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Sparkles size={14} /> Process with AI <ArrowRight size={14} />
                    </button>
                  )}
                  {stage === 'insights' && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        borderRadius: 8,
                        background: 'rgba(0,200,83,0.1)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#00c853',
                      }}
                    >
                      <CheckCircle2 size={14} /> AI Analysis Complete
                    </div>
                  )}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr
                      style={{
                        borderTop: '1px solid var(--color-border-subtle)',
                        borderBottom: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      {parseResult.headers.map((h) => (
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
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parseResult.rows.slice(0, 10).map((row, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: '1px solid rgba(42,42,53,0.5)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {parseResult.headers.map((h) => (
                          <td
                            key={h}
                            className="font-mono"
                            style={{
                              padding: '10px 16px',
                              fontSize: 12,
                              color: 'var(--color-text-secondary)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {String(row[h] ?? '—')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
