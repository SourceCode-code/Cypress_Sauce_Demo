const fs = require('fs');
const ExcelJS = require('exceljs');

const reportPath = './output.json';
const excelPath = './Daily_Tracker.xlsx';
const todayDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-'); // dd-mm-yyyy
const MAX_DAYS = 60;

async function updateExcelWithDescribeBlocks() {
  if (!fs.existsSync(reportPath)) {
    console.error('❌ Mochawesome report not found!');
    process.exit(1);
  }

  const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  const testResults = [];

  function extractDescribeTitles(suites) {
    suites.forEach(suite => {
      const describeTitle = suite.title?.trim();
      if (describeTitle) {
        const hasFail = suite.tests?.some(test => test.state !== 'passed');
        const hasPass = suite.tests?.some(test => test.state === 'passed');
        let status = 'F';

        if (hasPass && !hasFail) {
          status = 'P';
        }

        testResults.push({ title: describeTitle, status });
        console.log(`✅ Extracted Describe: "${describeTitle}" - ${status}`);
      }

      if (suite.suites?.length) {
        extractDescribeTitles(suite.suites);
      }
    });
  }

  if (Array.isArray(reportData.results)) {
    reportData.results.forEach(result => {
      if (result.suites?.length) {
        extractDescribeTitles(result.suites);
      }
    });
  }

  if (!testResults.length) {
    console.error('❌ No describe block titles found!');
    process.exit(1);
  }

  const workbook = new ExcelJS.Workbook();
  let worksheet;

  if (fs.existsSync(excelPath)) {
    await workbook.xlsx.readFile(excelPath);
    worksheet = workbook.getWorksheet('TestResults');
    if (!worksheet) {
      worksheet = workbook.addWorksheet('TestResults');
      worksheet.addRow(['Test Case Title']);
    }
  } else {
    worksheet = workbook.addWorksheet('TestResults');
    worksheet.addRow(['Test Case Title']);
  }

  const headerRow = worksheet.getRow(1);
  let dateColIndex = headerRow.values.indexOf(todayDate);

  // Clean up old columns if exceeding 60 date columns
  const allHeaders = headerRow.values;
  const dateHeaders = allHeaders.filter(v => typeof v === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(v));
  if (dateHeaders.length >= MAX_DAYS) {
    const oldestDate = dateHeaders[0];
    const oldestColIndex = headerRow.values.indexOf(oldestDate);
    worksheet.spliceColumns(oldestColIndex, 1);
    console.log(`🗑️ Removed oldest date column: ${oldestDate}`);
  }

  dateColIndex = headerRow.values.indexOf(todayDate);
  if (dateColIndex === -1) {
    dateColIndex = headerRow.cellCount + 1;
    headerRow.getCell(dateColIndex).value = todayDate;
    headerRow.commit();

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
        row.getCell(dateColIndex).value = '';
        row.commit();
      }
    });
  }

  const rowMap = new Map();
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const testCaseTitle = row.getCell(1).value?.toString().trim();
      if (testCaseTitle) {
        rowMap.set(testCaseTitle, rowNumber);
      }
    }
  });

  const seen = new Set();

  for (const { title, status } of testResults) {
    if (seen.has(title)) continue;
    seen.add(title);

    let row;
    if (rowMap.has(title)) {
      row = worksheet.getRow(rowMap.get(title));
    } else {
      row = worksheet.addRow([title]);
      for (let i = row.cellCount + 1; i <= dateColIndex; i++) {
        row.getCell(i).value = '';
      }
      rowMap.set(title, row.number);
    }

    const cell = row.getCell(dateColIndex);
    // Set cell value and color based on status
    if (status === 'P') {
      cell.value = 'P';
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'C6EFCE' }, // Green
      };
      cell.font = {
        color: { argb: '006100' }, // Green text
        bold: true,
      };
    } else if (status === 'F') {
      cell.value = 'F';
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC7CE' }, // Red
      };
      cell.font = {
        color: { argb: '9C0006' }, // Red text
        bold: true,
      };
    } else {
      cell.value = status === 'S' ? 'S' : 'N/A'; // S for skipped, N/A for others
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9D9D9' }, // Grey
      };
      cell.font = {
        color: { argb: '7F7F7F' }, // Grey text
        bold: true,
      };
    }

    row.commit();
  }

  worksheet.columns.forEach(col => {
    col.width = Math.max(20, col.width || 20);
  });

  // ✅ Update or create Summary Sheet
  let summarySheet = workbook.getWorksheet('Summary');
  if (!summarySheet) {
    summarySheet = workbook.addWorksheet('Summary');
  }

  // Ensure header row is present
  const expectedHeaders = ['Date', 'Passed', 'Failed', 'Total', '% Passed'];
  const summaryHeaderRow = summarySheet.getRow(1);
  let headerNeedsUpdate = false;
  for (let i = 0; i < expectedHeaders.length; i++) {
    if (summaryHeaderRow.getCell(i + 1).value !== expectedHeaders[i]) {
      headerNeedsUpdate = true;
      break;
    }
  }
  if (headerNeedsUpdate) {
    summaryHeaderRow.values = expectedHeaders;
    summaryHeaderRow.commit();
  }

  const updatedHeaderValues = worksheet.getRow(1).values;
  const updatedDateHeaders = updatedHeaderValues.filter(v => typeof v === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(v));

  updatedDateHeaders.forEach((date, i) => {
    const colIndex = updatedHeaderValues.indexOf(date);
    let passed = 0, failed = 0;

    worksheet.eachRow((row, rowNum) => {
      if (rowNum === 1) return;
      const status = row.getCell(colIndex).value;
      if (status === 'P') passed++;
      else if (status === 'F') failed++;
    });

    const total = passed + failed;
    const percent = total === 0 ? 0 : Math.round((passed / total) * 100);

    const summaryRow = summarySheet.getRow(i + 2);
    summaryRow.getCell(1).value = date;
    summaryRow.getCell(2).value = passed;
    summaryRow.getCell(3).value = failed;
    summaryRow.getCell(4).value = total;
    summaryRow.getCell(5).value = `${percent}%`;
    summaryRow.commit();
  });

  await workbook.xlsx.writeFile(excelPath);
  console.log(`📊 Excel updated with today's results and 60-day limit maintained.`);
}

updateExcelWithDescribeBlocks().catch(err => {
  console.error('❌ Error:', err);
});