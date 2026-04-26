import * as XLSX from 'xlsx';

export interface ParsedRow {
  [key: string]: string | number | boolean | null;
}

export interface ParseResult {
  headers: string[];
  rows: ParsedRow[];
  sheetName: string;
  totalRows: number;
  warnings: string[];
}

export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ParsedRow>(sheet);
        const headers = Object.keys(jsonData[0] || {});
        const warnings: string[] = [];

        if (jsonData.length === 0) warnings.push('Sheet appears to be empty');
        if (headers.length < 2) warnings.push('Very few columns detected');

        resolve({
          headers,
          rows: jsonData,
          sheetName,
          totalRows: jsonData.length,
          warnings,
        });
      } catch (err) {
        reject(new Error('Failed to parse Excel file: ' + (err as Error).message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function validateBudgetData(rows: ParsedRow[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredFields = ['ministry', 'amount'];

  const headers = Object.keys(rows[0] || {}).map((h) => h.toLowerCase());
  for (const field of requiredFields) {
    if (!headers.some((h) => h.includes(field))) {
      errors.push(`Missing required column: "${field}"`);
    }
  }

  rows.forEach((row, i) => {
    const amount = Object.entries(row).find(([k]) => k.toLowerCase().includes('amount'));
    if (amount && typeof amount[1] === 'number' && amount[1] < 0) {
      errors.push(`Row ${i + 1}: Negative amount detected`);
    }
  });

  return { valid: errors.length === 0, errors };
}
