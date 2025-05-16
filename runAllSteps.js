const { execSync } = require('child_process');

function runCommand(cmd, ignoreError = false) {
  try {
    console.log(`▶️ Running: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    if (!ignoreError) throw err;
    console.warn(`⚠️ Ignored error in: ${cmd}`);
  }
}

runCommand('node clean_mochawesome.js');
runCommand('npm run clean_report_files');
runCommand('npm run Run_Tests', true); // allow test failure
runCommand('npm run getMochawesomeReport');
runCommand('node syncTestResultsToExcel.js');
runCommand('npm run getHTMLReport');
console.log('✅ All steps attempted.');
