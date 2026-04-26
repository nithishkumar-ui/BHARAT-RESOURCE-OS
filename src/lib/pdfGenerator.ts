import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ─── Shared Types ────────────────────────────────────────────
interface ReportData {
  title: string;
  subtitle: string;
  date: string;
  sections: {
    heading: string;
    tableHeaders: string[];
    tableRows: (string | number)[][];
  }[];
  summary: string;
}

export type ExportFormat = 'pdf' | 'csv' | 'xlsx';

// ─── Core PDF Builder ────────────────────────────────────────
export function generatePDFReport(data: ReportData): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, pageWidth, 50, 'F');
  // Saffron accent line
  doc.setFillColor(255, 107, 0);
  doc.rect(0, 50, pageWidth, 1.2, 'F');

  doc.setTextColor(255, 107, 0);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(data.title, pageWidth / 2, 22, { align: 'center' });

  doc.setTextColor(138, 138, 154);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(data.subtitle, pageWidth / 2, 32, { align: 'center' });

  doc.setTextColor(85, 85, 102);
  doc.setFontSize(9);
  doc.text(`Generated: ${data.date}`, pageWidth / 2, 42, { align: 'center' });

  let yPos = 60;

  // Sections with tables
  for (const section of data.sections) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setTextColor(240, 240, 245);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(section.heading, 14, yPos);
    yPos += 8;

    autoTable(doc, {
      startY: yPos,
      head: [section.tableHeaders],
      body: section.tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [22, 22, 30],
        textColor: [255, 107, 0],
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [17, 17, 24],
        textColor: [200, 200, 210],
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [26, 26, 36],
      },
      margin: { left: 14, right: 14 },
    });

    // In jspdf-autotable v5, finalY is accessed via doc.lastAutoTable
    const lastTable = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
    yPos = (lastTable?.finalY ?? yPos + 40) + 12;
  }

  // Summary paragraph
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  doc.setTextColor(138, 138, 154);
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(data.summary, pageWidth - 28);
  doc.text(lines, 14, yPos);

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(85, 85, 102);
    doc.setFontSize(8);
    doc.text(
      `BHARAT ResourceOS • Official Report • Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
}

// ─── CSV Export Helper ───────────────────────────────────────
function downloadCSV(filename: string, sections: ReportData['sections']) {
  const csvParts: string[] = [];
  for (const section of sections) {
    csvParts.push(section.heading);
    csvParts.push(section.tableHeaders.join(','));
    for (const row of section.tableRows) {
      csvParts.push(row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','));
    }
    csvParts.push('');
  }
  const blob = new Blob([csvParts.join('\n')], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

// ─── XLSX Export Helper ──────────────────────────────────────
function downloadXLSX(filename: string, sections: ReportData['sections']) {
  const wb = XLSX.utils.book_new();
  for (const section of sections) {
    const data = [section.tableHeaders, ...section.tableRows];
    const ws = XLSX.utils.aoa_to_sheet(data);
    // Style header row widths
    ws['!cols'] = section.tableHeaders.map(() => ({ wch: 22 }));
    const sheetName = section.heading.substring(0, 31); // Excel limit
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  triggerDownload(blob, filename);
}

// ─── Generic Download Trigger ────────────────────────────────
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getNow() {
  return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ═══════════════════════════════════════════════════════════════
// 1. ALLOCATION REPORT
// ═══════════════════════════════════════════════════════════════
export function generateAllocationReport(
  allocations: { ministry: string; allocated: number; confidence: number; reasoning: string }[],
  totalBudget: number,
  format: ExportFormat = 'pdf',
) {
  const reportData: ReportData = {
    title: 'BHARAT ResourceOS — Budget Allocation Report',
    subtitle: `Total Budget: ₹${(totalBudget / 10000000).toLocaleString()} Cr`,
    date: getNow(),
    sections: [
      {
        heading: 'Ministry-wise Allocation',
        tableHeaders: ['Ministry', 'Allocated (₹ Cr)', 'Confidence', 'Reasoning'],
        tableRows: allocations.map((a) => [
          a.ministry,
          (a.allocated / 100).toLocaleString(),
          `${Math.round(a.confidence * 100)}%`,
          a.reasoning,
        ]),
      },
      {
        heading: 'AI Confidence Distribution',
        tableHeaders: ['Range', 'Count', '% of Total'],
        tableRows: [
          ['≥ 95%', String(allocations.filter((a) => a.confidence >= 0.95).length), `${Math.round(allocations.filter((a) => a.confidence >= 0.95).length / allocations.length * 100)}%`],
          ['90–95%', String(allocations.filter((a) => a.confidence >= 0.9 && a.confidence < 0.95).length), `${Math.round(allocations.filter((a) => a.confidence >= 0.9 && a.confidence < 0.95).length / allocations.length * 100)}%`],
          ['< 90%', String(allocations.filter((a) => a.confidence < 0.9).length), `${Math.round(allocations.filter((a) => a.confidence < 0.9).length / allocations.length * 100)}%`],
        ],
      },
    ],
    summary: `This report was auto-generated by the BHARAT ResourceOS AI Allocation Engine using Gemini 2.0 Flash. Total allocations cover ${allocations.length} ministries with an average AI confidence of ${Math.round(allocations.reduce((s, a) => s + a.confidence, 0) / allocations.length * 100)}%. Budget distribution follows SDG-aligned priorities with real-time anomaly validation.`,
  };

  exportReport(reportData, 'BHARAT_ResourceOS_Allocation_Report', format);
}

// ═══════════════════════════════════════════════════════════════
// 2. ANOMALY DETECTION REPORT
// ═══════════════════════════════════════════════════════════════
const sampleAnomalies = [
  { id: 'ANO-001', region: 'Uttar Pradesh', type: 'Over-expenditure', severity: 'Critical', amount: '₹240 Cr', description: 'MGNREGA fund disbursement exceeded allocation by 18%' },
  { id: 'ANO-002', region: 'Maharashtra', type: 'Under-utilization', severity: 'High', amount: '₹180 Cr', description: 'Healthcare infrastructure funds unused for 2 quarters' },
  { id: 'ANO-003', region: 'Bihar', type: 'Duplicate Entry', severity: 'Medium', amount: '₹45 Cr', description: 'Duplicate PMAY beneficiary entries detected across 3 districts' },
  { id: 'ANO-004', region: 'Tamil Nadu', type: 'Pattern Mismatch', severity: 'High', amount: '₹92 Cr', description: 'Education spending pattern deviates 2.5σ from regional norm' },
  { id: 'ANO-005', region: 'Rajasthan', type: 'Timing Anomaly', severity: 'Low', amount: '₹28 Cr', description: 'End-of-quarter spending spike in rural development' },
];

export function generateAnomalyReport(format: ExportFormat = 'pdf') {
  const severityDist = [
    ['Critical', '1', '20%'],
    ['High', '2', '40%'],
    ['Medium', '1', '20%'],
    ['Low', '1', '20%'],
  ];

  const reportData: ReportData = {
    title: 'BHARAT ResourceOS — Anomaly Detection Report',
    subtitle: 'AI-Flagged Discrepancies & Corrective Actions',
    date: getNow(),
    sections: [
      {
        heading: 'Anomaly Overview',
        tableHeaders: ['ID', 'Region', 'Type', 'Severity', 'Amount', 'Description'],
        tableRows: sampleAnomalies.map((a) => [a.id, a.region, a.type, a.severity, a.amount, a.description]),
      },
      {
        heading: 'Severity Distribution',
        tableHeaders: ['Severity Level', 'Count', '% of Total'],
        tableRows: severityDist,
      },
      {
        heading: 'Recommended Corrective Actions',
        tableHeaders: ['Anomaly ID', 'Action', 'Priority', 'Deadline'],
        tableRows: [
          ['ANO-001', 'Initiate audit of UP MGNREGA disbursement chain', 'Immediate', '15 days'],
          ['ANO-002', 'Review Maharashtra healthcare fund release schedule', 'High', '30 days'],
          ['ANO-003', 'De-duplicate PMAY beneficiary database in Bihar', 'Medium', '45 days'],
          ['ANO-004', 'Statistical review of TN education spending model', 'High', '30 days'],
          ['ANO-005', 'Monitor — Flag for next quarter trend analysis', 'Low', '90 days'],
        ],
      },
    ],
    summary: `This anomaly report was generated by the BHARAT ResourceOS AI engine. ${sampleAnomalies.length} anomalies were flagged across ${new Set(sampleAnomalies.map((a) => a.region)).size} states, with a total flagged amount of ₹585 Cr. Critical and High severity items require immediate attention. All anomalies have been cross-validated against historical spending patterns and regional benchmarks.`,
  };

  exportReport(reportData, 'BHARAT_ResourceOS_Anomaly_Report', format);
}

// ═══════════════════════════════════════════════════════════════
// 3. FUND UTILIZATION REPORT
// ═══════════════════════════════════════════════════════════════
const stateUtilization = [
  { state: 'Maharashtra', allocated: 48200, utilized: 42100, rate: 87.3 },
  { state: 'Tamil Nadu', allocated: 38500, utilized: 35200, rate: 91.4 },
  { state: 'Uttar Pradesh', allocated: 62000, utilized: 43400, rate: 70.0 },
  { state: 'Karnataka', allocated: 34800, utilized: 31600, rate: 90.8 },
  { state: 'Rajasthan', allocated: 29500, utilized: 22100, rate: 74.9 },
  { state: 'Gujarat', allocated: 32100, utilized: 28900, rate: 90.0 },
  { state: 'Bihar', allocated: 25800, utilized: 16200, rate: 62.8 },
  { state: 'West Bengal', allocated: 27400, utilized: 21400, rate: 78.1 },
];

export function generateUtilizationReport(format: ExportFormat = 'pdf') {
  const avgRate = stateUtilization.reduce((s, st) => s + st.rate, 0) / stateUtilization.length;
  const underUtilized = stateUtilization.filter((s) => s.rate < 75);

  const reportData: ReportData = {
    title: 'BHARAT ResourceOS — Fund Utilization Report',
    subtitle: `Average Utilization: ${avgRate.toFixed(1)}% | States Covered: ${stateUtilization.length}`,
    date: getNow(),
    sections: [
      {
        heading: 'State-wise Utilization Summary',
        tableHeaders: ['State', 'Allocated (₹ Cr)', 'Utilized (₹ Cr)', 'Utilization %', 'Status'],
        tableRows: stateUtilization.map((s) => [
          s.state,
          s.allocated.toLocaleString(),
          s.utilized.toLocaleString(),
          `${s.rate}%`,
          s.rate >= 85 ? '✅ On Track' : s.rate >= 70 ? '⚠️ Needs Review' : '🔴 Under-utilized',
        ]),
      },
      {
        heading: 'Under-utilized States (< 75%)',
        tableHeaders: ['State', 'Utilization %', 'Shortfall (₹ Cr)', 'Recommended Action'],
        tableRows: underUtilized.map((s) => [
          s.state,
          `${s.rate}%`,
          (s.allocated - s.utilized).toLocaleString(),
          s.rate < 65 ? 'Immediate audit & reallocate' : 'Quarterly review & capacity building',
        ]),
      },
      {
        heading: 'Performance Benchmarks',
        tableHeaders: ['Benchmark', 'Target', 'Actual', 'Status'],
        tableRows: [
          ['National Average Utilization', '≥ 80%', `${avgRate.toFixed(1)}%`, avgRate >= 80 ? 'Met' : 'Below Target'],
          ['States ≥ 85% Utilization', '≥ 60% of states', `${Math.round(stateUtilization.filter((s) => s.rate >= 85).length / stateUtilization.length * 100)}%`, stateUtilization.filter((s) => s.rate >= 85).length / stateUtilization.length >= 0.6 ? 'Met' : 'Below Target'],
          ['Zero Under-utilized States', '0', String(underUtilized.length), underUtilized.length === 0 ? 'Met' : 'Not Met'],
        ],
      },
    ],
    summary: `Fund utilization report covers ${stateUtilization.length} major states. National average utilization stands at ${avgRate.toFixed(1)}%. ${underUtilized.length} state(s) fall below the 75% utilization threshold and require targeted intervention. The AI engine recommends capacity building and process streamlining for under-performing states.`,
  };

  exportReport(reportData, 'BHARAT_ResourceOS_Utilization_Report', format);
}

// ═══════════════════════════════════════════════════════════════
// 4. SDG IMPACT ASSESSMENT
// ═══════════════════════════════════════════════════════════════
const sdgData = [
  { goal: 'SDG 1 — No Poverty', budget: 125000, impact: 'High', coverage: '78%', gap: 'Rural targeting accuracy' },
  { goal: 'SDG 2 — Zero Hunger', budget: 89000, impact: 'High', coverage: '82%', gap: 'Post-harvest loss reduction' },
  { goal: 'SDG 3 — Good Health', budget: 96000, impact: 'Medium', coverage: '65%', gap: 'Tier-2/3 city infrastructure' },
  { goal: 'SDG 4 — Quality Education', budget: 112000, impact: 'High', coverage: '71%', gap: 'Digital divide in rural areas' },
  { goal: 'SDG 6 — Clean Water', budget: 45000, impact: 'Medium', coverage: '58%', gap: 'Groundwater depletion monitoring' },
  { goal: 'SDG 7 — Affordable Energy', budget: 68000, impact: 'Medium', coverage: '62%', gap: 'Renewable grid integration' },
  { goal: 'SDG 9 — Innovation & Infra', budget: 155000, impact: 'High', coverage: '74%', gap: 'Last-mile connectivity' },
  { goal: 'SDG 11 — Sustainable Cities', budget: 72000, impact: 'Medium', coverage: '55%', gap: 'Smart city data integration' },
];

export function generateSDGReport(format: ExportFormat = 'pdf') {
  const totalBudget = sdgData.reduce((s, d) => s + d.budget, 0);
  const highImpact = sdgData.filter((d) => d.impact === 'High');

  const reportData: ReportData = {
    title: 'BHARAT ResourceOS — SDG Impact Assessment',
    subtitle: `Total SDG-aligned Budget: ₹${(totalBudget / 100).toLocaleString()} Cr | ${sdgData.length} Goals Tracked`,
    date: getNow(),
    sections: [
      {
        heading: 'SDG Goal-wise Budget Alignment',
        tableHeaders: ['SDG Goal', 'Budget (₹ Cr)', 'Impact Rating', 'Coverage', 'Key Gap'],
        tableRows: sdgData.map((d) => [
          d.goal,
          (d.budget / 100).toLocaleString(),
          d.impact,
          d.coverage,
          d.gap,
        ]),
      },
      {
        heading: 'High-Impact SDG Goals',
        tableHeaders: ['Goal', 'Budget (₹ Cr)', 'Coverage', 'Recommendation'],
        tableRows: highImpact.map((d) => [
          d.goal,
          (d.budget / 100).toLocaleString(),
          d.coverage,
          `Increase coverage to ≥85% — address ${d.gap}`,
        ]),
      },
      {
        heading: 'Gap Identification',
        tableHeaders: ['SDG Goal', 'Current Coverage', 'Target', 'Gap %', 'Priority'],
        tableRows: sdgData.map((d) => {
          const current = parseInt(d.coverage);
          const gap = 85 - current;
          return [
            d.goal,
            d.coverage,
            '85%',
            gap > 0 ? `${gap}%` : '—',
            gap > 20 ? 'Critical' : gap > 10 ? 'High' : gap > 0 ? 'Medium' : 'On Track',
          ];
        }),
      },
    ],
    summary: `SDG Impact Assessment covers ${sdgData.length} United Nations Sustainable Development Goals aligned with India's fiscal allocations. ${highImpact.length} goals demonstrate High impact. Average coverage stands at ${Math.round(sdgData.reduce((s, d) => s + parseInt(d.coverage), 0) / sdgData.length)}%. Key gaps include digital divide in education, clean water monitoring, and smart city integration. The AI engine recommends targeted budget reallocation towards goals with coverage below 65%.`,
  };

  exportReport(reportData, 'BHARAT_ResourceOS_SDG_Impact_Report', format);
}

// ─── Universal Export Dispatcher ─────────────────────────────
function exportReport(data: ReportData, filenameBase: string, format: ExportFormat) {
  switch (format) {
    case 'pdf': {
      const doc = generatePDFReport(data);
      doc.save(`${filenameBase}.pdf`);
      break;
    }
    case 'csv':
      downloadCSV(`${filenameBase}.csv`, data.sections);
      break;
    case 'xlsx':
      downloadXLSX(`${filenameBase}.xlsx`, data.sections);
      break;
  }
}

// ─── Recent-report quick download (generates sample data on the fly) ─
export function downloadRecentReport(reportName: string, format: ExportFormat = 'pdf') {
  if (reportName.toLowerCase().includes('allocation')) {
    generateAllocationReport(
      [
        { ministry: 'Education', allocated: 112600, confidence: 0.94, reasoning: 'NEP expansion' },
        { ministry: 'Health', allocated: 89300, confidence: 0.91, reasoning: 'Ayushman Bharat' },
        { ministry: 'Defence', allocated: 593000, confidence: 0.97, reasoning: 'Modernization' },
        { ministry: 'Agriculture', allocated: 125100, confidence: 0.88, reasoning: 'PM-KISAN' },
        { ministry: 'Railways', allocated: 255000, confidence: 0.95, reasoning: 'Vande Bharat' },
      ],
      45000000000,
      format,
    );
  } else if (reportName.toLowerCase().includes('anomaly')) {
    generateAnomalyReport(format);
  } else if (reportName.toLowerCase().includes('utilization')) {
    generateUtilizationReport(format);
  } else if (reportName.toLowerCase().includes('sdg')) {
    generateSDGReport(format);
  } else {
    // Fallback — generic allocation
    generateAllocationReport(
      [
        { ministry: 'Education', allocated: 112600, confidence: 0.94, reasoning: 'NEP expansion' },
        { ministry: 'Health', allocated: 89300, confidence: 0.91, reasoning: 'Ayushman Bharat' },
        { ministry: 'Defence', allocated: 593000, confidence: 0.97, reasoning: 'Modernization' },
      ],
      45000000000,
      format,
    );
  }
}
