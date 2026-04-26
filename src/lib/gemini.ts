import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// ─── Types ───────────────────────────────────────────────────
export interface AllocationRequest {
  totalBudget: number;
  ministries: string[];
  historicalData?: Record<string, number>[];
  priorities: string[];
}

export interface AllocationResult {
  ministry: string;
  allocated: number;
  reasoning: string;
  confidence: number;
  sdgAlignment: string[];
}

export interface AnomalyResult {
  id: string;
  type: 'overspend' | 'underspend' | 'duplicate' | 'pattern';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  region: string;
  amount: number;
  deviation: number;
}

// ─── Retry Helper ────────────────────────────────────────────
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 3000;

async function callWithRetry(prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await geminiModel.generateContent(prompt);
      return result.response.text();
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const errMsg = lastError.message || '';

      // Only retry on 429 (quota/rate-limit) errors
      if (errMsg.includes('429') || errMsg.toLowerCase().includes('quota')) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(`[Gemini] Rate limited (attempt ${attempt + 1}/${MAX_RETRIES + 1}). Retrying in ${delay / 1000}s…`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      // For non-retryable errors, throw immediately
      throw lastError;
    }
  }

  // All retries exhausted — throw so callers can use fallback
  throw lastError ?? new Error('Gemini API call failed after retries');
}

// ─── Fallback Mock Data ──────────────────────────────────────
function getFallbackAllocation(req: AllocationRequest): AllocationResult[] {
  const share = req.totalBudget / req.ministries.length;
  const sdgMap: Record<string, string[]> = {
    Education: ['SDG 4'], Health: ['SDG 3'], Defence: ['SDG 16'],
    Agriculture: ['SDG 2'], Infrastructure: ['SDG 9'], 'Rural Development': ['SDG 1', 'SDG 11'],
    'Women & Child': ['SDG 5'], 'Science & Tech': ['SDG 9'], Finance: ['SDG 8'],
  };
  return req.ministries.map((m, i) => ({
    ministry: m,
    allocated: Math.round(share * (1 + (i % 3 - 1) * 0.08)),
    reasoning: `Baseline equal-share allocation for ${m}. AI was unavailable — this is an offline estimate.`,
    confidence: 0.65,
    sdgAlignment: sdgMap[m] || ['SDG 17'],
  }));
}

function getFallbackAnomalies(): AnomalyResult[] {
  return [
    { id: 'ANO-F01', type: 'overspend', severity: 'high', title: 'Excess MGNREGA Expenditure — Jharkhand', description: 'Material costs 42% above state average, suggesting procurement irregularities. (Offline fallback data)', region: 'Jharkhand', amount: 187, deviation: 42 },
    { id: 'ANO-F02', type: 'underspend', severity: 'medium', title: 'PM-KISAN Funds Under-Utilized — Punjab', description: 'Only 38% of allocated funds disbursed despite 92% beneficiary registration. (Offline fallback data)', region: 'Punjab', amount: 340, deviation: -62 },
    { id: 'ANO-F03', type: 'duplicate', severity: 'critical', title: 'Duplicate Scholarship Disbursement — UP', description: 'Same beneficiary IDs received payments from both state and central schemes. (Offline fallback data)', region: 'Uttar Pradesh', amount: 56, deviation: 100 },
    { id: 'ANO-F04', type: 'pattern', severity: 'low', title: 'Seasonal Spending Spike — Kerala', description: 'Healthcare spending spikes 3x in Q3 annually — consistent with monsoon-related disease outbreaks. (Offline fallback data)', region: 'Kerala', amount: 120, deviation: 28 },
  ];
}

// ─── 1. AI Budget Allocation ────────────────────────────────
export async function generateAllocation(request: AllocationRequest): Promise<AllocationResult[]> {
  const prompt = `You are an expert Indian government budget allocation AI for BHARAT ResourceOS.
Given the following inputs, generate an optimal budget allocation for each ministry.

Total Budget: ₹${(request.totalBudget / 10000000).toFixed(2)} Crore
Ministries: ${request.ministries.join(', ')}
Policy Priorities: ${request.priorities.join(', ')}
${request.historicalData ? `Historical Data: ${JSON.stringify(request.historicalData)}` : ''}

Rules:
- Allocate the ENTIRE budget across all ministries — amounts must sum to the total budget.
- Consider India's current development priorities, SDG alignment, and policy focus areas.
- Provide realistic confidence scores (0.80–0.98 range).
- Each reasoning should be 1–2 sentences referencing actual Indian government schemes.
- Map each ministry to relevant UN SDG goals.

Return a JSON array where each object has:
- ministry (string — exact name from the list)
- allocated (number in INR, NOT crore — full rupee value)
- reasoning (string, 1-2 sentences)
- confidence (number 0-1)
- sdgAlignment (array of SDG goal strings like "SDG 4", "SDG 3")

Return ONLY the raw JSON array, no markdown, no code fences, no extra text.`;

  try {
    const text = await callWithRetry(prompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Failed to parse AI allocation response');
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.warn('[Gemini] Allocation call failed, using offline fallback:', err);
    return getFallbackAllocation(request);
  }
}

// ─── 2. AI Anomaly Detection ────────────────────────────────
export async function detectAnomalies(data: Record<string, unknown>[]): Promise<AnomalyResult[]> {
  const prompt = `You are an AI anomaly detection engine for India's government fiscal data (BHARAT ResourceOS).
Analyze this spending data for anomalies, suspicious patterns, or inefficiencies:

${JSON.stringify(data.slice(0, 50))}

For each anomaly found, return an object with:
- id (string like "ANO-001")
- type (one of: "overspend", "underspend", "duplicate", "pattern")
- severity (one of: "critical", "high", "medium", "low")
- title (short descriptive title, max 60 chars)
- description (1-2 sentence explanation)
- region (Indian state name)
- amount (number in crore)
- deviation (percentage deviation, positive for overspend, negative for underspend)

Return a JSON array of 3-6 anomalies. Return ONLY the raw JSON array, no markdown, no code fences.`;

  try {
    const text = await callWithRetry(prompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return getFallbackAnomalies();
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.warn('[Gemini] Anomaly detection failed, using offline fallback:', err);
    return getFallbackAnomalies();
  }
}

// ─── 3. AI Data Analysis (for uploaded Excel) ───────────────
export async function analyzeUploadedData(
  headers: string[],
  sampleRows: Record<string, unknown>[],
): Promise<{ insights: string[]; suggestedMinistries: string[]; estimatedBudget: number }> {
  const prompt = `You are an AI fiscal data analyst for India's BHARAT ResourceOS platform.
Analyze this uploaded budget data:

Headers: ${headers.join(', ')}
Sample Data (first ${sampleRows.length} rows): ${JSON.stringify(sampleRows.slice(0, 20))}

Provide:
1. "insights" — array of 3-5 key observations about the data
2. "suggestedMinistries" — array of ministry names detected or inferred from the data
3. "estimatedBudget" — estimated total budget in INR (full rupee value, not in crore)

Return ONLY a JSON object with these three fields. No markdown, no code fences.`;

  try {
    const text = await callWithRetry(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { insights: ['Unable to parse AI response — showing offline estimate'], suggestedMinistries: [], estimatedBudget: 0 };
    }
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.warn('[Gemini] Upload analysis failed, using offline fallback:', err);
    return {
      insights: [
        'AI quota exceeded — displaying offline analysis.',
        `Dataset contains ${headers.length} columns and ${sampleRows.length} rows.`,
        'Detected fiscal data structure. Re-run analysis when API quota resets.',
      ],
      suggestedMinistries: ['Education', 'Health', 'Infrastructure', 'Defence', 'Agriculture'],
      estimatedBudget: 5000000000000,
    };
  }
}

// ─── 4. AI Summary / Chat (for dashboard insights) ─────────
export async function generateInsightSummary(context: string): Promise<string> {
  const prompt = `You are BHARAT ResourceOS AI assistant. Based on this context, provide a brief 2-3 sentence insight summary for government officials:

${context}

Be concise, data-driven, and actionable. Mention specific Indian schemes or SDG goals where relevant.`;

  try {
    const text = await callWithRetry(prompt);
    return text;
  } catch (err) {
    console.warn('[Gemini] Insight summary failed, using offline fallback:', err);
    return '⚠️ AI quota temporarily exceeded. The system is operating in offline mode with cached insights. Budget allocations and anomaly scans will use baseline heuristics until the API resets. Estimated reset: ~60 seconds.';
  }
}
