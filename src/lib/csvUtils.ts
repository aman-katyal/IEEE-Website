/**
 * Sanitizes a cell value to prevent CSV formula injection attacks in Excel / Google Sheets.
 */
export function sanitizeCsvCell(val: unknown): string {
  if (val == null) return '';
  let str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return str;
}

/**
 * Escapes a cell value for standard RFC 4180 CSV output with injection defense.
 */
export function escapeCsvCell(val: unknown): string {
  if (val == null) return '""';
  const sanitized = sanitizeCsvCell(val);
  if (sanitized.includes(",") || sanitized.includes('"') || sanitized.includes("\n") || sanitized.includes("\r")) {
    return `"${sanitized.replace(/"/g, '""')}"`;
  }
  return `"${sanitized}"`;
}

/**
 * Converts an array of rows and headers into a CSV string.
 */
export function generateCsvString(
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): string {
  const headerLine = headers.map(escapeCsvCell).join(",");
  const dataLines = rows.map((row) => row.map(escapeCsvCell).join(","));
  return [headerLine, ...dataLines].join("\r\n");
}

/**
 * Triggers a browser download of a CSV file given headers and rows.
 */
export function downloadCsvFile(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): void {
  const csvContent = generateCsvString(headers, rows);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
