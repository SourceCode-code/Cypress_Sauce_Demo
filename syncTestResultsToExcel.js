const fs = require('fs');
const ExcelJS = require('exceljs');

const reportPath = './output.json';
const excelPath = './Daily_Tracker.xlsx';
const todayDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-'); // dd-mm-yyyy

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
    worksheet = workbook.getWorksheet(1);
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
    cell.value = status;

    if (status === 'P') {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'C6EFCE' },
      };
      cell.font = {
        color: { argb: '006100' },
        bold: true,
      };
    } else {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC7CE' },
      };
      cell.font = {
        color: { argb: '9C0006' },
        bold: true,
      };
    }

    row.commit();
  }

  worksheet.columns.forEach(col => {
    col.width = Math.max(20, col.width || 20);
  });

  // ✅ Add Summary Sheet logic here
  let summarySheet = workbook.getWorksheet('Summary');
  if (!summarySheet) {
    summarySheet = workbook.addWorksheet('Summary');
    summarySheet.addRow(['Date', 'Passed', 'Failed', 'Total', '% Passed']);
  }

  const headerValues = worksheet.getRow(1).values;
  const dateHeaders = headerValues.filter(v => typeof v === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(v));

  for (let i = 0; i < dateHeaders.length; i++) {
    const date = dateHeaders[i];
    const colIndex = headerValues.indexOf(date);

    let passed = 0, failed = 0;

    worksheet.eachRow((row, rowNum) => {
      if (rowNum === 1) return;
      const status = row.getCell(colIndex).value;
      if (status === 'P') passed++;
      else if (status === 'F') failed++;
    });

    const total = passed + failed;
    const percent = total === 0 ? 0 : Math.round((passed / total) * 100);

    const summaryRow = summarySheet.findRow(i + 2);
    if (summaryRow) {
      summaryRow.getCell(1).value = date;
      summaryRow.getCell(2).value = passed;
      summaryRow.getCell(3).value = failed;
      summaryRow.getCell(4).value = total;
      summaryRow.getCell(5).value = `${percent}%`;
      summaryRow.commit();
    } else {
      summarySheet.addRow([date, passed, failed, total, `${percent}%`]);
    }
  }

  await workbook.xlsx.writeFile(excelPath);
  console.log(`📊 Summary sheet updated.`);
}

updateExcelWithDescribeBlocks().catch(err => {
  console.error('❌ Error:', err);
});
