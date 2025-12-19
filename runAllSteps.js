const { execSync } = require('child_process');

function runCommand(cmd, ignoreError = false) {
  try {
    console.log(`▶️ Running: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (err) {
    if (!ignoreError) throw err;
    console.warn(`⚠️ Ignored error in: ${cmd}`);
    return false;
  }
}

// ------------------------
// CLEANUP
// ------------------------
runCommand('node clean_mochawesome.js');
runCommand('npm run clean_report_files');

// ------------------------
// INITIAL TEST RUN
// ------------------------
const firstRunPassed = runCommand('npm run Run_Tests', true); // allow failure

// ------------------------
// REPORT GENERATION
// ------------------------
runCommand('npm run getMochawesomeReport');
runCommand('npm run getHTMLReport');

// ------------------------
// RERUN FAILED SPECS (CI + LOCAL)
// ------------------------
if (!firstRunPassed) {
  console.log('🔁 Initial test run failed. Attempting rerun of failed specs...');
  runCommand('npx cypress-rerun-failed', true);
} else {
  console.log('✅ Initial test run passed. No rerun needed.');
}

// ------------------------
// POST-PROCESSING
// ------------------------
runCommand('node syncTestResultsToExcel.js');

console.log('✅ All steps completed.');
