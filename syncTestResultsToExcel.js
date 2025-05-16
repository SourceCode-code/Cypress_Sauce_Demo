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
        } else if (hasPass && hasFail) {
          status = 'F'; // Keep "F" if there's any fail
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

    // Color formatting
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

  await workbook.xlsx.writeFile(excelPath);
  console.log(`✅ Excel updated for ${todayDate} with ${testResults.length} describe blocks.`);
}

updateExcelWithDescribeBlocks().catch(err => {
  console.error('❌ Error:', err);
});
