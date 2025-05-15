const fs = require('fs');
const path = require('path');

// Construct the absolute path to output.json
const filePath = path.join(__dirname, 'output.json');

if (fs.existsSync(filePath)) {
  try {
    fs.unlinkSync(filePath);
    console.log('✅ output.json deleted.');
  } catch (error) {
    console.error('❌ Error deleting output.json:', error);
  }
} else {
  console.log('⚠️ File not found:', filePath);
}
