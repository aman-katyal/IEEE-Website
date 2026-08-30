export interface ExcelCell {
  value: string | number | boolean | null | undefined;
  style?: "currency" | "number";
}

export interface ExcelSheet {
  name: string;
  headers: string[];
  rows: (string | number | boolean | null | undefined | ExcelCell)[][];
}

export function exportToExcelXml(filename: string, sheets: ExcelSheet[]) {
  const sanitize = (val: string) => {
    return val
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Bottom"/>
      <Borders/>
      <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <Style ss:ID="sHeader">
      <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000" ss:Bold="1"/>
    </Style>
    <Style ss:ID="sCurrency">
      <NumberFormat ss:Format="&quot;$&quot;#,##0.00"/>
    </Style>
  </Styles>`;

  for (const sheet of sheets) {
    xml += `\n  <Worksheet ss:Name="${sanitize(sheet.name)}">
    <Table>`;

    for (let i = 0; i < sheet.headers.length; i++) {
      xml += `\n      <Column ss:AutoFitWidth="1" ss:Width="120"/>`;
    }

    xml += `\n      <Row>`;
    for (const header of sheet.headers) {
      xml += `\n        <Cell ss:StyleID="sHeader"><Data ss:Type="String">${sanitize(header)}</Data></Cell>`;
    }
    xml += `\n      </Row>`;

    for (const row of sheet.rows) {
      xml += `\n      <Row>`;
      for (const cellItem of row) {
        const isObj =
          cellItem !== null &&
          typeof cellItem === "object" &&
          !Array.isArray(cellItem) &&
          "value" in cellItem;
        const cell = isObj ? (cellItem as ExcelCell).value : cellItem;
        const style = isObj ? (cellItem as ExcelCell).style : undefined;

        if (cell === null || cell === undefined) {
          xml += `\n        <Cell><Data ss:Type="String"></Data></Cell>`;
        } else if (typeof cell === "number") {
          if (style === "currency") {
            xml += `\n        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${cell}</Data></Cell>`;
          } else {
            xml += `\n        <Cell><Data ss:Type="Number">${cell}</Data></Cell>`;
          }
        } else if (typeof cell === "boolean") {
          xml += `\n        <Cell><Data ss:Type="String">${cell ? "TRUE" : "FALSE"}</Data></Cell>`;
        } else {
          xml += `\n        <Cell><Data ss:Type="String">${sanitize(cell.toString())}</Data></Cell>`;
        }
      }
      xml += `\n      </Row>`;
    }

    xml += `\n    </Table>
  </Worksheet>`;
  }

  xml += `\n</Workbook>`;

  const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download =
    filename.endsWith(".xml") ||
    filename.endsWith(".xls") ||
    filename.endsWith(".xlsx") ||
    filename.endsWith(".xls") ||
    filename.endsWith(".xml")
      ? filename
      : `${filename}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
