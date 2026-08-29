/**
 * BoilerBooks 3.0 TooCOOL Membership Dues CSV Parser
 * Handles semester export files from Purdue TooCOOL / BoilerConnect.
 */

export interface ParsedDuesRow {
  studentName: string;
  purdueEmail: string;
  amountPaid: number;
  paymentDate: string; // YYYY-MM-DD
  transactionId?: string | null;
  semester: string;
  fiscalYearId: string;
  rowNumber: number;
  rawRow?: Record<string, string>;
}

export interface ParseDuesError {
  rowNumber: number;
  raw: string;
  reason: string;
}

export interface ParseDuesDuplicate {
  rowNumber: number;
  purdueEmail: string;
  studentName: string;
  transactionId?: string | null;
  originalRowNumber: number;
}

export interface ParseDuesResult {
  validRecords: ParsedDuesRow[];
  errors: ParseDuesError[];
  duplicates: ParseDuesDuplicate[];
  totalRows: number;
  validCount: number;
  errorCount: number;
  duplicateCount: number;
  totalAmount: number;
  fiscalYearId: string;
  semester: string;
}

/**
 * Validates standard email address format.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

/**
 * Cleans and parses monetary strings (e.g. "$15.00", "15.50 USD", " 20 ") into numeric floats.
 */
export function parseCurrencyAmount(rawAmount: unknown): number | null {
  if (typeof rawAmount === 'number') {
    return Number.isFinite(rawAmount) && rawAmount > 0
      ? Math.round((rawAmount + Number.EPSILON) * 100) / 100
      : null;
  }
  if (typeof rawAmount !== 'string') return null;
  const cleaned = rawAmount.replace(/[^0-9.-]/g, '').trim();
  if (!cleaned) return null;
  const val = parseFloat(cleaned);
  if (!Number.isFinite(val) || val <= 0) return null;
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Normalizes dates (ISO strings, MM/DD/YYYY, MM/DD/YY, timestamps) into standard YYYY-MM-DD.
 */
export function parseDateToISO(rawDate: unknown): string {
  if (!rawDate || typeof rawDate !== 'string') {
    return new Date().toISOString().split('T')[0];
  }
  const str = rawDate.trim();
  if (!str) {
    return new Date().toISOString().split('T')[0];
  }

  // Match YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS
  const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Match MM/DD/YYYY or MM/DD/YY
  const usMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (usMatch) {
    let y = usMatch[3];
    if (y.length === 2) {
      y = parseInt(y, 10) > 50 ? `19${y}` : `20${y}`;
    }
    const m = usMatch[1].padStart(2, '0');
    const d = usMatch[2].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Fallback to native Date parser
  const parsed = Date.parse(str);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
}

/**
 * Parses raw CSV text into a 2D array of string cells following RFC 4180.
 * Correctly handles quoted values, escaped quotes (""), embedded commas, and CRLF/LF newlines.
 */
export function parseCSVToRows(csvContent: string): string[][] {
  if (!csvContent || typeof csvContent !== 'string') {
    return [];
  }

  // Strip UTF-8 BOM if present
  const content = csvContent.startsWith('\uFEFF') ? csvContent.slice(1) : csvContent;

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentCell += '"';
          i += 2;
          continue;
        } else {
          insideQuotes = false;
          i++;
          continue;
        }
      } else {
        currentCell += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentCell);
        currentCell = '';
        i++;
        continue;
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++;
        }
        currentRow.push(currentCell);
        currentCell = '';
        if (currentRow.some((c) => c.trim().length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        i++;
        continue;
      } else if (char === '\n') {
        currentRow.push(currentCell);
        currentCell = '';
        if (currentRow.some((c) => c.trim().length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        i++;
        continue;
      } else {
        currentCell += char;
        i++;
        continue;
      }
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some((c) => c.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Parses raw Excel 2003 XML spreadsheet text (<Workbook><Table><Row><Cell><Data>...</Data></Cell></Row></Table></Workbook>)
 */
export function parseSpreadsheetXMLToRows(xmlContent: string): string[][] {
  if (!xmlContent || typeof xmlContent !== 'string') {
    return [];
  }

  const rowMatches = xmlContent.match(/<Row[\s\S]*?<\/Row>/gi) || [];
  const rows: string[][] = [];

  for (const rowXml of rowMatches) {
    const cellMatches = rowXml.match(/<Cell[\s\S]*?<\/Cell>/gi) || [];
    const cellValues: string[] = [];

    for (const cellXml of cellMatches) {
      const dataMatch = cellXml.match(/<Data[^>]*>([\s\S]*?)<\/Data>/i);
      const val = dataMatch ? dataMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim() : '';
      cellValues.push(val);
    }

    if (cellValues.some((c) => c.trim().length > 0)) {
      rows.push(cellValues);
    }
  }

  return rows;
}

/**
 * Universal spreadsheet content row extractor supporting CSV, TSV, and Excel XML formats.
 */
export function parseSpreadsheetToRows(content: string): string[][] {
  if (!content || typeof content !== 'string') return [];
  const trimmed = content.trim();
  if (trimmed.includes('<Workbook') || trimmed.includes('<?xml') || trimmed.includes('<ss:Workbook')) {
    return parseSpreadsheetXMLToRows(trimmed);
  }
  return parseCSVToRows(trimmed);
}

function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

interface ColumnMapping {
  nameIndex: number;
  firstNameIndex: number;
  lastNameIndex: number;
  emailIndex: number;
  amountIndex: number;
  dateIndex: number;
  transactionIndex: number;
  customerIndex: number;
}

function detectColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    nameIndex: -1,
    firstNameIndex: -1,
    lastNameIndex: -1,
    emailIndex: -1,
    amountIndex: -1,
    dateIndex: -1,
    transactionIndex: -1,
    customerIndex: -1,
  };

  headers.forEach((h, index) => {
    const norm = normalizeKey(h);

    if (
      norm === 'firstname' ||
      norm === 'first' ||
      norm === 'fname'
    ) {
      mapping.firstNameIndex = index;
    } else if (
      norm === 'lastname' ||
      norm === 'last' ||
      norm === 'lname' ||
      norm === 'surname'
    ) {
      mapping.lastNameIndex = index;
    } else if (
      norm === 'studentname' ||
      norm === 'name' ||
      norm === 'fullname' ||
      norm === 'membername' ||
      norm === 'student' ||
      norm === 'member'
    ) {
      mapping.nameIndex = index;
    } else if (
      norm.includes('email') ||
      norm.includes('alias') ||
      norm === 'purdueemail' ||
      norm === 'studentemail'
    ) {
      mapping.emailIndex = index;
    } else if (
      norm === 'amount' ||
      norm === 'amountpaid' ||
      norm === 'totalpaid' ||
      norm === 'paymentamount' ||
      norm === 'orderamount' ||
      norm === 'itemtotal' ||
      norm === 'price' ||
      norm === 'total' ||
      norm === 'cost' ||
      norm === 'fee' ||
      norm === 'dues' ||
      norm === 'duesamount'
    ) {
      mapping.amountIndex = index;
    } else if (
      norm === 'date' ||
      norm === 'paymentdate' ||
      norm === 'transactiondate' ||
      norm === 'orderdate' ||
      norm === 'timestamp' ||
      norm === 'createddate' ||
      norm === 'paidat' ||
      norm === 'purchasedate' ||
      norm === 'ordercreated'
    ) {
      mapping.dateIndex = index;
    } else if (
      norm.includes('transaction') ||
      norm.includes('orderid') ||
      norm.includes('ordernumber') ||
      norm === 'ecorder' ||
      norm === 'invoicenumber' ||
      norm.includes('receipt') ||
      norm.includes('confirmation') ||
      norm === 'transid' ||
      norm === 'ref' ||
      norm === 'referenceid'
    ) {
      if (mapping.transactionIndex === -1 || norm === 'ecorder') {
        mapping.transactionIndex = index;
      }
    } else if (norm === 'eccustomer' || norm === 'customer' || norm === 'customerid') {
      mapping.customerIndex = index;
    }
  });

  return mapping;
}

/**
 * Universal Parser: Parses TooCOOL CSV or vECOrders Excel XML content and returns structured valid records, errors, and duplicates.
 */
export function parseDuesFile(
  content: string,
  fiscalYearId: string,
  semester: string
): ParseDuesResult {
  if (!fiscalYearId || typeof fiscalYearId !== 'string') {
    throw new Error('fiscalYearId is required to parse TooCOOL CSV');
  }

  if (!semester || typeof semester !== 'string') {
    throw new Error('semester is required to parse TooCOOL CSV');
  }

  const rawRows = parseSpreadsheetToRows(content);

  if (rawRows.length === 0) {
    return {
      validRecords: [],
      errors: [],
      duplicates: [],
      totalRows: 0,
      validCount: 0,
      errorCount: 0,
      duplicateCount: 0,
      totalAmount: 0,
      fiscalYearId,
      semester,
    };
  }

  const headerRow = rawRows[0];
  const mapping = detectColumnMapping(headerRow);
  const dataRows = rawRows.slice(1);

  const validRecords: ParsedDuesRow[] = [];
  const errors: ParseDuesError[] = [];
  const duplicates: ParseDuesDuplicate[] = [];

  const seenEmails = new Map<string, number>();
  const seenTransactions = new Map<string, number>();

  let totalAmount = 0;

  dataRows.forEach((row, idx) => {
    const rowNumber = idx + 2; // 1-indexed including header
    const rawString = row.join(',');

    // Skip entirely blank rows
    if (row.every((cell) => cell.trim().length === 0)) {
      return;
    }

    // Extract student name
    let studentName = '';
    if (mapping.nameIndex !== -1 && row[mapping.nameIndex]) {
      studentName = row[mapping.nameIndex].trim();
    } else if (
      mapping.firstNameIndex !== -1 ||
      mapping.lastNameIndex !== -1
    ) {
      const first = mapping.firstNameIndex !== -1 ? (row[mapping.firstNameIndex] || '').trim() : '';
      const last = mapping.lastNameIndex !== -1 ? (row[mapping.lastNameIndex] || '').trim() : '';
      studentName = `${first} ${last}`.trim();
    }

    // Format "Last, First [Middle]" -> "First [Middle] Last"
    if (studentName.includes(',')) {
      const nameParts = studentName.split(',').map((p) => p.trim());
      if (nameParts.length >= 2) {
        studentName = `${nameParts.slice(1).join(' ')} ${nameParts[0]}`.trim();
      }
    }

    // Extract email or derive Purdue alias
    let purdueEmail = '';
    if (mapping.emailIndex !== -1 && row[mapping.emailIndex]) {
      purdueEmail = row[mapping.emailIndex].trim().toLowerCase();
    } else if (studentName) {
      // Fallback: derive Purdue email identifier from name
      const cleanParts = studentName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
      if (cleanParts.length >= 2) {
        purdueEmail = `${cleanParts[0]}.${cleanParts[cleanParts.length - 1]}@purdue.edu`;
      } else if (cleanParts.length === 1 && cleanParts[0]) {
        purdueEmail = `${cleanParts[0]}@purdue.edu`;
      } else if (mapping.customerIndex !== -1 && row[mapping.customerIndex]) {
        purdueEmail = `customer-${row[mapping.customerIndex].trim()}@purdue.edu`;
      }
    }

    // Extract amount
    const amountRaw = mapping.amountIndex !== -1 ? row[mapping.amountIndex] : '';
    const parsedAmount = parseCurrencyAmount(amountRaw);

    // Extract date
    const dateRaw = mapping.dateIndex !== -1 ? row[mapping.dateIndex] : '';
    const paymentDate = parseDateToISO(dateRaw);

    // Extract transaction ID
    const transactionId =
      mapping.transactionIndex !== -1 && row[mapping.transactionIndex]
        ? row[mapping.transactionIndex].trim()
        : null;

    // Validate fields
    if (!studentName) {
      errors.push({
        rowNumber,
        raw: rawString,
        reason: 'Missing or empty student name',
      });
      return;
    }

    if (!purdueEmail || !isValidEmail(purdueEmail)) {
      errors.push({
        rowNumber,
        raw: rawString,
        reason: `Invalid or missing email address: "${purdueEmail}"`,
      });
      return;
    }

    if (parsedAmount === null) {
      errors.push({
        rowNumber,
        raw: rawString,
        reason: `Invalid or non-positive payment amount: "${amountRaw}"`,
      });
      return;
    }

    // Check for in-file duplicates
    // ⚡ Bolt: Optimize Map lookups by combining .has() and .get()
    const originalEmailRow = seenEmails.get(purdueEmail);
    if (originalEmailRow !== undefined) {
      duplicates.push({
        rowNumber,
        purdueEmail,
        studentName,
        transactionId,
        originalRowNumber: originalEmailRow,
      });
      return;
    }

    const originalTxRow = transactionId ? seenTransactions.get(transactionId) : undefined;
    if (transactionId && originalTxRow !== undefined) {
      duplicates.push({
        rowNumber,
        purdueEmail,
        studentName,
        transactionId,
        originalRowNumber: originalTxRow,
      });
      return;
    }

    // Build raw row record dictionary
    const rawRowDict: Record<string, string> = {};
    headerRow.forEach((h, hIdx) => {
      rawRowDict[h] = row[hIdx] ?? '';
    });

    seenEmails.set(purdueEmail, rowNumber);
    if (transactionId) {
      seenTransactions.set(transactionId, rowNumber);
    }

    totalAmount = Math.round((totalAmount + parsedAmount + Number.EPSILON) * 100) / 100;

    validRecords.push({
      studentName,
      purdueEmail,
      amountPaid: parsedAmount,
      paymentDate,
      transactionId,
      semester,
      fiscalYearId,
      rowNumber,
      rawRow: rawRowDict,
    });
  });

  return {
    validRecords,
    errors,
    duplicates,
    totalRows: dataRows.length,
    validCount: validRecords.length,
    errorCount: errors.length,
    duplicateCount: duplicates.length,
    totalAmount,
    fiscalYearId,
    semester,
  };
}

/**
 * Legacy alias for parseDuesFile
 */
export function parseTooCOOLCSV(
  csvContent: string,
  fiscalYearId: string,
  semester: string
): ParseDuesResult {
  return parseDuesFile(csvContent, fiscalYearId, semester);
}

