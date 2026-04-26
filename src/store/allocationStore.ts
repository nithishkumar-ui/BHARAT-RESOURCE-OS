import { create } from 'zustand';
import type { AllocationResult, AnomalyResult } from '../lib/gemini';
import type { ParsedRow } from '../lib/excelParser';

interface AllocationState {
  // Upload
  uploadedData: ParsedRow[];
  uploadFileName: string;
  isUploading: boolean;

  // Allocation
  allocations: AllocationResult[];
  isAllocating: boolean;
  totalBudget: number;

  // Anomalies
  anomalies: AnomalyResult[];
  isDetecting: boolean;

  // AI Insights from upload
  aiInsights: string[];

  // Error
  error: string | null;

  // Actions
  setUploadedData: (data: ParsedRow[], fileName: string) => void;
  setAllocations: (allocations: AllocationResult[]) => void;
  setIsAllocating: (v: boolean) => void;
  setTotalBudget: (budget: number) => void;
  setAnomalies: (anomalies: AnomalyResult[]) => void;
  setIsDetecting: (v: boolean) => void;
  setAiInsights: (insights: string[]) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

export const useAllocationStore = create<AllocationState>((set) => ({
  uploadedData: [],
  uploadFileName: '',
  isUploading: false,
  allocations: [],
  isAllocating: false,
  totalBudget: 450000_00_00_000, // ₹4.5 lakh crore default
  anomalies: [],
  isDetecting: false,
  aiInsights: [],
  error: null,

  setUploadedData: (data, fileName) =>
    set({ uploadedData: data, uploadFileName: fileName, isUploading: false }),

  setAllocations: (allocations) => set({ allocations, isAllocating: false }),

  setIsAllocating: (v) => set({ isAllocating: v }),

  setTotalBudget: (budget) => set({ totalBudget: budget }),

  setAnomalies: (anomalies) => set({ anomalies, isDetecting: false }),

  setIsDetecting: (v) => set({ isDetecting: v }),

  setAiInsights: (insights) => set({ aiInsights: insights }),

  setError: (error) => set({ error }),

  clearData: () =>
    set({
      uploadedData: [],
      uploadFileName: '',
      allocations: [],
      anomalies: [],
      aiInsights: [],
      error: null,
    }),
}));
