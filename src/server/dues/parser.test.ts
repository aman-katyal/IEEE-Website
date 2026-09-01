import { describe, it, expect } from 'vitest';
import {
  parseTooCOOLCSV,
  isValidEmail,
  parseCurrencyAmount,
  parseDateToISO,
  parseCSVToRows
} from './parser';

describe('CSV Parser Helper Functions', () => {
  it('validates email addresses accurately', () => {
    expect(isValidEmail('purdue_member@purdue.edu')).toBe(true);
    expect(isValidEmail('john.doe@gmail.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('@purdue.edu')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('parses currency strings with symbols, spaces, and decimals', () => {
    expect(parseCurrencyAmount('$15.00')).toBe(15.00);
    expect(parseCurrencyAmount(' 15.50 USD ')).toBe(15.50);
    expect(parseCurrencyAmount('20')).toBe(20.00);
    expect(parseCurrencyAmount(15)).toBe(15.00);
    expect(parseCurrencyAmount('$0.00')).toBeNull();
    expect(parseCurrencyAmount('-15.00')).toBeNull();
    expect(parseCurrencyAmount('free')).toBeNull();
  });

  it('normalizes various date formats to YYYY-MM-DD', () => {
    expect(parseDateToISO('2025-09-15')).toBe('2025-09-15');
    expect(parseDateToISO('2025-09-15T14:30:00Z')).toBe('2025-09-15');
    expect(parseDateToISO('09/15/2025')).toBe('2025-09-15');
    expect(parseDateToISO('9/5/25')).toBe('2025-09-05');
    expect(parseDateToISO('')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('parses RFC 4180 CSV rows with quoted fields and embedded commas', () => {
    const csv = `"Student Name","Email","Amount"\n"Doe, John",jdoe@purdue.edu,"$15.00"\n"Smith, ""Jack""",jsmith@purdue.edu,"$15.00"`;
    const rows = parseCSVToRows(csv);
    expect(rows).toHaveLength(3);
    expect(rows[1][0]).toBe('Doe, John');
    expect(rows[1][1]).toBe('jdoe@purdue.edu');
    expect(rows[2][0]).toBe('Smith, "Jack"');
  });
});

describe('parseTooCOOLCSV', () => {
  it('parses standard TooCOOL CSV export with clean rows', () => {
    const csv = `Student Name,Purdue Email,Amount Paid,Payment Date,Transaction ID
Neil Armstrong,narmstrong@purdue.edu,$15.00,2025-09-01,TXN-1001
Gene Cernan,gcernan@purdue.edu,$15.00,2025-09-02,TXN-1002
Amelia Earhart,aearhart@purdue.edu,15.00,09/03/2025,TXN-1003`;

    const result = parseTooCOOLCSV(csv, 'fy25-26', 'Fall 2025');

    expect(result.validCount).toBe(3);
    expect(result.errorCount).toBe(0);
    expect(result.duplicateCount).toBe(0);
    expect(result.totalAmount).toBe(45.00);
    expect(result.validRecords[0]).toEqual({
      studentName: 'Neil Armstrong',
      purdueEmail: 'narmstrong@purdue.edu',
      amountPaid: 15.00,
      paymentDate: '2025-09-01',
      transactionId: 'TXN-1001',
      semester: 'Fall 2025',
      fiscalYearId: 'fy25-26',
      rowNumber: 2,
      rawRow: expect.any(Object),
    });
    expect(result.validRecords[2].paymentDate).toBe('2025-09-03');
  });

  it('handles First Name and Last Name separate columns and BOM character', () => {
    const csv = `\uFEFFFirst Name,Last Name,Email Address,Price,Transaction Date
Gus,Grissom,ggrissom@purdue.edu,$15.00,2025-09-10
Roger,Chaffee,rchaffee@purdue.edu,$15.00,2025-09-11`;

    const result = parseTooCOOLCSV(csv, 'fy25-26', 'Fall 2025');

    expect(result.validCount).toBe(2);
    expect(result.validRecords[0].studentName).toBe('Gus Grissom');
    expect(result.validRecords[0].purdueEmail).toBe('ggrissom@purdue.edu');
    expect(result.validRecords[1].studentName).toBe('Roger Chaffee');
  });

  it('identifies malformed rows with invalid emails or missing names', () => {
    const csv = `Student Name,Email,Amount Paid,Date\n,missingname@purdue.edu,$15.00,2025-09-01\nValid Student,notanemail,$15.00,2025-09-01\nAnother Student,valid@purdue.edu,invalid_amt,2025-09-01\nGood Student,good@purdue.edu,$15.00,2025-09-01`;

    const result = parseTooCOOLCSV(csv, 'fy25-26', 'Fall 2025');

    expect(result.validCount).toBe(1);
    expect(result.errorCount).toBe(3);
    expect(result.validRecords[0].studentName).toBe('Good Student');
    expect(result.errors[0].reason).toContain('Missing or empty student name');
    expect(result.errors[1].reason).toContain('Invalid or missing email address');
    expect(result.errors[2].reason).toContain('Invalid or non-positive payment amount');
  });

  it('detects duplicate rows inside the CSV file by email and transaction ID', () => {
    const csv = `Student Name,Email,Amount Paid,Date,Transaction ID\nAlex Boiler,aboiler@purdue.edu,$15.00,2025-09-01,TXN-2001\nAlex Boiler Duplicate,aboiler@purdue.edu,$15.00,2025-09-01,TXN-2002\nDifferent Person,different@purdue.edu,$15.00,2025-09-01,TXN-2001`;

    const result = parseTooCOOLCSV(csv, 'fy25-26', 'Fall 2025');

    expect(result.validCount).toBe(1);
    expect(result.duplicateCount).toBe(2);
    expect(result.duplicates[0].purdueEmail).toBe('aboiler@purdue.edu');
    expect(result.duplicates[0].originalRowNumber).toBe(2);
    expect(result.duplicates[1].transactionId).toBe('TXN-2001');
  });

  it('throws when fiscalYearId or semester are missing', () => {
    expect(() => parseTooCOOLCSV('Name,Email,Amount\nTest,test@purdue.edu,15', '', 'Fall 2025')).toThrow(
      'fiscalYearId is required'
    );
    expect(() => parseTooCOOLCSV('Name,Email,Amount\nTest,test@purdue.edu,15', 'fy25-26', '')).toThrow(
      'semester is required'
    );
  });
});

describe('vECOrders Excel XML Parser', () => {
  it('parses Excel 2003 XML spreadsheet (vECOrders format) and normalizes names', () => {
    const xmlData = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Sheet1">
    <Table>
      <Row>
        <Cell><Data ss:Type="String">EC Order</Data></Cell>
        <Cell><Data ss:Type="String">Full Name</Data></Cell>
        <Cell><Data ss:Type="String">EC Customer</Data></Cell>
        <Cell><Data ss:Type="String">Order Date</Data></Cell>
        <Cell><Data ss:Type="String">Invoice Number</Data></Cell>
        <Cell><Data ss:Type="String">Order Amount</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">179435</Data></Cell>
        <Cell><Data ss:Type="String">Leviste, Ryan</Data></Cell>
        <Cell><Data ss:Type="String">91866</Data></Cell>
        <Cell><Data ss:Type="String">2026-03-05T19:47:00.000</Data></Cell>
        <Cell><Data ss:Type="String">149766</Data></Cell>
        <Cell><Data ss:Type="String">10</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">178327</Data></Cell>
        <Cell><Data ss:Type="String">Belhadj, Youssef</Data></Cell>
        <Cell><Data ss:Type="String">91535</Data></Cell>
        <Cell><Data ss:Type="String">2026-02-26T13:14:00.000</Data></Cell>
        <Cell><Data ss:Type="String">148861</Data></Cell>
        <Cell><Data ss:Type="String">15</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
</Workbook>`;

    const result = parseTooCOOLCSV(xmlData, 'fy25-26', 'Spring 2026');
    expect(result.validCount).toBe(2);
    expect(result.validRecords[0].studentName).toBe('Ryan Leviste');
    expect(result.validRecords[0].purdueEmail).toBe('ryan.leviste@purdue.edu');
    expect(result.validRecords[0].amountPaid).toBe(10);
    expect(result.validRecords[0].paymentDate).toBe('2026-03-05');
    expect(result.validRecords[0].transactionId).toBe('179435');

    expect(result.validRecords[1].studentName).toBe('Youssef Belhadj');
    expect(result.validRecords[1].amountPaid).toBe(15);
  });
});
