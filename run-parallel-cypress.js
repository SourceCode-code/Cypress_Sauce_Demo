// File: run-parallel-cypress.js

const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

// CONFIGURABLE: Folder where your spec files are located
const SPEC_FOLDER = path.join(__dirname, 'cypress', 'e2e', 'Smoke_Suit');

// CONFIGURABLE: Max parallel processes (default to CPU cores)
const MAX_PARALLEL = os.cpus().length;  // You can hardcode e.g., 3

// Read all spec files
const specFiles = fs.readdirSync(SPEC_FOLDER)
  .filter(file => file.endsWith('.cy.js'))
  .map(file => path.join('cypress', 'e2e', 'Smoke_Suit', file));

if (specFiles.length === 0) {
  console.error('No spec files found in', SPEC_FOLDER);
  process.exit(1);
}

console.log(`Found ${specFiles.length} spec files. Running up to ${MAX_PARALLEL} in parallel...`);

let currentIndex = 0;
let activeProcesses = 0;

function runNextSpec() {
  if (currentIndex >= specFiles.length) return;

  const spec = specFiles[currentIndex++];
  activeProcesses++;

  console.log(`\n▶️ Starting: ${spec}`);

  const child = exec(`npx cypress run --spec=\\"${spec}\\"`);

  child.stdout.on('data', data => process.stdout.write(data));
  child.stderr.on('data', data => process.stderr.write(data));

  child.on('exit', code => {
    console.log(`\n✅ Finished: ${spec} (exit code ${code})`);
    activeProcesses--;
    runNextSpec();

    if (activeProcesses === 0 && currentIndex >= specFiles.length) {
      console.log('\n🎉 All specs completed.');
    }
  });
}

// Start initial batch
const initialBatch = Math.min(MAX_PARALLEL, specFiles.length);
for (let i = 0; i < initialBatch; i++) {
  runNextSpec();
} 
