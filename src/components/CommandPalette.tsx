import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, LayoutDashboard, Upload, Brain, Globe2, BarChart3,
  CheckCircle, AlertTriangle, FileText, Eye, MapPin, TrendingUp,
  Shield, Coins, Users, Building2, Zap, ArrowRight
} from 'lucide-react';

// ── Search Index ──────────────────────────────────────────────
interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'page' | 'feature' | 'state' | 'action';
  path: string;
  icon: React.ReactNode;
  keywords: string[];
}

const searchIndex: SearchItem[] = [
  // Pages
  { id: 'dashboard', title: 'Command Center', description: 'Overview dashboard with key metrics', category: 'page', path: '/dashboard', icon: <LayoutDashboard size={18} />, keywords: ['home', 'dashboard', 'overview', 'command', 'center', 'metrics', 'kpi'] },
  { id: 'upload', title: 'Data Ingestion', description: 'Upload and process budget data files', category: 'page', path: '/upload', icon: <Upload size={18} />, keywords: ['upload', 'data', 'ingestion', 'csv', 'excel', 'import', 'file'] },
  { id: 'allocation', title: 'AI Allocation Engine', description: 'AI-powered budget allocation recommendations', category: 'page', path: '/allocation', icon: <Brain size={18} />, keywords: ['allocation', 'ai', 'engine', 'budget', 'distribute', 'funds', 'ministry'] },
  { id: 'geo', title: 'Geo Strategic View', description: '3D geographic visualization of India', category: 'page', path: '/geo', icon: <Globe2 size={18} />, keywords: ['geo', 'map', 'india', 'geographic', 'strategic', '3d', 'states', 'view'] },
  { id: 'analytics', title: 'Analytics Hub', description: 'Deep analytics and trend analysis', category: 'page', path: '/analytics', icon: <BarChart3 size={18} />, keywords: ['analytics', 'charts', 'trends', 'analysis', 'graphs', 'statistics'] },
  { id: 'approvals', title: 'Approval Pipeline', description: 'Review and approve budget requests', category: 'page', path: '/approvals', icon: <CheckCircle size={18} />, keywords: ['approvals', 'pipeline', 'review', 'approve', 'reject', 'pending', 'requests'] },
  { id: 'anomalies', title: 'Anomaly Detection', description: 'AI-detected fiscal anomalies and alerts', category: 'page', path: '/anomalies', icon: <AlertTriangle size={18} />, keywords: ['anomaly', 'detection', 'fraud', 'alert', 'suspicious', 'irregularity'] },
  { id: 'reports', title: 'Report Generator', description: 'Generate and download fiscal reports', category: 'page', path: '/reports', icon: <FileText size={18} />, keywords: ['reports', 'generate', 'download', 'pdf', 'export', 'fiscal', 'summary'] },
  { id: 'transparency', title: 'Public Transparency', description: 'Public-facing transparency portal', category: 'page', path: '/transparency', icon: <Eye size={18} />, keywords: ['transparency', 'public', 'portal', 'citizen', 'open', 'data'] },

  // Features
  { id: 'f-budget', title: 'Budget Overview', description: 'View total budget allocation & utilization', category: 'feature', path: '/dashboard', icon: <Coins size={18} />, keywords: ['budget', 'total', 'allocation', 'utilization', 'spending', 'crore'] },
  { id: 'f-gdp', title: 'GDP Growth Analysis', description: 'State-wise GDP growth tracking', category: 'feature', path: '/geo', icon: <TrendingUp size={18} />, keywords: ['gdp', 'growth', 'economy', 'economic', 'state'] },
  { id: 'f-employment', title: 'Employment Metrics', description: 'Employment rates across states', category: 'feature', path: '/analytics', icon: <Users size={18} />, keywords: ['employment', 'jobs', 'workforce', 'labor', 'rate'] },
  { id: 'f-infra', title: 'Infrastructure Tracking', description: 'Infrastructure project status & spending', category: 'feature', path: '/geo', icon: <Building2 size={18} />, keywords: ['infrastructure', 'roads', 'bridges', 'construction', 'projects'] },
  { id: 'f-defence', title: 'Defence & Security', description: 'Defence budget allocation & status', category: 'feature', path: '/allocation', icon: <Shield size={18} />, keywords: ['defence', 'defense', 'security', 'military', 'armed'] },
  { id: 'f-digital', title: 'Digital India Progress', description: 'Digital access & IT sector metrics', category: 'feature', path: '/analytics', icon: <Zap size={18} />, keywords: ['digital', 'india', 'it', 'technology', 'internet', 'access'] },

  // States
  { id: 's-mh', title: 'Maharashtra', description: 'Capital: Mumbai • ₹4200 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['maharashtra', 'mumbai', 'pune', 'nagpur'] },
  { id: 's-up', title: 'Uttar Pradesh', description: 'Capital: Lucknow • ₹3800 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['uttar pradesh', 'lucknow', 'varanasi', 'agra', 'up'] },
  { id: 's-ka', title: 'Karnataka', description: 'Capital: Bengaluru • ₹3200 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['karnataka', 'bengaluru', 'bangalore', 'mysore'] },
  { id: 's-tn', title: 'Tamil Nadu', description: 'Capital: Chennai • ₹3500 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['tamil nadu', 'chennai', 'madurai', 'coimbatore', 'tn'] },
  { id: 's-gj', title: 'Gujarat', description: 'Capital: Gandhinagar • ₹2900 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['gujarat', 'gandhinagar', 'ahmedabad', 'surat'] },
  { id: 's-rj', title: 'Rajasthan', description: 'Capital: Jaipur • ₹2400 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['rajasthan', 'jaipur', 'jodhpur', 'udaipur'] },
  { id: 's-dl', title: 'Delhi', description: 'Capital: New Delhi • ₹2100 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['delhi', 'new delhi', 'national capital'] },
  { id: 's-wb', title: 'West Bengal', description: 'Capital: Kolkata • ₹2600 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['west bengal', 'kolkata', 'calcutta', 'wb'] },
  { id: 's-tg', title: 'Telangana', description: 'Capital: Hyderabad • ₹2200 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['telangana', 'hyderabad', 'warangal'] },
  { id: 's-kr', title: 'Kerala', description: 'Capital: Thiruvananthapuram • ₹1800 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['kerala', 'thiruvananthapuram', 'kochi', 'trivandrum'] },
  { id: 's-mp', title: 'Madhya Pradesh', description: 'Capital: Bhopal • ₹2300 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['madhya pradesh', 'bhopal', 'indore', 'mp'] },
  { id: 's-bh', title: 'Bihar', description: 'Capital: Patna • ₹2000 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['bihar', 'patna'] },
  { id: 's-pj', title: 'Punjab', description: 'Capital: Chandigarh • ₹1600 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['punjab', 'chandigarh', 'amritsar', 'ludhiana'] },
  { id: 's-od', title: 'Odisha', description: 'Capital: Bhubaneswar • ₹1500 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['odisha', 'orissa', 'bhubaneswar'] },
  { id: 's-as', title: 'Assam', description: 'Capital: Dispur • ₹1200 Cr budget', category: 'state', path: '/geo', icon: <MapPin size={18} />, keywords: ['assam', 'dispur', 'guwahati'] },
];

// ── Category Config ──────────────────────────────────────────
const categoryConfig: Record<string, { label: string; color: string }> = {
  page: { label: 'Pages', color: '#FF9933' },
  feature: { label: 'Features', color: '#00D4FF' },
  state: { label: 'States', color: '#22C55E' },
  action: { label: 'Actions', color: '#A855F7' },
};

// ── Component ────────────────────────────────────────────────
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter results
  const results = query.trim()
    ? searchIndex.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.includes(q))
        );
      })
    : searchIndex.filter((item) => item.category === 'page'); // Default: show all pages

  // Group by category
  const grouped = results.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatResults = Object.values(grouped).flat();

  // Navigate to selected item
  const selectItem = useCallback(
    (item: SearchItem) => {
      navigate(item.path);
      onClose();
      setQuery('');
      setActiveIndex(0);
    },
    [navigate, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % flatResults.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (flatResults[activeIndex]) selectItem(flatResults[activeIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, flatResults, selectItem, onClose]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Auto-focus input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 9998,
            }}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            style={{
              position: 'fixed',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: 640,
              background: 'linear-gradient(180deg, rgba(26,26,36,0.98) 0%, rgba(17,17,24,0.99) 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
              zIndex: 9999,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '60vh',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Search size={20} color="#FF9933" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, states, features..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 16,
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              <button
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 8px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 11,
                  fontFamily: 'monospace',
                }}
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              style={{
                overflowY: 'auto',
                padding: '8px',
                flex: 1,
              }}
            >
              {flatResults.length === 0 ? (
                <div
                  style={{
                    padding: '32px 20px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: 14,
                  }}
                >
                  <Search size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <div>No results found for "{query}"</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Try searching for pages, states, or features</div>
                </div>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category} style={{ marginBottom: 8 }}>
                    {/* Category Header */}
                    <div
                      style={{
                        padding: '8px 12px 4px',
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 1.5,
                        color: categoryConfig[category]?.color || '#888',
                        fontFamily: 'monospace',
                      }}
                    >
                      {categoryConfig[category]?.label || category}
                    </div>

                    {/* Items */}
                    {items.map((item) => {
                      const globalIndex = flatResults.indexOf(item);
                      const isActive = globalIndex === activeIndex;

                      return (
                        <div
                          key={item.id}
                          data-index={globalIndex}
                          onClick={() => selectItem(item)}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 12px',
                            borderRadius: 10,
                            cursor: 'pointer',
                            background: isActive
                              ? 'linear-gradient(135deg, rgba(255,153,51,0.12) 0%, rgba(255,153,51,0.05) 100%)'
                              : 'transparent',
                            border: isActive ? '1px solid rgba(255,153,51,0.2)' : '1px solid transparent',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {/* Icon */}
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              background: isActive
                                ? 'rgba(255,153,51,0.15)'
                                : 'rgba(255,255,255,0.04)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isActive
                                ? '#FF9933'
                                : categoryConfig[item.category]?.color || '#888',
                              flexShrink: 0,
                            }}
                          >
                            {item.icon}
                          </div>

                          {/* Text */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                              }}
                            >
                              {item.title}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: 'rgba(255,255,255,0.35)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.description}
                            </div>
                          </div>

                          {/* Arrow */}
                          {isActive && (
                            <ArrowRight
                              size={14}
                              color="#FF9933"
                              style={{ flexShrink: 0 }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '10px 20px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                fontSize: 11,
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'monospace',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <kbd style={{ padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>↑</kbd>
                <kbd style={{ padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>↓</kbd>
                navigate
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <kbd style={{ padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>↵</kbd>
                open
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <kbd style={{ padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>esc</kbd>
                close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
