import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, ArrowRight, User, Calendar, IndianRupee } from 'lucide-react';

interface ApprovalItem {
  id: string;
  title: string;
  ministry: string;
  amount: number;
  submittedBy: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
}

const initialItems: ApprovalItem[] = [
  { id: 'APR-001', title: 'PM-KISAN Expansion Fund', ministry: 'Agriculture', amount: 2400, submittedBy: 'Rajesh Kumar', date: '2025-04-18', priority: 'high', status: 'pending' },
  { id: 'APR-002', title: 'Digital India Phase III', ministry: 'IT & Electronics', amount: 1800, submittedBy: 'Priya Singh', date: '2025-04-17', priority: 'medium', status: 'pending' },
  { id: 'APR-003', title: 'Ayushman Bharat Extension', ministry: 'Health', amount: 3200, submittedBy: 'Dr. Anil Gupta', date: '2025-04-16', priority: 'high', status: 'pending' },
  { id: 'APR-004', title: 'Vande Bharat Manufacturing', ministry: 'Railways', amount: 5600, submittedBy: 'Suresh Patel', date: '2025-04-15', priority: 'high', status: 'approved' },
  { id: 'APR-005', title: 'Green Hydrogen Mission', ministry: 'Environment', amount: 1200, submittedBy: 'Kavita Reddy', date: '2025-04-14', priority: 'medium', status: 'approved' },
  { id: 'APR-006', title: 'Smart City Phase II', ministry: 'Urban Dev', amount: 4100, submittedBy: 'Amit Joshi', date: '2025-04-13', priority: 'low', status: 'approved' },
  { id: 'APR-007', title: 'Defence Procurement R23', ministry: 'Defence', amount: 8200, submittedBy: 'Col. Sharma', date: '2025-04-12', priority: 'high', status: 'rejected' },
  { id: 'APR-008', title: 'Tribal Welfare Scheme', ministry: 'Tribal Affairs', amount: 650, submittedBy: 'Meena Kumari', date: '2025-04-11', priority: 'medium', status: 'rejected' },
];

const columns: { key: ApprovalItem['status']; label: string; icon: typeof Clock; color: string }[] = [
  { key: 'pending', label: 'Pending Review', icon: Clock, color: '#ffc107' },
  { key: 'approved', label: 'Approved', icon: CheckCircle2, color: '#00c853' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: '#ff1744' },
];

const priorityColors = { high: '#ff1744', medium: '#ffc107', low: '#1a73e8' };

export default function Approvals() {
  const [items, setItems] = useState(initialItems);

  const moveItem = (id: string, newStatus: ApprovalItem['status']) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {columns.map((col) => {
          const Icon = col.icon;
          const count = items.filter((i) => i.status === col.key).length;
          return (
            <div key={col.key} className="card-base" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${col.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} color={col.color} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{col.label}</div>
                <div className="font-display" style={{ fontSize: 26, fontWeight: 800 }}>{count}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}>
        {columns.map((col) => {
          const Icon = col.icon;
          const colItems = items.filter((i) => i.status === col.key);
          return (
            <div key={col.key}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                  padding: '8px 0',
                  borderBottom: `2px solid ${col.color}`,
                }}
              >
                <Icon size={16} color={col.color} />
                <span style={{ fontSize: 14, fontWeight: 700 }}>{col.label}</span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: `${col.color}15`,
                    color: col.color,
                    marginLeft: 'auto',
                  }}
                >
                  {colItems.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {colItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card-base"
                    style={{ padding: 16 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{item.id}</span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: 3,
                          background: `${priorityColors[item.priority]}15`,
                          color: priorityColors[item.priority],
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{item.title}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--color-text-muted)' }}>
                        <IndianRupee size={12} /> ₹{item.amount} Cr • {item.ministry}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--color-text-muted)' }}>
                        <User size={12} /> {item.submittedBy}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--color-text-muted)' }}>
                        <Calendar size={12} /> {item.date}
                      </div>
                    </div>
                    {col.key === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => moveItem(item.id, 'approved')}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            padding: '7px 10px',
                            borderRadius: 6,
                            border: 'none',
                            background: 'rgba(0,200,83,0.1)',
                            color: '#00c853',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <CheckCircle2 size={13} /> Approve
                        </button>
                        <button
                          onClick={() => moveItem(item.id, 'rejected')}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            padding: '7px 10px',
                            borderRadius: 6,
                            border: 'none',
                            background: 'rgba(255,23,68,0.1)',
                            color: '#ff1744',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    )}
                    {col.key !== 'pending' && (
                      <button
                        onClick={() => moveItem(item.id, 'pending')}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4,
                          padding: '7px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--color-border-subtle)',
                          background: 'transparent',
                          color: 'var(--color-text-muted)',
                          fontSize: 11,
                          cursor: 'pointer',
                        }}
                      >
                        <ArrowRight size={13} /> Move to Pending
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
