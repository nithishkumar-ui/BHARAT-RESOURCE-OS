import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Generic Helpers ──────────────────────────────────────────────────

export async function getCollection<T = DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<(T & { id: string })[]> {
  const q = constraints.length
    ? query(collection(db, collectionName), ...constraints)
    : collection(db, collectionName);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

export async function getDocument<T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<(T & { id: string }) | null> {
  const docRef = doc(db, collectionName, docId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as T) };
}

export async function addDocument(collectionName: string, data: DocumentData) {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
) {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(collectionName: string, docId: string) {
  await deleteDoc(doc(db, collectionName, docId));
}

export async function setDocument(
  collectionName: string,
  docId: string,
  data: DocumentData,
  merge = true
) {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge });
}

// ─── Real-time Listeners ──────────────────────────────────────────────

export function subscribeToCollection<T = DocumentData>(
  collectionName: string,
  callback: (data: (T & { id: string })[]) => void,
  ...constraints: QueryConstraint[]
) {
  const q = constraints.length
    ? query(collection(db, collectionName), ...constraints)
    : collection(db, collectionName);

  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
    callback(docs);
  });
}

// ─── Seed Initial Data ───────────────────────────────────────────────

export async function seedInitialData() {
  // Check if already seeded
  const check = await getDocument('system', 'seed_status');
  if (check) return; // Already seeded

  // Seed sample approvals
  const approvals = [
    {
      title: 'National Highway Extension',
      ministry: 'Ministry of Road Transport',
      amount: 24500,
      status: 'pending',
      priority: 'high',
      submittedBy: 'Rajesh Kumar',
      description: 'Extension of NH-44 from Agra to Kanpur (120 km)',
    },
    {
      title: 'Smart City Infrastructure',
      ministry: 'Ministry of Housing',
      amount: 18200,
      status: 'approved',
      priority: 'medium',
      submittedBy: 'Priya Sharma',
      description: 'Smart infrastructure deployment in 5 tier-2 cities',
    },
    {
      title: 'Renewable Energy Plant',
      ministry: 'Ministry of Power',
      amount: 31000,
      status: 'pending',
      priority: 'high',
      submittedBy: 'Arun Mehta',
      description: 'Solar power plant in Rajasthan (500 MW capacity)',
    },
    {
      title: 'Digital India Phase III',
      ministry: 'Ministry of Electronics & IT',
      amount: 8900,
      status: 'approved',
      priority: 'medium',
      submittedBy: 'Deepak Patel',
      description: 'Internet connectivity for 10,000 remote villages',
    },
    {
      title: 'Healthcare Equipment Upgrade',
      ministry: 'Ministry of Health',
      amount: 12500,
      status: 'rejected',
      priority: 'low',
      submittedBy: 'Dr. Meera Joshi',
      description: 'Medical equipment upgrade in 200 district hospitals',
    },
  ];

  for (const approval of approvals) {
    await addDocument('approvals', approval);
  }

  // Seed sample anomalies
  const anomalies = [
    {
      title: 'Unusual Expenditure Spike',
      ministry: 'Ministry of Defence',
      severity: 'high',
      amount: 4500,
      type: 'spending_anomaly',
      description: 'Spending increased 340% in Q3 vs Q2 for equipment procurement',
      detected: new Date().toISOString(),
      status: 'investigating',
    },
    {
      title: 'Duplicate Vendor Payments',
      ministry: 'Ministry of Agriculture',
      severity: 'medium',
      amount: 820,
      type: 'duplicate_payment',
      description: 'Multiple payments detected to same vendor for fertilizer supplies',
      detected: new Date().toISOString(),
      status: 'open',
    },
    {
      title: 'Budget Overrun Alert',
      ministry: 'Ministry of Railways',
      severity: 'high',
      amount: 15200,
      type: 'budget_overrun',
      description: 'Vande Bharat expansion project exceeding allocated budget by 23%',
      detected: new Date().toISOString(),
      status: 'open',
    },
  ];

  for (const anomaly of anomalies) {
    await addDocument('anomalies', anomaly);
  }

  // Seed sample notifications
  const notifications = [
    {
      title: 'Anomaly Detected',
      description: 'Unusual spending pattern in Ministry of Defence',
      type: 'alert',
      read: false,
      timestamp: new Date().toISOString(),
    },
    {
      title: 'Plan Approved',
      description: 'Maharashtra infrastructure plan approved by Finance Minister',
      type: 'success',
      read: false,
      timestamp: new Date().toISOString(),
    },
    {
      title: 'Pending Review',
      description: '3 new allocation requests need your review',
      type: 'info',
      read: false,
      timestamp: new Date().toISOString(),
    },
  ];

  for (const notif of notifications) {
    await addDocument('notifications', notif);
  }

  // Mark as seeded
  await setDocument('system', 'seed_status', { seeded: true, seedDate: new Date().toISOString() }, false);
}

// Re-export commonly used Firestore utilities
export { query, where, orderBy, limit, serverTimestamp, collection, doc };
