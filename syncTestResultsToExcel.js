const fs = require('fs');
const XLSX = require('xlsx');

const reportPath = './output.json'; // Path to mochawesome JSON report
const excelPath = './Daily_Tracker.xlsx'; // Excel file path

if (!fs.existsSync(reportPath)) {
  console.error('❌ mochawesome.json not found!');
  process.exit(1);
}

const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
const testResults = [];

// Recursive function to extract tests from suites
function extractTests(suites) {
  suites.forEach(suite => {
    if (suite.tests && suite.tests.length) {
      suite.tests.forEach(test => {
        testResults.push({
          title: test.title || 'Untitled',
          status: test.state === 'passed' ? 'Pass' : 'Fail'
        });
      });
    }
    if (suite.suites && suite.suites.length) {
      extractTests(suite.suites);
    }
  });
}

// Extract tests from all root results suites
if (Array.isArray(reportData.results)) {
  reportData.results.forEach(result => {
    if (result.suites && result.suites.length) {
      extractTests(result.suites);
    }
  });
}

let workbook, worksheet, data;

// Load or create workbook and worksheet
if (fs.existsSync(excelPath)) {
  workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  worksheet = workbook.Sheets[sheetName];
  data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // If empty or missing headers, initialize headers
  if (!data.length || data[0].length < 2 || data[0][0] !== 'Test Case Title' || data[0][1] !== 'Status') {
    data = [['Test Case Title', 'Status']];
  }
} else {
  workbook = XLSX.utils.book_new();
  data = [['Test Case Title', 'Status']];
}

// Map existing test titles to row index for easy update
const existingMap = {};
for (let i = 1; i < data.length; i++) {
  const title = data[i][0];
  if (title) {
    existingMap[title] = i;
  }
}

// Update or add test cases in data array
for (const test of testResults) {
  const title = test.title.trim();
  const status = test.status;

  if (existingMap[title] !== undefined) {
    data[existingMap[title]][1] = status; // update Status (index 1)
  } else {
    data.push([title, status]); // add new row: [Test Case Title, Status]
  }
}

// Convert updated data back to worksheet and write to file
const updatedSheet = XLSX.utils.aoa_to_sheet(data);
const targetSheetName = workbook.SheetNames[0] || 'Sheet1';
workbook.Sheets[targetSheetName] = updatedSheet;

XLSX.writeFile(workbook, excelPath);

console.log('✅ Excel updated with test case titles and statuses!');
