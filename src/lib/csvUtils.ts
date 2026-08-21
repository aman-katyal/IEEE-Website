/**
 * Escapes a cell value for standard RFC 4180 CSV output.
 */
export function escapeCsvCell(val: unknown): string {
  if (val == null) return '""';
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
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
